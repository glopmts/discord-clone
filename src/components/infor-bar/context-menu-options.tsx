type FunctionsProps = {
  handleMark: (serverId: string) => void;
  handleExitSever: (serverId: string) => void;
  handleDeleteSever: (serverId: string) => void;
  handleConviteServer: (id: string, name: string, inviteCode: string) => void;
  server?: {
    id: string;
    name: string;
    inviteCode: string;
    ownerId: string;
  }
  userId: string;
}

type ContextMenuOption = {
  id: number;
  label: string;
  onClick: (handleCloseMenu: () => void) => void;
  type?: string;
};

export const optionsContextMenuSever = ({ handleMark, handleExitSever, handleConviteServer, server, handleDeleteSever, userId }: FunctionsProps) => {
  const options: ContextMenuOption[] = [
    {
      id: 1,
      label: "Marcar como lida",
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
  ];

  if (userId === server?.ownerId) {
    options.push({
      id: 4,
      label: "Deletar servidor",
      type: "delete",
      onClick: (handleCloseMenu: () => void) => {
        handleDeleteSever(server?.id!);
        handleCloseMenu();
      }
    });
  } else {
    options.push({
      id: 3,
      label: "Sair do servidor",
      type: "delete",
      onClick: (handleCloseMenu: () => void) => {
        handleExitSever(server?.id!);
        handleCloseMenu();
      }
    });
  }

  return options;
}
