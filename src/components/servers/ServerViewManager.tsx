"use client"

import { createOrUpdateCategory, deleteCategoryId } from "@/app/actions/category"
import { createChannel, deleteChannel } from "@/app/actions/channels"
import { markMessagesChannelRead } from "@/app/actions/menssagens"
import { useDirectMessages, useModalState, useServerData } from "@/hooks/sidebar-infor-server/userDataHooks"
import { ModalVariant, UserIdProps } from "@/types/interfaces"
import { ChannelTypes } from "@prisma/client"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { useMenuModalHandler } from "../../hooks/useMenuModalHandler"
import ContextMenuGlobe from "../ContextMenu"
import RenderDirectMessages from "../infor-bar/DirectMessageList"
import { renderModalContent } from "../infor-bar/ModalContent"
import GenericModal from "../modals/GenericModal"
import ConviteUserServer from "../modals/InviteUsersModal"
import { Skeleton } from "../ui/skeleton"
import MenuOptionsInfor from "./DropdownMenu"
import { MenuItemsInforServer } from "./ServerItems"
import RenderServerChannels from "./ServerRenderChannel"

interface FormData {
  name: string;
  typeChannel?: ChannelTypes;
  isPrivate?: boolean;
  channelId?: string;
  categoryId?: string;
}

interface SelectedServer {
  id: string;
  name: string;
  inviteCode: string;
}

