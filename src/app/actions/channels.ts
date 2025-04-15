"use server";

import { db } from "@/lib/db";
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