import { getDirectMessages } from "@/app/actions/menssagens";
import { getServer } from "@/app/actions/servers";
import { ModalVariant } from "@/types/interfaces";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface ModalState {
  isOpen: boolean;
  variant: ModalVariant | null;
  categoryId?: string;
  deleteData?: { id: string; name: string };
}

export const useServerData = (id: string | null) => {
  return useQuery({
    queryKey: ["server", id],
    queryFn: () => (id ? getServer(id) : null),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useDirectMessages = (userId: string | null) => {
  return useQuery({
    queryKey: ["direct_messages", userId],
    queryFn: () => (userId ? getDirectMessages(userId) : null),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  });
};

export const useModalState = (initialState?: Partial<ModalState>) => {
  const [state, setState] = useState<ModalState>({
    isOpen: false,
    variant: null,
    ...initialState,
  });

  const openModal = (variant: ModalVariant, options?: Partial<ModalState>) => {
    setState({
      isOpen: true,
      variant,
      ...options,
    });
  };

  const closeModal = () => {
    setState(prev => ({ ...prev, isOpen: false }));
  };

  return {
    modalState: state,
    setModalState: setState,
    openModal,
    closeModal
  };
};