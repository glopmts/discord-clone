"use client";

import { UserProps } from "@/types/interfaces";
import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const UserMessageItem = ({ user }: { user: UserProps }) => {
  const [mouseHover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="w-full flex justify-between items-center gap-2 h-10 hover:opacity-55 hover:bg-zinc-400/20 dark:hover:bg-zinc-900 rounded-md transition-all p-1"
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
            <span className={`text-sm font-medium  truncate w-full ${mouseHover ? "text-zinc-600 dark:text-white" : "dark:text-white"}`}>
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
};

export default UserMessageItem;