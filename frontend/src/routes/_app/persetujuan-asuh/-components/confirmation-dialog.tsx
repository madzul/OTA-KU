import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CircleCheck, CircleX } from "lucide-react";

function ConfirmationDialog({ id }: { id: string }) {
  return (
    <div className="flex gap-2">
      <Dialog>
        <CircleCheck className="text-succeed h-6 w-6 cursor-pointer" />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Terima</DialogTitle>
          </DialogHeader>
          <p>Apakah Anda yakin ingin menerima ID: {id}?</p>
        </DialogContent>
      </Dialog>
      <Dialog>
        <CircleX className="text-destructive h-6 w-6 cursor-pointer" />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Tolak</DialogTitle>
          </DialogHeader>
          <p>Apakah Anda yakin ingin menolak ID: {id}?</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ConfirmationDialog;
