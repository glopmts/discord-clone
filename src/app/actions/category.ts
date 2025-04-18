"use server";

import { db } from "@/lib/db";
import { hasPermission } from "@/lib/permissions";

export async function createNewsCategory(data: {
  serverId: string;
  name: string;
}) {
  try {
    if (!data.serverId || !data.name) {
      throw new Error("Server ID and name are required!")
    }

    const category = await db.category.create({
      data: {
        ...data
      }
    })

    return { category }

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create category: ${error.message}`)
    }
    throw new Error("Failed to create category")
  }
}


export async function deleteCategoryId(categoryId: string, userId: string) {
  try {
    if (!categoryId || !userId) {
      throw new Error("Missing required parameters");
    }

    const category = await db.category.findUnique({
      where: { id: categoryId },
      include: { server: true }
    });

    if (!category) {
      throw new Error("Category not found");
    }

    if (category.server.ownerId !== userId) {
      throw new Error("Unauthorized - You don't own this category");
    }

    const isOwner = category.server.ownerId === userId;
    const hasAdminPermission = await hasPermission(userId, category.server.id, 'admin');

    if (!isOwner && !hasAdminPermission) {
      throw new Error("Você precisa ser administrador ou dono do servidor para deletar categorias");
    }

    return await db.$transaction(async (prisma) => {
      await prisma.message.deleteMany({
        where: {
          channel: {
            categoryId: categoryId
          }
        }
      });

      await prisma.channel.deleteMany({
        where: { categoryId }
      });

      await prisma.category.delete({
        where: { id: categoryId }
      });

      return { success: true };
    });

  } catch (error) {
    console.error("Error deleting category:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to delete category");
  }
}