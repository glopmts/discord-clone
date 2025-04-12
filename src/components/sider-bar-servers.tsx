"use client"

import { getUserServers } from "@/app/actions/servers"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { UserIdProps } from "@/types/interfaces"
import { getLinksServers } from "@/types/linksNavegations"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import ModalCreateServer from "./servers/modal-news-servers"

const SideBarServers = ({ userId }: UserIdProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentServerId = searchParams.get('id')

  const {
    data: servers,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["servers", userId],
    queryFn: () => getUserServers(userId),
  })

  const [modalCreate, setModalCreate] = useState(false);

  const handleCreateServer = () => {
    setModalCreate(!modalCreate);
  }

  const hasNotifications = (server: any) => {
    return server.channels.some((channel: any) => channel.messages.length > 0)
  }

  const countUnreadMessages = (server: any) => {
    return server.channels.reduce((total: number, channel: any) => {
      return total + channel.messages.length
    }, 0)
  }

  const linksServers = getLinksServers(handleCreateServer)

  useEffect(() => {
    if (servers && servers.length > 0 && !currentServerId) {
      router.push(`/channels/?id=${servers[0].id}`)
    }
  }, [servers, currentServerId, router])

  const handleServerClick = (serverId: string) => {
    router.push(`/channels/?id=${serverId}`)
  }

  return (
    <>
      <div className="w-[72px] h-full flex flex-col items-center py-2">
        <ScrollArea className="w-full h-[80vh] mb-15 relative scrollarea-viewport"
          type="always"
          scrollHideDelay={0}
          style={{
            scrollbarWidth: "none"
          }}>
          <div className="flex flex-col items-center space-y-2">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative group">
                    <div className="absolute -left-3 w-1 h-10 bg-white rounded-r-full transition-all group-hover:h-5" />
                    <button className="relative w-9 h-9 rounded-md bg-[#5865f2] flex items-center justify-center hover:rounded-2xl transition-all duration-200 cursor-pointer">
                      <svg aria-hidden="true" role="img" width="28" height="20" viewBox="0 0 28 20">
                        <path
                          fill="white"
                          d="M23.0212 1.67671C21.3107 0.879656 19.5079 0.318797 17.6584 0C17.4062 0.461742 17.1749 0.934541 16.9708 1.4184C15.003 1.12145 12.9974 1.12145 11.0283 1.4184C10.819 0.934541 10.589 0.461744 10.3368 0.00000331C8.48074 0.324926 6.67795 0.885659 4.96746 1.68231C1.56727 6.77853 0.649666 11.7538 1.11108 16.652C3.10102 18.1418 5.3262 19.2743 7.69177 20C8.22338 19.2743 8.69519 18.4993 9.09812 17.691C8.32996 17.3997 7.58522 17.0424 6.87684 16.6135C7.06531 16.4762 7.24726 16.3387 7.42403 16.1847C11.5911 18.1749 16.408 18.1749 20.5763 16.1847C20.7531 16.3332 20.9351 16.4762 21.1171 16.6135C20.41 17.0369 19.6639 17.3997 18.897 17.691C19.3052 18.4993 19.7718 19.2689 20.3021 19.9945C22.6677 19.2689 24.8929 18.1364 26.8828 16.6466H26.8893C27.43 10.9731 25.9665 6.04728 23.0212 1.67671ZM9.68041 13.6383C8.39754 13.6383 7.34085 12.4453 7.34085 10.994C7.34085 9.54272 8.37155 8.34973 9.68041 8.34973C10.9893 8.34973 12.0395 9.54272 12.0187 10.994C12.0187 12.4453 10.9828 13.6383 9.68041 13.6383ZM18.3161 13.6383C17.0332 13.6383 15.9765 12.4453 15.9765 10.994C15.9765 9.54272 17.0124 8.34973 18.3161 8.34973C19.6184 8.34973 20.6751 9.54272 20.6543 10.994C20.6543 12.4453 19.6184 13.6383 18.3161 13.6383Z"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-black text-white border-none rounded-md py-1 px-3">
                  <p>Discord</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Separator */}
            <div className="w-8 h-[2px] bg-[#35363c] rounded-full my-1" />

            {/* Server list */}
            <div className="flex flex-col items-center space-y-2 w-full mt-2">
              <div className="flex flex-col items-center space-y-2 w-full mt-2">
                {servers?.map((server) => {
                  const unreadCount = countUnreadMessages(server)
                  const isActive = currentServerId === server.id

                  return (
                    <TooltipProvider key={server.id} delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="relative group" onClick={() => handleServerClick(server.id)}>
                            {unreadCount > 0 && (
                              <div className="absolute -right-1 z-10 top-5 border border-zinc-800 bottom-0 min-w-5 h-5 bg-[#f23f43] rounded-full flex items-center justify-center text-xs text-white font-semibold px-1">
                                {unreadCount}
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
                                isActive && "rounded-2xl",
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
    </>
  )
}

export default SideBarServers
