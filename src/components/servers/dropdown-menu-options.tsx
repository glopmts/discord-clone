import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { FolderPlus, LucideArrowBigDown, PlusCircle, Settings, Users } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type DropdownMenuProps = {
  name: string;
  handleNewsChannel: () => void;
  handleNewsCategory: () => void;
}

type FunctionsProps = {
  handleNewsChannel: () => void;
  handleNewsCategory: () => void;
}

const navegaTions = ({ handleNewsChannel, handleNewsCategory }: FunctionsProps) => [
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
    onClick: (closeDropdown: () => void) => {
      handleNewsChannel();
      closeDropdown();
    }
  },
  {
    id: 4,
    label: "Criar categoria",
    icon: FolderPlus,
    onClick: (closeDropdown: () => void) => {
      handleNewsCategory();
      closeDropdown();
    }
  }
];

export default function MenuOptionsInfor({
  name,
  handleNewsChannel,
  handleNewsCategory
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCloseDropdown = () => {
    setIsOpen(false);
  };

  const handleItemClick = (itemOnClick: (closeDropdown: () => void) => void) => {
    itemOnClick(handleCloseDropdown);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="flex items-center justify-between w-full cursor-pointer">
        <span className="font-semibold  truncate">{name}</span>
        <LucideArrowBigDown size={20} className={`text-zinc-500 ${isOpen ? "rotate-180 animate-accordion-up transition-all" : ""}`} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn("w-[14rem]")}>
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Impulso de servidor</span>
          <Image src="/icons/impuso-icon.png"
            alt="impuso-icon"
            width={15}
            height={15}
            className="filter  hue-rotate-690"
          />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {navegaTions({ handleNewsChannel, handleNewsCategory }).map((nv) => (
          <DropdownMenuItem
            key={nv.id}
            className="flex w-full items-center justify-between"
            onClick={() => handleItemClick(nv.onClick)}
          >
            {nv.label}
            <nv.icon size={23} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}