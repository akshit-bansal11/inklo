import type { Metadata } from "next";
import { InstallSections } from "@/components/sections/install";
import { ProjectSections } from "@/components/sections/project";
import { UsingSections } from "@/components/sections/using";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Toc } from "@/components/toc";
import { loadVersion } from "@/lib/repo";

const TITLE = "Inklo — documentation";
const DESCRIPTION =
  "Inklo documentation on one page: install on Windows, macOS and Linux, default shortcuts, known limits, the security model, and the developer guide.";

// A page's openGraph replaces the layout's whole object rather than merging into it,
// hence type and site name again here.
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/docs" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "/docs",
    siteName: "Inklo",
  },
};

export default function DocsPage() {
  // Read at build time from the repository's package.json. If it cannot be parsed this
  // throws and the build fails, rather than rendering a page with no version.
  const version = loadVersion();

  return (
    <div id="top" className="min-h-dvh">
      <SiteHeader variant="docs" />

      <main id="main" className="mx-auto scroll-mt-16 max-w-[90rem] px-4 md:px-6">
        {/* No entrance on the title block: it is the first paint, and a fade would
            hide it until the JavaScript arrives. */}
        <div className="py-10 md:py-16">
          <p className="text-primary mb-2 text-[0.9375rem] font-bold">Documentation</p>
          <h1 className="max-w-[20ch] text-[2.5rem] leading-[1.04] font-black tracking-[-0.025em] md:text-6xl">
            Install Inklo, and what it does.
          </h1>
          <p className="text-dim mt-5 max-w-[64ch] text-base leading-relaxed md:text-lg">
            Install on Windows, macOS and Linux, the default shortcuts, the known
            limits, the security model, and the developer guide. The version is read
            from the repository when this page is built.
          </p>
        </div>

        {/* Sidebar + body */}
        <div className="lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12">
          <aside className="hidden lg:block">
            <div className="bg-card shadow-card sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-[var(--radius-panel)] p-3 pt-4">
              <Toc />
            </div>
          </aside>

          <div className="divide-line min-w-0 divide-y">
            <InstallSections />
            <UsingSections />
            <ProjectSections version={version} />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
