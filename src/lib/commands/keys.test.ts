import { describe, expect, it } from "vitest";
import { firesWhileTyping, isGlobalAccelerator, keyFromEvent, keyLabel } from "@/lib/commands/keys";

const press = (
  code: string,
  mods: Partial<Record<"ctrl" | "alt" | "shift" | "meta", boolean>> = {},
) =>
  keyFromEvent({
    code,
    ctrlKey: mods.ctrl ?? false,
    altKey: mods.alt ?? false,
    shiftKey: mods.shift ?? false,
    metaKey: mods.meta ?? false,
  });

const base = { ctrlKey: false, altKey: false, shiftKey: false, metaKey: false };

describe("keyFromEvent", () => {
  it("ignores AltGr, which browsers report as Ctrl+Alt", () => {
    const event = { ...base, code: "KeyC", ctrlKey: true, altKey: true };
    expect(keyFromEvent({ ...event, getModifierState: (k) => k === "AltGraph" }, false)).toBeNull();
  });

  it("on a Mac maps Cmd to Ctrl and leaves Control and Option alone", () => {
    expect(keyFromEvent({ ...base, code: "KeyK", metaKey: true }, true)).toBe("Ctrl+K");
    expect(keyFromEvent({ ...base, code: "KeyA", ctrlKey: true }, true)).toBeNull();
    expect(keyFromEvent({ ...base, code: "KeyE", altKey: true }, true)).toBeNull();
    expect(keyFromEvent({ ...base, code: "KeyE", altKey: true, metaKey: true }, true)).toBe(
      "Ctrl+Alt+E",
    );
  });

  it("orders modifiers Ctrl, Alt, Shift whatever order they were pressed in", () => {
    expect(press("KeyK", { shift: true, alt: true, ctrl: true })).toBe("Ctrl+Alt+Shift+K");
  });

  it("names the physical key, so Shift does not change it", () => {
    expect(press("Slash", { shift: true })).toBe("Shift+/");
    expect(press("Digit8", { ctrl: true, shift: true })).toBe("Ctrl+Shift+8");
  });

  it("covers function, arrow and punctuation keys", () => {
    expect(press("F2")).toBe("F2");
    expect(press("ArrowDown", { alt: true })).toBe("Alt+Down");
    expect(press("Backslash", { ctrl: true })).toBe("Ctrl+\\");
    expect(press("Backquote", { ctrl: true })).toBe("Ctrl+`");
  });

  it("returns null for a bare modifier or an unknown key", () => {
    expect(press("ControlLeft", { ctrl: true })).toBeNull();
    expect(press("MediaPlayPause")).toBeNull();
  });
});

describe("firesWhileTyping", () => {
  it("allows only combos plain typing cannot produce", () => {
    expect(firesWhileTyping("Ctrl+N")).toBe(true);
    expect(firesWhileTyping("Alt+P")).toBe(true);
    expect(firesWhileTyping("F1")).toBe(true);
    expect(firesWhileTyping("Shift+/")).toBe(false);
    expect(firesWhileTyping("Delete")).toBe(false);
  });
});

describe("isGlobalAccelerator", () => {
  it("needs Ctrl or Alt", () => {
    expect(isGlobalAccelerator("Ctrl+Alt+N")).toBe(true);
    expect(isGlobalAccelerator("F5")).toBe(false);
  });
});

describe("keyLabel", () => {
  it("writes Mac symbols on a Mac and leaves the combo alone elsewhere", () => {
    expect(keyLabel("Ctrl+Shift+K", true)).toBe("⌘⇧K");
    expect(keyLabel("Ctrl+Shift+K", false)).toBe("Ctrl+Shift+K");
  });
});
