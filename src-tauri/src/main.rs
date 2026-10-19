// Without this a console window opens next to the app in release builds.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Mutex, MutexGuard};
use std::time::Duration;

use inklo_core::Vault;
use notify_debouncer_mini::notify::{self, RecommendedWatcher, RecursiveMode};
use notify_debouncer_mini::{new_debouncer, DebounceEventResult, Debouncer};
use tauri::{AppHandle, Emitter, Manager, RunEvent};

pub const MAIN_WINDOW: &str = "main";

/// Set once the page has had its chance to save before quitting.
static SAVED_BEFORE_QUIT: AtomicBool = AtomicBool::new(false);

/// The config folder's name before the app was renamed from Keyslate to Inklo.
const OLD_IDENTIFIER: &str = "com.akshitbansal.keyslate";

pub struct Inner {
    pub vault: PathBuf,
    /// Dropping the debouncer stops the watch, so replacing it is the restart.
    pub _watcher: Option<Debouncer<RecommendedWatcher>>,
}

pub struct AppState(Mutex<Inner>);

impl AppState {
    pub fn lock(&self) -> Result<MutexGuard<'_, Inner>, String> {
        self.0.lock().map_err(|e| e.to_string())
    }
}

pub fn settings_file(app: &AppHandle) -> Result<PathBuf, String> {
    let dir = app.path().app_config_dir().map_err(|e| e.to_string())?;
    Ok(dir.join("settings.json"))
}

/// Copies Keyslate's settings.json the first time Inklo starts, so a renamed install
/// keeps its vault path, theme and keys. The old file is left where it is.
fn adopt_keyslate_settings(app: &AppHandle) {
    let Ok(new) = settings_file(app) else { return };
    let Some(old) = new
        .parent()
        .and_then(Path::parent)
        .map(|dir| dir.join(OLD_IDENTIFIER).join("settings.json"))
    else {
        return;
    };
    if new.exists() || !old.is_file() {
        return;
    }
    if let Some(dir) = new.parent() {
        let _ = std::fs::create_dir_all(dir);
    }
    let _ = std::fs::copy(old, new);
}

/// Emits `vault-changed` when notes or the index change on disk.
///
/// Recursive so `.inklo/index.json` is covered even when `.inklo` is
/// created after the watch starts; `is_vault_change` drops everything else.
pub fn watch(app: &AppHandle, vault: &Path) -> notify::Result<Debouncer<RecommendedWatcher>> {
    let handle = app.clone();
    // macOS reports events under the canonical path (/private/var for /var). Windows
    // would add a \\?\ prefix, so there the path stays as given.
    let root = if cfg!(windows) {
        vault.to_path_buf()
    } else {
        std::fs::canonicalize(vault).unwrap_or_else(|_| vault.to_path_buf())
    };
    let handle_root = root.clone();
    let mut debouncer = new_debouncer(
        Duration::from_millis(300),
        move |result: DebounceEventResult| {
            let Ok(events) = result else { return };
            if events
                .iter()
                .any(|event| inklo_core::is_vault_change(&handle_root, &event.path))
            {
                let _ = handle.emit_to(MAIN_WINDOW, "vault-changed", ());
            }
        },
    )?;
    debouncer.watcher().watch(&root, RecursiveMode::Recursive)?;
    Ok(debouncer)
}

