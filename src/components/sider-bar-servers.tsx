"use client";

import { markAllMessagesAsRead } from "@/app/actions/menssagens";
import { getUserServersWithUnreadCount } from "@/app/actions/servers";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { UserIdProps } from "@/types/interfaces";
import { getLinksServers } from "@/types/linksNavegations";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { optionsContextMenuSever } from "./infor-bar/context-menu-options";
import ConviteUserServer from "./modals/convite-users-server";
import ModalCreateServer from "./servers/modal-news-servers";

const SideBarServers = ({ userId }: UserIdProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentServerId = searchParams.get('id')
  const pathname = usePathname()
  const isUserPage = pathname === "/channels/me";
  const [contextMenuOpen, setContextMenuOpen] = useState<string | null>(null);
  const [modalCreate, setModalCreate] = useState(false);
  const [modalConviter, setModalConviter] = useState(false);
  const [selectedServer, setSelectedServer] = useState<{
    id: string;
    name: string;
    inviteCode: string;
  } | null>(null);

  const {
    data: servers,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["servers", userId],
    queryFn: () => getUserServersWithUnreadCount(userId),
  });

  const handleCreateServer = () => {
    setModalCreate(!modalCreate);
  }

  const linksServers = getLinksServers(handleCreateServer)

  const handleServerClick = (serverId: string) => {
    router.push(`/channels/?id=${serverId}`)
  }

  const handleUserClick = () => {
    router.push(`/channels/me`)
  }

  const handleCloseMenu = () => {
    setContextMenuOpen(null);
  };

  const handleItemClick = (itemOnClick: (closeMenu: () => void) => void) => {
    itemOnClick(handleCloseMenu);
  };

  const handleExitSever = () => {

  }

  const handleConviteServer = (server: {
    id: string;
    name: string;
    inviteCode: string;
  }) => {
    setSelectedServer(server);
    setModalConviter(true);
  };

  const handleMark = async (serverId: string) => {
    try {
      await markAllMessagesAsRead(serverId, userId);
      toast.success("Todas as mensagens marcadas como lidas!");
      refetch();
    } catch (error) {
      toast.error("Erro ao marcar mensagens:");
    }
  }


  return (
    <>
      <div className="w-[72px] h-full flex flex-col items-center py-2">
        <ScrollArea className="w-full h-[80vh] mb-15 relative scrollarea-viewport"
          type="always"
          scrollHideDelay={0}>
          <div className="flex flex-col items-center space-y-2">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative group">
                    {isUserPage && (
                      <div className="absolute -left-3 w-1 h-10 bg-white rounded-r-full transition-all group-hover:h-5" />
                    )}
                    <button className={`relative w-9 h-9 rounded-md flex items-center justify-center hover:rounded-2xl transition-all duration-200 cursor-pointer ${isUserPage ? "bg-[#5865f2]" : "bg-zinc-800"}`} onClick={handleUserClick}>
                      <Image src="/images/discord-white.png" alt="Discord icone" fill className="w-full h-full object-cover" />
                    </button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-black text-white border-none rounded-md py-1 px-3">
                  <p>Discord</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="w-8 h-[2px] bg-[#35363c] rounded-full my-1" />

            {/* Server list */}
            <div className="flex flex-col items-center space-y-2 w-full mt-2">
              <div className="flex flex-col items-center space-y-2 w-full mt-2">
                {servers?.map((server) => {
                  const isActive = currentServerId === server.id

                  return (
                    <ContextMenu
                      key={contextMenuOpen}
                      onOpenChange={(open) => {
                        setContextMenuOpen(open ? server.id : null);
                      }}
                    >
                      <ContextMenuTrigger
                      >
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="relative group" onClick={() => handleServerClick(server.id)}>
                                {server.unreadCount > 0 && (
                                  <div className="absolute -right-1 z-10 top-5 border border-zinc-800 bottom-0 min-w-5 h-5 bg-[#f23f43] rounded-full flex items-center justify-center text-xs text-white font-semibold px-1">
                                    {server.unreadCount > 99 ? '99+' : server.unreadCount}
                                  </div>
                                )}

                                <div
                                  className={cn(
                                    "absolute -left-3 w-1 h-10 bg-white rounded-r-full transition-all",
                                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-hover:h-5"
                                  )}
                                />

                                <div
                                  className={cn(
                                    "relative w-9 h-9 rounded-md overflow-hidden hover:rounded-sm transition-all duration-200 cursor-pointer",
                                    isActive && "rounded-md",
                                  )}
                                >
                                  <Image
                                    src={server.image || "/placeholder.svg"}
                                    alt={server.name}
                                    fill
                                    quality={90}
                                    sizes="100vw"
                                    className="object-cover"
                                  />
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="bg-zinc-800 border text-white rounded-md p-2 px-4">
                              <p>{server.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        {optionsContextMenuSever({ handleExitSever, handleMark, server, handleConviteServer: () => handleConviteServer(server) }).map((nv) => (
                          <ContextMenuItem
                            key={nv.id}
                            className={nv.type === 'delete' ? "text-red-500" : ""}
                            onClick={() => handleItemClick(nv.onClick)}
                          >
                            {nv.label}
                          </ContextMenuItem>
                        ))}
                      </ContextMenuContent>
                    </ContextMenu>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="mt-2 flex flex-col items-center space-y-2 pb-2">
            {linksServers.map((link) => (
              <TooltipProvider key={link.id} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={link.handleCreateServer}
                      className="w-9 h-9 cursor-pointer rounded-md bg-[#252527] flex items-center justify-center hover:rounded-sm hover:bg-[#5865f2] text-[#f9fdfa] hover:text-white transition-all duration-200"
                    >
                      {link.icon}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-black text-white border-none rounded-md py-1 px-3">
                    <p>{link.label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* modal create server */}

      {modalCreate && (
        <ModalCreateServer
          isOpen={modalCreate}
          refetch={refetch}
          userId={userId}
          onClose={() => setModalCreate(false)}
        />
      )}

      <ConviteUserServer
        isOpen={modalConviter}
        serverName={selectedServer?.name || ""}
        serverConvite={selectedServer?.inviteCode || ""}
        onClose={() => setModalConviter(false)}
      />
    </>
  )
}

export default SideBarServers
