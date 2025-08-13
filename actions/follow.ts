"use server"
import { revalidatePath } from "next/cache";
import { followUser, unfollowUser } from "@/lib/follow-service";

export const onFollow = async (username: string) => {
    try {
        const followedUser = await followUser(username);
        revalidatePath("/");

        if (followedUser) {
            revalidatePath(`/${followedUser.following.username}`);
        }

        return followedUser;
    } catch (error) {
        console.error("Follow error:", error);
        if (process.env.NODE_ENV === "development") {
            throw error;
        }
        throw new Error("Internal Error");
    }
};

export const onUnfollow = async (username: string) => {
    try {
        const unfollowedUser = await unfollowUser(username);
        revalidatePath("/");

        if (unfollowedUser) {
            revalidatePath(`/${unfollowedUser.following.username}`);
        }

        return unfollowedUser;
    } catch (error) {
        console.error("Unfollow error:", error);
        if (process.env.NODE_ENV === "development") {
            throw error;
        }
        throw new Error("Internal Error");
    }
};