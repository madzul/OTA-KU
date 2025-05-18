import { AllAccountListElement } from "@/api/generated";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";

import DetailDialog from "./detail-dialog";

function DropdownMenuAccount({ account }: { account: AllAccountListElement }) {
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <DialogTrigger className="flex cursor-pointer gap-2">
              <Eye className="h-4 w-4" />
              Lihat Detail
            </DialogTrigger>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DetailDialog account={account} />
    </Dialog>
  );
}

export default DropdownMenuAccount;
