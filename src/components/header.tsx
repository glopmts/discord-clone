"use client";

import { geServer } from "@/app/actions/servers";
import { acceptFriends, getPendingFriendRequests } from "@/app/actions/user";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { CircleHelp, Inbox, LucideUsers, User, UserPlusIcon } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import ModalInfor from "./ModalCustom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

const Header = () => {
  const { userId } = useAuth();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: server } = useQuery({
    queryKey: ["server", id],
    queryFn: () => (id ? geServer(id) : null),
    enabled: !!id,
  });

  const { data: pendings, refetch } = useQuery({
    queryKey: ["pendings", userId],
    queryFn: () => (userId ? getPendingFriendRequests(userId) : null),
    enabled: !!userId,
  });

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleAcept = async (addressee: string) => {
    try {
      await acceptFriends(userId!, addressee)
      toast.success("Pedido aceito com sucesso!")
      refetch()
    } catch (error) {
      toast.error("Erro ao aceitar o pedido")
      console.log(error)
    }
  }

  return (
    <header className="w-full p-1 py-2 px-2.5 relative">
      <div className="w-full flex justify-between items-center">
        <div className=""></div>
        {server ? (
          <>
            <div className="flex items-center gap-2.5">
              <div className="">
                {server.image ? (
                  <Image
                    src={server.image}
                    alt={server.name}
                    width={20}
                    height={20}
                    sizes="100vw"
                    className="rounded-[2px] object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-zinc-700 rounded-md flex items-center justify-center">
                    {server.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="font-semibold text-sm">{server.name}</span>
            </div>
            <ButtonsOptions onMenuClick={toggleMenu} hasPending={!!pendings?.length} />
          </>
        ) : (
          <>
            <div className="flex items-center gap-1.5">
              <LucideUsers size={16} className="text-neutral-300" />
              <span className="font-semibold text-sm">Amigos</span>
            </div>
            <ButtonsOptions onMenuClick={toggleMenu} hasPending={!!pendings?.length} />
          </>
        )}
      </div>

      <ModalInfor
        isOpen={isMenuOpen}
        className="w-[380px] max-h-[420px] p-0 overflow-hidden"
        onClose={closeMenu}
      >
        <div className="w-full h-full flex flex-col">
          <div className="flex items-center justify-between w-full p-4">
            <div className="flex items-center gap-1.5">
              <Inbox size={20} />
              <span className="text-xl font-semibold">Caixa de Entrada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-8 cursor-pointer bg-zinc-700 hover:bg-zinc-600/30 flex items-center justify-center gap-2 rounded-md">
                <UserPlusIcon size={16} />
                <span>{pendings?.length || 0}</span>
              </div>
            </div>
          </div>
          <Separator className="w-full" />

          <div className="flex-1 overflow-y-auto">
            {pendings?.length ? (
              <div className="p-2 space-y-2">
                {pendings.map((request) => (
                  <FriendRequestItem
                    key={request.id}
                    request={request}
                    userId={userId!}
                    handleAcept={handleAcept}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <User className="w-12 h-12 text-zinc-500 mb-2" />
                <p className="text-zinc-400">Nenhum pedido de amizade pendente</p>
              </div>
            )}
          </div>
        </div>
      </ModalInfor>
    </header>
  );
};

const FriendRequestItem = ({
  request, userId, handleAcept
}: {
  request: any,
  userId: string,
  handleAcept: (id: string) => void
}) => {

  const isRequester = request.requesterId === userId;
  const friend = isRequester ? request.addressee : request.requester;

  return (
    <div className="flex items-center justify-between p-2 hover:bg-zinc-700/30 rounded-md">
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10 border">
          <AvatarImage src={friend.image} alt={friend.username} />
          <AvatarFallback>{friend.username?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{friend.username}</p>
          <p className="text-sm text-zinc-400">
            {isRequester ? "Você enviou" : "Enviou solicitação"}
          </p>
        </div>
      </div>
      {!isRequester && (
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleAcept(friend.clerk_id)} size="sm" className="bg-green-600 hover:bg-green-700">
            Aceitar
          </Button>
          <Button variant="outline" size="sm" className="bg-zinc-700 hover:bg-zinc-600">
            Recusar
          </Button>
        </div>
      )}
    </div>
  );
};

const ButtonsOptions = ({ onMenuClick, hasPending }: { onMenuClick: () => void, hasPending: boolean }) => {
  return (
    <div className="flex items-center gap-2.5">
      <button
        className="cursor-pointer text-neutral-300 hover:text-neutral-100 transition-colors relative"
        onClick={onMenuClick}
        aria-label="Abrir menu"
      >
        <Inbox size={18} />
        {hasPending && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center">
            {hasPending}
          </span>
        )}
      </button>
      <button
        className="cursor-pointer text-neutral-300 hover:text-neutral-100 transition-colors"
        aria-label="Ajuda"
      >
        <CircleHelp size={18} />
      </button>
    </div>
  );
};

export default Header;