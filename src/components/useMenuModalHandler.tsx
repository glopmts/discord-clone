import { useState } from "react";

export const useMenuModalHandler = () => {
  const [contextMenuOpen, setContextMenuOpen] = useState<string | null>(null);

  const handleCloseMenu = () => setContextMenuOpen(null);

  const withMenuHandler = (action: () => void) => {
    handleCloseMenu();
    requestAnimationFrame(() => {
      action();
    });
  };

  return { contextMenuOpen, setContextMenuOpen, withMenuHandler };
};