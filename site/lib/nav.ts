/**
 * The documentation page's table of contents. One list, used three times: by the
 * sidebar, by the mobile menu, and by the scroll-spy. Every `id` here must exist as a
 * section anchor on the page, which is why the sections take their heading from this
 * list rather than repeating it.
 */
export type NavItem = { id: string; label: string };
export type NavGroup = { label: string; items: NavItem[] };

export const NAV: NavGroup[] = [
  {
    label: "Install",
    items: [
      { id: "install", label: "Install" },
      { id: "check", label: "Check the download" },
      { id: "where", label: "Where things live" },
      { id: "upgrading", label: "Upgrading" },
      { id: "uninstall", label: "Uninstall" },
      { id: "keyslate", label: "Upgrading from Keyslate" },
    ],
  },
  {
    label: "Using Inklo",
    items: [
      { id: "features", label: "What it does" },
      { id: "shortcuts", label: "Default shortcuts" },
      { id: "limits", label: "Limits" },
    ],
  },
  {
    label: "Reference",
    items: [{ id: "security", label: "Security" }],
  },
  {
    label: "Developing",
    items: [
      { id: "develop", label: "Develop" },
      { id: "releases", label: "Releases" },
    ],
  },
];

export const ALL_NAV_IDS: string[] = NAV.flatMap((group) =>
  group.items.map((item) => item.id),
);

export const REPO = "https://github.com/akshit-bansal11/inklo";

/** The site's one origin. Canonical links, the sitemap and robots.txt all resolve against it. */
export const SITE = "https://inklo.akshitbansal.dev";

/** The two checks the README gives for a download, run from the folder holding it. */
export const CHECKSUM_COMMANDS = `Get-FileHash <file> -Algorithm SHA256            # Windows (PowerShell); compare with SHA256SUMS.txt
shasum -a 256 -c SHA256SUMS.txt --ignore-missing # macOS
sha256sum -c --ignore-missing SHA256SUMS.txt     # Linux`;

export const ATTEST_COMMAND =
  "gh attestation verify <file> --repo akshit-bansal11/inklo";
