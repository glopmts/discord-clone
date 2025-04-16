import { db } from "@/lib/db";
import { broadcastMessageFriends } from "@/lib/sse";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { content, sendId, receivesId } = await req.json();

    if (!content || !sendId || !receivesId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const newMessage = await db.messageFriends.create({
      data: { content, sendId, receivesId },
      include: {
        sendUser: true,
        receivesFriends: true
      },
    });

    broadcastMessageFriends(sendId, receivesId, newMessage);

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error("[MESSAGE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}