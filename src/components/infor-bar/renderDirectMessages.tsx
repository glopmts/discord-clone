"use client";

import { cn } from "@/lib/utils";
import { UserProps } from "@/types/interfaces";
import { Store, Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import UserMessageItem from "./userMessageItem";

const links = () => [
  {
    id: 1,
    label: "Amigos",
    icon: <Users className="h-5 w-5 text-neutral-400" />,
    active: "/channels/me",
  },
  {
    id: 3,
    label: "Loja",
    icon: <Store className="h-5 w-5 text-neutral-400" />,
    active: "/channels/store",
  },
]


const RenderDirectMessages = ({
  messages
}: {
  messages: UserProps[];
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const handlePush = () => {
    router.push("/channels/me");
  }

  return (
    <>
      <div className="w-full">
        <Button className="w-full border h-8 dark:bg-zinc-900 bg-background hover:bg-zinc-400/20 dark:hover:bg-zinc-800">
          <span className="text-zinc-400 text-sm">Encontre ou comece uma conversa</span>
        </Button>
      </div>
      <Separator className="mt-5" />
      <div className="flex flex-col gap-1 mt-1">
        {links().map((c) => {
          return (
            <Button
              key={c.id}
              onClick={handlePush}
              variant={pathname === c.active ? "secondary" : "ghost"}
              className={cn(`w-full justify-start rounded-md cursor-pointer flex items-center gap-1.5`)}
            >
              {c.icon}
              <span className={pathname === c.active ? "font-semibold" : "font-semibold text-neutral-400"}>
                {c.label}
              </span>
            </Button>
          )
        })}
      </div>
      <Separator className="mt-1" />
      <div className="mt-4 p-2 w-full">
        <div className="flex items-center justify-between w-full p-1">
          <span className="text-neutral-400 text-sm hover:text-black dark:hover:text-zinc-200">Menssagens diretas</span>
          <button className="cursor-pointer">
            <span className="text-neutral-400">+</span>
          </button>
        </div>
        <div className="w-full">
          <div className="w-full flex flex-col gap-2.5">
            {messages?.map((user: UserProps) => (
              <UserMessageItem key={user.clerk_id} user={user} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default RenderDirectMessages;