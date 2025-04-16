import { getServerRole } from "@/app/actions/member-servers";
import { ServerProps, UnifiedMessage } from "@/types/interfaces";
import { Roles, Server } from "@prisma/client";

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
  currentUserId: string,
  message: UnifiedMessage,
  server?: Server | null
) => {
  const isAuthor =
    message.user.clerk_id === currentUserId ||
    message.userId === currentUserId ||
    (message.sendUser && message.sendUser.clerk_id === currentUserId);

  if (!server) {
    return isAuthor;
  }

  const isServerOwner = server.ownerId === currentUserId;
  const isServerAdmin = false;

  return isAuthor || isServerOwner || isServerAdmin;
};