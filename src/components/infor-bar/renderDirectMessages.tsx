"use client";

import { getDirectMessages } from "@/app/actions/menssagens";
import { cn } from "@/lib/utils";
import { UserIdProps } from "@/types/interfaces";
import { useQuery } from "@tanstack/react-query";
import { Store, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

const links = ({ handlePush }: { handlePush: () => void }) => [
  {
    id: 1,
    label: "Amigos",
    icon: <Users className="h-5 w-5 text-neutral-400" />,
    active: "/channels/me",
    onclick: () => handlePush(),
  },
  {
    id: 3,
    label: "Loja",
    icon: <Store className="h-5 w-5 text-neutral-400" />,
    active: "/channels/store",
    onclick: () => handlePush(),
  },
]


const RenderDirectMessages = ({ userId }: UserIdProps) => {
  const {
    data: messages,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["direct_messages", userId],
    queryFn: () => (userId ? getDirectMessages(userId) : null),
    enabled: !!userId,
  });

  const pathname = usePathname();
  const router = useRouter();

  const handlePush = () => {
    router.push("/channels/me");
  }

  return (
    <>
      <div className="w-full">
        <Button className="w-full border h-8 bg-zinc-900 text-white hover:bg-zinc-800">
          <span className="text-zinc-400 text-sm">Encontre ou comece uma conversa</span>
        </Button>
      </div>
      <Separator className="mt-5" />
      <div className="flex flex-col gap-1 mt-1">
        {links({ handlePush }).map((c) => {
          return (
            <Button
              key={c.id}
              onClick={() => handlePush()}
              variant={pathname === c.active ? "secondary" : "ghost"}
              className={cn(`w-full justify-start rounded-md cursor-pointer flex items-center gap-1.5`)}
            >
              {c.icon}
              <span className={pathname === c.active ? "font-semibold text-white" : "font-semibold text-neutral-400"}>
                {c.label}
              </span>
            </Button>
          )
        })}
      </div>
      <Separator className="mt-1" />
      <div className="mt-4 p-2 w-full">
        <div className="flex items-center justify-between w-full p-1">
          <span className="text-neutral-400 text-sm hover:text-white">Menssagens diretas</span>
          <button className="cursor-pointer">
            <span className="text-neutral-400">+</span>
          </button>
        </div>
        <div className="w-full">
          <div className="w-full flex flex-col gap-2.5">
            {messages?.map((user) => {
              const [mouseHover, setHover] = useState(false);

              return (
                <div
                  onMouseEnter={() => setHover(true)}
                  onMouseLeave={() => setHover(false)}
                  className="w-full flex justify-between items-center gap-2 h-10 hover:bg-zinc-900 rounded-md transition-all p-1"
                  key={user.clerk_id}
                >
                  <Link href={`/channels/me/${user.id}`} className="w-full"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div className="relative">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user.image!!} />
                          <AvatarFallback>
                            {user.username?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="flex flex-col items-start overflow-hidden">
                        <span className={`text-sm font-medium  truncate w-full ${mouseHover ? "text-white" : "text-zinc-400"}`}>
                          {user.name}
                        </span>
                      </div>
                    </div>
                  </Link>
                  <div className="">
                    <button className={`text-zinc-400 z-30 mr-0.5 cursor-pointer hover:text-white ${mouseHover ? "block" : "hidden"}`}>
                      <span className="text-[18px]">+</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default RenderDirectMessages;