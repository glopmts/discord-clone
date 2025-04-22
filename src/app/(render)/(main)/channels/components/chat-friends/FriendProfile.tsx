import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@prisma/client";

interface FriendProfileProps {
  friend: User;
}

const FriendProfile = ({ friend }: FriendProfileProps) => {
  return (
    <div className="mt-4 flex flex-col">
      <Avatar className="w-20 h-20 dark:bg-[#1e1f22] bg-zinc-400/30 p-0.5 rounded-full border-4 border-zinc-400 dark:border-[#1e1f22]">
        <AvatarImage className="rounded-full object-cover" src={friend?.image!} alt={friend?.username!} />
        <AvatarFallback className="bg-[#5865f2] text-white">
          {friend?.username?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col mt-3">
        <span className="font-semibold text-xl dark:text-gray-100">{friend?.name}</span>
        <span className="text-sm dark:text-gray-400">@{friend?.username}</span>
      </div>
      <div className="flex items-center gap-1 text-gray-400 mt-4 text-center">
        <span>Este é o começo do seu histórico de mensagens diretas com</span>
        <span className="font-semibold dark:text-gray-200">{friend?.name}.</span>
      </div>
    </div>
  );
}

export default FriendProfile;