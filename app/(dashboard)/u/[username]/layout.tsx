import { getSelfByUsername } from "@/lib/auth-service";
import { redirect } from "next/navigation";
import { Navbar } from "./_components/navbar";
import Sidebar from "./_components/sidebar";
import Container from "./_components/container";

interface CreatorLayoutProps {
  params: Promise<{ username: string }>; // ✅ async params
  children: React.ReactNode;
}

const CreatorLayout = async ({ params, children }: CreatorLayoutProps) => {
  const { username } = await params; // ✅ await params
  const self = await getSelfByUsername(username);

  if (!self) {
    redirect("/");
  }

  return (
    <>
      
      <div className="flex h-full pt-20">
        <Navbar />
        <Sidebar />
        <Container>{children}</Container>
      </div>
    </>
  );
};

export default CreatorLayout;
