import { useMenuModalHandler } from "@/hooks/useMenuModalHandler";
import { hasAnyPermission } from "@/lib/permissions";
import { LockKeyhole } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";
import ContextMenuGlobe from "../ContextMenu";
import { channelIcons } from "../icons/IconsChannels";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

interface MenuItemsInforServerProps {
  userId: string;
  serverId: string;
  currentChannelId?: string;
  onEdit: (channelId: string, categoryId?: string) => void;
  onDelete: (channelId: string) => Promise<void>;
  onServerClick: (channelId: string) => void;
  children?: ReactNode;
  server: any;
  hasUnreadMessages?: boolean;
  categoryId?: string;
  channel: {
    id: string;
    name: string;
    typeChannel: keyof typeof channelIcons;
    isPrivate?: boolean;
  }
}

export const MenuItemsInforServer = ({
  userId,
  serverId,
  currentChannelId,
  onEdit,
  onDelete,
  onServerClick,
  children,
  server,
  categoryId,
  channel,
  hasUnreadMessages
}: MenuItemsInforServerProps) => {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setContextMenuOpen, withMenuHandler } = useMenuModalHandler();

  useEffect(() => {
    const loadMenuItems = async () => {
      const isAdmin = await hasAnyPermission(userId, serverId, ['owner', 'admin', 'moderator']);
      const isOwner = server?.ownerId === userId;

      const items = [
        ...(isAdmin || isOwner ? [
          {
            label: "Editar canal",
            action: () => withMenuHandler(() => onEdit(channel.id, categoryId)),
          },
          {
            label: "Excluir canal",
            action: () => onDelete(channel.id),
            destructive: true
          }
        ] : []),
        {
          label: "Copiar ID do canal",
          action: () => {
            navigator.clipboard.writeText(channel.id);
            toast.success("ID copiado!");
          }
        },
      ];

      setMenuItems(items);
      setIsLoading(false);
    };

    loadMenuItems();
  }, [userId, serverId, channel.id]);

  if (isLoading)
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="w-full h-5" />
      </div>
    );

  return (
    <ContextMenuGlobe
      onOpenChange={(open) => {
        setContextMenuOpen(open ? channel.id : null);
      }}
      menuItems={menuItems}>
      {children || (
        <div className="relative">
          {hasUnreadMessages && (
            <div className="absolute z-20 w-1 h-2 top-3 dark:bg-white text-zinc-600 rounded-r-full transition-all" />
          )}
          <Button
            variant={currentChannelId === channel.id ? "secondary" : "ghost"}
            onClick={() => onServerClick(channel.id)}
            className="w-full relative justify-start px-3 py-1 hover:text-zinc-500 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-zinc-700/50 rounded-sm group"
          >
            {channelIcons[channel.typeChannel]}
            <div className="flex items-center w-full justify-between">
              <span className="truncate ml-2">{channel.name}</span>
              {channel.isPrivate && (
                <div className="">
                  <LockKeyhole size={12} className="text-zinc-600 dark:text-neutral-300" />
                </div>
              )}
            </div>
          </Button>
        </div>
      )}
    </ContextMenuGlobe>
  );
};