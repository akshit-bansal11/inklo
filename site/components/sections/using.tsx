import { C, Note, P, Section } from "@/components/section";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const LIST = "max-w-[68ch] list-disc space-y-2 pl-5 text-base leading-relaxed";

const FEATURES: { title: string; body: string }[] = [
  {
    title: "Markdown and plain text",
    body: "Each note is one or the other; switch with Ctrl+Shift+M. Markdown notes get syntax highlighting, formatting commands, and a live preview beside the editor or on its own.",
  },
  {
    title: "A vault of real files",
    body: "The default vault is Documents/Inklo. Pins and tags live in .inklo/index.json inside it, so the note files stay clean. Edits made by another program show up live.",
  },
  {
    title: "Find anything",
    body: "Ctrl+P jumps to a note by title, or creates one if nothing matches. Ctrl+Shift+F searches the text of every note and lands on the matching line.",
  },
  {
    title: "Import and export",
    body: "Import .md and .txt files from a dialog or by dropping them on the window. Export a note as its own file or as a standalone HTML page, or copy it as Markdown, rich text or plain text. Export the whole vault to a folder.",
  },
  {
    title: "Smart paste",
    body: "Rich text pasted into a Markdown note becomes Markdown. Ctrl+Shift+V makes the next paste plain.",
  },
  {
    title: "Themes",
    body: "Six built in, three dark and three light. Duplicate any of them to make your own, and share it as a JSON file. The theme editor warns when a colour pair is hard to read.",
  },
  {
    title: "Customisation",
    body: "Editor font, text size, line height, line width, wrapping, line numbers, spell check, density, sort order, default note format, and every shortcut.",
  },
  {
    title: "Summon from anywhere",
    body: "A global shortcut brings the window forward with a new note, whatever app has focus. It is off until you set one in Settings, and it does not work on Linux Wayland.",
  },
  {
    title: "Your files, as they were",
    body: "UTF-8 (with or without a byte-order mark) and UTF-16 notes are saved the way they were found, line endings included. A file in any other encoding opens read-only.",
  },
  {
    title: "Nothing lost to a clash",
    body: "If another program changes the open note while you type, your version is saved as a new note beside it.",
  },
  {
    title: "A trash, not a delete",
    body: "Ctrl+Shift+Delete moves a note to .inklo/trash. Deleting for good asks first.",
  },
];

type Shortcut = { keys: string; action: string };

const SHORTCUTS: { group: string; rows: Shortcut[] }[] = [
  {
    group: "Notes",
    rows: [
      { keys: "Ctrl+N", action: "New note" },
      { keys: "Ctrl+Shift+N", action: "New plain-text note" },
      { keys: "F2", action: "Rename note" },
      { keys: "Ctrl+T", action: "Edit tags" },
      { keys: "Alt+P", action: "Pin or unpin" },
      { keys: "Ctrl+Shift+D", action: "Duplicate" },
      { keys: "Ctrl+Shift+M", action: "Switch between Markdown and plain text" },
      { keys: "Ctrl+Shift+Delete", action: "Move to trash" },
      { keys: "Ctrl+S", action: "Save now (notes also save as you type)" },
      { keys: "Ctrl+O", action: "Import notes from files" },
      { keys: "Ctrl+Shift+S", action: "Export note as a file" },
      {
        keys: "Ctrl+Shift+C / Ctrl+Alt+C",
        action: "Copy note as Markdown / as rich text",
      },
    ],
  },
  {
    group: "Moving around",
    rows: [
      { keys: "Ctrl+K", action: "Show all commands" },
      { keys: "Ctrl+P", action: "Go to note" },
      { keys: "Ctrl+Shift+F", action: "Search in all notes" },
      { keys: "Ctrl+PageDown / Ctrl+PageUp", action: "Next / previous note" },
      {
        keys: "Alt+E / Alt+L / Alt+F",
        action: "Focus the editor / the note list / the list filter",
      },
      { keys: "Ctrl+,", action: "Settings" },
      { keys: "F1", action: "Keyboard shortcuts" },
    ],
  },
  {
    group: "View",
    rows: [
      {
        keys: "Alt+1 / Alt+2 / Alt+3",
        action: "Editor only / side by side / preview only",
      },
      { keys: "Ctrl+E", action: "Cycle those three" },
      { keys: "Ctrl+\\", action: "Show or hide the sidebar" },
      {
        keys: "Ctrl+= / Ctrl+- / Ctrl+0",
        action: "Larger / smaller / default text size",
      },
      { keys: "Alt+Z", action: "Toggle word wrap" },
      { keys: "Ctrl+Alt+T", action: "Next theme" },
    ],
  },
  {
    group: "Editing (Markdown notes)",
    rows: [
      {
        keys: "Ctrl+B / Ctrl+I / Ctrl+Shift+X",
        action: "Bold / italic / strikethrough",
      },
      { keys: "Ctrl+` / Ctrl+Shift+`", action: "Inline code / code block" },
      { keys: "Ctrl+L", action: "Link" },
      { keys: "Ctrl+H", action: "Cycle heading level" },
      {
        keys: "Ctrl+Shift+8 / Ctrl+Shift+7 / Ctrl+Shift+9",
        action: "Bulleted / numbered / task list",
      },
      { keys: "Ctrl+Enter", action: "Check or uncheck a task" },
      { keys: "Ctrl+Shift+.", action: "Quote" },
      { keys: "Alt+D", action: "Insert today's date" },
      { keys: "Ctrl+F", action: "Find in note" },
      { keys: "Ctrl+Shift+V", action: "Make the next paste plain text" },
    ],
  },
];

