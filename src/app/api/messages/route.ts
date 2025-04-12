import { db } from "@/lib/db";
import { broadcastMessage } from "@/lib/sse";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { content, userId, channelId } = await req.json();

    const newMessage = await db.message.create({
      data: { content, userId, channelId },
      include: { user: true },
    });

    broadcastMessage(channelId, newMessage);

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error("[MESSAGE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
