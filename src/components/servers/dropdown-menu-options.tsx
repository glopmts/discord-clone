import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { LucideArrowBigDown, PlusCircle, Settings, Users } from "lucide-react";

type DropdownMenuProps = {
  name: string;
  handleNewsChannel: () => void;
}

type FunctionsProps = {
  handleNewsChannel: () => void;
}

const navegaTions = ({ handleNewsChannel }: FunctionsProps) => [
  {
    id: 1,
    label: "Convidar pessoas",
    icon: Users,
    onClick: () => console.log("Convidar pessoas clicado")
  },
  {
    id: 2,
    label: "Config. do servidor",
    icon: Settings,
    onClick: () => console.log("Config. do servidor clicado")
  },
  {
    id: 3,
    label: "Criar um canal",
    icon: PlusCircle,
    onClick: handleNewsChannel
  }
];

export default function MenuOptionsInfor({ name, handleNewsChannel }: DropdownMenuProps) {

  return (
    <DropdownMenu dir="ltr" modal>
      <DropdownMenuTrigger className="flex items-center justify-between w-full cursor-pointer">
        <span className="font-semibold text-white truncate">{name}</span>
        <LucideArrowBigDown size={20} className="text-zinc-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn("w-[14rem]")}>
        <DropdownMenuLabel>Impulso de servidor</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {navegaTions({ handleNewsChannel }).map((nv) => (
          <DropdownMenuItem
            key={nv.id}
            className="flex w-full items-center justify-between"
            onClick={nv.onClick}
          >
            {nv.label}
            <nv.icon size={23} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>

  )
}