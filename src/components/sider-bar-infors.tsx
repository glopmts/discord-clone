"use client"

import { createNewsCategory, deleteCategoryId } from "@/app/actions/category"
import { createChannel } from "@/app/actions/channels"
import { geServer } from "@/app/actions/servers"
import { channelIcons } from "@/types/iconsChannels"
import { UserIdProps } from "@/types/interfaces"
import { ChannelTypes } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import MemberServer from "./infor-bar/meber-server"
import renderDirectMessages from "./infor-bar/renderDirectMessages"
import { renderModalContent } from "./infor-bar/renderModalContent"
import GenericModal from "./modals/GenericModal"
import RenderServerChannels from "./servers/renderServerChannels"
import { Button } from "./ui/button"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "./ui/context-menu"
import { ScrollArea } from "./ui/scroll-area"
import { Skeleton } from "./ui/skeleton"


const SiderBarInfors = ({ userId }: UserIdProps) => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const router = useRouter();
  const currentChannelId = searchParams.get("chaId");
  const [selectedCategoryForDelete, setSelectedCategoryForDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    variant: "createChannel" | "createCategory" | "delete" | null;
    categoryId?: string;
    deleteData?: { id: string; name: string };
  }>({
    isOpen: false,
    variant: null,
  });


  const {
    data: server,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["server", id],
    queryFn: () => (id ? geServer(id) : null),
    enabled: !!id,
  });

  useEffect(() => {
    if (id) {
      refetch()
    }
  }, [id, refetch]);

  const handleServerClick = (channelId: string) => {
    router.push(`/channels/?id=${id}&chaId=${channelId}`)
  };

  const [formData, setFormData] = useState<{
    name: string;
    typeChannel?: ChannelTypes;
    isPrivate?: boolean;
  }>({
    name: "",
    typeChannel: "TEXT",
    isPrivate: false,
  });

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

  const handleDeleteCategory = (categoryId?: string,) => {
    setModalState({
      isOpen: true,
      variant: "delete",
      categoryId: categoryId || undefined,
    });

  };

  const handleConfirmDelete = async () => {
    if (selectedCategoryForDelete) {
      try {
        await deleteCategoryId(selectedCategoryForDelete.id, userId)
        await refetch();
        toast.success("Categoria deletada com sucesso!")
        setSelectedCategoryForDelete(null);
      } catch (error) {
        console.error("Erro ao deletar categoria:", error);
        toast.error("Erro ao deletar categoria:")
      }
    }
  };

  const handleCreateChannel = async () => {
    try {
      await createChannel({
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
      await createNewsCategory({
        serverId: id as string,
        name: formData.name,
      });
      toast.success("Categoria criado com sucesso!");
      refetch?.();
      setModalState({ isOpen: false, variant: null });
    } catch (error) {
      console.error("Error creating channel:", error);
      toast.error("Erro ao criar categoia!");
    }
  };



  const getModalTitle = () => {
    switch (modalState.variant) {
      case "createChannel": return "Criar canal";
      case "createCategory": return "Criar categoria";
      case "delete": return "Excluir categoria";
      default: return "";
    }
  };

  const getConfirmAction = () => {
    switch (modalState.variant) {
      case "createChannel": return handleCreateChannel;
      case "createCategory": return handleCreateCategory;
      case "delete": return handleConfirmDelete;
      default: return () => { };
    }
  };

  const isConfirmDisabled = () => {
    if (modalState.variant === "delete") return false;
    return !formData.name;
  };


  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="w-[290px] z-[500] h-full border rounded-l-md flex flex-col">
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
                  <RenderServerChannels
                    server={server}
                    currentChannelId={currentChannelId!}
                    handleNewsChannel={handleNewsChannel}
                    handleNewsCategory={handleNewsCategory}
                    handleServerClick={handleServerClick}
                    handleDelete={handleDeleteCategory}
                    handleEdite={() => { }}
                  />
                  <div>
                    {server.channels
                      .filter(channel => !channel.categoryId)
                      .map((channel) => {
                        const channelId = channel.id;
                        const isActive = currentChannelId === channelId;

                        return (
                          <div className="w-full" key={channel.id}>
                            <Button
                              variant={isActive ? "secondary" : "ghost"}
                              onClick={() => handleServerClick(channel.id)}
                              className="w-full justify-start px-3 py-1 text-neutral-400 hover:text-white hover:bg-zinc-700/50 rounded-sm"
                            >
                              {channelIcons[channel.typeChannel]}
                              <span className="truncate">{channel.name}</span>
                            </Button>
                          </div>
                        );
                      })}
                  </div>

                  {error && (
                    <div className="text-center text-base font-semibold text-red-500">
                      {error.message}
                    </div>
                  )}
                </>
              ) : (
                renderDirectMessages()
              )}
            </div>

            <ScrollArea className="flex-1 w-full h-32 mb-15">
              <MemberServer server={server!} />
            </ScrollArea>
          </div>

        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Criar um canal</ContextMenuItem>
          <ContextMenuItem>Criar categoria</ContextMenuItem>
          <ContextMenuItem>Convidar pessoas</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* modals functions */}


      <GenericModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, variant: null })}
        variant={modalState.variant || "createChannel" || "createCategory" || "delete"}
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
    </>
  )
}

export default SiderBarInfors;
