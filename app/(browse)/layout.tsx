import Sidebar, { SidebarSkeleton } from "./_components/sidebar";
import Container from "./_components/container";
import { Suspense } from "react";
import { Navbar } from "./_components/navbar";

export default function BrowseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-20">

        <Suspense fallback={<SidebarSkeleton />}>
          <Sidebar />
        </Suspense>
        <Container>{children}</Container>
      </div>
    </div>
  );
}
