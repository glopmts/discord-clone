"use client"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useAuth } from "@clerk/nextjs"
import { User } from "@prisma/client"
import { LogOut, Search, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ModeToggle } from "../theme-button"
import { Separator } from "../ui/separator"
import { ProfileModal } from "./ProfileModal"
import { getLinksNavegation } from "./details-props"
import StatusBar from "./status-bar-user"

type ModalConfig = {
  isOpen?: boolean;
  userId: string;
  onClose: () => void;
  user: User | null;
  isOnline: boolean;
}

const InterfacePageConfigs = ({ onClose, userId, user, isOnline }: ModalConfig) => {
  const { signOut } = useAuth();
  const [activeItem, setActiveItem] = useState(1);
  const [isPerfil, setPerfil] = useState(true);
  const [activeTab, setActiveTab] = useState("seguranca")
  const router = useRouter();

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName)
  }

  const handlePerfil = () => {
    setPerfil(!isPerfil);
  }

  const handleSIgnOut = () => {
    signOut();
    router.push("/login")
  }

  const linksNavegation = getLinksNavegation({ handlePerfil });

  return (
    <div className="fixed flex items-center inset-0 w-full h-full bg-background z-[999] dark:bg-[#202024]">
      {/* Sidebar */}
      <div className="w-[486px] h-full dark:bg-[#121214] border-r  bg-background border-zinc-800 overflow-y-auto">
        <div className="p-7 flex flex-col justify-end items-end">
          <div className="relative mb-4 mt-4">
            <Input
              placeholder="Buscar"
              className="dark:bg-[#1e1f22] border h-8 pl-2 pr-8 text-sm rounded-sm text-zinc-300 placeholder:text-zinc-500 focus-visible:ring-0"
            />
            <Search size={16} className="text-zinc-400 absolute top-2 bottom-0 right-2" />
          </div>

          <div className="w-[200px]">
            <h2 className="text-zinc-500 font-medium text-xs mb-2 px-2">CONFIGURAÇÕES DE USUÁRIO</h2>
            <div className="flex flex-col">
              {linksNavegation.map((nav) => (
                <button
                  key={nav.id}
                  onClick={() => {
                    setActiveItem(nav.id)
                    nav.onChange()
                  }}
                  className={cn(
                    "text-left py-1.5 px-2 rounded text-sm font-medium transition-colors",
                    activeItem === nav.id
                      ? "bg-[#36373d] text-white"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800",
                  )}
                >
                  {nav.label}
                </button>
              ))}
            </div>
            <Separator className="mt-2" />
            <div className="mt-3">
              <h2 className="text-zinc-500 font-medium text-xs mb-2 px-2">CONFIG. DO APLICATIVO</h2>
              <div className="p-2">
                <span className="mb-3 text-zinc-400 font-semibold">Aparência</span>
                <ModeToggle />
              </div>
            </div>
            <Separator className="mt-2" />
            <div className="mt-3">
              <button className="text-zinc-400 flex items-center justify-between w-full dark:hover:bg-zinc-800 rounded-[8px] p-1 hover:bg-zinc-500/30" onClick={handleSIgnOut}>
                <span>sair</span>
                <LogOut size={14} />
              </button>
            </div>
            <Separator className="mt-2" />
          </div>
        </div>
      </div>

      <div className="w-[740px] h-full dark:bg-[#202024]  bg-background overflow-y-auto p-4">
        <div className="p-6">
          <div className="">
            <div className="flex items-start justify-between mb-6">
              <h2 className="font-semibold text-xl text-white">Minha conta</h2>
              <button className="flex items-center cursor-pointer gap-0.5 flex-col hover:text-white" onClick={onClose}>
                <div className="border rounded-full p-1 hover:bg-zinc-800">
                  <X size={20} className="text-zinc-500" />
                </div>
                <span className="text-zinc-500 text-xs hover:text-white">ESC</span>
              </button>
            </div>
          </div>

          <div className="mt-4">
            <div className="">
              {activeItem === 1 && (
                <div className="w-full h-full">
                  <div className="flex items-center gap-8">
                    <button className="cursor-pointer relative" onClick={() => handleTabChange("seguranca")}>
                      <span
                        className={`font-semibold ${activeTab === "seguranca" ? "text-blue-500 hover:text-white" : "text-zinc-400 hover:text-zinc-200"}`}
                      >
                        Segurança
                      </span>
                      <div className={`w-20 h-1 -bottom-[14px] z-20 absolute rounded-r-2xl rounded-l-2xl ${activeTab === "seguranca" ? " border-b-3 border-blue-500" : ''}`}></div>
                    </button>
                    <button className="cursor-pointer relative" onClick={() => handleTabChange("status")}>
                      <span
                        className={`font-semibold ${activeTab === "status" ? "text-blue-500 hover:text-white" : "text-zinc-400 hover:text-zinc-200"}`}
                      >
                        Status
                      </span>
                      <div className={`w-10 h-1 -bottom-[14px] z-20 absolute rounded-r-2xl rounded-l-2xl ${activeTab === "status" ? " border-b-3 border-blue-500" : ''}`}></div>
                    </button>
                  </div>
                  <div className="mt-3 mb-8 relative">
                    <div className="w-full h-0.5 bg-zinc-700 relative"></div>
                  </div>
                  {activeTab === "seguranca" && (
                    <div className="">
                      <ProfileModal isOnline={isOnline} user={user!} />
                    </div>
                  )}
                  {activeTab === "status" && (
                    <div className="w-full">
                      <StatusBar username={user?.username!} userImage={user?.image!} status="ok" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InterfacePageConfigs;