/// The vault to open, and whether the user chose it in settings.
fn initial_vault(app: &AppHandle) -> Result<(PathBuf, bool), String> {
    let settings = settings_file(app)
        .and_then(|file| inklo_core::load_settings(&file).map_err(|e| e.to_string()))
        .unwrap_or_default();
    if let Some(path) = inklo_core::vault_path(&settings) {
        return Ok((path, true));
    }
    let documents = app
        .path()
        .document_dir()
        .or_else(|_| app.path().home_dir())
        .map_err(|e| e.to_string())?;
    let inklo = documents.join("Inklo");
    let keyslate = documents.join("Keyslate");
    // Keyslate's default vault stays where it is after the rename: notes are never moved
    // behind the user's back.
    Ok((
        if !inklo.exists() && keyslate.is_dir() {
            keyslate
        } else {
            inklo
        },
        false,
    ))
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            // A second launch focuses the running window instead of opening the vault twice.
            if let Some(window) = app.get_webview_window(MAIN_WINDOW) {
                let _ = window.unminimize();
                let _ = window.show();
                let _ = window.set_focus();
            }
        }))
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .setup(|app| {
            let handle = app.handle().clone();
            adopt_keyslate_settings(&handle);
            let (vault, configured) = initial_vault(&handle)?;
            // A chosen vault that went missing (an unplugged drive) is reported by every
            // command, never recreated empty; only the default folder is created on first run.
            let opened = if configured {
                Vault::open_existing(&vault)
            } else {
                Vault::open(&vault)
            };
            let watcher = opened.ok().and_then(|_| watch(&handle, &vault).ok());
            app.manage(AppState(Mutex::new(Inner {
                vault,
                _watcher: watcher,
            })));
            // macOS: the default menu's Quit ends the app at once, skipping the save
            // before quitting. This Quit asks to exit, which `ExitRequested` can hold.
            #[cfg(target_os = "macos")]
            {
                use tauri::menu::{Menu, MenuItem, PredefinedMenuItem, Submenu};
                let quit = MenuItem::with_id(app, "quit", "Quit Inklo", true, Some("CmdOrCtrl+Q"))?;
                let app_menu = Submenu::with_items(
                    app,
                    "Inklo",
                    true,
                    &[
                        &PredefinedMenuItem::hide(app, None)?,
                        &PredefinedMenuItem::hide_others(app, None)?,
                        &PredefinedMenuItem::separator(app)?,
                        &quit,
                    ],
                )?;
                // The Edit menu is what gives text fields Cmd+C, Cmd+V, Cmd+Z and friends on macOS.
                let edit_menu = Submenu::with_items(
                    app,
                    "Edit",
                    true,
                    &[
                        &PredefinedMenuItem::undo(app, None)?,
                        &PredefinedMenuItem::redo(app, None)?,
                        &PredefinedMenuItem::separator(app)?,
                        &PredefinedMenuItem::cut(app, None)?,
                        &PredefinedMenuItem::copy(app, None)?,
                        &PredefinedMenuItem::paste(app, None)?,
                        &PredefinedMenuItem::select_all(app, None)?,
                    ],
                )?;
                app.set_menu(Menu::with_items(app, &[&app_menu, &edit_menu])?)?;
                app.on_menu_event(|app, event| {
                    if event.id() == "quit" {
                        app.exit(0);
                    }
                });
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_vault_path,
            commands::set_vault_path,
            commands::pick_folder,
            commands::list_notes,
            commands::list_trash,
            commands::read_note,
            commands::create_note,
            commands::write_note,
            commands::rename_note,
            commands::set_format,
            commands::duplicate_note,
            commands::set_pinned,
            commands::set_tags,
            commands::trash_note,
            commands::restore_note,
            commands::delete_note,
            commands::empty_trash,
            commands::search,
            commands::open_text_files,
            commands::read_text_paths,
            commands::save_text_file,
            commands::export_vault,
            commands::reveal_vault,
            commands::load_settings,
            commands::save_settings,
            commands::set_global_shortcut,
        ])
        .build(tauri::generate_context!())
        .expect("error while running Inklo")
        .run(|handle, event| {
            // Quitting skips the window's close handler: let the page save once, then it
            // destroys its window and the second request goes through.
            if let RunEvent::ExitRequested { api, .. } = event {
                if handle.get_webview_window(MAIN_WINDOW).is_some()
                    && !SAVED_BEFORE_QUIT.swap(true, Ordering::SeqCst)
                {
                    api.prevent_exit();
                    let _ = handle.emit_to(MAIN_WINDOW, "save-before-quit", ());
                }
            }
        });
}
