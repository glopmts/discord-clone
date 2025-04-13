import { cn } from "@/lib/utils";
import { Store, Users } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

const links = [
  {
    id: 1,
    label: "Amigos",
    icon: <Users className="h-5 w-5 text-neutral-400" />,
  },
  {
    id: 3,
    label: "Loja",
    icon: <Store className="h-5 w-5 text-neutral-400" />,
  },
]


const RenderDirectMessages = () => {
  return (
    <>
      <div className="flex flex-col gap-1">
        {links.map((c) => (
          <Button
            key={c.id}
            variant="ghost"
            className={cn("w-full justify-start rounded-md cursor-pointer flex items-center gap-1.5")}
          >
            {c.icon}
            <span className="font-semibold text-neutral-400">{c.label}</span>
          </Button>
        ))}
      </div>
      <Separator className="mt-1" />
      <div className="mt-4 p-2">
        <div className="flex items-center justify-between">
          <span className="text-neutral-400 text-sm hover:text-white">Menssagens diretas</span>
          <button className="cursor-pointer">
            <span className="text-neutral-400">+</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default RenderDirectMessages;