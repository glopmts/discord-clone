import { User } from "@prisma/client";

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
                <div className="w-8 h-8 rounded-full bg-zinc-700 mr-2"></div>
                <div>
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