import { getUserColor } from "@/components/getUsersCores";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { MessagePropsRender } from "@/types/interfaces";
import { CornerUpRight, Laugh } from "lucide-react";
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
  messagesEndRef
}) => {
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);

  return (
    <div className="mt-4 flex flex-col gap-4">
      {allMessages.length > 0 ? (
        allMessages.map((msg) => {
          const userColor = getUserColor(msg.userId || msg.user.name || "");

          return (
            <div
              className="flex items-start gap-2 relative group"
              key={msg.id}
              onMouseEnter={() => setHoveredMessage(msg.id)}
              onMouseLeave={() => setHoveredMessage(null)}
            >
              <Avatar className={cn("w-10 h-10")}>
                <AvatarImage src={msg.user.image || undefined} />
                <AvatarFallback>
                  {msg.user.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold text-base ${userColor}`}>
                    {msg.user.name}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-zinc-300">{msg.content}</p>

                {/* Menu que aparece ao passar o mouse */}
                {hoveredMessage === msg.id && (
                  <div className="absolute right-10 top-0 flex gap-2 bg-zinc-800 border p-1 rounded-md">
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

export default RenderMessagens;