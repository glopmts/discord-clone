import { getRoleIcon } from "@/components/IconsCargosMembers";
import { cn } from "@/lib/utils";
import { MenuItem } from "@/types/interfaces";
import { Roles, User } from "@prisma/client";
import { Ban, MessageSquare, MoreVertical, Shield, User as UserIcon } from "lucide-react";
import { useState } from "react";
import ContextMenuGlobe from "../ContextMenu";
import DetailsMembers from "../modals/details-members-modal";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type ServerProps = {
  server: {
    id: string;
    members: {
      id: string;
      user: User & {
        MemberCargo: {
          userId: string;
          id: string;
          createdAt: Date;
          updatedAt: Date;
          serverId: string;
          role: Roles;
        }[];
      };
    }[];
  };
  refetch: () => void;
}

const MemberServer = ({ server, refetch }: ServerProps) => {
  const [isOpen, setOpen] = useState(false);
  const [selectMember, setSelectMember] = useState<string | null>(null);
  const [contextMenuOpen, setContextMenuOpen] = useState<string | null>(null);

  const handleInfor = (id: string) => {
    setOpen(!isOpen);
    setSelectMember(id);
    setContextMenuOpen(null);
  };

  const getMemberRole = (memberId: string): Roles => {
    const member = server.members.find(m => m.id === memberId);
    if (!member || !member.user.MemberCargo || member.user.MemberCargo.length === 0) {
      return Roles.user;
    }

    const cargo = member.user.MemberCargo.find(c => c.serverId === server.id);
    return cargo ? cargo.role : Roles.user;
  };

  const getMemberContextMenuItems = (memberId: string, isAdmin: boolean): MenuItem[] => {
    const memberRole = getMemberRole(memberId);

    return [
      {
        label: "Ver perfil",
        action: () => handleInfor(memberId),
        icon: <UserIcon size={16} />,
      },
      {
        label: "Enviar mensagem",
        action: () => console.log(`Mensagem para ${memberId}`),
        icon: <MessageSquare size={16} />,
      },
      {
        label: isAdmin ? "Remover admin" : "Tornar admin",
        action: () => {
          console.log(`Alterar status admin para ${memberId}`);
          refetch();
        },
        icon: <Shield size={16} />,
        disabled: memberRole === "owner",
      },
      {
        label: "Expulsar do servidor",
        action: () => console.log(`Expulsar ${memberId}`),
        icon: <Ban size={16} />,
        destructive: true,
        disabled: memberRole === "owner",
      },
    ];
  };

  return (
    <div className="p-2">
      {server?.members?.length > 0 && (
        <div className="mt-4">
          <div className="px-3 flex items-center justify-between group">
            <span className="text-xs uppercase font-semibold text-neutral-400 group-hover:text-neutral-200">
              Membros — {server.members.length}
            </span>
          </div>
          <div className="mt-2">
            {server.members.map((member) => {
              const memberRole = getMemberRole(member.id);

              return (
                <ContextMenuGlobe
                  key={contextMenuOpen} // isso faz que a tela não congele ao abrir o modal!
                  menuItems={getMemberContextMenuItems(
                    member.id,
                    memberRole === "admin" || memberRole === "owner"
                  )}
                  onOpenChange={(open) => {
                    setContextMenuOpen(open ? member.id : null);
                  }}
                >
                  <div
                    onClick={() => handleInfor(member.user.clerk_id!)}
                    className="flex items-center px-3 py-1.5 hover:bg-zinc-700/50 rounded-sm cursor-pointer"
                  >
                    <Avatar className={cn("w-9 h-9")}>
                      <AvatarImage src={member.user?.image ?? "G"} />
                      <AvatarFallback>
                        {member.user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <p className="text-sm text-white">{member.user?.name || "Usuário"}</p>
                      <div className="flex items-center gap-1 text-xs mt-1 text-neutral-400">
                        {getRoleIcon(memberRole, 14)}
                        <span className="capitalize">{memberRole}</span>
                      </div>
                    </div>
                    <button
                      className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        setContextMenuOpen(member.id);
                      }}
                    >
                      <MoreVertical size={16} className="text-neutral-400" />
                    </button>
                  </div>
                </ContextMenuGlobe>
              );
            })}
          </div>
        </div>
      )}

      {isOpen && (
        <DetailsMembers
          isOpen={isOpen}
          key={selectMember}
          serverId={server.id}
          memberId={selectMember!}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

export default MemberServer;