import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Copy, CopyCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type Modalprops = {
  isOpen: boolean;
  serverConvite?: string;
  serverName: string;
  onClose: () => void
}

const URL = "http://localhost:3000/convite"

const ConviteUserServer = ({
  isOpen,
  serverConvite,
  serverName,
  onClose
}: Modalprops) => {
  const [copy, setCopy] = useState(false);

  const copyToClipboard = () => {
    setCopy(true);
    navigator.clipboard.writeText(`${URL}/${serverConvite}`);
    toast.success("Convite copiado!");
    setTimeout(() => {
      setCopy(false);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("dark:bg-[#242429] bg-background border")}>
        <DialogHeader>
          <DialogTitle>Convidar amigos para {serverName}</DialogTitle>
        </DialogHeader>
        <div className="w-full">

        </div>
        <DialogFooter>
          <div className="flex flex-col gap-1.5 w-full">
            <span>Ou, Envie Um Convite Do Servidor A Um Amigo</span>
            <div className="flex items-center gap-3.5">
              <div className="grid flex-1 gap-2">
                <Input
                  id="link"
                  defaultValue={`${URL}/${serverConvite}`}
                  readOnly
                />
              </div>
              <Button
                type="button"
                size="sm"
                variant={copy ? "outline" : "default"}
                className="px-3"
                onClick={copyToClipboard}
              >
                {copy ? (
                  <CopyCheck className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConviteUserServer;