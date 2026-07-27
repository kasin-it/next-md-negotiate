import { DocsSidebar, DocsMobileNav } from "../components/docs-sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-5xl gap-12 px-5 py-10 sm:py-12">
        <DocsSidebar />
        <div className="min-w-0 flex-1">
          <DocsMobileNav />
          {children}
        </div>
      </div>
    </div>
  );
}
