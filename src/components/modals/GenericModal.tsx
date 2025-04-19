import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { ModalVariant } from "@/types/interfaces";
import { ReactNode, useState } from "react";


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
  title,
  description,
  onConfirm,
  children,
}: GenericModalProps) {
  const [loader, setLoader] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoader(true);
      await onConfirm?.();
    } finally {
      setLoader(false);
    }
  };

  const renderContent = () => {
    if (children) return children;

    return null;
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => {
      if (!open && !loader) {
        onClose();
      }
    }}
    >
      <AlertDialogContent className={cn("dark:bg-[#242429] bg-background border-none z-[360]", {
        "overflow-y-scroll h-[90vh]": variant === "createChannel",
      })}>
        <AlertDialogHeader>
          <AlertDialogTitle className="">
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
          <button onClick={onClose} className={cn("text-blue-600 mr-4 cursor-pointer hover:opacity-65")}>
            Cancelar
          </button>
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