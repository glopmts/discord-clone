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