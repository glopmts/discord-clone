import { cn } from "@/lib/utils"
import { Store, Users } from "lucide-react"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { Separator } from "./ui/separator"

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

// Simulando uma lista grande para demonstrar o scroll
const directMessages = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Usuário ${i + 1}`,
}))

const SiderBarInfors = () => {
  return (
    <div className="w-[290px] h-full border rounded-l-md flex flex-col">
      <div className="w-full p-2 flex flex-col">
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
      </div>

      <ScrollArea className="flex-1 w-full h-32 mb-15">
        <div className="p-2">
          {directMessages.map((dm) => (
            <Button
              key={dm.id}
              variant="ghost"
              className="w-full justify-start rounded-md cursor-pointer flex items-center gap-1.5 mb-1"
            >
              <div className="h-8 w-8 rounded-full bg-neutral-700 flex items-center justify-center">
                <span className="text-xs text-white">{dm.name.charAt(0)}</span>
              </div>
              <span className="font-medium text-neutral-400">{dm.name}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export default SiderBarInfors
