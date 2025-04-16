import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Gift, Laugh, PlusCircle, Sticker } from "lucide-react";

type MessagePropsInput = {
  name?: string;
  messageInput?: string;
  setMessageInput: (value: string) => void;
  handleSendMessage: () => void;
  type?: "fixed" | "absolute"
  className?: string;
}

const InputMenssagens = ({
  name,
  messageInput,
  handleSendMessage,
  setMessageInput,
  type,
  className
}: MessagePropsInput) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="bg-[#222327] w-full border rounded-lg">
        <div className="flex items-center w-full justify-between bg-[#222327] p-1.5 px-4 rounded-md">
          <div className="flex items-center w-full">
            <div className="mr-4 text-zinc-400 hover:text-zinc-200 cursor-pointer">
              <PlusCircle size={20} />
            </div>
            <Input
              placeholder={`Conversar em # 💬 ${name}`}
              className={cn("border-0 w-full dark:bg-input/0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0")}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              minLength={3}
              multiple
            />
          </div>
          <div className="ml-4 text-zinc-400 flex items-center gap-3">
            <Gift size={20} className="hover:text-zinc-200 cursor-pointer" />
            <Sticker size={20} className="hover:text-zinc-200 cursor-pointer" />
            <Laugh size={20} className="hover:text-zinc-200 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InputMenssagens;