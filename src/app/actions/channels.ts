"use server";

import { db } from "@/lib/db";
import { hasPermission } from "@/lib/permissions";
import { ChannelTypes } from "@prisma/client";

export async function createChannel(data: {
  serverId: string,
  name: string,
  typeChannel: ChannelTypes,
  isPrivate: boolean,
  categoryId?: string
}) {
  try {
    if (!data.serverId) {
      throw new Error("ID is required server!")
    }

    const createChanell = await db.channel.create({
      data: {
        ...data,
        categoryId: data.categoryId || null
      }
    })

    return createChanell;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed create channel: ${error.message}`)
    }
    throw new Error("Failed create channel")
  }
}


export async function getChannelId(id: string) {
  try {
    if (!id) {
      throw new Error("ID is required channel!")
    }

    const channel = await db.channel.findUnique({
      where: {
        id,
      },
      include: {
        messages: {
          include: {
            channel: true,
            user: true,
          }
        },
        server: true,
        bot: true,
      }
    })

    return channel;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed get channel: ${error.message}`)
    }
    throw new Error("Failed get channel")
  }
}

export async function deleteChannel(channelId: string, userId: string) {
  try {
    if (!channelId) {
      throw new Error("ID is required channel!")
    }

    const channel = await db.channel.findUnique({
      where: { id: channelId },
      include: { server: true, messages: true, }
    });

    if (!channel) {
      throw new Error("Channel not found");
    }

    if (channel.server.ownerId !== userId) {
      throw new Error("Unauthorized - You don't own this channel");
    }

    const isOwner = channel.server.ownerId === userId;
    const hasAdminPermission = await hasPermission(userId, channel.server.id, 'admin');

    if (!isOwner && !hasAdminPermission) {
      throw new Error("Você precisa ser administrador ou dono do servidor para deletar canal");
    }

    const messageId = channel.messages.map((msg) => msg.id);

    await db.$transaction([
      db.messageRead.deleteMany({
        where: { messageId: { in: messageId } }
      }),
      db.message.deleteMany({
        where: { id: { in: messageId } }
      }),
      db.channel.delete({
        where: { id: channelId }
      }),
    ]);

    return { success: true };

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed delete channel: ${error.message}`)
    }
    throw new Error("Failed delete channel")
  }
}