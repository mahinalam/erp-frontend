import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import type { Buyer } from "@/lib/api/buyer.api";

type Props = { buyer: Buyer | null; deleting: boolean; onOpenChange: (open: boolean) => void; onConfirm: () => void };

export function BuyerDeleteDialog({ buyer, deleting, onOpenChange, onConfirm }: Props) {
  return (
    <AlertDialog open={buyer !== null} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader><AlertDialogTitle>Delete buyer?</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete <strong>{buyer?.name}</strong>? This will remove the buyer from the active list.</AlertDialogDescription></AlertDialogHeader>
        <AlertDialogFooter><AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel><AlertDialogAction disabled={deleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={(event) => { event.preventDefault(); onConfirm(); }}>{deleting ? "Deleting..." : "Delete Buyer"}</AlertDialogAction></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
