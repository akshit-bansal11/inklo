# Contributing

## Set up

You need Node 24 and a Rust toolchain. On Linux, also the WebKitGTK 4.1 and GTK development packages that Tauri lists.

```
npm ci
npm run dev        # the UI alone in a browser, on an in-memory backend
npm run tauri dev  # the desktop app
```

## Before you push

```
npm run check      # format, organise imports, lint, typecheck (writes fixes)
npm test           # unit tests
```

`npm run check:ci` is the same gate without writing fixes; it is what CI runs. `npm run test:e2e` drives the built UI with Playwright. `cargo test -p inklo-core` runs the vault tests.

CI runs the gate on Windows and the Rust checks on Windows, macOS and Linux.

## Changes

- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
- Add a line under `## [Unreleased]` in `CHANGELOG.md` for anything a user would notice.
- After a `Cargo.toml` change, run the `lockfile` workflow on your branch and commit the `Cargo.lock` it uploads.

## Security problems

Report them privately; see [SECURITY.md](SECURITY.md).
