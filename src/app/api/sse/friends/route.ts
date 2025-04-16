import { addClientFriends, removeClientFriends } from "@/lib/sse";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const friendId = searchParams.get("friendId");

  if (!userId || !friendId) {
    return new Response("userId and friendId are required", { status: 400 });
  }

  try {
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        const clientRes = {
          write: (data: any) => {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
          },
        };

        addClientFriends(userId, friendId, clientRes);

        req.signal.addEventListener("abort", () => {
          removeClientFriends(userId, friendId, clientRes);
          controller.close();
        });
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("[SSE_GET]", error);
    return new Response("Internal Error", { status: 500 });
  }
}