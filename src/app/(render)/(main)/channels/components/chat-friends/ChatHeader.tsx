import { IconBar } from "@/components/icons/IcnonsListFriends";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { User } from "@prisma/client";
import { Search } from "lucide-react";

interface ChatHeaderProps {
  friend: User;
  onMenuToggle: () => void;
  onVoiceCall?: () => void;
  onVideoCall?: () => void;
}


const ChatHeader = ({
  friend,
  onMenuToggle,
  onVideoCall,
  onVoiceCall
}: ChatHeaderProps) => {
  return (
    <div className="w-full sticky top-0 z-50 dark:bg-[#1A1A1E] bg-background shadow-sm">
      <div className="flex justify-between items-center px-4 py-2 border-b border-zinc-400 dark:border-[#1e1f22] w-full">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8 rounded-full">
            <AvatarImage src={friend?.image!} alt={friend?.username!} />
            <AvatarFallback className="bg-[#5865f2] text-white">
              {friend?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-zinc-700 text-base dark:text-gray-100">{friend?.name}</span>
            <span className="text-xs text-gray-400">{friend?.isOnline || "Offline"}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <IconBar
              onVoiceCall={onVoiceCall}
              onVideoCall={onVideoCall}
              onUserInfo={onMenuToggle}
              className="text-gray-400 dark:hover:text-gray-200"
            />
          </div>
          <div className="w-[180px] relative">
            <Input
              placeholder="Buscar..."
              className="w-full h-8 dark:bg-[#1e1f22] bg-zinc-400/30 text-sm border-none focus-visible:ring-0 text-gray-200 placeholder:text-gray-400"
            />
            <Search size={16} className="absolute top-2 right-2.5 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;