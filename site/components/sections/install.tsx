import { CodeBlock } from "@/components/code-block";
import { C, ExternalLink, Note, P, Section, Sub } from "@/components/section";
import { ATTEST_COMMAND, CHECKSUM_COMMANDS, REPO } from "@/lib/nav";

const LIST = "max-w-[68ch] list-disc space-y-2 pl-5 text-base leading-relaxed";

/** Install, check, where things live, upgrading, uninstall, upgrading from Keyslate. */
export function InstallSections() {
  return (
    <>
      <Section
        id="install"
        eyebrow="Install"
        title="Install"
        lede={
          <>
            Download the file for your system from the{" "}
            <ExternalLink href={`${REPO}/releases/latest`}>latest release</ExternalLink>
            . No build is code-signed, so each system warns on first run; the steps are
            below.
          </>
        }
      >
        <Sub>Windows</Sub>
        <P>
          Windows 10 or 11, x64. Run <C>Inklo-&lt;version&gt;-windows-x64-setup.exe</C>{" "}
          to install. <C>Inklo-&lt;version&gt;-windows-x64.exe</C> is the same app
          without an installer; it still keeps its settings in your user profile, so it
          is not a portable install.
        </P>
        <P>
          SmartScreen will warn on first run: choose &ldquo;More info&rdquo;, then
          &ldquo;Run anyway&rdquo;. Inklo needs the WebView2 runtime, which ships with
          Windows 11 and current Windows 10.
        </P>

        <Sub>macOS</Sub>
        <P>
          Open <C>Inklo-&lt;version&gt;-macos-universal.dmg</C> and drag Inklo to
          Applications. It runs on Apple silicon and Intel.
        </P>
        <P>
          The app is ad-hoc signed, not notarized, so the first open is refused. Open
          System Settings, then Privacy &amp; Security, and choose &ldquo;Open
          Anyway&rdquo;.
        </P>
        <Note label="Not tried on real machines">
          The macOS build is new in 0.2.0 and has not been tried on real machines beyond
          CI.
        </Note>

        <Sub>Linux</Sub>
        <P>
          x86_64 only. Use <C>Inklo-&lt;version&gt;-linux-x86_64.AppImage</C> (run{" "}
          <C>chmod +x</C> on it first) or <C>Inklo-&lt;version&gt;-linux-amd64.deb</C>.
          Inklo needs WebKitGTK 4.1, which the <C>.deb</C> pulls in.
        </P>
        <Note label="Not tried on real machines">
          The Linux builds are new in 0.2.0 and have not been tried on real machines
          beyond CI.
        </Note>
      </Section>

      <Section
        id="check"
        title="Check the download"
        lede={
          <>
            <C>SHA256SUMS.txt</C> is published with each release. Run the check from the
            folder holding the download.
          </>
        }
      >
        <CodeBlock title="Check the download" code={CHECKSUM_COMMANDS} />
        <P>Every file also carries a build provenance attestation:</P>
        <CodeBlock title="Verify the attestation" code={ATTEST_COMMAND} />
      </Section>

      <Section id="where" title="Where things live">
        <ul className={LIST}>
          <li>
            <strong>Vault.</strong> The default is <C>Documents/Inklo</C>, in your
            Documents folder. Pins and tags are in the <C>.inklo</C> folder inside it.
          </li>
          <li>
            <strong>Settings.</strong> <C>settings.json</C>, in:
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                Windows: <C>%APPDATA%\com.akshitbansal.inklo</C>
              </li>
              <li>
                macOS: <C>~/Library/Application Support/com.akshitbansal.inklo</C>
              </li>
              <li>
                Linux: <C>~/.config/com.akshitbansal.inklo</C>
              </li>
            </ul>
          </li>
        </ul>
      </Section>

      <Section id="upgrading" title="Upgrading">
        <P>
          Inklo does not update itself. Install a newer release over the old one
          (Windows installer), or replace the app or the AppImage. Your notes and
          settings stay.
        </P>
      </Section>

      <Section id="uninstall" title="Uninstall">
        <ul className={LIST}>
          <li>
            Windows: remove Inklo in the &ldquo;Apps&rdquo; settings (installer), or
            delete the exe.
          </li>
          <li>macOS: delete the app.</li>
          <li>
            Linux: delete the AppImage, or run <C>sudo apt remove inklo</C>.
          </li>
        </ul>
        <P>
          Your notes and settings stay. Delete the vault folder and the settings folder
          yourself if you want them gone.
        </P>
      </Section>

      <Section
        id="keyslate"
        title="Upgrading from Keyslate"
        lede="Keyslate was renamed Inklo in 0.2.0 because another product is called Keyslate. On first start Inklo:"
      >
        <ul className={LIST}>
          <li>copies Keyslate&apos;s settings once; the old settings file stays;</li>
          <li>
            keeps using <C>Documents/Keyslate</C> as the vault when{" "}
            <C>Documents/Inklo</C> does not exist;
          </li>
          <li>
            renames the vault&apos;s <C>.keyslate</C> folder (pins and tags) to{" "}
            <C>.inklo</C>.
          </li>
        </ul>
        <P>
          The GitHub repository moved to <C>akshit-bansal11/inklo</C>; old links
          redirect.
        </P>
      </Section>
    </>
  );
}
