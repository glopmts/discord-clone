import { UserIdProps } from "@/types/interfaces";
import { CircleHelp, Inbox, LucideUsers } from "lucide-react";

const Header = ({ userId }: UserIdProps) => {

  return (
    <div className="w-full p-1 py-2 px-2.5">
      <div className="w-full flex justify-between items-center">
        <div className=""></div>
        <div className="">
          <div className="flex items-center gap-1.5">
            <LucideUsers size={16} className="mr-1 text-neutral-300" />
            <span className="font-semibold text-sm">Amigos</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="cursor-pointer">
            <Inbox size={18} className="text-neutral-300" />
          </button>
          <button className="cursor-pointer">
            <CircleHelp size={18} className="text-neutral-300" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;