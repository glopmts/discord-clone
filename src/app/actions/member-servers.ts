"use server";

import { db } from "@/lib/db";
import { Roles } from "@prisma/client";

export async function assignServerRole(
  currentUserId: string,
  targetUserId: string,
  serverId: string,
  role: Roles
) {
  try {
    // Verificar se o usuário que está atribuindo tem permissão
    // (deve ser owner ou admin)

    const existingRole = await db.memberCargo.findUnique({
      where: {
        userId_serverId: {
          userId: targetUserId,
          serverId
        }
      }
    });

    if (existingRole) {
      return await db.memberCargo.update({
        where: {
          id: existingRole.id
        },
        data: { role }
      });
    }

    return await db.memberCargo.create({
      data: {
        userId: targetUserId,
        serverId,
        role
      }
    });
  } catch (error) {
    console.error("Error assigning server role:", error);
    throw error;
  }
}

export async function removeServerRole(userId: string, serverId: string) {
  return await db.memberCargo.delete({
    where: {
      userId_serverId: {
        userId,
        serverId
      }
    }
  });
}

export async function getServerRole(userId: string, serverId: string) {
  const role = await db.memberCargo.findUnique({
    where: {
      userId_serverId: {
        userId,
        serverId
      }
    }
  });

  return role?.role || Roles.user;
}

export async function listServerMembers(serverId: string) {
  return await db.memberCargo.findMany({
    where: { serverId },
    include: { user: true },
    orderBy: { role: "desc" }
  });
}

export async function updateServerRole(
  currentUserId: string, // ID do usuário que está fazendo a mudança
  targetUserId: string,  // ID do usuário que terá o cargo alterado
  serverId: string,
  newRole: Roles
) {
  try {

    const currentUserRole = await getServerRole(currentUserId, serverId);

    if (currentUserRole !== "owner" && currentUserRole !== "admin") {
      throw new Error("Sem permissão para alterar cargos");
    }

    // Verificar se está tentando modificar outro owner
    const targetUserRole = await getServerRole(targetUserId, serverId);
    if (targetUserRole === "owner") {
      throw new Error("Não pode modificar o dono do servidor");
    }

    if (newRole === "owner" && currentUserRole !== "owner") {
      throw new Error("Apenas o dono pode transferir a propriedade");
    }

    return await assignServerRole(currentUserId, targetUserId, serverId, newRole);
  } catch (error) {
    console.error("Error updating server role:", error);
    throw error;
  }
}


export async function expelsMember(userId: string, memberId: string, serverId: string) {
  try {
    if (!userId || !memberId || !serverId) {
      throw new Error("Missing required parameters");
    }

    const currentUserRole = await getServerRole(userId, serverId);

    if (currentUserRole !== "owner" && currentUserRole !== "admin") {
      throw new Error("Sem permissão para expulsar membro");
    }

    const targetUserRole = await getServerRole(memberId, serverId);
    if (targetUserRole === "owner") {
      throw new Error("Não pode expulsar o dono do servidor");
    }

    if (currentUserRole === "admin" && targetUserRole === "admin") {
      throw new Error("Admins não podem expulsar outros admins");
    }

    const result = await db.$transaction([
      db.channelMember.deleteMany({
        where: {
          userId: memberId,
          serverId: serverId
        }
      }),

      db.memberCargo.deleteMany({
        where: {
          userId: memberId,
          serverId: serverId
        }
      }),

      db.message.deleteMany({
        where: {
          userId: memberId,
          channel: {
            serverId: serverId
          }
        }
      })
    ]);

    return {
      success: true,
      message: "Membro expulso com sucesso",
      data: result
    };

  } catch (error) {
    console.error("Failed to expel member:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

