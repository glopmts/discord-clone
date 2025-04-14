"use client";

import { geServer } from "@/app/actions/servers";
import { useQuery } from "@tanstack/react-query";
import { CircleHelp, Inbox, LucideUsers } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const Header = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const {
    data: server,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["server", id],
    queryFn: () => (id ? geServer(id) : null),
    enabled: !!id,
  });

  useEffect(() => {
    if (id) {
      refetch()
    }
  }, [id, refetch]);

  return (
    <div className="w-full p-1 py-2 px-2.5">
      <div className="w-full flex justify-between items-center">
        <div className=""></div>
        {server ? (
          <>
            <div className="flex items-center gap-2.5">
              <div className="">
                {server.image ? (
                  <Image src={server.image} alt={server.name} width={20} height={20} sizes="100vw" className="rounded-[2px] object-cover" />
                ) : (
                  <div className="w-8 h-8 bg-zinc-700 rounded-md">
                    <div className="w-full h-full items-center justify-center">
                      {server.name.charAt(0).toLowerCase()}
                    </div>
                  </div>
                )}
              </div>
              <span className="font-semibold text-sm">{server.name}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <button className="cursor-pointer">
                <Inbox size={18} className="text-neutral-300" />
              </button>
              <button className="cursor-pointer">
                <CircleHelp size={18} className="text-neutral-300" />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="">
              <div className="flex items-center gap-1.5">
                <LucideUsers size={16} className="mr-1 text-neutral-300" />
                <span className="font-semibold text-sm">Amigos</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <button className="cursor-pointer">
                <Inbox size={18} className="text-neutral-300" />
              </button>
              <button className="cursor-pointer">
                <CircleHelp size={18} className="text-neutral-300" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;