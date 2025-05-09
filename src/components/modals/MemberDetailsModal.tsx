"use client"

import { checkFriendshipStatus, createFriendship, getUserByClerkId } from "@/app/actions/user";
import {
  Dialog,
  DialogContent,
  DialogTitle
} from "@/components/ui/dialog";

import { assignServerRole } from "@/app/actions/member-servers";
import { getRoleIcon } from "@/components/icons/IconsCargosMembers";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import useDominantColor from "@/hooks/useDominantColor";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/clerk-react";
import { FriendStatus, Roles } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader, MoreVertical, Shield, Star, User2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ErrorMenssage from "../ErrorMenssage";
import { getStatusButton } from "../getStatusButton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type MenuDetailsProps = {
  memberId: string;
  serverId: string;
  isOpen: boolean;
  onClose: () => void;
}

const DetailsMembers = ({
  isOpen,
  memberId,
  serverId,
  onClose
}: MenuDetailsProps) => {

  if (!memberId) {
    return null;
  }

  const { userId } = useAuth();
  const currentUserId = userId!
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

  const getMemberRole = (memberCargo: {
    userId: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    serverId: string;
    role: Roles;
  }[]): Roles => {
    if (!memberCargo || memberCargo.length === 0) return Roles.user;
    return memberCargo[0].role;
  };

  const dominantColor = useDominantColor(member?.image!);

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

  const handleRoleChange = async (targetUserId: string, newRole: Roles) => {
    try {
      await assignServerRole(currentUserId, targetUserId, serverId, newRole);
      refetch();
      toast.success("Novo cago aplicado com sucesso!")
    } catch (error) {
      console.error("Failed to change role:", error);
      toast.error("Erro ao aplicae cargo!")
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
          {isLoading ? (
            <div className="flex items-center h-38 justify-center w-full">
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
                  <div className="h-18 w-18 rounded-full flex items-center justify-between">
                    <Avatar className="h-21 w-21 p-1 rounded-full relative bg-zinc-700">
                      <AvatarImage src={member?.image ?? "No image user"} className="object-cover rounded-full" alt="User avatar" />
                      <AvatarFallback>
                        {member?.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="z-50 absolute top-0 left-23">
                      {getStatusButton({
                        isLoadingStatus,
                        friendshipStatus: friendshipStatus!,
                        addFriendMutation,
                        handleAddFriend
                      })}
                    </div>
                  </div>
                  <div className="flex flex-col p-2">
                    <div className="flex items-center justify-between w-full">
                      <div className="">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-semibold text-xl">{member?.name}</h3>
                          {getRoleIcon(getMemberRole(member?.MemberCargo ?? []), 18)}
                        </div>
                        <span className="text-sm dark:text-zinc-400 text-zinc-500">{member?.username}</span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreVertical size={16} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className={cn("z-[220]")}>
                          <DropdownMenuItem className="cursor-pointer hover:opacity-70" onClick={() => handleRoleChange(member?.clerk_id!, "admin")}>
                            <Shield className="mr-2 h-4 w-4" />
                            Tornar Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer hover:opacity-70" onClick={() => handleRoleChange(member?.clerk_id!, "moderator")}>
                            <Shield className="mr-2 h-4 w-4 text-green-500" />
                            Tornar Moderador
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer hover:opacity-70" onClick={() => handleRoleChange(member?.clerk_id!, "vip")}>
                            <Star className="mr-2 h-4 w-4 text-purple-500" />
                            Tornar VIP
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer hover:opacity-70" onClick={() => handleRoleChange(member?.clerk_id!, "user")}>
                            <User2 className="mr-2 h-4 w-4" />
                            Remover Cargos
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
      </DialogContent>
    </Dialog>
  );
}

export default DetailsMembers;