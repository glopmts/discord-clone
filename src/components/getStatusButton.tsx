import { Ban, Check, Loader, UserPlus2Icon, UserRoundCog } from "lucide-react";
import { Button } from "./ui/button";

interface FriendStatus {
  friendshipStatus: string;
  isLoadingStatus: boolean;
  handleAddFriend: () => void;
  addFriendMutation: {
    isPending: boolean;
  }
}

export const getStatusButton = ({
  isLoadingStatus,
  friendshipStatus,
  addFriendMutation,
  handleAddFriend
}: FriendStatus) => {

  if (isLoadingStatus) {
    return (
      <Button disabled className="rounded-full w-8 h-8 bg-background dark:bg-zinc-800/60">
        <Loader size={16} className="animate-spin" />
      </Button>
    );
  }

  switch (friendshipStatus) {
    case "PENDING":
      return (
        <Button title="Pedido pendente..." disabled className="rounded-full w-8 h-8 bg-yellow-600/60">
          <UserRoundCog size={16} className="text-white" />
        </Button>
      );
    case "ACCEPTED":
      return (
        <Button disabled className="rounded-full w-8 h-8 bg-green-600">
          <Check size={16} className="text-white" />
        </Button>
      );
    case "FRIENDS":
      return (
        <Button disabled className="rounded-full w-8 h-8 bg-green-600">
          <Check size={16} className="text-white" />
        </Button>
      );
    case "BLOCKED":
      return (
        <Button disabled className="rounded-full w-8 h-8 bg-red-600/100">
          <Ban size={16} className="text-white" />
        </Button>
      );
    default:
      return (
        <Button
          onClick={handleAddFriend}
          className="rounded-full w-8 h-8 bg-background dark:bg-zinc-800/60 hover:bg-zinc-700/30 text-white"
          disabled={addFriendMutation.isPending}
        >
          {addFriendMutation.isPending ? (
            <Loader size={16} className="animate-spin text-white" />
          ) : (
            <UserPlus2Icon size={16} />
          )}
        </Button>
      );
  }
};