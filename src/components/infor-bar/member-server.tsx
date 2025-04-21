import { getRoleIcon } from "@/components/icons/IconsCargosMembers";
import { useMenuModalHandler } from "@/hooks/useMenuModalHandler";
import { canDeletePermission } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import { MenuItem, ServerPropsMember } from "@/types/interfaces";
import { Roles } from "@prisma/client";
import { Ban, MessageSquare, MoreVertical, User as UserIcon } from "lucide-react";
import { useState } from "react";
import ContextMenuGlobe from "../ContextMenu";
import DetailsMembers from "../modals/details-members-modal";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";


const MemberServer = ({ server, currentUserId, handleExpulseMember }: ServerPropsMember) => {
  const [isOpen, setOpen] = useState(false);
  const [selectMember, setSelectMember] = useState<string | null>(null);
  const { setContextMenuOpen, withMenuHandler } = useMenuModalHandler();

  const handleInfor = (id: string) => {
    withMenuHandler(() => {
      setOpen(!isOpen);
      setSelectMember(id);
    });
  };

  const getMemberRole = (memberId: string): Roles => {
    const member = server.members.find(m => m.id === memberId);
    if (!member || !member.user.MemberCargo || member.user.MemberCargo.length === 0) {
      return Roles.user;
    }

    const cargo = member.user.MemberCargo.find(c => c.serverId === server.id);
    return cargo ? cargo.role : Roles.user;
  };

  const getMemberContextMenuItems = (memberId: string, showDeleteOption: boolean): MenuItem[] => {
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
      ...(showDeleteOption ? [{
        label: "Expulsar do servidor",
        action: () => handleExpulseMember(memberId),
        icon: <Ban size={16} />,
        destructive: true,
        disabled: memberRole === "owner",
      }] : []),
    ];
  };

  return (
    <div className="p-2 h-full">
      {server?.members?.length > 0 && (
        <div className="mt-4 w-full h-full">
          <div className="px-3 flex items-center justify-between group">
            <span className="text-xs uppercase font-semibold text-neutral-400 group-hover:text-neutral-200">
              Membros — {server.members.length}
            </span>
          </div>
          <div className="mt-2 h-full">
            {server.members.map((member) => {
              const memberRole = getMemberRole(member.id);
              const canDelete = canDeletePermission(currentUserId, member as any, server as any);

              return (
                <ContextMenuGlobe
                  key={member.id}
                  menuItems={getMemberContextMenuItems(
                    member.user.clerk_id!,
                    canDelete
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
                      <p className="text-sm truncate line-clamp-1">{member.user?.name || "Usuário"}</p>
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