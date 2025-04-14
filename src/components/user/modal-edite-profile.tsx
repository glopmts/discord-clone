import { updateUser } from "@/app/actions/user";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { User } from "@prisma/client";
import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ImageUploader } from "./imageProfileUpload";

type ModalAlert = {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  userId: string;
  refetch: () => void;
}

export function AlertEditeProfile({ isOpen, onClose, user, userId, refetch }: ModalAlert) {
  const [isUpdate, setUpdate] = useState(false);

  const [form, setForm] = useState({
    userId,
    name: user?.name || "",
    username: user?.username || "",
    image: user?.image || "",
    description: ""
  });


  const handleSubmit = async () => {
    if (!userId) {
      toast.error("Erro");
      return;
    }

    setUpdate(true);

    try {
      const res = await updateUser({ ...form });
      if (res) {
        toast.success("Perfil atualizado com sucesso!")
        refetch();
        onClose();
      }
    } catch (error) {
      toast.error("Error")
      console.error(error);
    } finally {
      setUpdate(false);
    }
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="bg-[#1f1f22] text-white border">
        <AlertDialogHeader>
          <AlertDialogTitle>Editar perfil</AlertDialogTitle>
          <AlertDialogDescription>
            Você está prestes a editar suas informações de perfil.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="mt-4 flex flex-col gap-2">
          <div className="mb-4">
            <Label>Imagem de Perfil</Label>
            <ImageUploader
              value={form.image}
              onChange={(url) => setForm({ ...form, image: url || "" })}
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <Label>Nome de Exibição</Label>
            <Input
              placeholder="Nome de Exibição"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <Label>Nome de Usuário</Label>
            <Input
              placeholder="Nome de Usuário"
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <Label>Descrição</Label>
            <Input
              placeholder="Descrição"
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
          <AlertDialogAction disabled={isUpdate} onClick={handleSubmit}>
            {isUpdate ? <Loader size={20} className="animate-spin" /> : "Atualizar perfil"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}