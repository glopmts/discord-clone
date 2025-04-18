import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { FC } from "react";

type ModalProps = {
  title?: string;
  titleButton?: string;
  description?: string;
  isOpen: boolean;
  handleConfirm: () => void;
  onClose: () => void;
  loader?: boolean;
}

const ModalGlobalDelete: FC<ModalProps> = ({
  isOpen,
  description,
  title,
  titleButton,
  loader,
  onClose,
  handleConfirm
}) => {
  return (
    <AlertDialog open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}>
      <AlertDialogContent className={cn("dark:bg-[#242429] bg-background")}>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir {title}</AlertDialogTitle>
          <AlertDialogDescription>
            Deseja mesmo excluir  <strong>{description}</strong> ? Esta ação é irreversível.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent border-none text-blue-500  hover:text-white" onClick={onClose}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 border hover:bg-red-500 text-white rounded-md p-2"
            disabled={loader}
            onClick={handleConfirm}>
            {loader ? "Deletando..." : titleButton}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ModalGlobalDelete;