const ServerViewManager = ({ userId }: UserIdProps) => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const currentChannelId = searchParams.get("chaId");

  // Estados e hooks
  const [loader, setLoader] = useState(false);
  const [modalConviter, setModalConviter] = useState(false);
  const [selectedServer, setSelectedServer] = useState<SelectedServer | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    typeChannel: "TEXT",
    isPrivate: false,
  });
  const { setContextMenuOpen, withMenuHandler } = useMenuModalHandler();

  /// Dados do servidor e mensagens diretas
  const {
    data: server,
    isLoading,
    error,
    refetch
  } = useServerData(id);

  const {
    data: messages,
    isLoading: loaderMessages
  } = useDirectMessages(userId);

  // Funções de manipulação de eventos
  const {
    modalState,
    setModalState,
  } = useModalState();

  useEffect(() => {
    if (id) {
      refetch()
    }
  }, [id, refetch]);

  const handleChannelClick = async (channelId: string) => {
    try {
      if (userId) {
        await markMessagesChannelRead(channelId, userId);
      }
      handleServerClick(channelId);
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const handleServerClick = useCallback((channelId: string) => {
    router.push(`/channels/?id=${id}&chaId=${channelId}`);
  }, [id, router]);

  const handleNewsChannel = (categoryId?: string) => {
    setModalState({
      isOpen: true,
      variant: "createChannel",
      categoryId: categoryId || undefined,
    });
    setFormData({
      name: "",
      typeChannel: "TEXT",
      isPrivate: false,
    });
  };

  const handleNewsCategory = (categoryId?: string) => {
    setModalState({
      isOpen: true,
      variant: "createCategory",
      categoryId: categoryId || undefined,
    });
    setFormData({
      name: "",
    });
  };

  const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    setModalState({
      isOpen: true,
      variant: "delete",
      categoryId,
      deleteData: { id: categoryId, name: categoryName }
    });
  };

  const handleConfirmDelete = async () => {
    if (!modalState.categoryId) return;
    setLoader(true);

    try {
      await deleteCategoryId(modalState.categoryId, userId);
      await refetch();
      toast.success("Categoria deletada com sucesso!");
      setModalState({ isOpen: false, variant: null });
    } catch (error: any) {
      toast.error(error.message || "Erro ao deletar categoria");
      setLoader(false)
    } finally {
      setLoader(false)
    }
  };

  const handleCreateChannel = async () => {
    try {
      await createChannel({
        userId,
        serverId: id as string,
        name: formData.name,
        typeChannel: formData.typeChannel!,
        isPrivate: formData.isPrivate!,
        categoryId: modalState.categoryId,
      });
      toast.success("Canal criado com sucesso!");
      refetch?.();
      setModalState({ isOpen: false, variant: null });
    } catch (error) {
      toast.error("Erro ao criar canal!");
    }
  };

  const handleCreateCategory = async () => {
    try {
      await createOrUpdateCategory({
        serverId: id as string,
        name: formData.name,
      });
      toast.success("Categoria criado com sucesso!");
      refetch?.();
      setModalState({ isOpen: false, variant: null });
    } catch (error) {
      toast.error("Erro ao criar categoia!");
    }
  };

  const handleDeleteChannel = useCallback(async (channelId: string) => {
    if (!channelId) return;

    try {
      await deleteChannel(channelId, userId);
      toast.success("Canal deletado com sucesso!");
      refetch?.();
      setModalState({ isOpen: false, variant: null });
    } catch (error) {
      toast.error("Erro ao deletar canal!");
    }
  }, []);

  const handleEditChannel = (channelId: string) => {
    const channelToEdit = server?.channels.find((channel) => channel.id === channelId);

    if (!channelToEdit) return;

    setModalState({
      isOpen: true,
      variant: "editChannel",
    });

    setFormData({
      name: channelToEdit.name,
      typeChannel: channelToEdit.typeChannel,
      isPrivate: channelToEdit.isPrivate || false,
      channelId: channelId,
    });
  };

  const handleEditeChannel = async () => {
    try {
      await createChannel({
        userId,
        name: formData.name,
        serverId: id as string,
        typeChannel: formData.typeChannel!,
        isPrivate: formData.isPrivate!,
        categoryId: modalState.categoryId,
        channelId: formData.channelId,
      });
      toast.success("Canal editado com sucesso!");
      refetch?.();
      setModalState({ isOpen: false, variant: null });
    } catch (error) {
      toast.error("Erro ao editar canal!");
    }
  };

  const handleEditeCategory = (categoryId: string) => {
    setModalState({
      isOpen: true,
      variant: "editCategory",
      categoryId: categoryId || undefined,
    });
    setFormData({
      name: server?.Category.find((category) => category.id === categoryId)?.name || "",
    });
  };

  const handleEditCategory = async () => {
    if (!modalState.categoryId) return;
    setLoader(true);

    try {
      await createOrUpdateCategory({
        serverId: id as string,
        name: formData.name,
        categoryId: modalState.categoryId,
      });
      await refetch();
      toast.success("Categoria editada com sucesso!");
      setModalState({ isOpen: false, variant: null });
    } catch (error: any) {
      toast.error(error.message || "Erro ao editar categoria");
      setLoader(false)
    } finally {
      setLoader(false)
    }
  };

  const getConfirmAction = () => {
    switch (modalState.variant) {
      case "createChannel": return handleCreateChannel;
      case "createCategory": return handleCreateCategory;
      case "delete": return handleConfirmDelete;
      case "editCategory": return handleEditCategory;
      case "editChannel": return handleEditeChannel;
      default: return () => { };
    }
  };

  const handleConviteServer = (server: {
    id: string;
    name: string;
    inviteCode: string;
  }) => {
    setSelectedServer(server);
    setModalConviter(true);
  };


  /// Renderização do conteúdo
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-2 p-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-1/2" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-base font-semibold text-red-500">
          {error.message}
        </div>
      );
    }

    if (server) {
      return (
        <ContextMenuGlobe
          onOpenChange={(open) => {
            setContextMenuOpen(open ? id : null);
          }}
          className="w-auto"
          menuItems={[
            {
              label: "Convidar pessoas",
              action: () => withMenuHandler(() => handleConviteServer({
                id: id!,
                inviteCode: server?.inviteCode!,
                name: server?.name || "Server"
              })),
            },
            {
              label: "Criar um canal",
              action: () => withMenuHandler(() => handleNewsChannel())
            },
            {
              label: "Criar categoria",
              action: () => withMenuHandler(() => handleNewsCategory()),
            }
          ]}
        >
          <div className="">
            <div className="p-3 flex items-center justify-between">
              <MenuOptionsInfor
                name={server.name}
                handleNewsCategory={handleNewsCategory}
                handleNewsChannel={handleNewsChannel}
              />
            </div>
            <div className="w-full h-[72vh] overflow-y-auto scroll-style">
              {/* Render channels that belong to a category */}
              <RenderServerChannels
                server={server}
                userId={userId}
                currentChannelId={currentChannelId!}
                handleNewsChannel={handleNewsChannel}
                handleNewsCategory={handleNewsCategory}
                handleServerClick={handleChannelClick}
                handleDelete={handleDeleteCategory}
                handleEditeCategory={handleEditeCategory}
                handleDeleteChannel={handleDeleteChannel}
                handleEditChannel={handleEditChannel}
              />

              <div className="flex flex-col gap-1.5 p-1.5">
                {/* Render channels that do not belong to any category */}
                {server.channels
                  .filter(channel => !channel.categoryId)
                  .map((channel) => (
                    <MenuItemsInforServer
                      key={channel.id}
                      userId={userId}
                      serverId={server.id}
                      server={server}
                      currentChannelId={currentChannelId!}
                      onEdit={handleEditChannel}
                      onDelete={handleDeleteChannel}
                      onServerClick={handleServerClick}
                      channel={channel}
                    />
                  ))}
              </div>
            </div>
          </div>
        </ContextMenuGlobe>
      )
    }

    return loaderMessages ? (
      <div className="w-full flex items-center gap-1.5">
        <div className="">
          <Skeleton className="w-9 h-9 rounded-full" />
        </div>
        <Skeleton className="w-full h-4 rounded-md" />
      </div>
    ) : (
      <RenderDirectMessages messages={messages as any} />
    );
  }

  return (
    <div>
      <div
        className="w-full h-full"
      >
        <div className="w-[290px] z-[500] h-full border rounded-l-md flex flex-col">
          <div className="w-full h-full flex flex-col p-2">
            {renderContent()}
          </div>
        </div>
      </div>

      <GenericModal
        isOpen={modalState.isOpen}
        onClose={() => {
          if (!loader) {
            setModalState({ isOpen: false, variant: null });
          }
        }}
        variant={modalState.variant!}
        title={getModalTitle(modalState.variant)}
        description={
          modalState.variant === "createChannel"
            ? `Em ${formData.typeChannel!.toLowerCase()}`
            : undefined
        }
        onConfirm={getConfirmAction()}
        serverId={id || undefined}
        categoryId={modalState.categoryId}
        refetch={refetch}
      >
        {renderModalContent({
          modalState,
          setFormData,
          formData
        })}
      </GenericModal>

      <ConviteUserServer
        isOpen={modalConviter}
        serverName={selectedServer?.name || ""}
        serverConvite={selectedServer?.inviteCode || ""}
        onClose={() => setModalConviter(false)}
      />
    </div>
  )
}

function getModalTitle(variant: ModalVariant | null): string {
  const titles: Record<ModalVariant, string> = {
    createChannel: "Criar canal",
    createCategory: "Criar categoria",
    editCategory: "Editando categoria",
    editChannel: "Editando canal",
    delete: "Excluir categoria",
  };

  return variant ? titles[variant] : "";
}

export default ServerViewManager;
