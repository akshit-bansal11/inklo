# Security

## What Inklo protects

- There is no network code. The window's content security policy allows only the app's own files and the channel to its Rust core.
- Links in the preview are copied to the clipboard, not opened. Remote images are not loaded.
- HTML in notes is sanitised with DOMPurify before it is previewed.

## What it does not protect

- Notes are plain files that any program can read. They are not encrypted.
- Anything running as you can read them.
- Inklo is not a vault for secrets. Do not keep passwords or keys in it.

## Reporting a problem

Report a vulnerability privately through GitHub's security advisories:

https://github.com/akshit-bansal11/inklo/security/advisories/new

Please do not open a public issue for it.
