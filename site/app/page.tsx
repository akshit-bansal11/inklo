import {
  ArrowRight,
  ClipboardPaste,
  Download,
  FileText,
  FolderOpen,
  Keyboard,
  type LucideIcon,
  Palette,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { GithubMark } from "@/components/icons/github";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GridPattern } from "@/components/ui/grid-pattern";
import { MagicCard } from "@/components/ui/magic-card";
import { ATTEST_COMMAND, CHECKSUM_COMMANDS, REPO } from "@/lib/nav";
import { loadVersion } from "@/lib/repo";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/** The README's "What it does" list, one card each. */
const FEATURES: { title: string; Icon: LucideIcon; body: string }[] = [
  {
    title: "Markdown and plain text",
    Icon: FileText,
    body: "Each note is one or the other; switch with Ctrl+Shift+M. Markdown notes get syntax highlighting, formatting commands, and a live preview beside the editor or on its own.",
  },
  {
    title: "A vault of real files",
    Icon: FolderOpen,
    body: "The default vault is Documents/Inklo. Pins and tags live in .inklo/index.json inside it, so the note files stay clean. Edits made by another program show up live.",
  },
  {
    title: "Find anything",
    Icon: Search,
    body: "Ctrl+P jumps to a note by title, or creates one if nothing matches. Ctrl+Shift+F searches the text of every note and lands on the matching line.",
  },
  {
    title: "Import and export",
    Icon: Download,
    body: "Import .md and .txt files from a dialog or by dropping them on the window. Export a note as its own file or as a standalone HTML page, or copy it as Markdown, rich text or plain text. Export the whole vault to a folder.",
  },
  {
    title: "Smart paste",
    Icon: ClipboardPaste,
    body: "Rich text pasted into a Markdown note becomes Markdown. Ctrl+Shift+V makes the next paste plain.",
  },
  {
    title: "Themes",
    Icon: Palette,
    body: "Six built in, three dark and three light. Duplicate any of them to make your own, and share it as a JSON file. The theme editor warns when a colour pair is hard to read.",
  },
  {
    title: "Customisation",
    Icon: SlidersHorizontal,
    body: "Editor font, text size, line height, line width, wrapping, line numbers, spell check, density, sort order, default note format, and every shortcut.",
  },
  {
    title: "Summon from anywhere",
    Icon: Keyboard,
    body: "A global shortcut brings the window forward with a new note, whatever app has focus. It is off until you set one in Settings, and it does not work on Linux Wayland.",
  },
];

/** What happens to your notes, from the README and the changelog. */
const FILES: { title: string; body: string }[] = [
  {
    title: "Saved the way they were found",
    body: "UTF-8 (with or without a byte-order mark) and UTF-16 notes are saved as they were found, line endings included. A file in any other encoding opens read-only and is never written.",
  },
  {
    title: "Outside edits are never overwritten",
    body: "If another program changes the open note while you type, your version is saved as a new note beside it.",
  },
  {
    title: "A failed save keeps your text",
    body: "The text and the open note stay, and closing keeps the window open once so you can copy it out.",
  },
  {
    title: "A missing vault is reported",
    body: "A vault folder that went missing, deleted or on an unplugged drive, is reported instead of being recreated empty.",
  },
  {
    title: "A trash, not a delete",
    body: "Ctrl+Shift+Delete moves a note to .inklo/trash. Deleting for good asks first.",
  },
];

/** "Limits worth knowing", word for word in meaning. */
const LIMITS: string[] = [
  "Not code-signed on any system.",
  "The vault is one flat folder. Tags organise notes; there are no nested notebooks.",
  "No images or attachments. The preview shows an image's alt text, because the app cannot fetch anything.",
  "Links in the preview are copied to the clipboard when clicked rather than opened.",
  "Shortcuts are single combinations; there are no chord sequences.",
  "Search is a linear scan of the vault. It has not been measured on large vaults.",
  "Global shortcuts do not work on Linux Wayland. Use the desktop's own keyboard settings to start Inklo.",
];

const DOWNLOADS: { system: string; files: string[]; note: string }[] = [
  {
    system: "Windows",
    files: ["Inklo-<version>-windows-x64-setup.exe", "Inklo-<version>-windows-x64.exe"],
    note: "Windows 10 or 11, x64. Run the setup file to install; the other is the same app without an installer and still keeps its settings in your user profile. SmartScreen warns on first run: choose “More info”, then “Run anyway”. Inklo needs the WebView2 runtime, which ships with Windows 11 and current Windows 10.",
  },
  {
    system: "macOS",
    files: ["Inklo-<version>-macos-universal.dmg"],
    note: "Open the dmg and drag Inklo to Applications. It runs on Apple silicon and Intel. The app is ad-hoc signed, not notarized, so the first open is refused: open System Settings, then Privacy & Security, and choose “Open Anyway”. This build is new in 0.2.0 and has not been tried on real machines beyond CI.",
  },
  {
    system: "Linux",
    files: ["Inklo-<version>-linux-x86_64.AppImage", "Inklo-<version>-linux-amd64.deb"],
    note: "x86_64 only. Run chmod +x on the AppImage first. Inklo needs WebKitGTK 4.1, which the .deb pulls in. These builds are new in 0.2.0 and have not been tried on real machines beyond CI.",
  },
];

