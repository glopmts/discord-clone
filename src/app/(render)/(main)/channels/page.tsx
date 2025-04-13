"use client";

import { getChannelId } from "@/app/actions/channels";
import RenderMessagens from "@/components/servers/messages/message-content-render";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { MessageProps } from "@/types/interfaces";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { Bell, Dot, Gift, Hash, Laugh, Pin, PlusCircle, Search, Sticker, Users } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const Channels = () => {
  const { userId } = useAuth();
  const searchParams = useSearchParams();
  const id = searchParams.get("chaId");

  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [realTimeMessages, setRealTimeMessages] = useState<MessageProps[]>([]);

  const {
    data: channel,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["channelId", id],
    queryFn: () => getChannelId(id!),
  });

  useEffect(() => {
    if (!id) return;

    const eventSource = new EventSource(`/api/sse?channelId=${id}`);
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setRealTimeMessages((prev) => [...prev, data]);
    };

    return () => {
      eventSource.close();
    };
  }, [id]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [realTimeMessages]);


  const handleSendMessage = async () => {
    if (!messageInput.trim() || !id || !userId) return;

    await fetch("/api/messages", {
      method: "POST",
      body: JSON.stringify({
        content: messageInput,
        userId,
        channelId: id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    refetch();
    setMessageInput("");
  };

  const channelMessages = channel?.messages || [];
  const allMessages = Array.from(
    new Map([...channelMessages, ...realTimeMessages].map(m => [m.id, m])).values()
  );

  return (
    <div className="w-full h-full flex flex-col bg-zinc-900">
      <div className="p-2 w-full h-full flex flex-col">
        {/* header */}
        <div className="px-2">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1.5">
              <Hash size={20} className="text-zinc-500" />
              <div className="flex items-center gap-1.5">
                💬 <Dot size={16} /> <span className="truncate">{channel?.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-3.5">
              <Bell size={18} className="text-zinc-400" />
              <Pin size={18} className="text-zinc-400" />
              <Users size={18} className="text-zinc-400" />
              <div className="w-[180px] relative ml-4">
                <Input placeholder="Buscar..." className="relative w-full h-8 dark:bg-zinc-900" />
                <Search size={18} className="absolute top-1.5 right-3 text-zinc-400" />
              </div>
            </div>
          </div>
          {error && (
            <div className="text-center text-base mb-4 mt-4 font-semibold text-red-600">
              {error.message}
            </div>
          )}
          <Separator className="bg-zinc-800 h-0.5 mt-3" />
        </div>

        <div className="h-[180px]"></div>

        {/* conteúdo principal (cresce para ocupar espaço disponível) */}
        <div className="flex-1 overflow-hidden p-2">
          <ScrollArea className="h-full w-full">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                <div className="rounded-full bg-zinc-700 p-4 w-16 h-16 flex items-center justify-center">
                  <Hash size={33} />
                </div>
                <div className="flex items-center">
                  <h1 className="font-semibold text-2xl">Bem-vindo(a) a # 💬</h1>
                  <Dot size={36} />
                  <span className="font-semibold text-2xl truncate">{channel?.name}</span>
                </div>
              </div>

              <div className="text-zinc-400 flex items-center text-sm">
                <p>Este é o começo do canal # 💬 </p>
                <Dot size={36} />
                <span>{channel?.name}</span>
              </div>
              <Separator className="bg-zinc-800 h-0.5 mt-3" />

              {/* render menssagens chat */}

              <div className="">
                <RenderMessagens
                  allMessages={allMessages as any}
                  messagesEndRef={messagesEndRef}
                />
              </div>
            </div>
          </ScrollArea>
        </div>

        <div className="p-2">
          <div className="bg-zinc-900 rounded-lg">
            <div className="flex items-center justify-between bg-[#222327] p-1.5 px-4 border rounded-md">
              <div className="flex items-center w-full">
                <div className="mr-4 text-zinc-400">
                  <PlusCircle size={20} />
                </div>
                <Input
                  placeholder={`Conversar em # 💬 ${channel?.name}`}
                  className={cn("border-0 w-full dark:bg-input/0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0")}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
              </div>
              <div className="ml-4 text-zinc-400 flex items-center gap-3">
                <Gift size={20} />
                <Sticker size={20} />
                <Laugh size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Channels;