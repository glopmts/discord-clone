import { updateActiveCategory } from "@/app/actions/category"
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

// Tipos melhorados
type CategoryActionsProps = {
  categoryId: string;
  categoryName: string;
};

type ContextMenuOption = {
  id: number;
  label: string;
  type?: "delete" | "alert";
  onClick: (handleCloseMenu: () => void) => void;
};

type FunctionsProps = {
  handleEditeCategory: (props: CategoryActionsProps) => void;
  handleDelete: (props: CategoryActionsProps) => void;
  category?: {
    id: string;
    name: string;
    isActive: boolean;
  };
  userId: string;
  server: InterfacesRender['server'];
};

const getContextMenuOptions = ({
  handleEditeCategory,
  handleDelete,
  category,
  userId,
  server
}: FunctionsProps): ContextMenuOption[] => {
  const isOwner = server?.ownerId === userId;
  const isAdmin = server?.MemberCargo?.some(
    member => member.userId === userId &&
      (member.role === 'admin' || member.role === 'owner' || member.role === "moderator")
  );

  if (!isOwner && !isAdmin) {
    return [{
      id: 3,
      label: "Denunciar categoria",
      type: "alert",
      onClick: (handleCloseMenu) => handleCloseMenu()
    }];
  }

  return [
    {
      id: 1,
      label: "Editar categoria",
      onClick: (handleCloseMenu) => {
        if (!category) return;
        handleEditeCategory({ categoryId: category.id, categoryName: category.name });
        handleCloseMenu();
      }
    },
    {
      id: 2,
      label: "Excluir categoria",
      type: "delete",
      onClick: (handleCloseMenu) => {
        if (!category) return;
        handleDelete({ categoryId: category.id, categoryName: category.name });
        handleCloseMenu();
      }
    }
  ];
};

const RenderServerChannels = ({
  server,
  userId,
  currentChannelId,
  handleNewsChannel,
  handleDelete,
  handleEditeCategory,
  handleEditChannel,
  handleDeleteChannel
}: InterfacesRender) => {
  if (!server) return null;

  const router = useRouter();
  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set());
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [contextMenuOpen, setContextMenuOpen] = useState<string | null>(null);

  // Inicializa com categorias ativas
  useEffect(() => {
    if (server.Category) {
      const initiallyActive = new Set(
        server.Category
          .filter(cat => cat.isActive)
          .map(cat => `category-${cat.id}`)
      );
      setActiveCategories(initiallyActive);
    }
  }, [server.Category]);

  // Busca mensagens não lidas
  useEffect(() => {
    const fetchUnreadCounts = async () => {
      if (!server?.Category || !userId) return;

      const counts: Record<string, number> = {};

      for (const category of server.Category) {
        for (const channel of category.channels) {
          try {
            const count = await getUnreadMessagesCount(userId, channel.id);
            counts[channel.id] = count;
          } catch (error) {
            console.error(`Error fetching unread count for channel ${channel.id}:`, error);
            counts[channel.id] = 0;
          }
        }
      }

      setUnreadCounts(counts);
    };

    fetchUnreadCounts();
  }, [server, userId]);

  const handleChannelClick = async (channelId: string) => {
    try {
      if (userId) {
        await markMessagesChannelRead(channelId, userId);
        setUnreadCounts(prev => ({ ...prev, [channelId]: 0 }));
      }
      router.push(`/channels/?id=${server.id}&chaId=${channelId}`);
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const handleCloseMenu = () => setContextMenuOpen(null);

  const handleItemClick = (itemOnClick: (closeMenu: () => void) => void) => {
    itemOnClick(handleCloseMenu);
  };

  const handleToggleCategory = async (categoryId: string) => {
    try {
      await updateActiveCategory(categoryId);

      setActiveCategories(prev => {
        const newSet = new Set(prev);
        const categoryKey = `category-${categoryId}`;

        if (newSet.has(categoryKey)) {
          newSet.delete(categoryKey);
        } else {
          newSet.add(categoryKey);
        }

        return newSet;
      });
    } catch (error) {
      console.error("Error toggling category:", error);
    }
  };

  return (
    <>
      <Separator className="dark:bg-zinc-800" />

      <div className="mt-2 mb-3">
        <Button variant="ghost" className="w-full flex justify-baseline">
          <Calendar size={20} className="mr-1 text-zinc-400" />
          <span className="text-zinc-400">Eventos</span>
        </Button>
        <Button variant="ghost" className="w-full flex justify-baseline">
          <LucideListMinus size={20} className="mr-1 text-zinc-400" />
          <span className="text-zinc-400">Canais & Cargos</span>
        </Button>
        <Button variant="ghost" className="w-full flex justify-baseline">
          <Users size={20} className="mr-1 text-zinc-400" />
          <span className="text-zinc-400">Membros</span>
        </Button>
      </div>

      <Separator className="dark:bg-zinc-800" />

      <div className="mt-4">
        <div className="mt-1">
          {server.Category?.map((category) => (
            <div className="w-full" key={category.id}>
              <div className="px-3 flex items-center justify-between group relative">
                <Accordion
                  type="multiple"
                  className="w-full"
                  value={Array.from(activeCategories)}
                >
                  <AccordionItem
                    value={`category-${category.id}`}
                    className="w-full border-none"
                  >
                    <ContextMenu
                      key={contextMenuOpen}
                      onOpenChange={(open) => setContextMenuOpen(open ? category.id : null)}
                    >
                      <ContextMenuTrigger>
                        <div className="flex items-center justify-between w-full">
                          <AccordionTrigger onClick={() => handleToggleCategory(category.id)}>
                            <span className="text-xs uppercase font-semibold dark:text-neutral-400 dark:group-hover:text-neutral-200 hover:group-hover:text-zinc-400">
                              {category.name}
                            </span>
                          </AccordionTrigger>

                          <button
                            className="dark:text-neutral-400 text-xs absolute cursor-pointer right-3"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNewsChannel(category.id);
                            }}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </ContextMenuTrigger>
                      <ContextMenuContent className="z-[100]">
                        <ContextMenuItem>Marcar como lida</ContextMenuItem>
                        <Separator className="mt-2 mb-2" />
                        {getContextMenuOptions({
                          handleDelete: ({ categoryId, categoryName }) =>
                            handleDelete(categoryId, categoryName),
                          handleEditeCategory: ({ categoryId, categoryName }) =>
                            handleEditeCategory(categoryId, categoryName),
                          userId,
                          server,
                          category
                        }).map((option) => (
                          <ContextMenuItem
                            key={option.id}
                            onClick={() => handleItemClick(option.onClick)}
                            className={option.type === "delete" ? "text-red-500" : ""}
                          >
                            {option.label}
                          </ContextMenuItem>
                        ))}
                      </ContextMenuContent>
                    </ContextMenu>
                    <AccordionContent className="w-full flex flex-col gap-2.5">
                      {category.channels.map((channel) => {
                        const unreadCount = unreadCounts[channel.id] || 0;
                        return (
                          <MenuItemsInforServer
                            key={channel.id}
                            userId={userId}
                            serverId={server.id}
                            server={server}
                            categoryId={category.id}
                            currentChannelId={currentChannelId!}
                            onEdit={handleEditChannel}
                            onDelete={handleDeleteChannel}
                            onServerClick={handleChannelClick}
                            hasUnreadMessages={unreadCount > 0}
                            channel={channel}
                          />
                        );
                      })}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default RenderServerChannels;