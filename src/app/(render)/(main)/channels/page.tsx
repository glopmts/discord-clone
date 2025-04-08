"use client";

import { useAuth } from "@clerk/nextjs";

const Channels = () => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold">Channels</h1>
      <p className="mt-4 text-gray-600">This is the Channels page.</p>
      <button
        onClick={handleSignOut}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Sign Out
      </button>
    </div>
  );
}

export default Channels;