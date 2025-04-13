import { channelTypes } from "@/types/typesChannels";
import { ChannelTypes } from "@prisma/client";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type ModalRender = {
  modalState: {
    variant: "createChannel" | "createCategory" | "delete" | null;
    deleteData?: { id: string; name: string };
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    typeChannel?: ChannelTypes;
    isPrivate?: boolean;
  }>>;
  formData: {
    name: string;
    typeChannel?: ChannelTypes;
    isPrivate?: boolean;
  };
}

export const renderModalContent = ({ modalState, formData, setFormData }: ModalRender) => {
  switch (modalState.variant) {
    case "createChannel":
      return (
        <div className="space-y-4">
          <div>
            <Label className="text-xs font-semibold text-gray-400 uppercase block mb-1">
              Tipo de canal
            </Label>
            <div className="space-y-2">
              {channelTypes.map((channel) => (
                <div
                  key={channel.type}
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    typeChannel: channel.type as ChannelTypes
                  }))}
                  className={`flex items-start p-3 rounded cursor-pointer ${formData.typeChannel === channel.type
                    ? 'bg-zinc-800'
                    : 'bg-[#1a1a1e] hover:bg-[#2a2a2e]'
                    }`}
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
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-[#1a1a1e] text-white pl-8 py-2 rounded focus:outline-none focus:ring-1 focus:ring-[#4553BE]"
                placeholder="novo-canal"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <label className="font-medium">Canal privado</label>
              <p className="text-sm text-gray-400">Somente membros específicos poderão ver este canal</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPrivate}
                onChange={() => setFormData(prev => ({ ...prev, isPrivate: !prev.isPrivate }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4553BE]"></div>
            </label>
          </div>
        </div>
      );
    case "createCategory":
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="category-name" className="text-xs font-semibold text-gray-400 uppercase block mb-1">
              Nome da categoria
            </Label>
            <Input
              id="category-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-[#1a1a1e] text-white py-2 rounded focus:outline-none focus:ring-1 focus:ring-[#4553BE]"
              placeholder="nova-categoria"
            />
          </div>
        </div>
      );
    case "delete":
      return (
        <p className="text-gray-400">
          Tem certeza que deseja excluir a categoria <strong>{modalState.deleteData?.name}</strong>? Esta ação não pode ser desfeita.
        </p>
      );
    default:
      return null;
  }
};