# Inklo

A fully local, keyboard-first notes app for Windows, macOS and Linux.

Inklo was called Keyslate until 0.2.0; see [Upgrading from Keyslate](#upgrading-from-keyslate).

Your notes are plain `.md` and `.txt` files in a folder you choose. There is no account, no sync, no telemetry and no network code: the app's content security policy allows the window to talk to its own Rust core and nothing else. Any other editor can open the same folder.

Every action is a command. Press `Ctrl+K` to see all of them, `F1` for the current shortcuts, and rebind any of them in Settings. On a Mac, use Cmd wherever this README says Ctrl.

## Install

Download the file for your system from the [latest release](https://github.com/akshit-bansal11/inklo/releases/latest). No build is code-signed, so each system warns on first run; the steps are below.

### Windows

Windows 10 or 11, x64. Run `Inklo-<version>-windows-x64-setup.exe` to install. `Inklo-<version>-windows-x64.exe` is the same app without an installer; it still keeps its settings in your user profile, so it is not a portable install.

SmartScreen will warn on first run: choose "More info", then "Run anyway". Inklo needs the WebView2 runtime, which ships with Windows 11 and current Windows 10.

### macOS

Open `Inklo-<version>-macos-universal.dmg` and drag Inklo to Applications. It runs on Apple silicon and Intel.

The app is ad-hoc signed, not notarized, so the first open is refused. Open System Settings, then Privacy & Security, and choose "Open Anyway". The macOS build is new in 0.2.0 and has not been tried on real machines beyond CI.

### Linux

x86_64 only. Use `Inklo-<version>-linux-x86_64.AppImage` (run `chmod +x` on it first) or `Inklo-<version>-linux-amd64.deb`. Inklo needs WebKitGTK 4.1, which the `.deb` pulls in. The Linux builds are new in 0.2.0 and have not been tried on real machines beyond CI.

### Check the download

`SHA256SUMS.txt` is published with each release. Run the check from the folder holding the download.

```
Get-FileHash <file> -Algorithm SHA256            # Windows (PowerShell); compare with SHA256SUMS.txt
shasum -a 256 -c SHA256SUMS.txt --ignore-missing # macOS
sha256sum -c --ignore-missing SHA256SUMS.txt     # Linux
```

Every file also carries a build provenance attestation:

```
gh attestation verify <file> --repo akshit-bansal11/inklo
```

## Where things live

- **Vault.** The default is `Documents/Inklo`, in your Documents folder. Pins and tags are in the `.inklo` folder inside it.
- **Settings.** `settings.json`, in:
  - Windows: `%APPDATA%\com.akshitbansal.inklo`
  - macOS: `~/Library/Application Support/com.akshitbansal.inklo`
  - Linux: `~/.config/com.akshitbansal.inklo`

## Upgrading

Inklo does not update itself. Install a newer release over the old one (Windows installer), or replace the app or the AppImage. Your notes and settings stay.

## Uninstall

- Windows: remove Inklo in the "Apps" settings (installer), or delete the exe.
- macOS: delete the app.
- Linux: delete the AppImage, or run `sudo apt remove inklo`.

Your notes and settings stay. Delete the vault folder and the settings folder yourself if you want them gone.

## Upgrading from Keyslate

Keyslate was renamed Inklo in 0.2.0 because another product is called Keyslate. On first start Inklo:

- copies Keyslate's settings once; the old settings file stays;
- keeps using `Documents/Keyslate` as the vault when `Documents/Inklo` does not exist;
- renames the vault's `.keyslate` folder (pins and tags) to `.inklo`.

The GitHub repository moved to akshit-bansal11/inklo; old links redirect.

## What it does

- **Markdown and plain text.** Each note is one or the other; switch with `Ctrl+Shift+M`. Markdown notes get syntax highlighting, formatting commands, and a live preview beside the editor or on its own.
- **A vault of real files.** The default vault is `Documents/Inklo`. Pins and tags live in `.inklo/index.json` inside it, so the note files stay clean. Edits made by another program show up live.
- **Find anything.** `Ctrl+P` jumps to a note by title, or creates one if nothing matches. `Ctrl+Shift+F` searches the text of every note and lands on the matching line.
- **Import and export.** Import `.md` and `.txt` files from a dialog or by dropping them on the window. Export a note as its own file or as a standalone HTML page, or copy it as Markdown, rich text or plain text. Export the whole vault to a folder.
- **Smart paste.** Rich text pasted into a Markdown note becomes Markdown. `Ctrl+Shift+V` makes the next paste plain.
- **Themes.** Six built in, three dark and three light. Duplicate any of them to make your own, and share it as a JSON file. The theme editor warns when a colour pair is hard to read.
- **Customisation.** Editor font, text size, line height, line width, wrapping, line numbers, spell check, density, sort order, default note format, and every shortcut.
- **Summon from anywhere.** A global shortcut brings the window forward with a new note, whatever app has focus. It is off until you set one in Settings, and it does not work on Linux Wayland.
- **Your files, as they were.** UTF-8 (with or without a byte-order mark) and UTF-16 notes are saved the way they were found, line endings included. A file in any other encoding opens read-only.
- **Nothing lost to a clash.** If another program changes the open note while you type, your version is saved as a new note beside it.
- **A trash, not a delete.** `Ctrl+Shift+Delete` moves a note to `.inklo/trash`. Deleting for good asks first.

## Default shortcuts

All of these can be changed in Settings, under Shortcuts.

On a Mac: Cmd for Ctrl; Cmd+Option for the Alt-only ones; and cycle heading Cmd+Shift+H, inline code Cmd+Shift+K, code block Cmd+Option+K, insert today's date Cmd+Shift+;.

| Notes | |
| --- | --- |
| `Ctrl+N` | New note |
| `Ctrl+Shift+N` | New plain-text note |
| `F2` | Rename note |
| `Ctrl+T` | Edit tags |
| `Alt+P` | Pin or unpin |
| `Ctrl+Shift+D` | Duplicate |
| `Ctrl+Shift+M` | Switch between Markdown and plain text |
| `Ctrl+Shift+Delete` | Move to trash |
| `Ctrl+S` | Save now (notes also save as you type) |
| `Ctrl+O` | Import notes from files |
| `Ctrl+Shift+S` | Export note as a file |
| `Ctrl+Shift+C` / `Ctrl+Alt+C` | Copy note as Markdown / as rich text |

| Moving around | |
| --- | --- |
| `Ctrl+K` | Show all commands |
| `Ctrl+P` | Go to note |
| `Ctrl+Shift+F` | Search in all notes |
| `Ctrl+PageDown` / `Ctrl+PageUp` | Next / previous note |
| `Alt+E` / `Alt+L` / `Alt+F` | Focus the editor / the note list / the list filter |
| `Ctrl+,` | Settings |
| `F1` | Keyboard shortcuts |

| View | |
| --- | --- |
| `Alt+1` / `Alt+2` / `Alt+3` | Editor only / side by side / preview only |
| `Ctrl+E` | Cycle those three |
| `Ctrl+\` | Show or hide the sidebar |
| `Ctrl+=` / `Ctrl+-` / `Ctrl+0` | Larger / smaller / default text size |
| `Alt+Z` | Toggle word wrap |
| `Ctrl+Alt+T` | Next theme |

| Editing (Markdown notes) | |
| --- | --- |
| `Ctrl+B` / `Ctrl+I` / `Ctrl+Shift+X` | Bold / italic / strikethrough |
| `` Ctrl+` `` / `` Ctrl+Shift+` `` | Inline code / code block |
| `Ctrl+L` | Link |
| `Ctrl+H` | Cycle heading level |
| `Ctrl+Shift+8` / `Ctrl+Shift+7` / `Ctrl+Shift+9` | Bulleted / numbered / task list |
| `Ctrl+Enter` | Check or uncheck a task |
| `Ctrl+Shift+.` | Quote |
| `Alt+D` | Insert today's date |
| `Ctrl+F` | Find in note |
| `Ctrl+Shift+V` | Make the next paste plain text |

In the note list: arrows move, `Enter` opens, `Delete` trashes, and typing starts filtering.

## Limits worth knowing

- Not code-signed on any system.
- The vault is one flat folder. Tags organise notes; there are no nested notebooks.
- No images or attachments. The preview shows an image's alt text, because the app cannot fetch anything.
- Links in the preview are copied to the clipboard when clicked rather than opened.
- Shortcuts are single combinations; there are no chord sequences.
- Search is a linear scan of the vault. It has not been measured on large vaults.
- Global shortcuts do not work on Linux Wayland. Use the desktop's own keyboard settings to start Inklo.

## Development

Requires Node 24 and a Rust toolchain. On Linux, also the WebKitGTK 4.1 and GTK development packages that Tauri lists.

```
npm ci
npm run check      # format, organise imports, lint, typecheck (writes fixes)
npm test           # unit tests
npm run dev        # the UI alone in a browser, on an in-memory backend
npm run tauri dev  # the desktop app
```

`npm run check:ci` is the same gate without writing; it is what CI runs. `npm run test:e2e` drives the built UI from the keyboard with Playwright and scans it with axe. `cargo test -p inklo-core` runs the vault tests.

CI runs the gate on Windows and the Rust checks on Windows, macOS and Linux. After a `Cargo.toml` change, run the `lockfile` workflow on the branch and commit the `Cargo.lock` it uploads.

### Layout

- `crates/inklo-core`: all vault logic, with no dependency on Tauri: atomic writes, title and id validation, pins and tags, trash, search, settings I/O.
- `src-tauri`: the desktop shell. One thin command per backend method, native dialogs, the file watcher, the global shortcut.
- `src`: the UI. `src/lib/backend/backend.ts` is the single interface between UI and machine, with a Tauri implementation and an in-memory one for the browser and for tests.

### Releasing

Set the version in `Cargo.toml`, `src-tauri/tauri.conf.json` and `package.json`, commit, then push a matching tag:

```
git tag v0.2.0 && git push origin v0.2.0
```

The release workflow builds Windows, macOS and Linux files, writes checksums, attests provenance and publishes the release with the notes from CHANGELOG.md.

### Accepted dependency advisories

`npm audit` reports GHSA-vfj7-8cjw-p6xm in `braces`, reached only through Stylelint, a development tool that globs this repository's own files. It is not in the shipped app. CI audits runtime dependencies at `--audit-level=high`. Review by 2027-01-03.

## Security

See [SECURITY.md](SECURITY.md) for what Inklo protects and how to report a problem.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
