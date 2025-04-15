import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { optionsContextMenuSever } from "../infor-bar/context-menu-options";

type RenderServersProps = {
  servers: {
    name: string;
    id: string;
    ownerId: string;
    image: string | null;
    inviteCode: string;
    createdAt: Date;
    unreadCount: number
  }[]
  userId: string;
  type?: string;
  currentServerId: string;
  handleMark: (serverId: string) => void;
  handleExitSever: (serverId: string) => void;
  handleDeleteSever: (serverId: string) => void;
  handleServerClick: (serverId: string) => void;
  handleConviteServer: (server: { id: string; name: string; inviteCode: string }) => void;
}

const RenderSideBarServer = ({
  servers,
  currentServerId,
  handleConviteServer,
  handleExitSever,
  handleMark,
  handleDeleteSever,
  handleServerClick,
  userId,
}: RenderServersProps) => {
  const [contextMenuOpen, setContextMenuOpen] = useState<string | null>(null);

  const handleCloseMenu = () => {
    setContextMenuOpen(null);
  };

  const handleItemClick = (itemOnClick: (closeMenu: () => void) => void) => {
    itemOnClick(handleCloseMenu);
  };

  return (
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
                {optionsContextMenuSever({
                  handleExitSever,
                  handleMark,
                  server,
                  userId,
                  handleDeleteSever,
                  handleConviteServer: () => handleConviteServer(server),
                }).map((nv) => (
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
  );
}

export default RenderSideBarServer;