"use server";

import { db } from "@/lib/db";
import { hasPermission } from "@/lib/permissions";
import { Category } from "@prisma/client";

export async function createOrUpdateCategory(data: {
  serverId: string;
  name: string;
  categoryId?: string;
}) {
  try {
    if (!data.serverId || !data.name) {
      throw new Error("Server ID and name are required!");
    }

    if (data.categoryId) {
      const updatedCategory = await db.category.update({
        where: { id: data.categoryId },
        data: {
          name: data.name,
        },
      });

      return { category: updatedCategory };
    } else {
      const newCategory = await db.category.create({
        data: {
          serverId: data.serverId,
          name: data.name,
        },
      });

      return { category: newCategory };
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create or update category: ${error.message}`);
    }
    throw new Error("Failed to create or update category");
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

export async function updateActiveCategory(categoryId: string): Promise<{ category: Category }> {
  if (!categoryId) {
    throw new Error("Category ID is required");
  }

  const category = await db.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  try {
    const updatedCategory = await db.category.update({
      where: { id: categoryId },
      data: { isActive: !category.isActive },
    });

    return { category: updatedCategory };
  } catch (error) {
    console.error("Error updating active category:", error);
    throw error instanceof Error ? error : new Error("Failed to update active category");
  }
}