"use client";

import { getChannelId } from "@/app/actions/channels";
import { expelsMember } from "@/app/actions/member-servers";
import { deleteMessage } from "@/app/actions/menssagens";
import { geServer } from "@/app/actions/servers";
import MemberServer from "@/components/infor-bar/member-server";
import InputMenssagens from "@/components/servers/messages/input-menssagens";
import RenderMessagens from "@/components/servers/messages/message-content-render";
import { ScrollArea } from "@/components/ui/scroll-area";
import { socket } from "@/services/socket-io";
import { MessageProps } from "@/types/interfaces";
import { formatMessageDate } from "@/utils/formatDate";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { Dot, Hash, Loader } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import HeaderChannels from "./components/header-channels";

const Channels = () => {
  const { userId } = useAuth();

  const searchParams = useSearchParams();
  const id = searchParams.get("chaId");
  const serverId = searchParams.get("id");

  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [memBersList, setListMembers] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [realTimeMessages, setRealTimeMessages] = useState<MessageProps[]>([]);

  const {
    data: channel,
    isLoading,
    error,
    refetch: refreshChannel
  } = useQuery({
    queryKey: ["channelId", id],
    queryFn: () => getChannelId(id!),
    staleTime: 0
  });

  const {
    data: server,
    isLoading: loaderServer,
  } = useQuery({
    queryKey: ["server", serverId],
    queryFn: () => geServer(serverId!),
  });


  useEffect(() => {
    if (id) {
      setRealTimeMessages([]);
      socket.emit('join_channel_room', id);
    }

    return () => {
      if (id) {
        socket.emit('leave_channel_room', id);
      }
    };
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setRealTimeMessages([]);
        await refreshChannel();
      }
    };

    fetchData();
  }, [id, refreshChannel]);

  useEffect(() => {
    const handleNewMessage = (newMessage: MessageProps) => {
      setRealTimeMessages(prev => [...prev, newMessage]);
      if (isAtBottom) {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    };

    socket.on('new_chat_message', handleNewMessage);

    return () => {
      socket.off('new_chat_message', handleNewMessage);
    };
  }, [isAtBottom]);


  const handleSendMessage = async () => {
    if (!messageInput.trim() || !id || !userId) return;

    try {
      const newMessage = await new Promise<MessageProps>((resolve, reject) => {
        socket.emit(
          'send_chats_message',
          {
            content: messageInput,
            userId: userId,
            channelId: id
          },
          (response: MessageProps | { error: string }) => {
            if ('error' in response) {
              reject(response.error);
            } else {
              resolve(response);
            }
          }
        );
      });

      setMessageInput("");
      setRealTimeMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast.error(typeof error === 'string' ? error : 'Erro ao enviar mensagem');
    }
  };

  useEffect(() => {
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [realTimeMessages, isAtBottom]);

  const handleScroll = () => {
    if (scrollAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
      const threshold = 50; // pixels from bottom
      setIsAtBottom(scrollHeight - (scrollTop + clientHeight) < threshold);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setIsAtBottom(true);
  };

  const channelMessages = channel?.messages || [];
  const allMessages = Array.from(
    new Map([...channelMessages, ...realTimeMessages].map(m => [m.id, m])).values()
  );

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(userId!, messageId);
      setRealTimeMessages(prev => prev.filter(msg => msg.id !== messageId));
      await refreshChannel();
    } catch (error) {
      console.error("Erro ao deletar mensagem:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao deletar mensagem!");
    }
  };

  const handleListMembers = () => {
    setListMembers(prev => !prev)
  }

  const handleExpulseMember = async (memberId: string) => {
    const confirmExit = window.confirm("Deseja continuar com esta ação?");
    if (!confirmExit) return;

    try {
      const result = await expelsMember(userId!, memberId, serverId!)
      if (result.success) {
        toast.success(result.message);
        refreshChannel();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Erro ao expulsar membro" + error)
    }
  }

  const groupedMessages = allMessages.reduce((acc, message) => {
    const messageDate = new Date(message.createdAt)
    const dateKey = formatMessageDate(messageDate)

    if (!acc[dateKey]) {
      acc[dateKey] = []
    }

    acc[dateKey].push(message)
    return acc
  }, {} as Record<string, typeof allMessages>)

  return (
    <div className="w-full h-full flex flex-col bg-[#1A1A1E]">
      <div className="p-2 w-full h-full flex flex-col">
        {/* header */}
        <HeaderChannels
          memBersList={memBersList}
          error={error?.message}
          name={channel?.name || "No name"}
          handleListMembers={handleListMembers}
        />

        <div className="flex w-full h-full relative overflow-hidden">
          <div className="flex flex-col w-full relative">
            <div className="h-[80px] relative"></div>
            {/* Área de mensagens com scroll */}
            <div className="flex-1 overflow-hidden h-full p-2 relative">
              {!isAtBottom && (
                <button
                  onClick={scrollToBottom}
                  className="absolute bottom-20 right-6 bg-[#404249] hover:bg-[#4e5058] text-white rounded-full p-2 z-10 shadow-lg transition-all"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M16.59 8.59L12 13.17L7.41 8.59L6 10l6 6l6-6l-1.41-1.41z" fill="currentColor" />
                  </svg>
                </button>
              )}

              <ScrollArea
                className="h-full w-full pr-4"
                ref={scrollAreaRef}
                onScroll={handleScroll}
              >
                <div className="flex flex-col gap-4 pb-4">
                  {/* Conteúdo de boas-vindas */}
                  <div className="flex flex-col gap-4 pt-4">
                    <div className="rounded-full bg-[#41434a] p-4 w-16 h-16 flex items-center justify-center">
                      <Hash size={33} className="text-[#949ba4]" />
                    </div>
                    <div className="flex items-center">
                      <h1 className="font-semibold text-2xl text-white">Bem-vindo(a) a # 💬</h1>
                      <Dot size={36} />
                      <span className="font-semibold text-2xl truncate text-white">{channel?.name}</span>
                    </div>
                  </div>

                  <div className="text-[#b5bac1] flex items-center text-sm">
                    <p>Este é o começo do canal # 💬 </p>
                    <Dot size={36} />
                    <span>{channel?.name}</span>
                  </div>

                  {/* render mensagens chat */}
                  <div className="mb-8">
                    {isLoading ? (
                      <div className="w-full text-zinc-400">
                        <span className="animate-pulse text-center text-base">Carregando menssagens...</span>
                      </div>
                    ) : (
                      Object.entries(groupedMessages).map(([date, messages]) => (
                        <div key={date}>
                          <div className="flex w-full relative my-4">
                            <div className="z-[99] flex items-center justify-center w-full">
                              <div className="w-full h-0.5 bg-[#3f4248]"></div>
                              <span className="flex w-[250px] items-center justify-center text-xs text-zinc-400 px-2">
                                {date}
                              </span>
                              <div className="w-full h-0.5 bg-[#3f4248]"></div>
                            </div>
                          </div>

                          <RenderMessagens
                            allMessages={messages as any}
                            messagesEndRef={messagesEndRef}
                            handleDeleteMessage={handleDeleteMessage}
                            currentUserId={userId!}
                            server={server!}
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </ScrollArea>
            </div>

            {/* Área de input de mensagem */}
            <InputMenssagens
              type="absolute"
              name={channel?.name}
              messageInput={messageInput}
              handleSendMessage={handleSendMessage}
              setMessageInput={setMessageInput}
            />
          </div>

          {/* Lista de membros */}
          {memBersList && (
            <div className="w-[240px] h-full border-l px-1">
              <ScrollArea className="flex-1 w-full h-32 mb-15">
                {loaderServer ? (
                  <div className="w-full h-28 flex items-center justify-center">
                    <Loader size={28} className="animate-spin text-[#949ba4]" />
                  </div>
                ) : (
                  <MemberServer
                    server={server!}
                    currentUserId={userId!}
                    handleExpulseMember={handleExpulseMember}
                  />
                )}
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Channels;