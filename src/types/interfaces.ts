import { ChannelTypes, Roles, User } from "@prisma/client";
import { ReactNode } from "react";

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



export interface UserProps {
  id: string;
  clerk_id: string | null;
  name: string | null;
  username: string | null;
  image: string | null;
  email: string | null;
  password: string | null;
  description: string | null;
  updatedAt: Date;
}

export interface MessageProps {
  id: string;
  content: string;
  userId: string;
  channelId: string;
  image: string | null;
  createdAt: Date;
  user: UserProps;
}

export interface ServerProps {
  id: string;
  image: string | null;
  ownerId: string;
  name: string;
  inviteCode: string;
  createdAt: Date;
  MemberCargo: {
    id: string;
    userId: string;
    serverId: string;
    role: Roles;
  }[];
}

export type MessagePropsRender = {
  allMessages: MessageProps[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  handleDeleteMessage: (messageId: string) => void;
  currentUserId: string;
  server?: ServerProps;
};

export interface InterfacesRender {
  server: {
    id: string;
    name: string;
    ownerId: string;
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
    MemberCargo: {
      role: Roles,
      userId: string;
    }[]
  };
  userId: string;

  handleNewsChannel: (categoryId?: string) => void;
  handleDeleteChannel: (channelId: string) => Promise<void>;
  handleEditChannel: (channelId?: string) => void;
  handleNewsCategory: () => void;
  handleServerClick: (id: string) => void;
  handleEdite: () => void;
  currentChannelId?: string;
  handleDelete: (categoryId: string, categoryName: string) => void;
}

export type MenuItem = {
  label: string;
  action: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  destructive?: boolean;
  showDeleteOption?: boolean;
};

export interface ServerPropsMember {
  server: {
    id: string;
    members: {
      id: string;
      user: User & {
        MemberCargo: {
          userId: string;
          id: string;
          createdAt: Date;
          updatedAt: Date;
          serverId: string;
          role: Roles;
        }[];
      };
    }[];
  };
  currentUserId: string;
  handleExpulseMember: (memberId: string) => void;
}

export type UnifiedMessage = {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    id?: string;
    clerk_id?: string;
    name: string;
    username?: string;
    image?: string | null;
  };
  userId?: string;
  sendUser?: any;
  receivesFriends?: any;
};
