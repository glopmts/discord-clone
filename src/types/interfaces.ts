import { User } from "@prisma/client";

export type UserIdProps = {
  userId: string;
}

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
  userId?: string;
  serverId?: string;
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