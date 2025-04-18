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
  className?: string;
};

const ContextMenuGlobe = ({
  children,
  menuItems,
  className,
  onOpenChange,
}: ContextMenuGlobeProps) => {

  const handleItemClick = (itemAction: () => void) => {
    if (onOpenChange) onOpenChange(false);
    itemAction();
  };

  return (
    <ContextMenu onOpenChange={onOpenChange}>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className={`w-64 z-[200] ${className}`}
        onInteractOutside={() => onOpenChange?.(false)}
      >
        {menuItems.map((item, index) => (
          <ContextMenuItem
            key={index}
            onClick={() => handleItemClick(item.action)}
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