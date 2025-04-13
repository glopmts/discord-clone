import { ChannelTypes, User } from "@prisma/client";

export type UserIdProps = {
  userId: string;
}

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
  userId?: string;
  serverId?: string;
  categoryId?: string;
  refetch: () => void;
}

export interface MessageProps {
  id: string;
  content: string;
  userId: string;
  channelId: string;
  user: {
    name: string;
    username: string;
    image: string | null;
  };
  createdAt: Date | string;
}


export type MessagePropsRender = {
  allMessages: Array<MessageProps & {
    user: {
      name: string | null;
      id: string;
      clerk_id: string | null;
      username: string | null;
      image: string | null;
      email: string | null;
      password: string | null;
      description: string | null;
      updatedAt: Date;
    };
  }>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export interface InterfacesRender {
  server: {
    name: string;
    id: string;
    createdAt: Date;
    Category: {
      id: string;
      name: string;
      channels: {
        id: string;
        name: string;
        typeChannel: ChannelTypes;
        createdAt: Date;
        serverId: string;
        categoryId: string | null;
        isPrivate: boolean;
        botId: string | null;
      }[];
    }[];
    members?: any[];
  };

  handleNewsChannel: (categoryId?: string) => void;
  handleNewsCategory: () => void;
  handleServerClick: (id: string) => void;
  handleEdite: () => void;
  currentChannelId?: string;
  handleDelete: (categoryId: string, categoryName: string) => void;
}