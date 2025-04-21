"use client";

import { geServerCode, joinServer } from "@/app/actions/servers";
import { getUserByClerkId } from "@/app/actions/user";
import LoadingScreen from "@/components/loadingScreen";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { Loader, Settings } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function ConviteClient() {
  const { id } = useParams<{ id: string; }>()
  const { userId, isLoaded } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadCreate, setIsLoadCreate] = useState(false);
  const router = useRouter()

  const [server, setServer] = useState({
    serverId: "",
    name: "",
    image: "",
    members: 0,
    channels: [] as { id: string }[]
  });

  const [user, setUser] = useState({
    name: "",
    image: "",
  });

  useEffect(() => {
    const fetchServerData = async () => {
      try {
        const res = await geServerCode(id);
        setServer({
          serverId: res?.id || "",
          name: res?.name || "",
          image: res?.image || "",
          members: res?.members.length || 0,
          channels: res?.channels || []
        });
      } catch (error) {
        console.error("Failed to fetch server data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchServerData();
    }
  }, [id]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const res = await getUserByClerkId(userId);
          setUser({
            name: res?.name || "",
            image: res?.image || "",
          });
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    if (isLoaded) {
      fetchUserData();
    }
  }, [userId, isLoaded]);


  const handleJoin = async () => {
    if (!userId || !server.serverId) return;
    setIsLoadCreate(true);

    try {
      const result = await joinServer(userId, server.serverId);
      if (result.success) {
        alert("Você entrou no servidor com sucesso!");
        const firstChannelId = server.channels[0]?.id;
        if (firstChannelId) {
          router.push(`/channels/?id=${server.serverId}&chaId=${firstChannelId}`);
        } else {
          router.push(`/channels/?id=${server.serverId}`);
        }
      }
    } catch (error) {
      console.error("Erro ao entrar no servidor:", error);
      setIsLoadCreate(false);
    } finally {
      setIsLoadCreate(false);
    }
  }


  return (
    <div className="w-full h-screen">
      {isLoading ? (
        <div className="w-full h-full">
          <LoadingScreen />
        </div>
      ) : (
        <div className="w-full h-full px-6 py-4" style={{ backgroundImage: "url('/images/backgroundAuth.svg')", backgroundSize: 'cover' }}>
          <div className="flex items-center gap-2">
            <Image src="/images/discord-white.png" alt="Logo" width={40} height={40} />
            <h2 className="font-semibold text-xl text-white">Discord Clone</h2>
          </div>

          <div className="w-full h-full flex items-center justify-center">
            <div className="w-[460px] h-[405px] bg-background rounded-[8px] dark:bg-[#323339] flex flex-col justify-between">
              <div className="flex items-center justify-center flex-col gap-0.5 p-4">
                <div className="flex items-center justify-center">
                  <Avatar className={cn("w-17 h-17 border")}>
                    <AvatarImage src={user.image} />
                    <AvatarFallback>
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="mt-1 flex flex-col items-center gap-1.5">
                  <span className="dark:text-zinc-400 text-zinc-500 font-semibold">Convidou você para se ajuntar</span>
                  <div className="flex items-center gap-1.5">
                    <Avatar className={cn("w-10 h-10 border rounded-md")}>
                      <AvatarImage src={server.image} />
                      <AvatarFallback>
                        {server.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="">
                      <h2 className="font-semibold text-xl">{server.name}</h2>
                    </div>
                  </div>
                  <div className="mt-0.5 flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <div className="bg-green-600 w-2 h-2 rounded-full"></div>
                      <span className="dark:text-zinc-300 text-sm">{0} online</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="bg-zinc-300 w-2 h-2 rounded-full"></div>
                      <span className="dark:text-zinc-300 text-sm">{server.members} membros</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 w-[380px]">
                  <div className="h-21 flex items-center px-4 rounded-[8px] bg-zinc-300 border dark:bg-zinc-700">
                    <div className="flex items-center gap-2 dark:text-zinc-300">
                      <div className="p-2 dark:bg-zinc-800 bg-zinc-400 rounded-full">
                        <Settings size={23} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">CONFIGURAÇÕES DO SERVIDOR</span>
                        <span className="text-sm">Você pode personalizar isso a qualquer momento</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex items-center justify-center p-4">
                <button className={`w-[380px] text-white rounded-[8px] p-2 bg-[#4d5dd1] ${isLoadCreate ? "opacity-35 cursor-default" : "cursor-pointer hover:bg-[#4654c0bd] transition-all"}`} disabled={isLoadCreate || isLoading} onClick={handleJoin}>
                  <span className="w-full text-center flex items-center justify-center">
                    {isLoadCreate ? <Loader size={20} className="animate-spin" /> : "Aceitar convite"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