const LIMITS: string[] = [
  "Not code-signed on any system.",
  "The vault is one flat folder. Tags organise notes; there are no nested notebooks.",
  "No images or attachments. The preview shows an image's alt text, because the app cannot fetch anything.",
  "Links in the preview are copied to the clipboard when clicked rather than opened.",
  "Shortcuts are single combinations; there are no chord sequences.",
  "Search is a linear scan of the vault. It has not been measured on large vaults.",
  "Global shortcuts do not work on Linux Wayland. Use the desktop's own keyboard settings to start Inklo.",
  "Notes over 5 MiB are refused.",
];

/** What it does, the default shortcuts, and the limits. */
export function UsingSections() {
  return (
    <>
      <Section
        id="features"
        eyebrow="Using Inklo"
        title="What it does"
        lede={
          <>
            Every action is a command. Press <C>Ctrl+K</C> to see all of them, <C>F1</C>{" "}
            for the current shortcuts, and rebind any of them in Settings. On a Mac, use
            Cmd wherever this page says Ctrl.
          </>
        }
      >
        <ul className="max-w-[68ch] list-disc space-y-3 pl-5 text-base leading-relaxed">
          {FEATURES.map((feature) => (
            <li key={feature.title}>
              <strong>{feature.title}.</strong> {feature.body}
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="shortcuts"
        title="Default shortcuts"
        lede="All of these can be changed in Settings, under Shortcuts."
      >
        <Note label="On a Mac">
          Cmd for Ctrl; Cmd+Option for the Alt-only ones; and cycle heading Cmd+Shift+H,
          inline code Cmd+Shift+K, code block Cmd+Option+K, insert today&apos;s date
          Cmd+Shift+;.
        </Note>

        {SHORTCUTS.map((table) => (
          <Table key={table.group}>
            <TableHeader>
              <TableRow>
                <TableHead>{table.group}</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.rows.map((row) => (
                <TableRow key={row.keys}>
                  <TableCell>
                    <C>{row.keys}</C>
                  </TableCell>
                  <TableCell>{row.action}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ))}

        <P>
          In the note list: arrows move, <C>Enter</C> opens, <C>Delete</C> trashes, and
          typing starts filtering.
        </P>
      </Section>

      <Section id="limits" title="Limits" lede="Limits worth knowing.">
        <ul className={LIST}>
          {LIMITS.map((limit) => (
            <li key={limit}>{limit}</li>
          ))}
        </ul>
      </Section>
    </>
  );
}
