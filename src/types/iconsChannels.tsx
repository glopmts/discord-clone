import { ChannelTypes } from "@prisma/client";
import { Hash, Megaphone, MessageSquare, Mic, Podcast } from "lucide-react";


export const channelIcons = {
  [ChannelTypes.TEXT]: <Hash className="h-4 w-4 mr-1 text-neutral-400" />,
  [ChannelTypes.VOZ]: <Mic className="h-4 w-4 mr-1 text-neutral-400" />,
  [ChannelTypes.FORUM]: <MessageSquare className="h-4 w-4 mr-1 text-neutral-400" />,
  [ChannelTypes.ANNOUNCEMENT]: <Megaphone className="h-4 w-4 mr-1 text-neutral-400" />,
  [ChannelTypes.STAGE]: <Podcast className="h-4 w-4 mr-1 text-neutral-400" />,
};