import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { MenuItem } from "@/types/interfaces";
import { ReactNode } from "react";

type ContextMenuGlobeProps = {
  children: ReactNode;
  menuItems: MenuItem[];
  onOpenChange?: (open: boolean) => void;
};

const ContextMenuGlobe = ({
  children,
  menuItems,
  onOpenChange,
}: ContextMenuGlobeProps) => {

  const handleAction = (action: () => void) => {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      if (onOpenChange) onOpenChange(false);
      action();
    };
  };

  return (
    <ContextMenu onOpenChange={onOpenChange}>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64 z-[200]" onInteractOutside={() => onOpenChange?.(false)}>
        {menuItems.map((item, index) => (
          <ContextMenuItem
            key={index}
            onClick={handleAction(item.action)}
            disabled={item.disabled}
            className={
              item.destructive
                ? "text-red-500 focus:text-red-500 focus:bg-red-500/10"
                : ""
            }
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            {item.label}
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default ContextMenuGlobe;