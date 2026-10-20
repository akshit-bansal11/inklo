import { create } from "zustand";
import type { NoteMeta } from "@/lib/backend/note-schemas";
import { parseSettings, type Settings } from "@/lib/settings/settings-schema";

export type Overlay = "palette" | "quick-open" | "search" | "settings" | "shortcuts";
export type ListView = "all" | "pinned" | "trash";

export interface Toast {
  id: number;
  message: string;
  tone: "info" | "error";
}

export interface ConfirmRequest {
  message: string;
  confirmLabel: string;
  resolve: (confirmed: boolean) => void;
}

export interface AppState {
  /** False until settings and the first note list have loaded. */
  ready: boolean;
  vaultPath: string;
  notes: NoteMeta[];
  trash: NoteMeta[];

  /** The open note. `content` is the editor buffer; `savedContent` is what is on disk. */
  activeId: string | null;
  content: string;
  savedContent: string;
  /** `modified` of the open note as last read or written; a save expects the file to still have it. */
  savedModified: number | null;
  /** The open note is not UTF-8 or UTF-16 text: shown, never written. */
  readOnly: boolean;
  saving: boolean;
  /** 1-based line the editor should scroll to and place the caret on, once the note is shown. */
  pendingLine: number | null;

  view: ListView;
  tagFilter: string | null;
  filterText: string;

  overlay: Overlay | null;
  confirm: ConfirmRequest | null;
  toast: Toast | null;
  settings: Settings;
}

/**
 * Client state only. Notes live on disk; `notes` and `trash` are a cache of the
 * last listing and are replaced wholesale by `refreshNotes`. Mutate through the
 * functions in `note-actions.ts` and `ui-actions.ts`, never with `setState`
 * from a component.
 */
export const useAppStore = create<AppState>(() => ({
  ready: false,
  vaultPath: "",
  notes: [],
  trash: [],
  activeId: null,
  content: "",
  savedContent: "",
  savedModified: null,
  readOnly: false,
  saving: false,
  pendingLine: null,
  view: "all",
  tagFilter: null,
  filterText: "",
  overlay: null,
  confirm: null,
  toast: null,
  settings: parseSettings(null),
}));
