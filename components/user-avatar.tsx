
import { cn } from "@/lib/utils";
import { cva,VariantProps } from "class-variance-authority";
import {Skeleton} from "@/components/ui/skeleton";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { LiveBadge } from "./live-badge";

const avatarSizes = cva(
  "",
  {
    variants:{
      size: {
        default: "h-8 w-8",
        lg: "h-14 w-14",
      },
    },
  }
)

interface UserAvatarProps {
  username: string;
  imageUrl: string;
  size?: "sm" | "md" | "lg";
  isLive?: boolean;
  showBadge?: boolean;
}

const sizeMap = {
  sm: "h-6 w-6",    // 24x24
  md: "h-8 w-8",    // 32x32
  lg: "h-14 w-14",  // 56x56
};

export const UserAvatar = ({
  username,
  imageUrl,
  size = "md",
  isLive,
  showBadge,
}: UserAvatarProps) => {
  const showLive = isLive && showBadge;
  const ringClass = showLive ? "ring-2 ring-rose-500 ring-offset-2 ring-offset-white" : "";

  return (
    <div className="relative">
      <Avatar className="inline-block">
        <AvatarImage
          src={imageUrl || "/default-avatar.png"}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/default-avatar.png";
          }}
          className={cn(
            "rounded-full object-cover",
            sizeMap[size],
            ringClass
          )}
        />
        <AvatarFallback
          delayMs={500}
          className={cn(
            "flex items-center justify-center bg-muted text-white font-medium rounded-full",
            sizeMap[size],
            "text-xs",
            ringClass
          )}
        >
          {(username?.[0] ?? "U").toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {showLive && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
            LIVE
          </span>
        </div>
      )}
    </div>
  );
};

interface UserAvatarSkeletonProps 
  extends VariantProps<typeof avatarSizes>{};

export const UserAvatarSkeleton = ({
  size,
}: UserAvatarSkeletonProps) => {
  return(
    <Skeleton className={cn("rounded-full", avatarSizes({size}),)}/>
  );
};