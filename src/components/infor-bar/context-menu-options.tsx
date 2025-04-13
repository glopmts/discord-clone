type FunctionsProps = {
  handleMark: (serverId: string) => void;
  handleExitSever: (serverId: string) => void;
  handleConviteServer: (id: string, name: string, inviteCode: string) => void;
  server?: {
    id: string;
    name: string,
    inviteCode: string
  }
}

export const optionsContextMenuSever = ({ handleMark, handleExitSever, handleConviteServer, server }: FunctionsProps) => [
  {
    id: 1,
    label: "Marcar como lidar",
    onClick: (handleCloseMenu: () => void) => {
      handleMark(server?.id!);
      handleCloseMenu();
    }
  },
  {
    id: 2,
    label: "Convidar pessoas",
    onClick: (handleCloseMenu: () => void) => {
      handleConviteServer(server?.id!, server?.name!, server?.inviteCode!);
      handleCloseMenu();
    }
  },
  {
    id: 3,
    label: "Sair do servidor",
    type: "delete",
    onClick: (handleCloseMenu: () => void) => {
      handleExitSever(server?.id!);
      handleCloseMenu();
    }
  }
]