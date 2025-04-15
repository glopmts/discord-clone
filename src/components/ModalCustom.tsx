import { ReactNode, useEffect, useRef } from "react";

type ModalProps = {
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
};

const ModalInfor = ({
  title,
  description,
  children,
  className,
  isOpen,
  onClose,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className={`w-[240px] h-[148px] bg-zinc-800 border absolute right-10 rounded-md z-[1100] ${className}`}
    >
      <div className="w-full p-2 flex flex-col gap-1.5">
        {title && (
          <div className="flex flex-col gap-2.5">
            <h3 className="text-base font-semibold">{title}</h3>
            {description && (
              <span className="text-sm text-zinc-400">{description}</span>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default ModalInfor;