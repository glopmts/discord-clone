import { hasAnyPermission } from "@/lib/permissions";
import { ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";
import ContextMenuGlobe from "../ContextMenu";
import { channelIcons } from "../icons/IconsChannels";
import { Button } from "../ui/button";

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
  server: any
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
  server
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

  if (isLoading) return <div className="text-xs text-zinc-500 animate-pulse">Carregando...</div>;

  return (
    <ContextMenuGlobe menuItems={menuItems}>
      {children || (
        <Button
          variant={currentChannelId === channelId ? "secondary" : "ghost"}
          onClick={() => onServerClick(channelId)}
          className="w-full justify-start px-3 py-1 text-neutral-400 hover:text-white hover:bg-zinc-700/50 rounded-sm"
        >
          {channelIcons[channelType]}
          <span className="truncate">{channelName}</span>
        </Button>
      )}
    </ContextMenuGlobe>
  );
};