import { channelIcons } from "@/types/iconsChannels"
import { InterfacesRender } from "@/types/interfaces"
import { Calendar, LucideListMinus, Plus, Users } from "lucide-react"
import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { Button } from "../ui/button"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../ui/context-menu"
import { Separator } from "../ui/separator"
import MenuOptionsInfor from "./dropdown-menu-options"


type FunctionsProps = {
  handleEdite: () => void;
  handleDelete: (categoryId: string, categoryName: string) => void;
  category?: {
    id: string;
    name: string;
  }
}

const optionsContextMenu = ({ handleEdite, handleDelete, category }: FunctionsProps) => [
  {
    id: 1,
    label: "Editar categoria",
    onClick: (handleCloseMenu: () => void) => {
      handleEdite();
      handleCloseMenu();
    }
  },
  {
    id: 2,
    label: "Excluir categoria",
    type: "delete",
    onClick: (handleCloseMenu: () => void) => {
      handleDelete(category?.id!, category?.name!);
      handleCloseMenu();
    }
  }
]

const RenderServerChannels = ({
  server,
  currentChannelId,
  handleServerClick,
  handleNewsChannel,
  handleNewsCategory,
  handleDelete,
  handleEdite
}: InterfacesRender) => {
  if (!server) return null

  const [contextMenuOpen, setContextMenuOpen] = useState<string | null>(null);

  const handleCloseMenu = () => {
    setContextMenuOpen(null);
  };

  const handleItemClick = (itemOnClick: (closeMenu: () => void) => void) => {
    itemOnClick(handleCloseMenu);
  };

  return (
    <>
      <div className="p-3 flex items-center justify-between">
        <MenuOptionsInfor
          name={server.name}
          handleNewsCategory={handleNewsCategory}
          handleNewsChannel={handleNewsChannel}
        />
      </div>
      <Separator className="bg-zinc-800" />

      <div className="mt-2 mb-3">
        <Button variant="ghost" className="w-full flex justify-baseline">
          <Calendar size={20} className="mr-1 text-zinc-400" />
          <span className=" text-zinc-400">Eventos</span>
        </Button>
        <Button variant="ghost" className="w-full flex justify-baseline">
          <LucideListMinus size={20} className="mr-1 text-zinc-400" />
          <span className=" text-zinc-400">Canais & Cargos</span>
        </Button>
        <Button variant="ghost" className="w-full flex justify-baseline">
          <Users size={20} className="mr-1 text-zinc-400" />
          <span className=" text-zinc-400">Membros</span>
        </Button>
      </div>
      <Separator className="bg-zinc-800" />

      <div className="mt-4">
        <div className="mt-1">
          {server.Category?.map((category) => {
            const channelId = category.channels.map((c) => c.id)
            const isActive = channelId.includes(currentChannelId || "")

            return (
              <div className="w-full" key={category.id}>
                <div className="px-3 flex items-center justify-between group relative">
                  <Accordion type="multiple" className="w-full">
                    <AccordionItem value="item-1" className="w-full border-none" >
                      <ContextMenu
                        key={contextMenuOpen}
                        onOpenChange={(open) => {
                          setContextMenuOpen(open ? category.id : null);
                        }}
                      >
                        <ContextMenuTrigger>
                          <div className="flex items-center justify-between w-full">
                            <AccordionTrigger>
                              <span className="text-xs uppercase font-semibold text-neutral-400 group-hover:text-neutral-200">
                                {category.name}
                              </span>
                            </AccordionTrigger>

                            {/* criar um canal especifico para category */}
                            <button className="text-neutral-400 text-xs absolute right-3"
                              onClick={() => handleNewsChannel(category?.id)}>
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </ContextMenuTrigger>
                        <ContextMenuContent className="z-[100]">
                          <ContextMenuItem>Marcar como lida</ContextMenuItem>
                          <Separator className="mt-2 mb-2" />
                          {optionsContextMenu({
                            handleDelete: () => handleDelete(category.id, category.name),
                            handleEdite: () => handleEdite(),
                          }).map((fc) => (
                            <ContextMenuItem
                              key={fc.id}
                              onClick={() => handleItemClick(fc.onClick)}
                              className={fc.type === "delete" ? "text-red-500" : ""}
                            >
                              {fc.label}
                            </ContextMenuItem>
                          ))}
                        </ContextMenuContent>
                      </ContextMenu>
                      <AccordionContent className="w-full ">
                        {category.channels.map((chanells) => (
                          <div className="w-full" key={chanells.id}>
                            <Button
                              variant={isActive ? "secondary" : "ghost"}
                              onClick={() => handleServerClick(chanells.id)}
                              className="w-full justify-start px-3 py-1 text-neutral-400 hover:text-white hover:bg-zinc-700/50 rounded-sm"
                            >
                              {channelIcons[chanells.typeChannel]}
                              <span className="truncate">{chanells.name}</span>
                            </Button>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default RenderServerChannels;