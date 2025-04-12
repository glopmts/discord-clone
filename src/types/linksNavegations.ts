import { CirclePlus, Compass, Download } from "lucide-react";
import React, { ReactNode } from "react";

interface LinkItem {
  id: number;
  label: string;
  icon: ReactNode;
  handleCreateServer?: () => void;
}

export const getLinksServers = (handleCreateServer: () => void): LinkItem[] => [
  {
    id: 1,
    label: "Adicionar um servidor",
    icon: React.createElement(CirclePlus, { className: "h-5 w-5" }),
    handleCreateServer,
  },
  {
    id: 2,
    label: "Descubra",
    icon: React.createElement(Compass, { className: "h-5 w-5" }),
  },
  {
    id: 3,
    label: "Baixar apps",
    icon: React.createElement(Download, { className: "h-5 w-5" }),
  },
];
