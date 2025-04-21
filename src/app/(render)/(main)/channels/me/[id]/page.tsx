"use client";

import { getMessagesFriends } from "@/app/actions/menssagens";
import { getServersByUserId } from "@/app/actions/servers";
import { deleteMessageFriends, getUserById } from "@/app/actions/user";
import { IconBar } from "@/components/icons/IcnonsListFriends";
import LoadingScreen from "@/components/loadingScreen";
import InputMenssagens from "@/components/servers/messages/input-menssagens";
import RenderMessagens from "@/components/servers/messages/message-content-render";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { socket } from "@/services/socket-io";
import { formatMessageDate } from "@/utils/formatDate";
import { useAuth } from "@clerk/nextjs";
import { MessageFriends } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import SideBarRightUser from "./sideBar-rigth-user";


const ChatFriends = () => {
  const { userId } = useAuth();
  const { id } = useParams<{ id: string; }>();
  const [isOpen, setOpen] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [realTimeMessages, setRealTimeMessages] = useState<MessageFriends[]>([]);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const queryClient = useQueryClient();

  const {
    data: friends,
    isLoading,
  } = useQuery({
    queryKey: ["userMessages", id],
    queryFn: () => getUserById(id!),
  });

  const {
    data: currentUserServers,
    isLoading: isLoadingCurrentUserServers
  } = useQuery({
    queryKey: ["currentUserServers", userId],
    queryFn: () => getServersByUserId(userId!),
    enabled: !!userId
  });

  const friendsClerck = friends?.clerk_id
  const friendId = friends?.clerk_id

  const {
    data: friendServers,
    isLoading: isLoadingFriendServers
  } = useQuery({
    queryKey: ["friendServers", friendsClerck],
    queryFn: () => getServersByUserId(friendsClerck!),
    enabled: !!friendsClerck
  });

  const {
    data: messages,
    refetch: refetchMessages,
    isLoading: isLoadingMessages
  } = useQuery({
    queryKey: ["messages_friends", userId, friendsClerck],
    queryFn: () => getMessagesFriends(userId!, friendsClerck!),
    enabled: !!friendsClerck || !!userId
  });

  const findCommonServers = () => {
    if (!currentUserServers || !friendServers) return [];

    return currentUserServers.filter((server: any) =>
      friendServers.some((friendServer: any) => friendServer.id === server.id)
    );
  };

  const commonServers = findCommonServers();

  useEffect(() => {
    if (userId) {
      socket.emit('join_user_room', userId);
    }

    return () => {
      if (userId) {
        socket.emit('leave_user_room', userId);
      }
    };
  }, [userId]);

  useEffect(() => {
    const handleNewMessage = (newMessage: MessageFriends) => {
      setRealTimeMessages(prev => {
        const isDuplicate = prev.some(msg =>
          msg.content === newMessage.content &&
          new Date(msg.createdAt).getTime() === new Date(newMessage.createdAt).getTime()
        );

        if (!isDuplicate) {
          return [...prev, newMessage];
        }
        return prev;
      });
    };

    socket.on('new_friend_message', handleNewMessage);

    return () => {
      socket.off('new_friend_message', handleNewMessage);
    };
  }, []);


  const handleSendMessage = async () => {
    if (!messageInput.trim() || !friendId || !userId) return;

    setMessageInput("");

    try {
      const newMessage = await socket.emitWithAck('send_friend_message', {
        content: messageInput,
        sendId: userId,
        receivesId: friendId
      });

      queryClient.setQueryData(
        ["messages_friends", userId, friendsClerck],
        (old: MessageFriends[] | undefined) => [...(old || []), newMessage]
      );
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };


  const allMessages = useMemo(() => {
    const combined = [...(messages || []), ...(realTimeMessages || [])];

    const uniqueMessages = combined.reduce((acc, current) => {
      if (!acc.some(msg => msg.id === current.id)) {
        acc.push(current);
      }
      return acc;
    }, [] as MessageFriends[]);

    return uniqueMessages.sort((a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [messages, realTimeMessages]);

  const groupedMessages = allMessages.reduce((acc, message) => {
    const messageDate = new Date(message.createdAt)
    const dateKey = formatMessageDate(messageDate)

    if (!acc[dateKey]) {
      acc[dateKey] = []
    }

    acc[dateKey].push(message)
    return acc
  }, {} as Record<string, typeof allMessages>)


  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    if (isAtBottom) {
      scrollToBottom();
    }

    const lastMessage = allMessages[allMessages.length - 1];
    if (lastMessage?.sendId === userId) {
      scrollToBottom();
    }
  }, [allMessages, isAtBottom, userId]);

  const handleScroll = () => {
    if (scrollAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
      const threshold = 50;
      setIsAtBottom(scrollHeight - (scrollTop + clientHeight) < threshold);
    }
  };


  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessageFriends(userId!, messageId);
      setRealTimeMessages(prev => prev.filter(msg => msg.id !== messageId));
      await refetchMessages();
    } catch (error) {
      console.error("Erro ao deletar mensagem:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao deletar mensagem!");
    }
  }

  const handleMenuInfor = () => {
    setOpen(prev => !prev);
  };

  const handleVoiceCall = () => {
    console.log("Chamada de voz iniciada");
  };

  const handleVideoCall = () => {
    console.log("Chamada de vídeo iniciada");
  };


  if (isLoading || isLoadingMessages) {
    return <LoadingScreen />;
  }

  return (
    <div className="w-full h-full overflow-hidden dark:bg-[#1A1A1E] bg-background text-gray-100">
      {/* Header */}
      <div className="w-full sticky top-0 z-50 dark:bg-[#1A1A1E] bg-background shadow-sm">
        <div className="flex justify-between items-center px-4 py-2 border-b border-zinc-400 dark:border-[#1e1f22] w-full">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 rounded-full">
              <AvatarImage src={friends?.image!} alt={friends?.username!} />
              <AvatarFallback className="bg-[#5865f2] text-white">
                {friends?.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-zinc-700 text-base dark:text-gray-100">{friends?.name}</span>
              <span className="text-xs text-gray-400">{friends?.isOnline || "Offline"}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <IconBar
                onVoiceCall={handleVoiceCall}
                onVideoCall={handleVideoCall}
                onUserInfo={handleMenuInfor}
                className="text-gray-400 dark:hover:text-gray-200"
              />
            </div>
            <div className="w-[180px] relative">
              <Input
                placeholder="Buscar..."
                className="w-full h-8 dark:bg-[#1e1f22] bg-zinc-400/30 text-sm border-none focus-visible:ring-0 text-gray-200 placeholder:text-gray-400"
              />
              <Search size={16} className="absolute top-2 right-2.5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 w-full overflow-hidden h-[calc(100vh-80px)]">
        <div className={`flex flex-col flex-1 overflow-hidden ${isOpen ? "w-[calc(100%-350px)]" : "w-full"}`}>
          <div className="flex flex-col w-full h-full p-4 overflow-hidden">
            <ScrollArea
              className="h-full w-full pr-4"
              ref={scrollAreaRef}
              onScroll={handleScroll}
            >
              <div className="flex flex-col gap-4  pb-8">
                {/* Friend Profile */}
                <div className="mt-4 flex flex-col">
                  <Avatar className="w-20 h-20 dark:bg-[#1e1f22] bg-zinc-400/30 p-0.5 rounded-full border-4 border-zinc-400 dark:border-[#1e1f22]">
                    <AvatarImage className="rounded-full object-cover" src={friends?.image!} alt={friends?.username!} />
                    <AvatarFallback className="bg-[#5865f2] text-white">
                      {friends?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col mt-3">
                    <span className="font-semibold text-xl text-gray-100">{friends?.name}</span>
                    <span className="text-sm text-gray-400">@{friends?.username}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 mt-4 text-center">
                    <span>Este é o começo do seu histórico de mensagens diretas com</span>
                    <span className="font-semibold dark:text-gray-200">{friends?.name}.</span>
                  </div>
                </div>

                {/* Common Servers */}
                <div className="w-full max-w-[600px] mt-3">
                  {isLoadingCurrentUserServers || isLoadingFriendServers ? (
                    <div className="flex justify-center">
                      <span className="text-sm text-gray-400">Carregando servidores em comum...</span>
                    </div>
                  ) : commonServers.length > 0 ? (
                    <div className="bg-[#2b2d31] rounded-lg p-3">
                      <h3 className="text-xs font-semibold text-gray-400 mb-2">SERVIDORES EM COMUM</h3>
                      <div className="flex flex-col gap-1">
                        {commonServers.map(server => (
                          <div key={server.id} className="flex items-center gap-2 p-2 hover:bg-[#35373c] rounded-md cursor-pointer">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={server.image!} />
                              <AvatarFallback className="bg-[#5865f2] text-white">
                                {server.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400">
                      Nenhum servidor em comum
                    </div>
                  )}
                </div>

                {/* Messages */}
                <div className="w-full">
                  {Object.entries(groupedMessages).map(([date, messages]) => (
                    <div key={date} className="mb-6 w-full">
                      <div className="flex w-full relative my-4">
                        <div className="z-[99] flex items-center justify-center w-full">
                          <div className="w-full h-0.5 bg-[#3f4248]"></div>
                          <span className="flex w-[450px] items-center justify-center text-xs text-zinc-400 px-2">
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
                      />
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Message Input */}
          <div className="sticky -bottom-1 dark:bg-[#1A1A1E] bg-background p-4 pt-0">
            <InputMenssagens
              name={friends?.name || "user"}
              messageInput={messageInput}
              handleSendMessage={handleSendMessage}
              setMessageInput={setMessageInput}
            />
          </div>
        </div>

        {/* User Info Panel */}
        {isOpen && (
          <SideBarRightUser friends={friends!} />
        )}
      </div>
    </div>
  );
}

export default ChatFriends;