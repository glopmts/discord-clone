"use client";

import { getUserById } from "@/app/actions/user";
import LoadingScreen from "@/components/loadingScree";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatDateComplete } from "@/utils/formatDate";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { PhoneCall, Pin, Search, User2Icon, UserCheck, Users, VideoIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

type IconItem = {
  id: number;
  icon: React.ComponentType<{ size?: number }>;
  active: boolean;
  onClick: () => void;
};

const ChatFriends = () => {
  const { userId } = useAuth();
  const { id } = useParams<{ id: string; }>();
  const [isOpen, setOpen] = useState(false);
  const [activeIcon, setActiveIcon] = useState<number | null>(null);

  const {
    data: friends,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["userMessages", id],
    queryFn: () => getUserById(id!),
  });

  const handleMenuInfor = () => {
    setOpen(prev => !prev);
    setActiveIcon(5);
  };

  const handleIconClick = (iconId: number) => {
    switch (iconId) {
      case 1:
        console.log("Iniciar chamada de voz");
        break;
      case 2:
        console.log("Iniciar chamada de vídeo");
        break;
      case 3:
        console.log("Mostrar mensagens fixadas");
        break;
      case 4:
        console.log("Mostrar membros do chat");
        break;
      case 5:
        handleMenuInfor();
        break;
      default:
        break;
    }

    setActiveIcon(iconId === activeIcon ? null : iconId);
  };

  const iconsList: IconItem[] = [
    {
      id: 1,
      icon: PhoneCall,
      active: activeIcon === 1,
      onClick: () => handleIconClick(1)
    },
    {
      id: 2,
      icon: VideoIcon,
      active: activeIcon === 2,
      onClick: () => handleIconClick(2)
    },
    {
      id: 3,
      icon: Pin,
      active: activeIcon === 3,
      onClick: () => handleIconClick(3)
    },
    {
      id: 4,
      icon: Users,
      active: activeIcon === 4,
      onClick: () => handleIconClick(4)
    },
    {
      id: 5,
      icon: User2Icon,
      active: isOpen,
      onClick: handleMenuInfor
    }
  ];

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center p-2 border-b w-full bg-[#1A1A1E]">
        <div className="flex items-center gap-1.5">
          <Avatar className={cn("w-8 h-8 rounded-full")}>
            <AvatarImage src={friends?.image!} alt={friends?.username!} />
            <AvatarFallback>
              {friends?.username?.charAt(0).toLowerCase()}
            </AvatarFallback>
          </Avatar>
          <div className="">
            <span className="font-semibold text-base text-zinc-300">{friends?.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-3">
            {iconsList.map((ic) => (
              <button
                key={ic.id}
                onClick={ic.onClick}
                className={`cursor-pointer p-0.5 rounded-full hover:text-white text-zinc-400 ${ic.active ? "bg-zinc-700/60 " : ""}`}
              >
                <ic.icon size={18} key={ic.id} />
              </button>
            ))}
          </div>
          <div className="w-[180px] relative ml-4">
            <Input placeholder="Buscar..." className="relative w-full h-8 bg-[#1e1f22] border-none focus-visible:ring-0" />
            <Search size={18} className="absolute top-1.5 right-3 text-zinc-400" />
          </div>
        </div>
      </div>
      <div className="flex w-full h-full">
        <div className="flex-1">
          chat
        </div>
        {isOpen && (
          <div className="w-[350px] h-full border-l-1 border-zinc-700 relative">
            <div className="w-full h-28 bg-blue-600 relative"></div>
            <div className="absolute top-0 right-0 p-2">
              <Button className="bg-zinc-800/40 w-8 h-8 rounded-full text-white hover:bg-zinc-800/60 cursor-pointer">
                <UserCheck />
              </Button>
            </div>
            <div className="flex w-full h-full flex-col gap-3.5 top-20 z-50 absolute bottom-0 p-3">
              <div className="">
                <Avatar className={cn("w-20 h-20 border bg-zinc-800 p-0.5 rounded-full")}>
                  <AvatarImage className="rounded-full object-cover" src={friends?.image!} alt={friends?.username!} />
                  <AvatarFallback>
                    {friends?.username?.charAt(0).toLowerCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-base font-semibold">{friends?.name}</span>
                <span className="text-sm text-zinc-300 font-sans">{friends?.username}</span>
              </div>
              <div className="mt-2 bg-zinc-900 rounded-md w-full h-auto min-h-40 p-2">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold">Sobre mim</span>
                  <span>{friends?.description}</span>
                </div>
                <div className="flex flex-col gap-1.5 mt-4">
                  <span className="text-xs font-semibold">Membro desde</span>
                  <span className="text-xs text-zinc-400 font-semibold">
                    {formatDateComplete(new Date(friends?.createdAt || ""))}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatFriends;