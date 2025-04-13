"use server";

import { db } from "@/lib/db";

export async function markAllMessagesAsRead(serverId: string, userId: string) {
  try {
    if (!serverId || !userId) {
      throw new Error("Server ID e User ID são obrigatórios.");
    }

    const messages = await db.message.findMany({
      where: {
        channel: { serverId },
        MessageRead: {
          none: { userId }
        }
      },
      select: { id: true }
    });

    if (messages.length === 0) return;

    const data = messages.map(message => ({
      userId,
      messageId: message.id
    }));

    await db.messageRead.createMany({
      data,
      skipDuplicates: true
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to mark messages: ${error.message}`)
    }
    throw new Error("Failed to mark messages")
  }
}