import { hasAnyPermission } from "@/lib/permissions";
import { ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";
import ContextMenuGlobe from "../ContextMenu";
import { channelIcons } from "../icons/IconsChannels";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

interface MenuItemsInforServerProps {
  userId: string;
  serverId: string;
  channelId: string;
  currentChannelId?: string;
  onEdit: (channelId: string) => void;
  onDelete: (channelId: string) => Promise<void>;
  onServerClick: (channelId: string) => void;
  channelType: keyof typeof channelIcons;
  channelName: string;
  children?: ReactNode;
  server: any;
  hasUnreadMessages?: boolean;
}

export const MenuItemsInforServer = ({
  userId,
  serverId,
  channelId,
  currentChannelId,
  onEdit,
  onDelete,
  onServerClick,
  channelType,
  channelName,
  children,
  server,
  hasUnreadMessages
}: MenuItemsInforServerProps) => {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMenuItems = async () => {
      const isAdmin = await hasAnyPermission(userId, serverId, ['owner', 'admin', 'moderator']);
      const isOwner = server?.ownerId === userId;

      const items = [
        {
          label: "Copiar ID do canal",
          action: () => {
            navigator.clipboard.writeText(channelId);
            toast.success("ID copiado!");
          }
        },
        ...(isAdmin || isOwner ? [
          {
            label: "Editar canal",
            action: () => onEdit(channelId)
          },
          {
            label: "Excluir canal",
            action: () => onDelete(channelId),
            destructive: true
          }
        ] : [])
      ];

      setMenuItems(items);
      setIsLoading(false);
    };

    loadMenuItems();
  }, [userId, serverId, channelId]);

  if (isLoading)
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="w-full h-5" />
      </div>
    );

  return (
    <ContextMenuGlobe menuItems={menuItems}>
      {children || (
        <div className="relative">
          {hasUnreadMessages && (
            <div className="absolute z-20 w-1 h-2 top-3 dark:bg-white text-zinc-600 rounded-r-full transition-all" />
          )}
          <Button
            variant={currentChannelId === channelId ? "secondary" : "ghost"}
            onClick={() => onServerClick(channelId)}
            className="w-full relative justify-start px-3 py-1 hover:text-zinc-500 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-zinc-700/50 rounded-sm"
          >
            {channelIcons[channelType]}
            <span className="truncate">{channelName}</span>
          </Button>
        </div>
      )}
    </ContextMenuGlobe>
  );
};