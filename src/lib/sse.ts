type Client = { write: (data: any) => void };
export const clients: Record<string, Client[]> = {};

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
