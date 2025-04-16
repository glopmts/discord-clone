import { getFriends } from "@/app/actions/user";
import ErrorMenssage from "@/components/ErrorMenssage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { UserIdProps } from "@/types/interfaces";
import { useQuery } from "@tanstack/react-query";
import { EllipsisVertical, Loader, MessageCircle, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Ref, useEffect, useRef, useState } from "react";

const DetailsFriends = ({ userId }: UserIdProps) => {

  const {
    data: friends,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["friends", userId],
    queryFn: () => getFriends(userId!),
  });

  const [hoverButtons, setHoverButtons] = useState(false);
  const [menu, setMenu] = useState(false);
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFriends, setFilteredFriends] = useState(friends);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node) && menu) {
        setMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [menu, setMenu])

  const toggleMenu = () => {
    setMenu(!menu);
  }

  const handleNavegation = (id: string) => {
    router.push(`/channels/me/${id}`)
  }

  useEffect(() => {
    if (!friends) return;

    if (!searchTerm) {
      setFilteredFriends(friends);
    } else {
      const filtered = friends.filter((friend) =>
        friend.addressee?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFriends(filtered);
    }
  }, [searchTerm, friends]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="w-full h-full flex">
      <div className="mt-2 p-3 flex-1">
        <div className="flex flex-col gap-3">
          <div className="w-full relative">
            <Input
              placeholder="Buscar"
              value={searchTerm}
              className="relative"
              onChange={handleSearchChange}
            />
            <Search size={20} className="absolute top-2 right-3" />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="">
              <span className="text-sm text-zinc-200">Todos os amigos - {friends?.length}</span>
            </div>
          </div>

          <div className="mt-1 flex flex-col gap-2.5">
            <Separator />
            {isLoading ? (
              <div className="p-2 flex items-center justify-center w-full h-10">
                <Loader size={20} className="animate-spin" />
              </div>
            ) : (
              filteredFriends?.filter((frind => frind.status === "FRIENDS"))
                .map((frind) => {

                  const isRequester = frind.requesterId === userId;
                  const friend = isRequester ? frind.addressee : frind.requester;

                  return (
                    <div className="w-full" key={frind.id}>
                      <div className="w-full hover:bg-zinc-800/60 rounded-md p-1 flex items-center justify-between" title={friend.username!}
                        onMouseOver={() => setHoverButtons(true)}
                      >
                        <div className="flex items-center gap-2.5 cursor-pointer"
                          onClick={() => handleNavegation(friend.id)}>
                          <Avatar className={cn("w-9 h-9")}>
                            <AvatarImage src={friend.image!} alt={friend.username!} />
                            <AvatarFallback>{friend.username?.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col items-baseline gap-0.5">
                            <span className="text-sm">{friend.name}</span>
                            <span className="text-sm text-zinc-400">Offline</span>
                          </div>
                        </div>
                        <div className="flex z-50 items-center gap-2.5 mr-3 text-zinc-400">
                          <button
                            className={`rounded-full cursor-pointer p-2 ${hoverButtons ? "bg-zinc-900" : ""}`}
                            onClick={() => handleNavegation(friend.id)}
                          >
                            <MessageCircle size={20} className="hover:text-white" />
                          </button>
                          <div className="">
                            <button
                              className={`rounded-full cursor-pointer p-2 ${hoverButtons ? "bg-zinc-900" : ""}`}
                              onClick={toggleMenu}>
                              <EllipsisVertical size={20} className="hover:text-white" />
                            </button>

                            {menu && (
                              <MenuOptions modalRef={modalRef} />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
            )}

            {error && (
              <ErrorMenssage error={error.message} />
            )}

            <Separator />
          </div>
        </div>
      </div>
    </div>
  );
}

const MenuOptions = ({ modalRef }: { modalRef: Ref<HTMLDivElement> | undefined }) => {

  const optIonsButtons = [
    {
      id: 1,
      label: "Iniciar chamada de video",
      onchange: () => { }
    },
    {
      id: 2,
      label: "Iniciar chamada de voz",
      onchange: () => { }
    },
    {
      id: 3,
      label: "Desfazer amizade",
      type: "delete",
      onchange: () => { }
    }
  ]

  return (
    <div className="w-[210px] h-36 bg-zinc-800 border rounded-md z-50 absolute" ref={modalRef}>
      <div className="flex flex-col w-full p-2 gap-2.5">
        {optIonsButtons.map((btn) => (
          <Button
            variant="ghost"
            key={btn.id}
            className={`w-full flex items-baseline justify-baseline hover:bg-zinc-700 ${btn.type === "delete" ? "text-red-500" : ""}`}>
            {btn.label}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default DetailsFriends;