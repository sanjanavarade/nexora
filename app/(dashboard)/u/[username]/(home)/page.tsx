import StreamPlayer from "@/components/stream-player/index";
import { getUserByUsername } from "@/lib/user-service";
import { currentUser } from "@clerk/nextjs/server";

interface CreatorPageProps {
  params: Promise<{ username: string }>; // params as a Promise
}

const CreatorPage = async ({ params }: CreatorPageProps) => {
  const { username } = await params; // await params first

  const externalUser = await currentUser();
  const user = await getUserByUsername(username); // use awaited username here

  if (!user || user.externalUserId !== externalUser?.id || !user.stream) {
    throw new Error("Unauthorized");
  }

  return (
    <div className="h-full">
      <StreamPlayer user={user} stream={user.stream} isFollowing />
    </div>
  );
};

export default CreatorPage;
