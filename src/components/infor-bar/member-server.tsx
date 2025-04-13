import { cn } from "@/lib/utils";
import { User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type ServerProps = {
  server: {
    members: {
      id: string;
      user: User
    }[]
  }
}

const MemberServer = ({
  server
}: ServerProps) => {
  return (
    <div className="p-2">
      {server && server.members && server.members.length > 0 && (
        <div className="mt-4">
          <div className="px-3 flex items-center justify-between group">
            <span className="text-xs uppercase font-semibold text-neutral-400 group-hover:text-neutral-200">
              Membros — {server.members.length}
            </span>
          </div>
          <div className="mt-2">
            {server.members.map((member) => (
              <div
                key={member.id}
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
                  <p className="text-xs text-neutral-400">
                    {member.user?.admin === "admin" ? "Administrador" : "Membro"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MemberServer;