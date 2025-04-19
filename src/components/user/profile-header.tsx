"use client"

import { getUserDetails } from "@/app/actions/user"
import { UserIdProps } from "@/types/interfaces"
import { useQuery } from "@tanstack/react-query"
import { HeadphoneOff, HeadphonesIcon, Loader, Mic, MicOffIcon, Settings } from "lucide-react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import ModalUserDetails from "./details-user-modal"
import InterfacePageConfigs from "./Details-User-Screen"
import { AlertEditeProfile } from "./modal-edite-profile"

const ProfileHeader = ({ userId }: UserIdProps) => {

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserDetails(userId),
  })

  const [isMic, setMic] = useState(false);
  const [isHeadphone, setHeadphone] = useState(false);
  const [isModal, setModal] = useState(false);
  const [isScreen, setFullScreen] = useState(false);
  const [isModalEdite, setModalEdite] = useState(false);

  const createToggleHandler = (setter: React.Dispatch<React.SetStateAction<boolean>>, currentValue: boolean) => {
    return () => setter(!currentValue);
  }

  const handleMic = createToggleHandler(setMic, isMic);
  const handHeadphone = createToggleHandler(setHeadphone, isHeadphone);
  const handleModal = createToggleHandler(setModal, isModal);
  const handleFullScreen = createToggleHandler(setFullScreen, isScreen);

  const handleEditProfile = () => {
    setModalEdite(true);
    setModal(false);
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        Error: {error instanceof Error ? error.message : "Failed to load user"}
      </div>
    )
  }

  return (
    <>
      <div className="relative">
        <div className="w-[345px] h-[58px] bg-background dark:bg-[#1a1a1d] z-50 bottom-0 left-3 mb-2 border absolute rounded-[0.4rem] dark:border-zinc-800">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader size={20} className="animate-spin" />
            </div>
          ) : (
            <div className="flex items-center justify-between px-2 w-full h-full">
              <div className="flex items-center gap-2" onClick={handleModal}>
                <div className="relative">
                  <Avatar className="h-9 w-10 rounded-full relative">
                    <AvatarImage src={user?.image ?? "No image user"} alt="User avatar" />
                    <AvatarFallback>
                      {user?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute bottom-0 top-5 right-0 ${user?.isOnline ? "bg-green-500" : "bg-zinc-600"} border-2 border-zinc-900 p-1.5 rounded-full`}></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user?.name}</span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">Disponível</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant={isMic ? 'ghost' : 'micOffIcon'} onClick={handleMic} className="text-zinc-500 dark:text-zinc-400 hover:text-white hover:bg-zinc-400 dark:hover:bg-zinc-800 cursor-pointer">
                  {isMic ? <Mic size={28} /> : <MicOffIcon color="red" size={28} />}
                </Button>
                <Button variant={isHeadphone ? 'ghost' : 'micOffIcon'} onClick={handHeadphone} className="text-zinc-500 dark:text-zinc-400 hover:text-white hover:bg-zinc-400 dark:hover:bg-zinc-800 cursor-pointer">
                  {isHeadphone ? <HeadphonesIcon size={28} /> : <HeadphoneOff color="red" size={28} />}
                </Button>
                <Button variant="ghost" className="text-zinc-500 dark:text-zinc-400 hover:text-white hover:bg-zinc-400 dark:hover:bg-zinc-800 cursor-pointer" onClick={handleFullScreen}>
                  <Settings size={28} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {isModal && (
        <ModalUserDetails
          isOpen={isModal}
          onClose={() => setModal(false)}
          userId={userId}
          username={user?.username!}
          image={user?.image!}
          isOnline={user?.isOnline!}
          onEditProfile={handleEditProfile}
        />
      )}

      {isScreen && (
        <InterfacePageConfigs
          isOpen={isScreen}
          onClose={() => setFullScreen(false)}
          userId={userId}
          user={user!}
          isOnline={user?.isOnline!}
        />
      )}

      {isModalEdite && (
        <AlertEditeProfile
          isOpen={isModalEdite}
          user={user!}
          userId={userId!}
          refetch={refetch}
          onClose={() => setModalEdite(false)}
        />
      )}
    </>
  )
}

export default ProfileHeader;
