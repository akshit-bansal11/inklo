/** Which desktop the page runs on, from the web view's user agent. */
const agent = typeof navigator === "undefined" ? "" : navigator.userAgent;

export const IS_MAC = /Macintosh|Mac OS X/.test(agent);
export const IS_WINDOWS = /Windows/.test(agent);

/** What the system's own file browser is called, for "Open vault folder in …". */
export const FILE_MANAGER = IS_MAC ? "Finder" : IS_WINDOWS ? "Explorer" : "the file manager";
