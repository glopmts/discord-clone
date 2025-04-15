"use server";

import { db } from "@/lib/db";

export async function getUserServersWithUnreadCount(userId: string) {
  try {
    if (!userId) {
      throw new Error("User ID is required!");
    }

    const servers = await db.server.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } }
        ]
      },
      include: {
        channels: {
          select: { id: true }
        },
        members: true,
        MemberCargo: true,
        Category: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const serversWithCount = await Promise.all(
      servers.map(async (server) => {
        const unreadCount = await db.message.count({
          where: {
            channel: {
              serverId: server.id
            },
            MessageRead: {
              none: {
                userId: userId
              }
            }
          }
        });

        return {
          ...server,
          unreadCount
        };
      })
    );

    return serversWithCount;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get servers: ${error.message}`);
    }
    throw new Error("Failed to get servers");
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
        Category: {
          include: {
            channels: true,
          }
        },
        members: {
          include: {
            user: {
              include: {
                MemberCargo: true
              }
            },
          }
        },
        MemberCargo: true,
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
  userId: string | undefined;
  name: string;
  image: string;
}) {
  try {
    if (!data.userId || !data.name) {
      throw new Error("User ID and name are required!")
    }

    const server = await db.server.create({
      data: {
        ownerId: data.userId,
        name: data.name,
        image: data.image
      }
    })

    const category = await db.category.create({
      data: {
        name: "Canais de Texto",
        serverId: server.id,
        channels: {
          create: {
            name: "geral",
            serverId: server.id,
            typeChannel: "TEXT"
          }
        }
      }
    })

    return { server, category }

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create server: ${error.message}`)
    }
    throw new Error("Failed to create server")
  }
}

export async function geServerCode(id: string) {
  try {

    if (!id) {
      throw new Error("ID is required!")
    }

    const server = await db.server.findUnique({
      where: {
        inviteCode: id
      },
      include: {
        members: true,
        channels: {
          select: {
            id: true
          }
        }
      }
    })

    return server
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed get server code: ${error.message}`)
    }
    throw new Error("Failed get server code")
  }
}

export async function joinServer(userId: string, serverId: string) {
  try {
    if (!userId || !serverId) throw new Error("Missing userId or serverId");

    await db.channelMember.create({
      data: {
        userId,
        serverId
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to join server:", error);
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
}


export async function exitServer(userId: string, serverId: string) {
  try {
    if (!userId || !serverId) throw new Error("Missing userId or serverId");

    const verifqServer = await db.server.findUnique({
      where: {
        id: serverId
      }
    })

    if (!verifqServer) {
      throw new Error("Server does not exist!")
    }

    await db.channelMember.delete({
      where: {
        userId_serverId: {
          userId: userId,
          serverId: serverId
        }
      }
    })

    return { success: true };
  } catch (error) {
    console.error("Failed to exit server:", error);
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
}


export async function deleteServer(userId: string, serverId: string) {
  try {
    if (!userId || !serverId) throw new Error("Missing userId or serverId");

    const server = await db.server.findUnique({
      where: {
        id: serverId
      },
      include: {
        Category: {
          include: {
            channels: true
          }
        },
        channels: true,
        members: true,
      }
    });

    if (!server) {
      throw new Error("Server does not exist!");
    }

    if (server.ownerId !== userId) {
      throw new Error("You are not authorized to delete this server!");
    }

    // Delete all associated data
    await db.$transaction([
      db.message.deleteMany({
        where: {
          channelId: {
            in: server.channels.map(channel => channel.id)
          }
        }
      }),
      db.channelMember.deleteMany({
        where: {
          serverId: serverId
        }
      }),
      db.channel.deleteMany({
        where: {
          serverId: serverId
        }
      }),
      db.category.deleteMany({
        where: {
          serverId: serverId
        }
      }),
      db.server.delete({
        where: {
          id: serverId
        }
      })
    ]);

    return { success: true };
  } catch (error) {
    console.error("Failed to delete server:", error);
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
  }
}


