import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Channel } from "@prisma/client";

interface CommonServersProps {
  commonServers: {
    id: string;
    name: string;
    image: string | null;
    channels: Channel[];
  }[];
  isLoadingCurrentUserServers: boolean;
  isLoadingFriendServers: boolean;
  handleServerClick: (serverId: string, channelId: string) => void;
}

const CommonServers = ({
  commonServers,
  handleServerClick,
  isLoadingCurrentUserServers,
  isLoadingFriendServers
}: CommonServersProps) => {
  return (
    <div className="w-full max-w-[600px] mt-3">
      {isLoadingCurrentUserServers || isLoadingFriendServers ? (
        <div className="flex justify-center">
          <span className="text-sm text-gray-400">Carregando servidores em comum...</span>
        </div>
      ) : commonServers.length > 0 ? (
        <div className="dark:bg-[#2b2d31] bg-gray-600/10 rounded-lg p-3">
          <h3 className="text-xs font-semibold dark:text-gray-400 mb-2">SERVIDORES EM COMUM</h3>
          <div className="flex flex-col gap-1">
            {commonServers.map(server => (
              <div key={server.id} className="flex items-center gap-2 p-2 hover:opacity-75 transition-opacity cursor-pointer" onClick={() => handleServerClick(server.id, server.channels[0]?.id)}>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={server.image!} />
                  <AvatarFallback className="bg-[#5865f2]">
                    {server.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-semibold dark:text-gray-100">{server.name}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-400">
          Nenhum servidor em comum
        </div>
      )}
    </div>
  );
}

export default CommonServers;