import { useCommands } from "@/hooks/use-commands";
import { keyLabel } from "@/lib/commands/keys";
import { keyFor } from "@/lib/commands/registry";
import { useAppStore } from "@/lib/store/app-store";

/** The key currently bound to a command, or undefined when it has none. */
export function useCommandKey(commandId: string): string | undefined {
  const commands = useCommands();
  const keybindings = useAppStore((state) => state.settings.keybindings);
  const command = commands.find((entry) => entry.id === commandId);
  const key = command ? keyFor(command, keybindings) : undefined;
  return key === undefined ? undefined : keyLabel(key);
}