/** A section's heading block: a short accent eyebrow, a 900 title, a dim lede. */
function Heading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <BlurFade>
      <p className="text-primary text-[0.9375rem] font-bold">{eyebrow}</p>
      <h2 className="mt-2 max-w-[22ch] text-[2rem] leading-[1.08] font-black tracking-[-0.02em] md:text-5xl">
        {title}
      </h2>
      {children ? (
        <p className="text-dim mt-4 max-w-[64ch] text-base leading-relaxed md:text-lg">
          {children}
        </p>
      ) : null}
    </BlurFade>
  );
}

/** An inline "go deeper" link: accent, bold, with an arrow. */
function MoreLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-primary inline-flex min-h-11 items-center gap-1.5 rounded-lg text-[0.9375rem] font-bold hover:underline hover:underline-offset-4"
    >
      {children}
      <ArrowRight aria-hidden className="size-4" />
    </Link>
  );
}

const SECTION = "mx-auto max-w-[80rem] scroll-mt-20 px-4 py-14 md:px-6 md:py-20";

export default function Page() {
  // Read at build time from the repository's package.json, so the version on this page
  // is the one the app ships.
  const version = loadVersion();

  const facts: { term: string; value: string }[] = [
    { term: "Runs on", value: "Windows, macOS and Linux" },
    { term: "Notes", value: "Plain .md and .txt files" },
    { term: "Network code", value: "None" },
    { term: "Version", value: `${version}, MIT` },
  ];

  return (
    <div id="top" className="min-h-dvh">
      <SiteHeader />

      <main id="main" className="scroll-mt-16">
        {/* Hero, on a faint grid that fades out towards the edges */}
        <section className="relative overflow-hidden">
          <GridPattern
            width={35}
            height={35}
            className="fill-transparent stroke-line [mask-image:radial-gradient(ellipse_70%_60%_at_60%_30%,black,transparent)]"
          />
          <div className="relative mx-auto max-w-[80rem] px-4 pt-12 pb-16 md:px-6 md:pt-20 md:pb-24">
            {/* No entrance on the headline: it is the largest paint on the page, and a
                fade would leave it invisible until the JavaScript arrives. */}
            <div>
              <p className="bg-card shadow-card inline-flex rounded-full px-4 py-1.5 text-sm font-bold">
                <AnimatedShinyText>Local, keyboard-first notes</AnimatedShinyText>
              </p>
              <h1 className="mt-6 max-w-[16ch] text-[2.75rem] leading-[1.02] font-black tracking-[-0.025em] sm:text-6xl lg:text-7xl">
                Notes that stay plain files.
              </h1>
              <p className="text-dim mt-6 max-w-[60ch] text-lg leading-relaxed md:text-xl">
                Inklo is a fully local notes app for Windows, macOS and Linux. Your
                notes are plain .md and .txt files in a folder you choose, so any other
                editor can open the same folder. Every action is a command: press Ctrl+K
                to see them all, and rebind any of them in Settings.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild>
                  <a href="#get">Download</a>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/docs">
                    Read the docs
                    <ArrowRight aria-hidden className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="ghost">
                  <a href={REPO} target="_blank" rel="noreferrer noopener">
                    <GithubMark className="size-4" />
                    Source
                  </a>
                </Button>
              </div>

              <ul
                aria-label="What it does not need"
                className="mt-8 flex flex-wrap gap-2"
              >
                {[
                  "No account",
                  "No sync",
                  "No telemetry",
                  "No network code",
                  "MIT licensed",
                ].map((item) => (
                  <li key={item}>
                    <Badge variant="outline">{item}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* The facts, stated rather than claimed */}
        <div className="mx-auto max-w-[80rem] px-4 md:px-6">
          <BlurFade>
            <dl className="bg-line shadow-card grid gap-px overflow-hidden rounded-[var(--radius-panel)] sm:grid-cols-2 lg:grid-cols-4">
              {facts.map((fact) => (
                <div key={fact.term} className="bg-card px-5 py-4">
                  <dt className="label">{fact.term}</dt>
                  <dd className="mt-1 text-base font-bold">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </BlurFade>
        </div>

        {/* What it does */}
        <section id="features" className={SECTION}>
          <Heading eyebrow="What it does" title="Everything is a command.">
            Press Ctrl+K to see all of them, F1 for the current shortcuts, and rebind
            any of them in Settings. On a Mac, use Cmd wherever this page says Ctrl.
          </Heading>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {FEATURES.map(({ title, Icon, body }, index) => (
              <li key={title}>
                <BlurFade delay={(index % 2) * 0.05} className="h-full">
                  <MagicCard className="shadow-card h-full rounded-[var(--radius-panel)]">
                    <div className="p-6">
                      <span className="bg-accent-soft text-primary grid size-11 place-items-center rounded-xl">
                        <Icon aria-hidden className="size-5" />
                      </span>
                      <h3 className="mt-4 text-lg font-bold">{title}</h3>
                      <p className="text-dim mt-2 text-[0.9375rem] leading-relaxed">
                        {body}
                      </p>
                    </div>
                  </MagicCard>
                </BlurFade>
              </li>
            ))}
          </ul>

          <BlurFade>
            <p className="mt-4">
              <MoreLink href="/docs#features">Everything it does</MoreLink>
            </p>
          </BlurFade>
        </section>

        {/* Your files stay yours */}
        <section id="files" className={SECTION}>
          <Heading eyebrow="Your files" title="Your files stay yours.">
            There is no account, no sync, no telemetry and no network code: the
            app&apos;s content security policy allows the window to talk to its own Rust
            core and nothing else.
          </Heading>

          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {FILES.map(({ title, body }, index) => (
              <li key={title}>
                <BlurFade delay={(index % 2) * 0.05} className="h-full">
                  <Card className="h-full px-6 py-6">
                    <span className="bg-accent-soft text-primary grid size-11 place-items-center rounded-xl">
                      {title === "A trash, not a delete" ? (
                        <Trash2 aria-hidden className="size-5" />
                      ) : (
                        <ShieldCheck aria-hidden className="size-5" />
                      )}
                    </span>
                    <div>
                      <h3 className="text-lg leading-snug font-bold">{title}</h3>
                      <p className="text-dim mt-2 text-[0.9375rem] leading-relaxed">
                        {body}
                      </p>
                    </div>
                  </Card>
                </BlurFade>
              </li>
            ))}
          </ul>

          <BlurFade>
            <p className="mt-4">
              <MoreLink href="/docs#security">
                What Inklo protects, and what it does not
              </MoreLink>
            </p>
          </BlurFade>
        </section>

        {/* What it will not do */}
        <section id="limits" className={SECTION}>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-16">
            <Heading eyebrow="The limits" title="Limits worth knowing.">
              These are the README&apos;s own list. Nothing is left out because it is
              inconvenient.
            </Heading>

            <BlurFade delay={0.05}>
              <ul className="bg-card shadow-card divide-line divide-y rounded-[var(--radius-panel)] px-5">
                {LIMITS.map((limit) => (
                  <li key={limit} className="py-4 text-[0.9375rem] leading-relaxed">
                    {limit}
                  </li>
                ))}
              </ul>
              <p className="mt-3 px-1">
                <MoreLink href="/docs#limits">Limits in the docs</MoreLink>
              </p>
            </BlurFade>
          </div>
        </section>

        {/* Download */}
        <section id="get" className={SECTION}>
          <Heading eyebrow="Download" title="One file for your system.">
            Download it from the latest release. No build is code-signed, so each system
            warns on first run; the steps are below.
          </Heading>

          <ul className="mt-10 grid gap-4 lg:grid-cols-3">
            {DOWNLOADS.map(({ system, files, note }, index) => (
              <li key={system}>
                <BlurFade delay={index * 0.05} className="h-full">
                  <Card className="h-full px-6 py-6">
                    <h3 className="text-lg font-bold">{system}</h3>
                    <ul className="mt-3 space-y-1">
                      {files.map((file) => (
                        <li
                          key={file}
                          className="font-mono text-[0.8125rem] [overflow-wrap:anywhere]"
                        >
                          {file}
                        </li>
                      ))}
                    </ul>
                    <p className="text-dim mt-3 text-[0.9375rem] leading-relaxed">
                      {note}
                    </p>
                  </Card>
                </BlurFade>
              </li>
            ))}
          </ul>

          <BlurFade className="mt-10 grid max-w-[52rem] gap-4">
            <p className="text-dim max-w-[68ch] text-[0.9375rem] leading-relaxed">
              SHA256SUMS.txt is published with each release. Run the check from the
              folder holding the download. Every file also carries a build provenance
              attestation.
            </p>
            <CodeBlock title="Check the download" code={CHECKSUM_COMMANDS} />
            <CodeBlock title="Verify the attestation" code={ATTEST_COMMAND} />
          </BlurFade>

          <BlurFade>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button asChild>
                <a
                  href={`${REPO}/releases/latest`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Latest release
                </a>
              </Button>
              <Button asChild variant="outline">
                <Link href="/docs#install">
                  Full install guide
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
              </Button>
            </div>
            <p className="text-dim mt-4 max-w-[68ch] text-[0.9375rem] leading-relaxed">
              Free and MIT licensed. Inklo does not update itself: install a newer
              release over the old one, and your notes and settings stay.
            </p>
          </BlurFade>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
