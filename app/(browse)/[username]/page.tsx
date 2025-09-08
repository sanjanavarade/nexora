import { isFollowingUser } from "@/lib/follow-service";
import { getUserByUsername } from "@/lib/user-service";
import { notFound } from "next/navigation";
import { Actions } from "./_components/actions";
import { isBlockedByUser } from "@/lib/block-service";
import StreamPlayer from "@/components/stream-player";

interface UserPageProps {
    params: Promise<{
        username: string;
    }>;
}

const UserPage = async ({ params }: UserPageProps) => {
    // ✅ params Promise ko await kiya
    const { username } = await params;

    const user = await getUserByUsername(username);

    if (!user || !user.stream) {
        notFound();
    }

    const isFollowing = await isFollowingUser(user.id);
    const isBlocked = await isBlockedByUser(user.id);

    if(isBlocked){
        notFound();
    }

    return (
        <StreamPlayer
          user= {user}
          stream={user.stream}
          isFollowing={isFollowing}
        
        />
    );
};

export default UserPage;
