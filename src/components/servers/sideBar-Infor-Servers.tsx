"use client"

import { createOrUpdateCategory, deleteCategoryId } from "@/app/actions/category"
import { createChannel, deleteChannel } from "@/app/actions/channels"
import { getDirectMessages, markMessagesChannelRead } from "@/app/actions/menssagens"
import { geServer } from "@/app/actions/servers"
import { ModalVariant, UserIdProps } from "@/types/interfaces"
import { ChannelTypes } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { useMenuModalHandler } from "../../hooks/useMenuModalHandler"
import ContextMenuGlobe from "../ContextMenu"
import RenderDirectMessages from "../infor-bar/renderDirectMessages"
import { renderModalContent } from "../infor-bar/renderModalContent"
import ConviteUserServer from "../modals/convite-users-server"
import GenericModal from "../modals/GenericModal"
import { Skeleton } from "../ui/skeleton"
import MenuOptionsInfor from "./dropdown-menu-options"
import { MenuItemsInforServer } from "./Items-Servers-Channels"
import RenderServerChannels from "./renderServerChannels"


const SiderBarInfors = ({ userId }: UserIdProps) => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const currentChannelId = searchParams.get("chaId");

  const [loader, setLoader] = useState(false);
  const [modalConviter, setModalConviter] = useState(false);

  const [selectedServer, setSelectedServer] = useState<{
    id: string;
    name: string;
    inviteCode: string;
  } | null>(null);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    variant: ModalVariant | null;
    categoryId?: string;
    deleteData?: { id: string; name: string };
  }>({
    isOpen: false,
    variant: null,
  });


  const { setContextMenuOpen, withMenuHandler } = useMenuModalHandler();

  const [formData, setFormData] = useState<{
    name: string;
    typeChannel?: ChannelTypes;
    isPrivate?: boolean;
    channelId?: string;
    categoryId?: string;
  }>({
    name: "",
    typeChannel: "TEXT",
    isPrivate: false,
  });


  //Query get server
  const { data: server, isLoading, error, refetch } = useQuery({
    queryKey: ["server", id],
    queryFn: () => (id ? geServer(id) : null),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  const { data: messages, isLoading: loaderMessages } = useQuery({
    queryKey: ["direct_messages", userId],
    queryFn: () => (userId ? getDirectMessages(userId) : null),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  });


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

  const handleServerClick = (channelId: string) => {
    router.push(`/channels/?id=${id}&chaId=${channelId}`)
  };

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
      console.error("Erro ao deletar categoria:", error);
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
      console.error("Error creating channel:", error);
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
      console.error("Error creating category:", error);
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
      console.error("Error delete channel:", error);
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
      console.error("Error creating channel:", error);
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
      console.error("Erro ao editar categoria:", error);
      toast.error(error.message || "Erro ao editar categoria");
      setLoader(false)
    } finally {
      setLoader(false)
    }
  };

  const getModalTitle = () => {
    switch (modalState.variant) {
      case "createChannel": return "Criar canal";
      case "createCategory": return "Criar categoria";
      case "editCategory": return "Editando categoria";
      case "editChannel": return "Editando canal";
      case "delete": return "Excluir categoria";
      default: return "";
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



  return (
    <div>
      <ContextMenuGlobe
        // Ensures the menu closes properly without freezing the screen
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
        ]}>
        <div className="w-[290px] z-[500] h-full border rounded-l-md flex flex-col">
          {error && (
            <div className="text-center text-base font-semibold text-red-500">
              {error.message}
            </div>
          )}
          <div className="w-full p-2 flex flex-col">
            {isLoading ? (
              <div className="space-y-2 p-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-1/2" />
              </div>
            ) : server ? (
              <>
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
              </>
            ) : (
              loaderMessages ? (
                <div className="w-full flex items-center gap-1.5">
                  <div className="">
                    <Skeleton className="w-9 h-9 rounded-full" />
                  </div>
                  <Skeleton className="w-full h-4 rounded-md" />
                </div>
              ) : (
                <RenderDirectMessages messages={messages as any} />
              )
            )}
          </div>
        </div>
      </ContextMenuGlobe>

      <GenericModal
        isOpen={modalState.isOpen}
        onClose={() => {
          if (!loader) {
            setModalState({ isOpen: false, variant: null });
          }
        }}
        variant={modalState.variant || "createChannel" || "createCategory" || "delete" || "editCategory" || "editChannel"}
        title={getModalTitle()}
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

export default SiderBarInfors;
