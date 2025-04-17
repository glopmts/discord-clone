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


export async function markMessagesChannelRead(channelId: string, userId: string) {
  try {
    if (!channelId || !userId) {
      throw new Error("Channel ID e User ID são obrigatórios.");
    }

    const unreadMessages = await db.message.findMany({
      where: {
        channelId: channelId,
        MessageRead: {
          none: { userId }
        }
      },
      select: { id: true }
    });

    if (unreadMessages.length === 0) return;

    const readRecords = unreadMessages.map(message => ({
      userId,
      messageId: message.id
    }));

    await db.messageRead.createMany({
      data: readRecords,
      skipDuplicates: true
    });

    return unreadMessages.length;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to mark messages as read: ${error.message}`);
    }
    throw new Error("Failed to mark messages as read");
  }
}

export async function deleteMessage(userId: string, messageId: string) {
  try {
    if (!messageId || !userId) {
      throw new Error("Message ID e User ID são obrigatórios.");
    }

    const message = await db.message.findUnique({
      where: { id: messageId },
      select: { userId: true },
    });

    if (!message) {
      throw new Error("Mensagem não encontrada.");
    }

    if (message.userId !== userId) {
      throw new Error("Sem permissão para deletar esta mensagem.");
    }

    await db.$transaction([
      db.messageRead.deleteMany({
        where: { messageId }
      }),
      db.message.delete({
        where: { id: messageId }
      })
    ]);

    return { success: true };

  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Falha ao deletar mensagem");
  }
}

export async function getUnreadMessagesCount(userId: string, channelId: string) {
  try {
    if (!userId || !channelId) {
      return 0;
    }

    const count = await db.message.count({
      where: {
        channelId: channelId,
        MessageRead: {
          none: {
            userId: userId
          }
        }
      }
    });

    return count;
  } catch (error) {
    console.error("Error fetching unread messages count:", error);
    return 0;
  }
}

//friends functions

export async function getMessagesFriends(userId: string, receivesId: string) {
  try {
    if (!receivesId || !userId) {
      throw new Error("Receives ID e User ID são obrigatórios.");
    }

    const messages = await db.messageFriends.findMany({
      where: {
        OR: [
          { sendId: userId, receivesFriends: { clerk_id: receivesId } },
          { sendId: receivesId, receivesFriends: { clerk_id: userId } }
        ]
      },
      include: {
        receivesFriends: true,
        sendUser: true,
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    return messages;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get messages between friends: ${error.message}`);
    }
    throw new Error("Failed to get messages between friends");
  }
}


export async function getDirectMessages(userId: string) {
  try {
    if (!userId) {
      throw new Error("User ID is required!");
    }

    const conversations = await db.messageFriends.findMany({
      where: {
        OR: [
          { sendId: userId },
          { receivesId: userId }
        ]
      },
      select: {
        sendUser: {
          select: {
            id: true,
            clerk_id: true,
            username: true,
            name: true,
            image: true,
          }
        },
        receivesFriends: {
          select: {
            id: true,
            clerk_id: true,
            username: true,
            name: true,
            image: true,
          }
        }
      },
      distinct: ['sendId', 'receivesId']
    });

    const otherUsers = conversations
      .map(conv =>
        conv.sendUser.clerk_id === userId
          ? conv.receivesFriends
          : conv.sendUser
      )
      .filter((user, index, self) =>
        index === self.findIndex(u => u.clerk_id === user.clerk_id)
      );

    return otherUsers;

  } catch (error) {
    console.error("Error getting conversation partners:", error);
    return [];
  }
}

