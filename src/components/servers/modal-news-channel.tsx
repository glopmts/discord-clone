import { createChannel } from "@/app/actions/channels";
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
import { cn } from "@/lib/utils";
import { ModalProps } from "@/types/interfaces";
import { channelTypes } from "@/types/typesChannels";
import { ChannelTypes } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type TypeForm = {
  name: string;
  typeChannel: ChannelTypes;
  isPrivate: boolean;
}

export default function ModalCreateChannels(
  {
    isOpen,
    onClose,
    refetch,
    serverId,
    categoryId
  }: ModalProps
) {
  const [loader, setLoader] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [form, setForm] = useState<TypeForm>({
    name: "",
    typeChannel: "TEXT",
    isPrivate: false,
  });

  const handleSubmit = async () => {
    try {
      setLoader(true);
      await createChannel({
        serverId: serverId as string,
        name: form.name,
        typeChannel: form.typeChannel,
        isPrivate: isPrivate,
        categoryId: categoryId
      });
      toast.success("Canal criado com sucesso!")
      refetch?.();
      onClose();
    } catch (error) {
      console.error("Error creating channel:", error);
      toast.error("Erro, erro ao criar canal!")
    } finally {
      setLoader(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      name: e.target.value
    }));
  };

  const handleTypeChange = (type: ChannelTypes) => {
    setForm(prev => ({
      ...prev,
      typeChannel: type
    }));
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className={cn("bg-[#242429] text-white border-none overflow-y-scroll h-[90vh]")}>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Criar canal</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            Em {form.typeChannel.toLowerCase()}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          {/* Tipo de canal */}
          <div>
            <Label className="text-xs font-semibold text-gray-400 uppercase block mb-1">
              Tipo de canal
            </Label>
            <div className="space-y-2">
              {channelTypes.map((channel) => (
                <div
                  key={channel.type}
                  onClick={() => handleTypeChange(channel.type as ChannelTypes)}
                  className={`flex items-start p-3 rounded cursor-pointer ${form.typeChannel === channel.type ? 'bg-zinc-800' : 'bg-[#1a1a1e] hover:bg-[#2a2a2e]'}`}
                >
                  <span className="text-2xl mr-3">{channel.icon}</span>
                  <div>
                    <div className="font-medium">{channel.label}</div>
                    <div className="text-sm text-gray-400">{channel.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="channel-name" className="text-xs font-semibold text-gray-400 uppercase block mb-1">
              Nome do canal
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">#</span>
              <Input
                id="channel-name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-[#1a1a1e] text-white pl-8 py-2 rounded focus:outline-none focus:ring-1 focus:ring-[#4553BE]"
                placeholder="novo-canal"
              />
            </div>
          </div>

          {/* Privacidade */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <label className="font-medium">Canal privado</label>
              <p className="text-sm text-gray-400">Sommente membros específicos poderão ver este canal</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={() => setIsPrivate(!isPrivate)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4553BE]"></div>
            </label>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent border-none text-white hover:bg-[#2a2a2e] hover:text-white">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSubmit}
            disabled={!form.name || loader}
            className="bg-[#4553BE] text-white hover:bg-[#4553BE]/90 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {loader ? "Criando..." : "Criar canal"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}