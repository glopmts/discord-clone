"use server";

import { db } from "@/lib/db";
import { hasPermission } from "@/lib/permissions";
import { ChannelTypes } from "@prisma/client";

export async function createChannel(data: {
  name: string;
  userId: string;
  serverId: string;
  typeChannel: ChannelTypes,
  isPrivate: boolean;
  categoryId?: string;
  channelId?: string;
}) {
  try {
    if (!data.serverId) {
      throw new Error("ID is required server!")
    }

    console.log("data", data)

    if (data.channelId) {
      const channel = await db.channel.findUnique({
        where: { id: data.channelId },
        include: { server: true, messages: true, }
      });

      if (!channel) {
        throw new Error("Channel not found");
      }

      const isOwner = channel.server.ownerId === data.userId;
      const hasAdminPermission = await hasPermission(data.serverId, channel.server.id, 'admin');

      if (!isOwner && !hasAdminPermission) {
        throw new Error("Você precisa ser administrador ou dono do servidor para editar canal");
      }

      const updatedChannel = await db.channel.update({
        where: { id: data.channelId },
        data: {
          name: data.name,
          typeChannel: data.typeChannel,
          isPrivate: data.isPrivate,
          categoryId: data.categoryId,
        },
      });

      return { channel: updatedChannel };
    } else {
      const channel = await db.channel.create({
        data: {
          serverId: data.serverId,
          name: data.name,
          typeChannel: data.typeChannel,
          isPrivate: data.isPrivate,
          categoryId: data.categoryId,
        },
        include: { server: true, messages: true, }
      });

      return { channel };
    }
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