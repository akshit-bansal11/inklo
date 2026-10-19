# Changelog

All notable changes to Inklo (called Keyslate until 0.2.0) are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-10-20

### Changed

- Renamed from Keyslate to Inklo, because another product is called Keyslate. On first start Inklo copies Keyslate's settings once (the old settings file stays), keeps using `Documents/Keyslate` as the vault when `Documents/Inklo` does not exist, and renames the vault's `.keyslate` folder (pins and tags) to `.inklo`. The repository moved to akshit-bansal11/inklo.
- Windows, macOS and Linux are supported. The Windows files are now named `Inklo-<version>-windows-x64-setup.exe` and `Inklo-<version>-windows-x64.exe`.
- The global shortcut is off until you choose one in Settings. It used to take Ctrl+Alt+N from every other app, and on keyboards with AltGr that combo types characters.
- On a Mac, Cmd stands in for Ctrl and labels show the Mac symbols. Defaults that use Alt alone become Cmd+Option. Four defaults differ because macOS owns the Windows ones: cycle heading, inline code, code block and insert today's date.
- The `Ctrl+Shift+V` command is titled "Make the next paste plain text"; it does not paste by itself.

### Fixed

- A note that is not UTF-8 or UTF-16 text opens read-only and is never written. Before, the first save corrupted it.
- UTF-16 notes (Notepad's "Unicode") are read and saved as UTF-16. A UTF-8 byte-order mark and CRLF line endings are kept on save.
- If another program changes the open note while you have unsaved typing, your version is saved as a new note "<title> (my edits)" instead of overwriting.
- A save that fails keeps your text and the open note, and closing keeps the window open once so you can copy it out.
- Quitting with Cmd+Q saves first.
- A vault folder that went missing (deleted, unplugged drive) is reported instead of being recreated empty.
- Notes over 5 MiB are refused.
- Exported settings no longer include the vault path.
- AltGr is no longer read as Ctrl+Alt.

### Added

- macOS and Linux builds.
- `SECURITY.md` and `CONTRIBUTING.md`.
- A second launch focuses the running window instead of opening a second copy.

## [0.1.0] - 2026-10-03

First release.

### Added

- Notes as plain `.md` and `.txt` files in a vault folder, with atomic writes, a trash, pins and tags.
- A CodeMirror editor with Markdown highlighting, formatting commands, a live preview, and rich-text paste converted to Markdown.
- A command palette, go-to-note with create-on-miss, and full-text search that lands on the matching line.
- Every action as a command with a rebindable shortcut, a shortcut sheet, and a global shortcut that summons the window.
- Six built-in themes, custom themes with a contrast check, and theme import and export.
- Import of `.md` and `.txt` files by dialog or drag and drop; export as a file or standalone HTML; copy as Markdown, rich text or plain text; export of the whole vault.
- Settings for editor font, text size, line height, line width, wrapping, line numbers, spell check, density, sort order and default format.

[Unreleased]: https://github.com/akshit-bansal11/inklo/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/akshit-bansal11/inklo/releases/tag/v0.2.0
[0.1.0]: https://github.com/akshit-bansal11/inklo/releases/tag/v0.1.0
