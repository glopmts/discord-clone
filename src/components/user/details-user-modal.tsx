import { ArrowRight, Edit2, IdCard, User } from "lucide-react";
import Image from "next/image";
import { FC, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

type UserModal = {
  userId: string;
  username: string;
  image?: string;
  onClose: () => void;
  isOpen: boolean;
  isOnline: boolean;
  onEditProfile: () => void;
}

const ModalUserDetails: FC<UserModal> = ({
  isOpen,
  onClose,
  userId,
  username,
  image,
  isOnline,
  onEditProfile
}) => {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node) && isOpen) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div ref={modalRef}
      className="dark:bg-zinc-800 bg-background shadow-md w-[300px] h-[457px] rounded-md absolute z-[500] flex items-center justify-center bottom-0 top-16 left-4">
      <div className="w-full h-full">
        <div className="overflow-hidden rounded-md relative">
          <div className="w-full h-24 bg-[#537BA2] relative"></div>
          <div className="p-3 z-[630] -top-12 relative">
            <div className="w-16 h-16 relative">
              {image ? (
                <Image src={image} alt={username} fill className="w-full h-full object-cover  rounded-full" />
              ) : (
                <div className="w-full h-full items-center justify-center">
                  <div className="w-full h-full flex items-center border-4 border-zinc-700 justify-center rounded-full bg-background dark:bg-zinc-900 text-center">
                    <span>{username?.charAt(0).toUpperCase()}</span>
                  </div>
                </div>
              )}
              <div className={`absolute bottom-0 right-0 ${isOnline ? "bg-green-500" : "dark:bg-zinc-800 bg-zinc-600 shadow-md"} border-2 border-zinc-700 p-2 rounded-full`}></div>
            </div>
            <div className="mt-2">
              <h2 className="font-semibold text-md">{username}</h2>
            </div>
            <div className="flex flex-col w-full border dark:bg-[#242425] p-2 rounded-md mt-2">
              <Button variant='ghost' className="flex items-center justify-start gap-2" onClick={onEditProfile}>
                <Edit2 size={20} className="text-neutral-400" />
                <span className="text-neutral-400">Editar perfil</span>
              </Button>
              <Separator />
              <Button variant='ghost' className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-green-600 rounded-full"></div>
                  <span className="text-neutral-400">Disponivel</span>
                </div>
                <ArrowRight size={16} className="text-neutral-400" />
              </Button>
            </div>
            <div className="flex flex-col w-full border dark:bg-[#242425] p-2 rounded-md mt-2">
              <Button variant='ghost' className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <User size={20} className="text-neutral-400" />
                  <span className="text-neutral-400">Mudar de conta</span>
                </div>
                <ArrowRight size={16} className="text-neutral-400" />
              </Button>
              <Separator />
              <Button variant='ghost' className="flex items-center justify-baseline left-2 w-full gap-2">
                <div className="flex items-center gap-2">
                  <IdCard size={20} className="text-neutral-400" />
                  <span className="text-neutral-400">Copiar ID usuário</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalUserDetails;