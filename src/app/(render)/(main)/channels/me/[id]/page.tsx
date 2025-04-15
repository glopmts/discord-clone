"use client";

import { useParams } from "next/navigation";

const ChatFriends = () => {
  const { id } = useParams<{ id: string; }>();

  return (
    <div className="w-full h-full p-3">
      {id}
    </div>
  );
}

export default ChatFriends;