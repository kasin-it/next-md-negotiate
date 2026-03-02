import { DocsSidebar, DocsMobileNav } from "../components/docs-sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pt-14 min-h-screen">
      <div className="max-w-6xl mx-auto px-5 py-10 sm:py-14 flex gap-10">
        <DocsSidebar />
        <div className="flex-1 min-w-0">
          <DocsMobileNav />
          {children}
        </div>
      </div>
    </div>
  );
}
