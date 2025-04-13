import { createNewsCategory } from "@/app/actions/category";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { ModalProps } from "@/types/interfaces";
import { Loader, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

export default function ModalCreateCategory({
  isOpen,
  onClose,
  refetch,
  serverId
}: ModalProps) {

  const [loader, setLoader] = useState(false);

  const [form, setForm] = useState({
    serverId,
    name: "",
  });

  const handleSubmit = async () => {
    if (!serverId) {
      toast.error("Erro, server id é necessario!");
      return;
    }
    setLoader(true);
    try {
      const res = await createNewsCategory({ ...form, serverId: serverId! });
      if (res) {
        toast.success("Categoria criado com sucesso!")
        refetch();
        onClose();
      }
    } catch (error) {
      toast.error("Error ao criar categoria")
      console.error(error);
    } finally {
      setLoader(false);
    }
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className={cn("bg-[#242429]")}>
        <AlertDialogHeader>
          <AlertDialogTitle>Criar categoria</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex flex-col gap-2.5">
            <Label>NOME DA CATEGORIA</Label>
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
          <div className="flex w-full flex-col gap-1.5">
            <div className="flex w-full items-center justify-between mb-8">
              <div className="flex items-center gap-2.5">
                <LockKeyhole size={20} className="text-zinc-400" />
                <span>Categoria privada</span>
              </div>
              <div className="w-auto">
                <Switch
                  className="w-10 h-[24px] "
                />
              </div>
            </div>
            <div className="flex items-center justify-between w-full">
              <button className={cn("bg-transparent p-1 cursor-pointer")} onClick={onClose}>Voltar</button>
              <AlertDialogAction disabled={loader} onClick={handleSubmit} className="bg-[#4553BE] text-white hover:bg-[#4553bec0]">
                {loader ? <Loader size={20} className="animate-spin" /> : "Criar categoria"}
              </AlertDialogAction>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}