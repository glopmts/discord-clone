type Client = { write: (data: any) => void };
export const clients: Record<string, Client[]> = {};

const clientsFriends: Record<string, Record<string, Client[]>> = {};


export function addClient(channelId: string, client: Client) {
  if (!clients[channelId]) clients[channelId] = [];
  clients[channelId].push(client);
}

export function removeClient(channelId: string, client: Client) {
  if (!clients[channelId]) return;
  clients[channelId] = clients[channelId].filter(c => c !== client);
}

export function broadcastMessage(channelId: string, message: any) {
  const channelClients = clients[channelId] || [];
  channelClients.forEach((client) => {
    client.write(message);
  });
}


export function addClientFriends(userId: string, friendId: string, client: Client) {
  if (!clientsFriends[userId]) {
    clientsFriends[userId] = {};
  }
  if (!clientsFriends[userId][friendId]) {
    clientsFriends[userId][friendId] = [];
  }
  clientsFriends[userId][friendId].push(client);
}

export function removeClientFriends(userId: string, friendId: string, client: Client) {
  if (!clientsFriends[userId]?.[friendId]) return;
  clientsFriends[userId][friendId] = clientsFriends[userId][friendId].filter(c => c !== client);
}

export function broadcastMessageFriends(senderId: string, receiverId: string, message: any) {
  if (clientsFriends[receiverId]?.[senderId]) {
    clientsFriends[receiverId][senderId].forEach(client => {
      client.write(message);
    });
  }

  if (clientsFriends[senderId]?.[receiverId]) {
    clientsFriends[senderId][receiverId].forEach(client => {
      client.write(message);
    });
  }
}