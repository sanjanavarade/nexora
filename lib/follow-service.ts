import { getSelf } from './auth-service';
import prisma from './prisma';

export const getFollowedUsers = async () => {
    try {
        const self = await getSelf();

        const followedUsers = await prisma.follow.findMany({
            where: {
                followerId: self.id,
                following: {
                    blocking: {
                        none: {
                            blockedId: self.id,
                        }
                    }
                }
            },
            include: {
                following: {
                    include:{
                        stream: {
                            select:{
                                isLive:true,
                            }
                        },
                    },
                },
            },
        });

        return followedUsers;
    } catch {
        return [];
    }
};

export const isFollowingUser = async (username: string) => {
    try {
        const self = await getSelf();

        const otherUser = await prisma.user.findUnique({
            where: { username },
        });

        if (!otherUser) {
            throw new Error("User not found");
        }

        if (otherUser.id === self.id) {
            return true;
        }

        const existingFollow = await prisma.follow.findFirst({
            where: {
                followerId: self.id,
                followingId: otherUser.id,
            },
        });

        return !!existingFollow;
    } catch {
        return false;
    }
};

export const followUser = async (username: string) => {
    console.log("followUser called with username:", username);
    const self = await getSelf();

    const otherUser = await prisma.user.findUnique({
        where: { username },
    });

    if (!otherUser) {
        throw new Error("User not found");
    }

    if (otherUser.id === self.id) {
        throw new Error("Cannot follow yourself");
    }

    const existingFollow = await prisma.follow.findFirst({
        where: {
            followerId: self.id,
            followingId: otherUser.id,
        },
    });

    if (existingFollow) {
        throw new Error("Already following");
    }

    const follow = await prisma.follow.create({
        data: {
            followerId: self.id,
            followingId: otherUser.id,
        },
        include: {
            following: true,
            follower: true,
        },
    });

    return follow;
};

export const unfollowUser = async (username: string) => {
    const self = await getSelf();

    const otherUser = await prisma.user.findUnique({
        where: { username },
    });

    if (!otherUser) {
        throw new Error("User not found");
    }

    if (otherUser.id === self.id) {
        throw new Error("Cannot unfollow yourself");
    }

    const existingFollow = await prisma.follow.findFirst({
        where: {
            followerId: self.id,
            followingId: otherUser.id,
        },
    });

    if (!existingFollow) {
        throw new Error("Not following");
    }

    const follow = await prisma.follow.delete({
        where: {
            id: existingFollow.id,
        },
        include: {
            following: true,
        },
    });

    return follow;
};
