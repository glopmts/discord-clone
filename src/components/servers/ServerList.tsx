"use client";

import { markAllMessagesAsRead } from "@/app/actions/menssagens";
import { exitServer, getUserServersWithUnreadCount } from "@/app/actions/servers";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UserIdProps } from "@/types/interfaces";
import { getLinksServers } from "@/types/linksNavegations";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import LoadingScreen from "../loadingScreen";
import ModalCreateServer from "../modals/CreateServerModal";
import ConviteUserServer from "../modals/InviteUsersModal";
import RenderSideBarServer from "./ServerListData";

const SideBarServers = ({ userId }: UserIdProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentServerId = searchParams.get('id');
  const pathname = usePathname();
  const isUserPage = pathname.startsWith("/channels/me");
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
    const currentServer = servers?.find(server => server.id === serverId);
    const firstChannelId = currentServer?.channels?.[0]?.id || null;

    const queryParams = new URLSearchParams();
    queryParams.set('id', serverId);

    if (firstChannelId) {
      queryParams.set('chaId', firstChannelId);
    }
    router.push(`/channels/?${queryParams.toString()}`);
  };

  const handleUserClick = () => {
    router.push(`/channels/me`)
  }

  const handleExitSever = async (serverId: string) => {
    const confirmExit = window.confirm("Tem certeza que deseja sair deste servidor?");
    if (!confirmExit) return;

    try {
      await exitServer(userId, serverId);
      toast.success("Saiu do servidor com sucesso!");
    } catch (error) {
      toast.error("Erro ao sair do servidor");
    }
  }


  const handleDeleSever = async (serverId: string) => {
    const confirmExit = window.confirm("Tem certeza que deseja DELETAR esté servidor?");
    if (!confirmExit) return;

    try {
      await exitServer(userId, serverId);
      toast.success("Servidor deletado com sucesso!");
    } catch (error) {
      toast.error("Erro ao deletar o servidor");
    }
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
      await refetch();
    } catch (error) {
      toast.error("Erro ao marcar mensagens:");
    }
  }

  if (isLoading) {
    <LoadingScreen />
  }

  return (
    <>
      <div className="w-[72px] h-full flex flex-col items-center py-2">
        <ScrollArea className="w-full h-[80vh] mb-15 relative scrollarea-viewport"
          type="always"
          scrollHideDelay={0}>
          <div className="flex flex-col items-center space-y-2">
            {/* Server list */}
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative group">
                    {isUserPage && (
                      <div className="absolute -left-3 w-1 h-10 dark:bg-white bg-zinc-600 rounded-r-full transition-all group-hover:h-5" />
                    )}
                    <button className={`relative w-9 h-9 rounded-md flex items-center justify-center hover:rounded-2xl transition-all duration-200 cursor-pointer ${isUserPage ? "bg-[#5865f2]" : "dark:bg-zinc-800 bg-zinc-600"}`} onClick={handleUserClick}>
                      <Image src="/images/discord-white.png" alt="Discord icone" fill className="w-full h-full object-cover" />
                    </button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Discord</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="w-8 h-[2px] bg-[#35363c] rounded-full my-1" />

            <RenderSideBarServer
              currentServerId={currentServerId!}
              handleConviteServer={handleConviteServer}
              handleExitSever={handleExitSever}
              handleMark={handleMark}
              handleServerClick={handleServerClick}
              handleDeleteSever={handleDeleSever}
              servers={servers!}
              userId={userId}
            />
          </div>
          <div className="mt-2 flex flex-col items-center space-y-2 pb-2">
            {linksServers.map((link) => (
              <TooltipProvider key={link.id} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={link.handleCreateServer}
                      className="w-9 h-9 cursor-pointer rounded-md dark:bg-[#252527] bg-zinc-600 flex items-center justify-center hover:rounded-sm hover:bg-[#5865f2] text-[#f9fdfa] hover:text-white transition-all duration-200"
                    >
                      {link.icon}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{link.label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </ScrollArea>
      </div>

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

export default SideBarServers;
