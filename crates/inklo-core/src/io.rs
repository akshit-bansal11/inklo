use std::fs::{self, File};
use std::io::{self, Write};
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{SystemTime, UNIX_EPOCH};

use serde::de::DeserializeOwned;

use crate::{Result, TextFile};

/// Files larger than this are skipped by search and by the text-file readers.
pub const MAX_TEXT_BYTES: u64 = 5 * 1024 * 1024;

const IMPORTABLE: [&str; 4] = ["md", "markdown", "txt", "json"];

pub(crate) fn now_ms() -> u128 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_millis())
        .unwrap_or_default()
}

/// Writes through a sibling temp file and renames it over the target, so a
/// crash mid-write leaves either the old file or the new one, never a torn one.
pub(crate) fn write_atomic(path: &Path, bytes: &[u8]) -> io::Result<()> {
    static SEQ: AtomicU64 = AtomicU64::new(0);
    let name = path
        .file_name()
        .ok_or_else(|| io::Error::new(io::ErrorKind::InvalidInput, "path has no file name"))?;
    // The `.tmp` suffix keeps the temp file from ever being listed as a note.
    let tmp = path.with_file_name(format!(
        ".{}.{}-{}.tmp",
        name.to_string_lossy(),
        std::process::id(),
        SEQ.fetch_add(1, Ordering::Relaxed)
    ));
    let written = (|| {
        let mut file = File::create(&tmp)?;
        file.write_all(bytes)?;
        file.sync_all()?;
        drop(file);
        fs::rename(&tmp, path)
    })();
    if written.is_err() {
        let _ = fs::remove_file(&tmp);
    }
    written
}

/// How a note file stores its text, so a save writes it back the same way.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub(crate) enum Encoding {
    Utf8,
    Utf8Bom,
    Utf16Le,
    Utf16Be,
}

/// The text of a file and its encoding. `None`: not UTF-8, nor UTF-16 with a byte-order
/// mark, so the text shown is a lossy reading and must never be written back.
pub(crate) fn decode_text(bytes: &[u8]) -> (String, Option<Encoding>) {
    if let Some(rest) = bytes.strip_prefix(&[0xEF, 0xBB, 0xBF]) {
        return utf8(rest, Encoding::Utf8Bom);
    }
    if let Some(rest) = bytes.strip_prefix(&[0xFF, 0xFE]) {
        return utf16(rest, u16::from_le_bytes, Encoding::Utf16Le);
    }
    if let Some(rest) = bytes.strip_prefix(&[0xFE, 0xFF]) {
        return utf16(rest, u16::from_be_bytes, Encoding::Utf16Be);
    }
    utf8(bytes, Encoding::Utf8)
}

fn utf8(bytes: &[u8], encoding: Encoding) -> (String, Option<Encoding>) {
    match std::str::from_utf8(bytes) {
        Ok(text) => (text.to_string(), Some(encoding)),
        Err(_) => (String::from_utf8_lossy(bytes).into_owned(), None),
    }
}

fn utf16(bytes: &[u8], unit: fn([u8; 2]) -> u16, encoding: Encoding) -> (String, Option<Encoding>) {
    let units: Vec<u16> = bytes
        .chunks_exact(2)
        .map(|pair| unit([pair[0], pair[1]]))
        .collect();
    match String::from_utf16(&units) {
        Ok(text) if bytes.len().is_multiple_of(2) => (text, Some(encoding)),
        _ => (String::from_utf16_lossy(&units), None),
    }
}

/// The bytes to write for `text` in `encoding`, byte-order mark included.
pub(crate) fn encode_text(text: &str, encoding: Encoding) -> Vec<u8> {
    match encoding {
        Encoding::Utf8 => text.as_bytes().to_vec(),
        Encoding::Utf8Bom => [&[0xEF, 0xBB, 0xBF][..], text.as_bytes()].concat(),
        Encoding::Utf16Le => [0xFF, 0xFE]
            .into_iter()
            .chain(text.encode_utf16().flat_map(u16::to_le_bytes))
            .collect(),
        Encoding::Utf16Be => [0xFE, 0xFF]
            .into_iter()
            .chain(text.encode_utf16().flat_map(u16::to_be_bytes))
            .collect(),
    }
}

/// Text for search and import: any encoding `decode_text` knows, lossy otherwise.
pub(crate) fn decode(bytes: &[u8]) -> String {
    decode_text(bytes).0
}

/// Reads a JSON file. Missing yields `None`. A file that does not parse is
/// renamed aside rather than overwritten, so nothing a user wrote is destroyed.
pub(crate) fn read_json<T: DeserializeOwned>(path: &Path) -> io::Result<Option<T>> {
    let bytes = match fs::read(path) {
        Ok(bytes) => bytes,
        Err(e) if e.kind() == io::ErrorKind::NotFound => return Ok(None),
        Err(e) => return Err(e),
    };
    match serde_json::from_slice(&bytes) {
        Ok(value) => Ok(Some(value)),
        Err(_) => {
            let mut aside = path.as_os_str().to_owned();
            aside.push(format!(".corrupt-{}", now_ms()));
            fs::rename(path, PathBuf::from(aside))?;
            Ok(None)
        }
    }
}

pub(crate) fn write_json<T: serde::Serialize>(path: &Path, value: &T) -> Result<()> {
    if let Some(dir) = path.parent() {
        fs::create_dir_all(dir)?;
    }
    write_atomic(path, &serde_json::to_vec_pretty(value)?)?;
    Ok(())
}

/// `None` for anything that is not a regular file of at most [`MAX_TEXT_BYTES`].
pub fn read_text_file(path: &Path) -> Option<TextFile> {
    let meta = fs::metadata(path).ok()?;
    if !meta.is_file() || meta.len() > MAX_TEXT_BYTES {
        return None;
    }
    Some(TextFile {
        name: path.file_name()?.to_string_lossy().into_owned(),
        content: decode(&fs::read(path).ok()?),
    })
}

/// Reads dropped paths, silently skipping directories and other file types.
pub fn read_text_paths(paths: &[PathBuf]) -> Vec<TextFile> {
    paths
        .iter()
        .filter(|p| {
            p.extension()
                .and_then(|e| e.to_str())
                .is_some_and(|e| IMPORTABLE.contains(&e.to_ascii_lowercase().as_str()))
        })
        .filter_map(|p| read_text_file(p))
        .collect()
}

pub fn write_text(path: &Path, content: &str) -> Result<()> {
    write_atomic(path, content.as_bytes())?;
    Ok(())
}
