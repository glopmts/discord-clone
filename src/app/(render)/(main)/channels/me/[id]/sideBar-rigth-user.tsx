import DetailsFriendsModal from "@/components/modals/user-directmessages-modal";
import { Button } from "@/components/ui/button";
import InforUserImage from "@/components/user/infor-user-image";
import useDominantColor from "@/hooks/useDominantColor";
import { formatDateComplete } from "@/utils/formatDate";
import { User } from "@prisma/client";
import { UserCheck } from "lucide-react";
import { useState } from "react";

type UserProps = {
  friends: User;
};

const SideBarRightUser = ({ friends }: UserProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dominantColor = useDominantColor(friends?.image!);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className="w-[350px] flex flex-col justify-between h-full bg-zinc-400/20 dark:bg-[#2b2d31] border-l border-zinc-400 dark:border-[#1e1f22] flex-shrink-0 overflow-y-auto">
        <div className="">
          <div
            className="w-full h-32 relative"
            style={{ backgroundColor: dominantColor }}
          ></div>
          <div className="absolute top-2 right-2">
            <Button className="dark:bg-[#1e1f22] bg-zinc-400/30/80 w-8 h-8 rounded-full hover:dark:bg-[#1e1f22] bg-zinc-400/30 cursor-pointer">
              <UserCheck size={18} />
            </Button>
          </div>
          <div className="relative px-4 pb-4">
            <div className="flex flex-col -mt-14">
              <InforUserImage
                image={friends?.image!}
                username={friends?.username!}
                isOnline={friends?.isOnline!}
              />
              <div className="flex flex-col mt-3">
                <span className="text-lg font-semibold text-black dark:text-white">{friends?.name}</span>
                <span className="text-sm dark:text-gray-400 text-zinc-500">@{friends?.username}</span>
              </div>
            </div>

            <div className="mt-6 dark:bg-[#1e1f22] bg-zinc-400/30 rounded-lg p-4">
              <h3 className="text-sm font-semibold dark:text-gray-400 text-zinc-500 mb-2">SOBRE MIM</h3>
              <p className="text-xs dark:text-gray-200 text-zinc-600">
                {friends?.description || "Nenhuma descrição fornecida."}
              </p>

              <div className="mt-6 pt-4 border-t border-[#3f4248]">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm dark:text-gray-400 text-zinc-500">Membro desde</p>
                    <p className="text-xs dark:text-gray-200 text-zinc-600">
                      {formatDateComplete(new Date(friends?.createdAt || ""))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-zinc-700 w-full flex items-center justify-center">
          <button className="w-full cursor-pointer text-center dark:text-zinc-300 text-zinc-500 dark:hover:text-zinc-100 hover:text-zinc-900 py-2 text-sm font-semibold transition-colors duration-200" onClick={handleMenuToggle}>
            <span>Ver Perfil Completo</span>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <DetailsFriendsModal
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          selectId={friends.clerk_id!}
        />
      )}
    </>
  );
}

export default SideBarRightUser;