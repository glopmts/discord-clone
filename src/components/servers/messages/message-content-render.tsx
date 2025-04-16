import { getUserColor } from "@/components/getUsersCores";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { canDeletePermission } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import { MessagePropsRender, UnifiedMessage } from "@/types/interfaces";
import { formatFullDateTime, formatTimeOnly, isFirstMessageOfDay } from "@/utils/formatDate";
import { Copy, CornerUpRight, EllipsisIcon, Laugh, Pen, Trash2 } from "lucide-react";
import { FC, useState } from "react";

const emojis = [
  {
    id: 1,
    content: "🔥"
  },
  {
    id: 2,
    content: "👀"
  },
  {
    id: 3,
    content: "😝"
  }
]

const RenderMessagens: FC<MessagePropsRender> = ({
  allMessages,
  messagesEndRef,
  handleDeleteMessage,
  currentUserId,
  server
}) => {
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);
  const [dropdownOpenForMessage, setDropdownOpenForMessage] = useState<string | null>(null);

  const handleCopyMessage = (text: string) => {
    if (!text) {
      return null;
    }

    navigator.clipboard.writeText(text)
  }

  const normalizeMessage = (msg: any): UnifiedMessage => {
    if (msg.sendUser) {
      return {
        id: msg.id,
        content: msg.content,
        createdAt: new Date(msg.createdAt),
        user: {
          id: msg.sendUser.id,
          clerk_id: msg.sendUser.clerk_id,
          name: msg.sendUser.name,
          username: msg.sendUser.username,
          image: msg.sendUser.image
        },
        sendUser: msg.sendUser,
        receivesFriends: msg.receivesFriends
      };
    } else {
      return {
        id: msg.id,
        content: msg.content,
        createdAt: new Date(msg.createdAt),
        user: {
          id: msg.user.id,
          name: msg.user.name,
          username: msg.user.username,
          image: msg.user.image
        },
        userId: msg.userId
      };
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-4">
      {allMessages.length > 0 ? (
        allMessages.map((msg, index) => {
          const normalizedMsg = normalizeMessage(msg);
          const userColor = getUserColor(normalizedMsg.user.id || normalizedMsg.user.clerk_id || normalizedMsg.user.name || "");

          const isFirstOfDay = isFirstMessageOfDay(allMessages, index);
          const timeText = isFirstOfDay
            ? formatFullDateTime(new Date(normalizedMsg.createdAt))
            : formatTimeOnly(new Date(normalizedMsg.createdAt));

          const canDelete = canDeletePermission(currentUserId, normalizedMsg, server);

          return (
            <div
              className="flex items-start gap-2 relative group"
              key={normalizedMsg.id}
              onMouseEnter={() => setHoveredMessage(normalizedMsg.id)}
              onMouseLeave={() => {
                if (dropdownOpenForMessage !== normalizedMsg.id) {
                  setHoveredMessage(null);
                }
              }}
            >
              <Avatar className={cn("w-10 h-10")}>
                <AvatarImage src={normalizedMsg.user.image || undefined} />
                <AvatarFallback>
                  {normalizedMsg.user.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold text-base ${userColor}`}>
                    {normalizedMsg.user.name}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {timeText}
                  </span>
                </div>
                <p className="text-zinc-300">{normalizedMsg.content}</p>

                {/* Menu que aparece ao passar o mouse */}
                {(hoveredMessage === msg.id || dropdownOpenForMessage === msg.id) && (
                  <div className="absolute right-10 h-10 top-0 flex gap-2 bg-zinc-800 border p-1 rounded-md">
                    <div className="flex items-center gap-1">
                      <div className="flex items-end gap-1.5">
                        {emojis.map((em) => (
                          <button key={em.id} className="cursor-pointer">
                            <span>{em.content}</span>
                          </button>
                        ))}
                      </div>
                      <span className="ml-1 mr-1 text-zinc-500">|</span>
                      <div className="flex items-center gap-0.5 text-zinc-400">
                        <button className="cursor-pointer hover:bg-zinc-700 hover:text-zinc-100 p-1 rounded-md">
                          <Laugh size={16} />
                        </button>
                        <button className="cursor-pointer hover:bg-zinc-700 hover:text-zinc-100 p-1 rounded-md">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                          </svg>
                        </button>
                        <button className="cursor-pointer hover:bg-zinc-700 hover:text-zinc-100 p-1 rounded-md">
                          <CornerUpRight size={16} />
                        </button>
                      </div>
                      <div className="">
                        <MenuOptions
                          messageId={msg.id}
                          dropdownOpen={dropdownOpenForMessage === msg.id}
                          setDropdownOpen={(open) => {
                            setDropdownOpenForMessage(open ? msg.id : null);
                            if (open) setHoveredMessage(msg.id);
                          }}
                          handleDeleteMessage={handleDeleteMessage}
                          handleCopyMessage={() => handleCopyMessage(msg.content)}
                          showDeleteOption={canDelete}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex items-center justify-center w-full">
          <div className="text-zinc-500">
            <span>Nenhuma mensagem!</span>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}


interface MenuOptionsProps {
  messageId: string;
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
  handleDeleteMessage: (messageId: string) => void;
  handleCopyMessage: (text: string) => void;
  showDeleteOption: boolean;
}

const MenuOptions: FC<MenuOptionsProps> = ({
  messageId,
  dropdownOpen,
  setDropdownOpen,
  handleDeleteMessage,
  handleCopyMessage,
  showDeleteOption
}) => {

  const menuOptions = [
    {
      id: 3,
      label: "Copiar texto",
      icon: Copy,
      onchage: handleCopyMessage
    },
    ...(showDeleteOption ? [{
      id: 2,
      label: "Editar menssagem",
      icon: Pen,
      onchage: () => { }
    }] : []),
    ...(showDeleteOption ? [{
      id: 1,
      label: "Excluir mensagem",
      type: "delete",
      icon: Trash2,
      onchage: handleDeleteMessage
    }] : [])
  ]


  return (
    <DropdownMenu
      open={dropdownOpen}
      onOpenChange={(open) => setDropdownOpen(open)}
    >
      <DropdownMenuTrigger asChild>
        <button
          className="cursor-pointer hover:bg-zinc-700/60 p-1 rounded-md"
          onClick={(e) => e.preventDefault()}
        >
          <EllipsisIcon size={20} className="text-zinc-400" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn("bg-zinc-800 border z-[800] absolute right-0 -top-20")}>
        <DropdownMenuLabel className="gap-2.5 flex">
          {emojis.map((em) => (
            <Button variant="outline" key={em.id}>
              {em.content}
            </Button>
          ))}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2.5 flex flex-col">
          {menuOptions.map((opt) => (
            <Button key={opt.id}
              onClick={() => opt.onchage(messageId)}
              className={`w-full flex items-center cursor-pointer shadow-none justify-between bg-zinc-800 text-white hover:bg-zinc-700/30 ${opt.type === "delete" ? "text-red-500" : ""}`}>
              {opt.label}
              <opt.icon />
            </Button>
          ))}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default RenderMessagens;