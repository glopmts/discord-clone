"use server"

import { db } from "@/lib/db"
import { FriendStatus } from "@prisma/client"

export async function getUserById(userId: string) {
  try {
    return await db.user.findUnique({
      where: {
        id: userId,
      },
    })
  } catch (error) {
    console.error("Erro ao buscar usuário:", error)
    return null
  }
}

export async function getUserByClerkId(clerkId: string) {
  try {
    return await db.user.findUnique({
      where: {
        clerk_id: clerkId,
      },
      include: {
        MemberCargo: true,
      }
    })
  } catch (error) {
    console.error("Erro ao buscar usuário por Clerk ID:", error)
    return null
  }
}

export async function updateOnlineStatus(userId: string, status: boolean) {
  try {
    if (!userId) {
      throw new Error("User ID is required!")
    }

    const user = await db.user.update({
      where: {
        clerk_id: userId,
      },
      data: {
        isOnline: status,
      },
    })

    return user
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update online status: ${error.message}`)
    }
    throw new Error("Failed to update online status")
  }
}

export async function getUserDetails(userId: string) {
  try {
    if (!userId) {
      throw new Error("User ID is required!")
    }

    let user = await db.user.findUnique({
      where: {
        clerk_id: userId,
      },
      include: {
        Message: true,
        channels: true,
        Server: true,
      },
    })

    if (!user) {
      user = await db.user.create({
        data: {
          clerk_id: userId,
          name: "Usuário Temporário",
          email: `${userId}@placeholder.com`,
          image: "",
        },
        include: {
          Message: true,
          channels: true,
          Server: true,
        },
      })
    }

    return user
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch or create user: ${error.message}`)
    }
    throw new Error("Failed to fetch or create user")
  }
}


export async function updateUser(userData: {
  userId: string
  name?: string
  username?: string
  description?: string
  image?: string
}) {
  try {
    if (!userData.userId) {
      throw new Error("User ID is required!")
    }

    const userIdentific = await db.user.findUnique({
      where: {
        clerk_id: userData.userId,
      },
    })

    if (!userIdentific) {
      throw new Error("User not found!")
    }

    const update = await db.user.update({
      where: {
        clerk_id: userData.userId
      },
      data: {
        name: userData.name,
        username: userData.username,
        image: userData.image || "",
        description: userData.description || ""
      }
    })

    return update
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed update user: ${error.message}`)
    }
    throw new Error("Failed update user")
  }
}


export async function createFriendship(memberId: string, userId: string) {
  try {
    if (!memberId || !userId) {
      throw new Error("User ID is required or membre ID!")
    }

    const membreAdd = await db.friendship.create({
      data: {
        requesterId: userId,
        addresseeId: memberId,
        status: "PENDING",
      }
    })

    return membreAdd

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed create friends: ${error.message}`)
    }
    throw new Error("Failed create friends")
  }
}

export async function checkFriendshipStatus(addresseeId: string, requesterId: string): Promise<FriendStatus | null> {
  try {
    const friendship = await db.friendship.findFirst({
      where: {
        OR: [
          { requesterId, addresseeId },
          { requesterId: addresseeId, addresseeId: requesterId }
        ]
      }
    });

    return friendship?.status || null;
  } catch (error) {
    console.error("Error checking friendship status:", error);
    return null;
  }
}


export async function getFriends(userId: string) {
  try {
    if (!userId) {
      throw new Error("User ID is required!");
    }

    const friends = await db.friendship.findMany({
      where: {
        OR: [
          { requesterId: userId, status: "FRIENDS" },
          { addresseeId: userId, status: "FRIENDS" }
        ]
      },
      include: {
        addressee: true,
        requester: true
      }
    });

    return friends.map(friendship => {
      const friend = friendship.requesterId === userId ? friendship.addressee : friendship.requester;
      return {
        ...friendship,
        friend
      };
    });

  } catch (error) {
    console.error("Error getting friends:", error);
    return null;
  }
}

export async function canceleFriends(userId: string, addresseeId: string) {
  try {
    if (!userId) {
      throw new Error("User ID is required!");
    }

    const cancele = await db.friendship.deleteMany({
      where: {
        OR: [
          { requesterId: userId, addresseeId, status: "PENDING" },
          { requesterId: addresseeId, addresseeId: userId, status: "PENDING" }
        ]
      }
    });

    return cancele;

  } catch (error) {
    console.error("Error canceling friend request:", error);
    return null;
  }
}


export async function getPendingFriendRequests(userId: string) {
  try {
    if (!userId) {
      throw new Error("User ID is required!");
    }

    const pendingRequests = await db.friendship.findMany({
      where: {
        OR: [
          { requesterId: userId, status: "PENDING" },
          { addresseeId: userId, status: "PENDING" }
        ]
      },
      include: {
        addressee: true,
        requester: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return pendingRequests;

  } catch (error) {
    console.error("Error getting pending friend requests:", error);
    return null;
  }
}

export async function acceptFriends(userId: string, addressee: string) {
  try {

    if (!userId) {
      throw new Error("User ID is required!");
    }

    const acceptRequests = await db.friendship.updateMany({
      where: {
        OR: [
          { requesterId: userId },
          { addresseeId: userId }
        ]
      },
      data: {
        status: "FRIENDS"
      }
    });

    return acceptRequests;

  } catch (error) {
    console.error("Error getting pending friend requests:", error);
    return null;
  }
}

export async function deleteFriendship(userId: string, friendId: string) {
  try {
    if (!userId || !friendId) {
      throw new Error("User ID and Friend ID are required!");
    }

    const friendship = await db.friendship.findFirst({
      where: {
        OR: [
          { requesterId: userId, addresseeId: friendId },
          { requesterId: friendId, addresseeId: userId }
        ]
      }
    });

    if (!friendship) {
      throw new Error("Friendship not found!");
    }

    await db.friendship.delete({
      where: {
        id: friendship.id
      }
    });

    return { success: true };

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to delete friendship: ${error.message}`)
    }
    throw new Error("Failed to delete friendship")
  }
}

export async function deleteMessageFriends(userId: string, messageId: string) {
  try {
    if (!messageId || !userId) {
      throw new Error("Message ID e User ID são obrigatórios.");
    }

    const message = await db.messageFriends.findUnique({
      where: { id: messageId },
      select: {
        receivesId: true,
        sendId: true,
      },
    });

    if (!message) {
      throw new Error("Mensagem não encontrada.");
    }

    if (message.sendId !== userId) {
      throw new Error("Sem permissão para deletar esta mensagem.");
    }

    await db.$transaction([
      db.messageFriends.delete({
        where: { id: messageId }
      })
    ]);

    return { success: true };

  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Falha ao deletar mensagem friends");
  }
}