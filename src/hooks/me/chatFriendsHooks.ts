import { getMessagesFriends } from "@/app/actions/menssagens";
import { getServersByUserId } from "@/app/actions/servers";
import { getUserById } from "@/app/actions/user";
import { useQuery } from "@tanstack/react-query";

export const useUserMessages = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["userMessages", userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  });
};

export const userFriends = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["currentUserServers", userId],
    queryFn: () => getServersByUserId(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  })
};

export const useServersByUserId = (friendsClerck: string | undefined) => {
  return useQuery({
    queryKey: ["friendServers", friendsClerck],
    queryFn: () => getServersByUserId(friendsClerck!),
    enabled: !!friendsClerck
  });
};

export const useMessagesFriends = (friendsClerck: string, userId: string) => {
  return useQuery({
    queryKey: ["messages_friends", userId, friendsClerck],
    queryFn: () => getMessagesFriends(userId!, friendsClerck!),
    enabled: !!friendsClerck || !!userId
  });
};

