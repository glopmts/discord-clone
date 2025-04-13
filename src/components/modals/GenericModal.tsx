"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";

type ModalVariant = "createChannel" | "createCategory" | "delete";

interface GenericModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant: ModalVariant;
  serverId?: string;
  categoryId?: string;
  refetch?: () => void;
  title?: string;
  description?: string;
  onConfirm?: () => void;
  children?: ReactNode;
}

export default function GenericModal({
  isOpen,
  onClose,
  variant,
  serverId,
  categoryId,
  refetch,
  title,
  description,
  onConfirm,
  children,
}: GenericModalProps) {
  const [loader, setLoader] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoader(true);
      onConfirm?.();
    } finally {
      setLoader(false);
    }
  };

  const renderContent = () => {
    if (children) return children;

    return null;
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className={cn("bg-[#242429] text-white border-none", {
        "overflow-y-scroll h-[90vh]": variant === "createChannel",
      })}>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            {title || "Modal"}
          </AlertDialogTitle>
          {description && (
            <AlertDialogDescription className="text-gray-400">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>

        {renderContent()}

        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent border-none text-white hover:bg-[#2a2a2e] hover:text-white">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loader}
            className="bg-[#4553BE] text-white hover:bg-[#4553BE]/90 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {loader ? "Processando..." : "Confirmar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}