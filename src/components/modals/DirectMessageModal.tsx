import { checkFriendshipStatus, createFriendship, deleteFriendship, getUserByClerkId } from "@/app/actions/user";
import {
  Dialog,
  DialogContent,
  DialogTitle
} from "@/components/ui/dialog";
import useDominantColor from "@/hooks/useDominantColor";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { FriendStatus } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader, UserMinus2, UserPlus2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ErrorMenssage from "../ErrorMenssage";
import { getStatusButton } from "../getStatusButton";
import { Button } from "../ui/button";
import InforUserImage from "../user/ImageUserPerfil";

type MenuDetailsProps = {
  selectId: string;
  isOpen: boolean;
  onClose: () => void;
}

const DetailsFriendsModal = ({
  isOpen,
  onClose,
  selectId
}: MenuDetailsProps) => {

  if (!selectId) {
    return null;
  }

  const { userId } = useAuth();
  const [friendshipStatus, setFriendshipStatus] = useState<FriendStatus | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  const {
    data: friends,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["selectId", selectId],
    queryFn: () => getUserByClerkId(selectId),
  });

  const dominantColor = useDominantColor(friends?.image!);

  useEffect(() => {
    if (selectId && userId) {
      checkFriendshipStatus(selectId, userId)
        .then(status => {
          setFriendshipStatus(status);
          setIsLoadingStatus(false);
        })
        .catch(() => {
          setIsLoadingStatus(false);
        });
    }
  }, [selectId, userId]);

  const addFriendMutation = useMutation({
    mutationFn: () => createFriendship(selectId, userId!),
    onSuccess: () => {
      setFriendshipStatus("PENDING");
      toast.success(`Pedido de amizade enviado para ${friends?.name}`);
      refetch();
    },
    onError: (error) => {
      console.error(error);
      toast.error(`Erro ao enviar pedido de amizade`);
    }
  });

  const handleAddFriend = async () => {
    if (!selectId || !userId) {
      toast.error("Necessário ID do membro ou user ID!");
      return;
    }
    addFriendMutation.mutate();
  };

  const handleDeleteFriend = async () => {
    if (!selectId || !userId) {
      toast.error("Necessário ID do membro ou user ID!");
      return;
    }

    try {
      await deleteFriendship(selectId, userId!);
      setFriendshipStatus(null);
      toast.success(`Amizade removida com ${friends?.name}`);
      refetch();
    } catch (error) {
      console.error(error);
      toast.error(`Erro ao remover amizade`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("p-0 overflow-hidden z-[200] bg-background dark:bg-zinc-800 w-[500px] h-[480px]")}>
        <DialogTitle className="hidden"></DialogTitle>
        <div className="w-full">
          {error && (
            <div className="w-full h-full text-center text-red-500">
              <ErrorMenssage error={error.message} />
            </div>
          )}
          <div className="w-full h-68">
            {isLoading ? (
              <div className="flex items-center h-68 justify-center w-full">
                <Loader size={20} className="animate-spin" />
              </div>
            ) : (
              <div className="w-full h-full">
                <div className="w-full relative">
                  <div
                    className="w-full h-32 relative"
                    style={{ backgroundColor: dominantColor }}
                  ></div>
                  <div className="p-2 flex flex-col gap-2.5 relative -top-8 z-40">
                    <div className="flex items-baseline justify-between w-full">
                      <div className="h-18 w-18 rounded-full flex items-center justify-between">
                        <InforUserImage
                          image={friends?.image!}
                          username={friends?.username!}
                          isOnline={friends?.isOnline!}
                          className="w-23 h-23"
                          classNameOnline="left-18 top-16"
                        />
                        <div className="z-50 absolute top-0 left-24">
                          {getStatusButton({
                            isLoadingStatus,
                            friendshipStatus: friendshipStatus!,
                            addFriendMutation,
                            handleAddFriend
                          })}
                        </div>
                      </div>
                      <div className="">
                        {friendshipStatus === "FRIENDS" ? (
                          <Button variant="destructive" className="flex cursor-pointer items-center gap-1.5 text-white" onClick={handleDeleteFriend}>
                            <UserMinus2 size={20} />
                            <span>Remover amigo</span>
                          </Button>
                        ) : (
                          <Button
                            className={cn("flex cursor-pointer items-center gap-1.5 text-white bg-[#5865F2] hover:bg-[#5865f2ce]")}
                            onClick={handleAddFriend}
                            disabled={friendshipStatus === "PENDING"}
                          >
                            <UserPlus2 size={20} />
                            <span>Adicionar amigo</span>
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col p-2">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col gap-1">
                          <span className="text-md font-semibold dark:text-gray-100 text-zinc-500">{friends?.name}</span>
                          <span className="text-sm dark:text-gray-100 text-zinc-500">{friends?.username}</span>
                        </div>
                      </div>
                      {friendshipStatus && (
                        <span className="text-xs mt-1 text-zinc-500 dark:text-zinc-400">
                          Status: {friendshipStatus === "PENDING" ? "Pedido pendente" :
                            friendshipStatus === "FRIENDS" ? "Amigos" :
                              "Bloqueado"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>

  );
}

export default DetailsFriendsModal;