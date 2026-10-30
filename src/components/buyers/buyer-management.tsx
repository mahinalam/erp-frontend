


"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBuyers, useCreateBuyer, useUpdateBuyer, useDeleteBuyer } from "@/hooks/use-buyers.hook";
import type { Buyer } from "@/lib/api/buyer.api";
import { BuyerStats } from "./components/buyer-stats";
import { BuyerToolbar } from "./components/buyer-toolbar";
import { BuyerTable } from "./components/buyer-table";
import { BuyerFormDialog } from "./components/buyer-form-dialog";
import { BuyerDetailsDialog } from "./components/buyer-details-dialog";
import { BuyerDeleteDialog } from "./components/buyer-delete-dialog";
import { BuyerFormValues, BuyerStatusFilter, buyerToForm, emptyBuyerForm, getErrorMessage, PAGE_SIZE } from "./buyer-utils";
// import { buyerToForm, emptyBuyerForm, getErrorMessage, PAGE_SIZE, type BuyerFormValues, type BuyerStatusFilter } from "./buyer.utils";

export default function BuyerManagement() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<BuyerStatusFilter>("all");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editingBuyer, setEditingBuyer] = useState<Buyer | null>(null);
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
  const [buyerToDelete, setBuyerToDelete] = useState<Buyer | null>(null);
  const [form, setForm] = useState<BuyerFormValues>({ ...emptyBuyerForm });
  const [formError, setFormError] = useState("");

  const buyersQuery = useBuyers({ page, limit: PAGE_SIZE, search: search.trim(), status });
  const createBuyer = useCreateBuyer();
  const updateBuyer = useUpdateBuyer();
  const deleteBuyer = useDeleteBuyer();

  const buyers = buyersQuery.data?.data ?? [];
  const total = buyersQuery.data?.meta?.total ?? 0;
  const totalPages = Math.max(1, buyersQuery.data?.meta?.lastPage ?? 1);
  const saving = createBuyer.isPending || updateBuyer.isPending;
  const deleting = deleteBuyer.isPending;

  function openAddDialog() {
    setEditingBuyer(null); setForm({ ...emptyBuyerForm }); setFormError(""); setFormOpen(true);
  }

  function openEditDialog(buyer: Buyer) {
    setEditingBuyer(buyer); setForm(buyerToForm(buyer)); setFormError(""); setFormOpen(true);
  }

  function changeForm<K extends keyof BuyerFormValues>(field: K, value: BuyerFormValues[K]) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function handleFormOpenChange(open: boolean) {
    if (!open && saving) return;
    setFormOpen(open);
    if (!open) { setEditingBuyer(null); setForm({ ...emptyBuyerForm }); setFormError(""); }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setFormError("");
    const payload = { name: form.name.trim(), country: form.country.trim(), email: form.email.trim(), phone: form.phone.trim() };
    if (!payload.name) { setFormError("Buyer name is required."); return; }
    try {
      if (editingBuyer) {
        await updateBuyer.mutateAsync({ id: editingBuyer.id, payload: { ...payload, isActive: form.isActive } });
        toast.success("Buyer updated successfully.");
      } else {
        await createBuyer.mutateAsync(payload);
        toast.success("Buyer created successfully.");
      }
      handleFormOpenChange(false);
    } catch (error) {
      const message = getErrorMessage(error, editingBuyer ? "Failed to update buyer." : "Failed to create buyer.");
      setFormError(message); toast.error(message);
    }
  }

  async function handleToggleStatus(buyer: Buyer) {
    try {
      await updateBuyer.mutateAsync({ id: buyer.id, payload: { isActive: !buyer.isActive } });
      toast.success(buyer.isActive ? "Buyer deactivated successfully." : "Buyer activated successfully.");
    } catch (error) { toast.error(getErrorMessage(error, "Failed to update buyer status.")); }
  }

  async function handleDelete() {
    if (!buyerToDelete || deleting) return;
    try {
      await deleteBuyer.mutateAsync(buyerToDelete.id);
      toast.success("Buyer deleted successfully."); setBuyerToDelete(null);
      if (buyers.length === 1 && page > 1) setPage((current) => current - 1);
    } catch (error) { toast.error(getErrorMessage(error, "Failed to delete buyer.")); }
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Buyer Management</h1><p className="mt-1 text-sm text-muted-foreground">Manage buyers and their information.</p></div>
        <Button type="button" onClick={openAddDialog}><Plus className="mr-2 h-4 w-4" /> Add Buyer</Button>
      </div>

      <BuyerStats total={total} active={buyers.filter((buyer) => buyer.isActive).length} inactive={buyers.filter((buyer) => !buyer.isActive).length} />

      <Card>
        <CardHeader><CardTitle>All Buyers</CardTitle><p className="text-sm text-muted-foreground">Search, view and manage your buyer records.</p></CardHeader>
        <CardContent className="space-y-4">
          <BuyerToolbar search={search} status={status} refreshing={buyersQuery.isFetching} onSearchChange={(value) => { setSearch(value); setPage(1); }} onStatusChange={(value) => { setStatus(value); setPage(1); }} onRefresh={() => { void buyersQuery.refetch(); }} />
          {buyersQuery.isError && <div role="alert" className="flex flex-col gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive sm:flex-row sm:items-center sm:justify-between"><span>{getErrorMessage(buyersQuery.error, "Failed to load buyers.")}</span><Button type="button" size="sm" variant="outline" onClick={() => { void buyersQuery.refetch(); }}>Try again</Button></div>}
          <BuyerTable buyers={buyers} loading={buyersQuery.isPending} loadError={buyersQuery.isError} total={total} page={page} totalPages={totalPages} refreshing={buyersQuery.isFetching} updating={updateBuyer.isPending} deleting={deleting} onView={(buyer) => { setSelectedBuyer(buyer); setDetailsOpen(true); }} onEdit={openEditDialog} onToggleStatus={(buyer) => { void handleToggleStatus(buyer); }} onDelete={setBuyerToDelete} onPageChange={setPage} />
        </CardContent>
      </Card>

      <BuyerFormDialog open={formOpen} onOpenChange={handleFormOpenChange} editingBuyer={editingBuyer} form={form} formError={formError} saving={saving} onFormChange={changeForm} onSubmit={(event) => { void handleSubmit(event); }} />
      <BuyerDetailsDialog buyer={selectedBuyer} open={detailsOpen} onOpenChange={setDetailsOpen} />
      <BuyerDeleteDialog buyer={buyerToDelete} deleting={deleting} onOpenChange={(open) => { if (!open && !deleting) setBuyerToDelete(null); }} onConfirm={() => { void handleDelete(); }} />
    </div>
  );
}


