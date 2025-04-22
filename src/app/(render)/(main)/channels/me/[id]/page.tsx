"use client";

import { deleteMessageFriends } from "@/app/actions/user";
import InputMenssagens from "@/components/servers/messages/input-menssagens";
import RenderMessagens from "@/components/servers/messages/message-content-render";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMessagesFriends, userFriends, useServersByUserId, useUserMessages } from "@/hooks/me/chatFriendsHooks";
import { socket } from "@/services/socket-io";
import { formatMessageDate } from "@/utils/formatDate";
import { useAuth } from "@clerk/nextjs";
import { MessageFriends } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import ChatHeader from "../../components/chat-friends/ChatHeader";
import CommonServers from "../../components/chat-friends/CommonServers";
import FriendProfile from "../../components/chat-friends/FriendProfile";
import SideBarRightUser from "./sideBar-rigth-user";


const ChatFriends = () => {
  const { userId } = useAuth();
  const { id } = useParams<{ id: string; }>();

  const router = useRouter();
  const [isOpen, setOpen] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [realTimeMessages, setRealTimeMessages] = useState<MessageFriends[]>([]);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const queryClient = useQueryClient();


  //Get user data
  const { data: friends, isLoading } = useUserMessages(id!);

  const {
    data: currentUserServers,
    isLoading: isLoadingCurrentUserServers
  } = userFriends(userId!);

  const friendsClerck = friends?.clerk_id
  const friendId = friends?.clerk_id

  const {
    data: friendServers,
    isLoading: isLoadingFriendServers
  } = useServersByUserId(friendsClerck!);

  const {
    data: messages,
    refetch: refetchMessages,
    isLoading: isLoadingMessages
  } = useMessagesFriends(friendsClerck!, userId!);


  /// Find common servers between current user and friend
  const findCommonServers = () => {
    if (!currentUserServers || !friendServers) return [];

    return currentUserServers.filter((server: any) =>
      friendServers.some((friendServer: any) => friendServer.id === server.id)
    );
  };

  const commonServers = findCommonServers();

  /// Check if the user is in the same server as the friend
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

  /// Handle delete message
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


  const handleServerClick = useCallback((serverId: string, channelId: string) => {
    router.push(`/channels/?id=${serverId}&chaId=${channelId}`);
  }, [id, router]);


  if (isLoading || isLoadingMessages) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-hidden dark:bg-[#1A1A1E] bg-background dark:text-gray-100">
      <ChatHeader friend={friends!} onMenuToggle={handleMenuInfor} />
      <div className="flex flex-1 w-full overflow-hidden h-[calc(100vh-80px)]">
        <div className={`flex flex-col flex-1 overflow-hidden ${isOpen ? "w-[calc(100%-350px)]" : "w-full"}`}>
          <div className="flex flex-col w-full h-full p-4 overflow-hidden">
            <ScrollArea
              className="h-full w-full pr-4"
              ref={scrollAreaRef}
              onScroll={handleScroll}
            >
              <div className="flex flex-col gap-4  pb-8">
                <FriendProfile friend={friends!} />
                <CommonServers
                  isLoadingCurrentUserServers={isLoadingCurrentUserServers}
                  isLoadingFriendServers={isLoadingFriendServers}
                  handleServerClick={handleServerClick}
                  commonServers={commonServers!}
                />
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
          <div className="sticky -bottom-1 dark:bg-[#1A1A1E] bg-background p-4 pt-0">
            <InputMenssagens
              name={friends?.name || "user"}
              messageInput={messageInput}
              handleSendMessage={handleSendMessage}
              setMessageInput={setMessageInput}
            />
          </div>
        </div>
        {isOpen && (
          <SideBarRightUser friends={friends!} />
        )}
      </div>
    </div>
  );
}

export default ChatFriends;