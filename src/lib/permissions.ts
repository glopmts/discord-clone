import { getServerRole } from "@/app/actions/member-servers";
import { ServerProps } from "@/types/interfaces";
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

export const isServerOwner = (userId: string, server: ServerProps): boolean => {
  return server.ownerId === userId;
};

export const hasServerRole = (
  userId: string,
  server: ServerProps,
  roles: Roles[]
): boolean => {
  return server.MemberCargo.some(
    (member) => member.userId === userId && roles.includes(member.role)
  );
};

export const canDeletePermission = (
  userId: string,
  validate: any,
  server: ServerProps
): boolean => {

  if (validate.userId === userId) return true;

  if (isServerOwner(userId, server)) return true;

  if (hasServerRole(userId, server, ['admin', 'moderator'])) return true;

  return false;
};
