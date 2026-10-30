import { FormField } from "@/components/shared/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Buyer } from "@/lib/api/buyer.api";
import { BuyerFormValues } from "../buyer-utils";
// import type { BuyerFormValues } from "../buyer.utils";

const inputClass = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

type Props = { open: boolean; onOpenChange: (open: boolean) => void; editingBuyer: Buyer | null; form: BuyerFormValues; formError: string; saving: boolean; onFormChange: <K extends keyof BuyerFormValues>(field: K, value: BuyerFormValues[K]) => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void; };

export function BuyerFormDialog({ open, onOpenChange, editingBuyer, form, formError, saving, onFormChange, onSubmit }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader><DialogTitle>{editingBuyer ? "Edit Buyer" : "Add New Buyer"}</DialogTitle><DialogDescription>Enter the buyer information below. Buyer code is generated automatically.</DialogDescription></DialogHeader>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-4">
            <FormField label="Buyer Name" htmlFor="buyer-name" required><Input id="buyer-name" value={form.name} onChange={(event) => onFormChange("name", event.target.value)} placeholder="Enter buyer name" className="h-10" required maxLength={150} /></FormField>
            <FormField label="Country" htmlFor="buyer-country" hint="Country where the buyer is based."><Input id="buyer-country" value={form.country} onChange={(event) => onFormChange("country", event.target.value)} placeholder="e.g. Sweden" className="h-10" maxLength={100} /></FormField>
            <FormField label="Email Address" htmlFor="buyer-email"><Input id="buyer-email" type="email" value={form.email} onChange={(event) => onFormChange("email", event.target.value)} placeholder="buyer@example.com" className="h-10" maxLength={254} /></FormField>
            <FormField label="Phone Number" htmlFor="buyer-phone"><Input id="buyer-phone" type="tel" value={form.phone} onChange={(event) => onFormChange("phone", event.target.value)} placeholder="Enter phone number" className="h-10" maxLength={30} /></FormField>
            {editingBuyer && <FormField label="Status" htmlFor="buyer-status"><select id="buyer-status" value={form.isActive ? "active" : "inactive"} onChange={(event) => onFormChange("isActive", event.target.value === "active")} className={`${inputClass} h-10`}><option value="active">Active</option><option value="inactive">Inactive</option></select></FormField>}
          </div>
          {formError && <p role="alert" className="text-sm text-destructive">{formError}</p>}
          <DialogFooter className="gap-2 border-t pt-4"><Button type="button" variant="outline" disabled={saving} onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? (editingBuyer ? "Saving changes..." : "Creating buyer...") : (editingBuyer ? "Save Changes" : "Create Buyer")}</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
