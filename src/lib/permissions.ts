import { getServerRole } from "@/app/actions/member-servers";
import { Roles } from "@prisma/client";

export const hasPermission = async (
  userId: string,
  serverId: string,
  requiredRole: Roles
) => {
  const userRole = await getServerRole(userId, serverId);
  const roleHierarchy: Record<Roles, number> = {
    owner: 4,
    admin: 3,
    moderator: 2,
    vip: 1,
    user: 0
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

// Exemplo de uso:
// const canManageRoles = await hasPermission(currentUserId, serverId, "admin");