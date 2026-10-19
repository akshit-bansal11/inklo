import { IS_MAC } from "@/lib/platform";

export type CommandGroup = "Note" | "Edit" | "View" | "Go" | "Vault" | "Theme" | "App";

export interface Command {
  /** Stable, dotted: "note.new". Keybinding overrides are stored against it. */
  id: string;
  /** Shown in the palette and the shortcut sheet. Sentence case, no trailing period. */
  title: string;
  group: CommandGroup;
  /** Key combo in the `keys.ts` format. Omit for palette-only commands. */
  defaultKey?: string;
  /** The Mac default when `defaultKey` collides with macOS (Cmd+H hides the app, Cmd+` switches windows, Cmd+Option+D toggles the Dock). "" leaves it unbound there. */
  macKey?: string;
  run: () => void | Promise<void>;
}

type KeyOverrides = Readonly<Record<string, string>>;

const commands = new Map<string, Command>();
const listeners = new Set<() => void>();
let snapshot: readonly Command[] = [];

function publish() {
  snapshot = [...commands.values()];
  for (const listener of listeners) listener();
}

/** Returns a function that removes exactly the commands this call added. */
export function registerCommands(list: readonly Command[]): () => void {
  for (const command of list) commands.set(command.id, command);
  publish();
  return () => {
    for (const command of list) {
      if (commands.get(command.id) === command) commands.delete(command.id);
    }
    publish();
  };
}

export function subscribeCommands(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Stable between registrations, so it is safe for `useSyncExternalStore`. */
export function getCommands(): readonly Command[] {
  return snapshot;
}

/**
 * The default combo on this system. On a Mac an Alt-only default would need Option,
 * which types characters, so it gains Cmd (Ctrl in the stored form) unless the command
 * names its own.
 */
export function defaultKeyOf(command: Command, mac = IS_MAC): string | undefined {
  if (!mac) return command.defaultKey;
  if (command.macKey !== undefined) return command.macKey === "" ? undefined : command.macKey;
  const key = command.defaultKey;
  return key?.startsWith("Alt+") ? `Ctrl+${key}` : key;
}

/** The combo currently bound to a command, after the user's overrides. */
export function keyFor(command: Command, overrides: KeyOverrides): string | undefined {
  const override = overrides[command.id];
  if (override === undefined) return defaultKeyOf(command);
  return override === "" ? undefined : override;
}

export function commandForKey(key: string, overrides: KeyOverrides): Command | undefined {
  return snapshot.find((command) => keyFor(command, overrides) === key);
}

/** Rejects when the command throws; resolves quietly when the id is unknown. */
export async function runCommand(id: string): Promise<void> {
  await commands.get(id)?.run();
}
