"use client"

import { checkFriendshipStatus, createFriendship, getUserByClerkId } from "@/app/actions/user";
import {
  Dialog,
  DialogContent,
  DialogTitle
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/clerk-react";
import { FriendStatus } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Ban, Check, Loader, UserPlus2Icon, UserRoundCog } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type MenuDetailsProps = {
  memberId: string;
  isOpen: boolean;
  onClose: () => void;
}

const DetailsMembers = ({
  isOpen,
  memberId,
  onClose
}: MenuDetailsProps) => {
  if (!memberId) {
    return null;
  }

  const { userId } = useAuth();
  const [friendshipStatus, setFriendshipStatus] = useState<FriendStatus | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  const {
    data: member,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["memberId", memberId],
    queryFn: () => getUserByClerkId(memberId),
  });

  useEffect(() => {
    if (memberId && userId) {
      checkFriendshipStatus(memberId, userId)
        .then(status => {
          setFriendshipStatus(status);
          setIsLoadingStatus(false);
        })
        .catch(() => {
          setIsLoadingStatus(false);
        });
    }
  }, [memberId, userId]);

  const addFriendMutation = useMutation({
    mutationFn: () => createFriendship(memberId, userId!),
    onSuccess: () => {
      setFriendshipStatus("PENDING");
      toast.success(`Pedido de amizade enviado para ${member?.name}`);
      refetch();
    },
    onError: (error) => {
      console.error(error);
      toast.error(`Erro ao enviar pedido de amizade`);
    }
  });

  const handleAddFriend = async () => {
    if (!memberId || !userId) {
      toast.error("Necessário ID do membro ou user ID!");
      return;
    }
    addFriendMutation.mutate();
  };

  const getStatusButton = () => {
    if (isLoadingStatus) {
      return (
        <Button disabled className="rounded-full w-8 h-8 bg-zinc-800/60">
          <Loader size={16} className="animate-spin" />
        </Button>
      );
    }

    switch (friendshipStatus) {
      case "PENDING":
        return (
          <Button title="Pedido pendente..." disabled className="rounded-full w-8 h-8 bg-yellow-600/60">
            <UserRoundCog size={16} />
          </Button>
        );
      case "ACCEPTED":
        return (
          <Button disabled className="rounded-full w-8 h-8 bg-green-600/60">
            <Check size={16} />
          </Button>
        );
      case "BLOCKED":
        return (
          <Button disabled className="rounded-full w-8 h-8 bg-red-600/60">
            <Ban size={16} />
          </Button>
        );
      default:
        return (
          <Button
            onClick={handleAddFriend}
            className="rounded-full w-8 h-8 bg-zinc-800/60 hover:bg-zinc-700/30 text-white"
            disabled={addFriendMutation.isPending}
          >
            {addFriendMutation.isPending ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              <UserPlus2Icon size={16} />
            )}
          </Button>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("p-0 overflow-hidden bg-zinc-800 w-[400px]")}>
        <DialogTitle className="hidden"></DialogTitle>
        <div className="w-full">
          {error && (
            <div className="w-full h-full text-center text-red-500">
              {error.message}
            </div>
          )}
          {isLoading ? (
            <div className="flex items-center justify-center h-8 w-full">
              <Loader size={20} className="animate-spin" />
            </div>
          ) : (
            <div className="w-full h-full">
              <div className="w-full relative">
                <div className="w-full h-18 bg-blue-600 relative"></div>
                <div className="p-2 flex flex-col gap-2.5 relative -top-8 z-40">
                  <div className="h-18 w-18 rounded-full flex items-center justify-between">
                    <Avatar className="h-18 w-18 p-1 rounded-full relative bg-zinc-700">
                      <AvatarImage src={member?.image ?? "No image user"} alt="User avatar" />
                      <AvatarFallback>
                        {member?.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="z-50 absolute top-0 left-19">
                      {getStatusButton()}
                    </div>
                  </div>
                  <div className="flex flex-col p-2">
                    <h3 className="font-semibold text-xl">{member?.name}</h3>
                    <span className="text-sm text-zinc-400">{member?.username}</span>
                    {friendshipStatus && (
                      <span className="text-xs mt-1 text-zinc-400">
                        Status: {friendshipStatus === "PENDING" ? "Pedido pendente" :
                          friendshipStatus === "ACCEPTED" ? "Amigos" :
                            "Bloqueado"}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-4 p-2">
                  <Input placeholder="conversar" className={cn("w-full")} />
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DetailsMembers;