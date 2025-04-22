import { canceleFriends, getPendingFriendRequests } from "@/app/actions/user";
import ErrorMenssage from "@/components/ErrorMenssage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { UserIdProps } from "@/types/interfaces";
import { useQuery } from "@tanstack/react-query";
import { Loader, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const PendingFriends = ({ userId }: UserIdProps) => {

  const {
    data: friends,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["pendings", userId],
    queryFn: () => getPendingFriendRequests(userId!),
  });

  const [hoverButtons, setHoverButtons] = useState(false);
  const [loader, setLoader] = useState(false);

  const handleCancel = async (id: string) => {
    if (!id) {
      return null;
    }

    setLoader(true);
    await canceleFriends(userId, id)
      .then(() => {
        toast.success("Pedido deletado com sucesso!")
        setLoader(false)
        refetch()
      })
      .catch(() => {
        toast.error("Error ao deletar o pedido")
        setLoader(false)
      })
  }

  return (
    <div className="w-full h-full">
      {isLoading ? (
        <div className="p-2 flex items-center justify-center w-full h-10">
          <Loader size={20} className="animate-spin" />
        </div>
      ) : (
        friends?.map((pending) => {
          const isRequester = pending.requesterId === userId;
          const friend = isRequester ? pending.addressee : pending.requester;

          return (
            <div className="mt-2 p-3" key={pending.id}>
              <div className="flex justify-between items-center hover:bg-zinc-400/20 dark:hover:bg-zinc-800/60 rounded-md p-1" onMouseOver={() => setHoverButtons(true)}>
                <div className="flex items-center gap-2.5 cursor-pointer"
                >
                  <Avatar className={cn("w-9 h-9")}>
                    <AvatarImage src={friend.image!} alt={friend.username!} />
                    <AvatarFallback>{friend.username?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-baseline gap-0.5">
                    <span className="text-sm">{friend.name}</span>
                    <span className="text-sm text-zinc-400">Offline</span>
                  </div>
                </div>
                <div className="mr-3">
                  <button
                    disabled={loader}
                    onClick={() => handleCancel(pending.addressee?.clerk_id!)}
                    className={`rounded-full cursor-pointer p-2 ${hoverButtons ? "dark:bg-zinc-900 bg-zinc-400" : ""} ${loader ? "opacity-75" : ""}`}>
                    <X size={20} className="text-zinc-400 hover:text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          )
        })
      )}
      <ErrorMenssage error={error?.message} />
    </div>
  );
}

export default PendingFriends;