"use client";

import LoadingScreen from "@/components/loadingScree";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { MessageCirclePlus, Users } from "lucide-react";
import { useState } from "react";
import PendingFriends from "./pending-friends";
import DetailsFriends from "./render-list-friends";

const buttons = [
  {
    id: 1,
    label: "Todos",
    onChange: () => { }
  },
  {
    id: 2,
    label: "Pendente",
    onChange: () => { }
  },
  {
    id: 3,
    label: "Adicionar amigo",
    type: "news",
    onChange: () => { }
  }
]

const Me = () => {
  const { userId, isLoaded } = useAuth();
  const [tabs, setTabs] = useState(1)

  if (isLoaded) {
    <LoadingScreen />
  }

  return (
    <div className="flex w-full h-full">
      <div className="flex-1 w-full h-full flex flex-col bg-zinc-900">
        <div className="w-full flex items-center justify-between text-zinc-400 border-b px-6 p-3">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-3">
              <Users size={20} />
              <span className="text-white">Amigos</span>
              <div className="w-1 h-1 bg-zinc-600 rounded-full"></div>
              <div className="flex items-center gap-2 cursor-pointer">
                {buttons.map((btn) => (
                  <Button
                    key={btn.id}
                    onClick={() => {
                      setTabs(btn.id)
                      btn.onChange()
                    }}
                    variant={btn.type === 'news' ? "discord" : "ghost"}
                    className={`${tabs === btn.id ? "bg-zinc-800/40 border" : ""}`}>
                    {btn.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="">
            <button className="cursor-pointer flex items-center justify-center hover:bg-zinc-500/10 rounded-full w-8 h-8">
              <MessageCirclePlus size={18} />
            </button>
          </div>
        </div>
        {tabs === 1 ? (
          <DetailsFriends userId={userId!} />
        ) : tabs === 2 ? (
          <PendingFriends userId={userId!} />
        ) : null}
      </div>
      <div className="w-[360px] border-l bg-[#212125]">
        <div className="p-3 mt-2.5">
          <h1 className="text-[1.2rem] font-semibold">Ativo agora</h1>
          <div className="flex items-center justify-center flex-col mt-3 p-4">
            <span className="font-semibold">
              Por enquanto, está quieto...
            </span>
            <span className="text-zinc-400 text-sm text-center">
              Quando um(a) amigo(a) começa uma atividade, como jogar um jogo ou bater papo por voz, mostraremos aqui!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Me;