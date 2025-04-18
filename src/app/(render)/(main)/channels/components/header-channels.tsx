import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-select";
import { Bell, Dot, Hash, Pin, Search, Users } from "lucide-react";

type HeaderProps = {
  name: string;
  handleListMembers: () => void;
  memBersList: boolean;
  error?: string | null;
}

const HeaderChannels = ({ handleListMembers, memBersList, name, error }: HeaderProps) => {
  return (
    <div className="px-2">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-1.5">
          <Hash size={20} className="text-zinc-500" />
          <div className="flex items-center gap-1.5">
            💬 <Dot size={16} /> <span className="truncate">{name}</span>
          </div>
        </div>
        <div className="flex items-center gap-3.5">
          <Bell size={18} className="text-gray-500 dark:text-zinc-400 hover:text-zinc-200 cursor-pointer" />
          <Pin size={18} className="text-gray-500 dark:text-zinc-400 hover:text-zinc-200 cursor-pointer" />
          <div className="">
            <button onClick={handleListMembers} className="cursor-pointer hover:bg-zinc-700/20 p-1 rounded-full">
              <Users size={18} className={memBersList ? "" : "text-gray-500 dark:text-zinc-400 hover:text-zinc-200"} />
            </button>
          </div>
          <div className="w-[180px] relative ml-4">
            <Input placeholder="Buscar..." className="relative w-full h-8 bg-zinc-200 dark:bg-[#1e1f22] border-none focus-visible:ring-0" />
            <Search size={18} className="absolute top-1.5 right-3 text-gray-500 dark:text-zinc-400" />
          </div>
        </div>
      </div>
      {error && (
        <div className="text-center text-base mb-4 mt-4 font-semibold text-red-600">
          {error}
        </div>
      )}
      <Separator className="dark:bg-zinc-800 bg-zinc-300 h-0.5 mt-3" />
    </div>
  );
}

export default HeaderChannels;