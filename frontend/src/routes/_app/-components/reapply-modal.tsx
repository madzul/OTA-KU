import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ReapplyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  daysRemaining: number;
  onReapply: () => void;
  onDelay: () => void;
}

export default function ReapplyModal({
  open,
  onOpenChange,
  daysRemaining,
  onReapply,
  onDelay,
}: ReapplyModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center text-[#0A2463]">
            Masa bantuan akan segera berakhir!
          </DialogTitle>
        </DialogHeader>
        
        <DialogDescription className="text-center">
          Masa bantuan orang tua asuh Anda akan berakhir dalam {daysRemaining} hari. Apakah Anda ingin memperpanjang periode bantuan ini?
        </DialogDescription>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={onDelay}
            className="w-full sm:w-auto"
          >
            Nanti saja
          </Button>
          <Button 
            variant="default"
            onClick={onReapply}
            className="w-full sm:w-auto bg-primary"
          >
            Perpanjang
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}