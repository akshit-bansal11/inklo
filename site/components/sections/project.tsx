import { CodeBlock } from "@/components/code-block";
import { C, ExternalLink, Note, P, Section } from "@/components/section";
import { REPO } from "@/lib/nav";

const LIST = "max-w-[68ch] list-disc space-y-2 pl-5 text-base leading-relaxed";

const DEVELOP_COMMANDS = `npm ci
npm run check      # format, organise imports, lint, typecheck (writes fixes)
npm test           # unit tests
npm run dev        # the UI alone in a browser, on an in-memory backend
npm run tauri dev  # the desktop app`;

/** Security, develop and releases. */
export function ProjectSections({ version }: { version: string }) {
  return (
    <>
      <Section
        id="security"
        eyebrow="Reference"
        title="Security"
        lede="What Inklo protects, what it does not, and how to report a problem."
      >
        <P>
          <strong>What Inklo protects.</strong>
        </P>
        <ul className={LIST}>
          <li>
            There is no network code. The window&apos;s content security policy allows
            only the app&apos;s own files and the channel to its Rust core.
          </li>
          <li>
            Links in the preview are copied to the clipboard, not opened. Remote images
            are not loaded.
          </li>
          <li>HTML in notes is sanitised with DOMPurify before it is previewed.</li>
        </ul>
        <P>
          <strong>What it does not protect.</strong>
        </P>
        <ul className={LIST}>
          <li>
            Notes are plain files that any program can read. They are not encrypted.
          </li>
          <li>Anything running as you can read them.</li>
          <li>
            Inklo is not a vault for secrets. Do not keep passwords or keys in it.
          </li>
        </ul>
        <Note label="Reporting a problem">
          Report a vulnerability privately through{" "}
          <ExternalLink href={`${REPO}/security/advisories/new`}>
            GitHub&apos;s security advisories
          </ExternalLink>
          . Please do not open a public issue for it.
        </Note>
      </Section>

      <Section
        id="develop"
        eyebrow="Developing"
        title="Develop"
        lede="You need Node 24 and a Rust toolchain. On Linux, also the WebKitGTK 4.1 and GTK development packages that Tauri lists."
      >
        <CodeBlock title="Run Inklo from source" code={DEVELOP_COMMANDS} />
        <P>
          <C>npm run check:ci</C> is the same gate without writing fixes; it is what CI
          runs. <C>npm run test:e2e</C> drives the built UI from the keyboard with
          Playwright and scans it with axe. <C>cargo test -p inklo-core</C> runs the
          vault tests.
        </P>
        <P>
          CI runs the gate on Windows and the Rust checks on Windows, macOS and Linux.
          After a <C>Cargo.toml</C> change, run the <C>lockfile</C> workflow on the
          branch and commit the <C>Cargo.lock</C> it uploads.
        </P>

        <P>
          <strong>Layout.</strong>
        </P>
        <ul className={LIST}>
          <li>
            <C>crates/inklo-core</C>: all vault logic, with no dependency on Tauri:
            atomic writes, title and id validation, pins and tags, trash, search,
            settings I/O.
          </li>
          <li>
            <C>src-tauri</C>: the desktop shell. One thin command per backend method,
            native dialogs, the file watcher, the global shortcut.
          </li>
          <li>
            <C>src</C>: the UI. <C>src/lib/backend/backend.ts</C> is the single
            interface between UI and machine, with a Tauri implementation and an
            in-memory one for the browser and for tests.
          </li>
        </ul>

        <P>
          <strong>Changes.</strong>
        </P>
        <ul className={LIST}>
          <li>
            Commit messages follow{" "}
            <ExternalLink href="https://www.conventionalcommits.org/en/v1.0.0/">
              Conventional Commits
            </ExternalLink>
            .
          </li>
          <li>
            Add a line under <C>## [Unreleased]</C> in <C>CHANGELOG.md</C> for anything
            a user would notice.
          </li>
        </ul>
      </Section>

      <Section
        id="releases"
        title="Releases"
        lede={`This site was built from version ${version}.`}
      >
        <P>
          Set the version in <C>Cargo.toml</C>, <C>src-tauri/tauri.conf.json</C>{" "}
          and <C>package.json</C>, commit, then push a matching tag:
        </P>
        <CodeBlock
          title="Tag a release"
          code="git tag v0.2.0 && git push origin v0.2.0"
        />
        <P>
          The release workflow builds Windows, macOS and Linux files, writes checksums,
          attests provenance and publishes the release with the notes from{" "}
          <ExternalLink href={`${REPO}/blob/main/CHANGELOG.md`}>
            CHANGELOG.md
          </ExternalLink>
          .
        </P>

        <Note label="Accepted dependency advisory">
          <C>npm audit</C> reports GHSA-vfj7-8cjw-p6xm in <C>braces</C>, reached only
          through Stylelint, a development tool that globs this repository&apos;s own
          files. It is not in the shipped app. CI audits runtime dependencies at{" "}
          <C>--audit-level=high</C>. Review by 2027-01-03.
        </Note>
      </Section>
    </>
  );
}
