import { createNewsServers } from "@/app/actions/servers";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { ModalProps } from "@/types/interfaces";
import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ImageUploader } from "../user/imageProfileUpload";

export default function ModalCreateServer({
  isOpen,
  onClose,
  refetch,
  userId
}: ModalProps) {

  const [loader, setLoader] = useState(false);

  const [form, setForm] = useState({
    userId,
    name: "",
    image: "",
  });

  const handleSubmit = async () => {
    if (!userId) {
      toast.error("Erro, user id é necessario!");
      return;
    }
    setLoader(true);
    try {
      const res = await createNewsServers({ ...form });
      if (res) {
        toast.success("Servidor criado com sucesso!")
        refetch();
        onClose();
      }
    } catch (error) {
      toast.error("Error ao criar servidor")
      console.error(error);
    } finally {
      setLoader(false);
    }
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className={cn("bg-[#242429] z-[360]")}>
        <AlertDialogHeader>
          <AlertDialogTitle>Personalizer seu servidor</AlertDialogTitle>
          <AlertDialogDescription>
            Deixe seu novo servidor com a sua cara dando um nome e um ícone a ele. Se quiser, é possível mudar depois.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="mt-4 flex flex-col gap-2">
          <div className="mb-4">
            <ImageUploader
              value={form.image}
              onChange={(url) => setForm({ ...form, image: url || "" })}
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <Label>NOME DO SERVIDOR</Label>
            <Input
              placeholder="NOME DO SERVIDOR"
              type="text"
              value={form.name}
              className={cn("bg-zinc-900")}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
        </div>
        <AlertDialogFooter>
          <div className="flex flex-col gap-1.5">

            <div className="text-[13px] text-zinc-400">
              Ao criar um servidor, você concorda com as <strong><a className="text-blue-500" href="//discord.com/guidelines" rel="noreferrer noopener" target="_blank">diretrizes da comunidade</a></strong> do Discord.
            </div>

            <div className="flex items-center justify-between w-full">
              <button className={cn("bg-transparent p-1 cursor-pointer")} onClick={onClose}>Voltar</button>
              <AlertDialogAction disabled={loader} onClick={handleSubmit} className="bg-[#4553BE] text-white hover:bg-[#4553bec0]">
                {loader ? <Loader size={20} className="animate-spin" /> : "Criar"}
              </AlertDialogAction>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}