"use server";

import { db } from "@/lib/db";

export async function getUserServers(userId: string) {
  try {

    if (!userId) {
      throw new Error("User ID is required!")
    }

    const servers = await db.server.findMany({
      where: {
        ownerId: userId
      },
      include: {
        channels: {
          include: {
            messages: true
          }
        },
        members: true,
      }
    })

    return servers
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed get servers: ${error.message}`)
    }
    throw new Error("Failed get servers")
  }
}

export async function geServer(id: string) {
  try {

    if (!id) {
      throw new Error("ID is required!")
    }

    const server = await db.server.findUnique({
      where: {
        id,
      },
      include: {
        channels: true,
        members: {
          include: {
            user: true,
          }
        },
      }
    })

    return server
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed get server: ${error.message}`)
    }
    throw new Error("Failed get server")
  }
}



export async function createNewsServers(data: {
  userId: string;
  name: string;
  image: string;
}) {
  try {

    if (!data.userId || !data.name) {
      throw new Error("User ID is required or name!")
    }

    const createServe = await db.server.create({
      data: {
        ownerId: data.userId,
        name: data.name,
        image: data.image,
      }
    })

    return createServe
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed create server: ${error.message}`)
    }
    throw new Error("Failed create server")
  }
}