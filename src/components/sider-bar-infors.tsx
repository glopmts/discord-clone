"use client"

import { geServer } from "@/app/actions/servers"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { Calendar, Hash, LucideListMinus, Plus, Store, Users, Volume2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import MenuOptionsInfor from "./servers/dropdown-menu-options"
import ModalCreateChannels from "./servers/modal-news-channel"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { Separator } from "./ui/separator"
import { Skeleton } from "./ui/skeleton"

const links = [
  {
    id: 1,
    label: "Amigos",
    icon: <Users className="h-5 w-5 text-neutral-400" />,
  },
  {
    id: 3,
    label: "Loja",
    icon: <Store className="h-5 w-5 text-neutral-400" />,
  },
]

const SiderBarInfors = () => {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const currentChannelId = searchParams.get("chaId")
  const [newsChannel, setNewsChannel] = useState(false);
  const router = useRouter()

  const {
    data: server,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["server", id],
    queryFn: () => (id ? geServer(id) : null),
    enabled: !!id,
  })

  useEffect(() => {
    if (id) {
      refetch()
    }
  }, [id, refetch])


  const handleServerClick = (channelId: string) => {
    router.push(`/channels/?id=${id}&chaId=${channelId}`)
  }


  const renderDirectMessages = () => (
    <>
      <div className="flex flex-col gap-1">
        {links.map((c) => (
          <Button
            key={c.id}
            variant="ghost"
            className={cn("w-full justify-start rounded-md cursor-pointer flex items-center gap-1.5")}
          >
            {c.icon}
            <span className="font-semibold text-neutral-400">{c.label}</span>
          </Button>
        ))}
      </div>
      <Separator className="mt-1" />
      <div className="mt-4 p-2">
        <div className="flex items-center justify-between">
          <span className="text-neutral-400 text-sm hover:text-white">Menssagens diretas</span>
          <button className="cursor-pointer">
            <span className="text-neutral-400">+</span>
          </button>
        </div>
      </div>
    </>
  )

  const handleNewsChannel = () => {
    setNewsChannel(!newsChannel)
  }

  // Render server channels when a server is selected
  const renderServerChannels = () => {
    if (!server) return null

    return (
      <>
        <div className="p-3 flex items-center justify-between">
          <MenuOptionsInfor name={server.name} handleNewsChannel={handleNewsChannel} />
        </div>
        <Separator className="bg-zinc-800" />
        <div className="mt-2 mb-3">
          <Button variant="ghost" className="w-full flex justify-baseline">
            <Calendar size={20} className="mr-1 text-zinc-400" />
            <span className=" text-zinc-400">Eventos</span>
          </Button>
          <Button variant="ghost" className="w-full flex justify-baseline">
            <LucideListMinus size={20} className="mr-1 text-zinc-400" />
            <span className=" text-zinc-400">Canais & Cargos</span>
          </Button>
          <Button variant="ghost" className="w-full flex justify-baseline">
            <Users size={20} className="mr-1 text-zinc-400" />
            <span className=" text-zinc-400">Membros</span>
          </Button>
        </div>
        <Separator className="bg-zinc-800" />
        <div className="mt-4">
          <div className="px-3 flex items-center justify-between group">
            <span className="text-xs uppercase font-semibold text-neutral-400 group-hover:text-neutral-200">
              Canais de texto
            </span>
            <button className="text-neutral-400 opacity-0 group-hover:opacity-100 text-xs">
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <div className="mt-1">
            {server.channels?.map((channel) => {
              const isActive = currentChannelId === channel.id

              return (
                <Button
                  key={channel.id}
                  variant={isActive ? "secondary" : "ghost"}
                  onClick={() => handleServerClick(channel.id)}
                  className="w-full justify-start px-3 py-1 text-neutral-400 hover:text-white hover:bg-zinc-700/50 rounded-sm"
                >
                  {channel.botId ? <Volume2 className="h-4 w-4 mr-2" /> : <Hash className="h-4 w-4 mr-2" />}
                  <span className="truncate">{channel.name}</span>
                </Button>
              )
            })}
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="w-[290px] h-full border rounded-l-md flex flex-col">
        <div className="w-full p-2 flex flex-col">
          {isLoading ? (
            <div className="space-y-2 p-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          ) : server ? (
            renderServerChannels()
          ) : (
            renderDirectMessages()
          )}
        </div>

        <ScrollArea className="flex-1 w-full h-32 mb-15">
          <div className="p-2">
            {/* Additional content can be rendered here */}
            {server && server.members && server.members.length > 0 && (
              <div className="mt-4">
                <div className="px-3 flex items-center justify-between group">
                  <span className="text-xs uppercase font-semibold text-neutral-400 group-hover:text-neutral-200">
                    Membros — {server.members.length}
                  </span>
                </div>
                <div className="mt-2">
                  {server.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center px-3 py-1.5 hover:bg-zinc-700/50 rounded-sm cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-full bg-zinc-700 mr-2"></div>
                      <div>
                        <p className="text-sm text-white">{member.user?.name || "Usuário"}</p>
                        <p className="text-xs text-neutral-400">
                          {member.user?.admin === "admin" ? "Administrador" : "Membro"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {newsChannel && (
        <ModalCreateChannels
          refetch={refetch}
          serverId={server?.id}
          isOpen={newsChannel}
          onClose={() => setNewsChannel(false)}
        />
      )}
    </>
  )
}

export default SiderBarInfors
