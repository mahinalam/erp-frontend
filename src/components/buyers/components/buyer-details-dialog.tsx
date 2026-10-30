import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Buyer } from "@/lib/api/buyer.api";
import { formatBuyerDate } from "../buyer-utils";
// import { formatBuyerDate } from "../buyer.utils";

type Props = { buyer: Buyer | null; open: boolean; onOpenChange: (open: boolean) => void };

export function BuyerDetailsDialog({ buyer, open, onOpenChange }: Props) {
  const rows: [string, string | null | undefined][] = buyer ? [
    ["Buyer Name", buyer.name], ["Buyer Code", buyer.code], ["Country", buyer.country], ["Email", buyer.email], ["Phone", buyer.phone],
    ["Status", buyer.isActive ? "Active" : "Inactive"], ["Created At", formatBuyerDate(buyer.createdAt)], ["Last Updated", formatBuyerDate(buyer.updatedAt)],
  ] : [];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg"><DialogHeader><DialogTitle>Buyer Details</DialogTitle><DialogDescription>View the selected buyer&apos;s information.</DialogDescription></DialogHeader>
        {buyer && <div className="space-y-4">{rows.map(([label, value]) => <div key={label} className="flex flex-col gap-1 border-b pb-3 sm:flex-row sm:justify-between"><span className="text-sm text-muted-foreground">{label}</span><span className="break-all text-sm font-medium">{value || "—"}</span></div>)}
          <div className="flex justify-end"><Button type="button" variant="outline" onClick={() => onOpenChange(false)}><X className="mr-2 h-4 w-4" /> Close</Button></div>
        </div>}
      </DialogContent>
    </Dialog>
  );
}
