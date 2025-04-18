import { getUnreadMessagesCount, markMessagesChannelRead } from "@/app/actions/menssagens"
import { InterfacesRender } from "@/types/interfaces"
import { Calendar, LucideListMinus, Plus, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { Button } from "../ui/button"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../ui/context-menu"
import { Separator } from "../ui/separator"
import { MenuItemsInforServer } from "./Items-Servers-Channels"

type FunctionsProps = {
  handleEdite: () => void;
  handleDelete: (categoryId: string, categoryName: string) => void;
  category?: {
    id: string;
    name: string;
  };
  userId: string;
  server: InterfacesRender['server'];
};

const optionsContextMenu = ({ handleEdite, handleDelete, category, userId, server }: FunctionsProps) => {
  const isOwner = server?.ownerId === userId;
  const isAdmin = server?.MemberCargo?.some(
    member => member.userId === userId && (member.role === 'admin' || member.role === 'owner' || member.role === "moderator")
  );

  const adminOptions = [
    {
      id: 1,
      label: "Editar categoria",
      onClick: (handleCloseMenu: () => void) => {
        handleEdite();
        handleCloseMenu();
      }
    },
    {
      id: 2,
      label: "Excluir categoria",
      type: "delete",
      onClick: (handleCloseMenu: () => void) => {
        handleDelete(category?.id!, category?.name!);
        handleCloseMenu();
      }
    }
  ];

  const regularUserOptions = [
    {
      id: 3,
      label: "Denunciar categoria",
      type: "alert",
      onClick: (handleCloseMenu: () => void) => {
        handleCloseMenu();
      }
    }
  ];

  if (isOwner || isAdmin) {
    return adminOptions;
  } else {
    return regularUserOptions;
  }
};


const RenderServerChannels = ({
  server,
  userId,
  currentChannelId,
  handleNewsChannel,
  handleDelete,
  handleEdite,
  handleEditChannel,
  handleDeleteChannel
}: InterfacesRender) => {
  if (!server) return null;

  const [openItems, setOpenItems] = useState<string[]>(['item-1']);
  const router = useRouter()

  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchUnreadCounts = async () => {
      const counts: Record<string, number> = {};

      for (const category of server.Category || []) {
        for (const channel of category.channels) {
          const count = await getUnreadMessagesCount(userId, channel.id);
          counts[channel.id] = count;
        }
      }

      setUnreadCounts(counts);
    };

    if (server && userId) {
      fetchUnreadCounts();
    }
  }, [server, userId]);

  const handleChannelClick = async (channelId: string) => {
    try {
      if (userId) {
        await markMessagesChannelRead(channelId, userId);
      }
      handleServerClick(channelId);
      const updatedCounts = { ...unreadCounts };
      updatedCounts[channelId] = 0;
      setUnreadCounts(updatedCounts);
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const handleServerClick = (channelId: string) => {
    router.push(`/channels/?id=${server.id}&chaId=${channelId}`)
  };

  useEffect(() => {
    if (server.Category) {
      setOpenItems(server.Category.map(cat => `category-${cat.id}`));
    }
  }, [server.Category]);

  const [contextMenuOpen, setContextMenuOpen] = useState<string | null>(null);

  const handleCloseMenu = () => {
    setContextMenuOpen(null);
  };

  const handleItemClick = (itemOnClick: (closeMenu: () => void) => void) => {
    itemOnClick(handleCloseMenu);
  };

  return (
    <>
      {/* Header */}

      <Separator className="dark:bg-zinc-800" />

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

      <Separator className="dark:bg-zinc-800" />

      {/* Render categories */}

      <div className="mt-4">
        <div className="mt-1">
          {server.Category?.map((category) => {
            return (
              <div className="w-full" key={category.id}>
                <div className="px-3 flex items-center justify-between group relative">
                  <Accordion type="multiple"
                    className="w-full"
                    value={openItems}
                    onValueChange={setOpenItems}>
                    <AccordionItem value={`category-${category.id}`} className="w-full border-none" >
                      <ContextMenu
                        key={contextMenuOpen}
                        onOpenChange={(open) => {
                          setContextMenuOpen(open ? category.id : null);
                        }}
                      >
                        <ContextMenuTrigger>
                          <div className="flex items-center justify-between w-full">
                            <AccordionTrigger>
                              <span className="text-xs uppercase font-semibold dark:text-neutral-400 dark:group-hover:text-neutral-200 hover:group-hover:text-zinc-400">
                                {category.name}
                              </span>
                            </AccordionTrigger>

                            {/* criar um canal especifico para category */}
                            <button className="dark:text-neutral-400 text-xs absolute cursor-pointer right-3"
                              onClick={() => handleNewsChannel(category?.id)}>
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </ContextMenuTrigger>
                        <ContextMenuContent className="z-[100]">
                          <ContextMenuItem>Marcar como lida</ContextMenuItem>
                          <Separator className="mt-2 mb-2" />
                          {optionsContextMenu({
                            handleDelete: () => handleDelete(category.id, category.name),
                            handleEdite: () => handleEdite(),
                            userId: userId,
                            server: server
                          }).map((fc) => (
                            <ContextMenuItem
                              key={fc.id}
                              onClick={() => handleItemClick(fc.onClick)}
                              className={fc.type === "delete" ? "text-red-500" : ""}
                            >
                              {fc.label}
                            </ContextMenuItem>
                          ))}
                        </ContextMenuContent>
                      </ContextMenu>
                      <AccordionContent className="w-full flex flex-col gap-2.5">
                        {category.channels.map((channel) => {
                          const unreadCount = unreadCounts[channel.id] || 0;
                          const hasUnreadMessages = unreadCount > 0;
                          return (
                            <MenuItemsInforServer
                              key={channel.id}
                              userId={userId}
                              serverId={server.id}
                              channelId={channel.id}
                              server={server}
                              currentChannelId={currentChannelId!}
                              onEdit={handleEditChannel}
                              onDelete={handleDeleteChannel}
                              onServerClick={handleChannelClick}
                              channelType={channel.typeChannel}
                              channelName={channel.name}
                              hasUnreadMessages={hasUnreadMessages}
                            />
                          );
                        })}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default RenderServerChannels;