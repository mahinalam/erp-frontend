
"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Eye,
  Power,
  Users,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Buyer = {
  id: string;
  name: string;
  code: string;
  country: string | null;
  email: string | null;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type BuyerForm = {
  name: string;
  code: string;
  country: string;
  email: string;
  phone: string;
  isActive: boolean;
};

const emptyForm: BuyerForm = {
  name: "",
  code: "",
  country: "",
  email: "",
  phone: "",
  isActive: true,
};

const initialBuyers: Buyer[] = [
  {
    id: "demo-1",
    name: "H&M",
    code: "BUY-001",
    country: "Sweden",
    email: "sourcing@example.com",
    phone: "+46 123 456 789",
    isActive: true,
    createdAt: "2026-10-01T09:00:00.000Z",
    updatedAt: "2026-10-01T09:00:00.000Z",
  },
  {
    id: "demo-2",
    name: "Zara",
    code: "BUY-002",
    country: "Spain",
    email: "purchase@example.com",
    phone: "+34 123 456 789",
    isActive: true,
    createdAt: "2026-10-05T09:00:00.000Z",
    updatedAt: "2026-10-05T09:00:00.000Z",
  },
  {
    id: "demo-3",
    name: "Next",
    code: "BUY-003",
    country: "United Kingdom",
    email: "buying@example.com",
    phone: null,
    isActive: false,
    createdAt: "2026-10-10T09:00:00.000Z",
    updatedAt: "2026-10-10T09:00:00.000Z",
  },
];

const inputClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

export default function BuyerManagement() {
  const [buyers, setBuyers] = useState<Buyer[]>(initialBuyers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editingBuyer, setEditingBuyer] = useState<Buyer | null>(null);
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
  const [form, setForm] = useState<BuyerForm>(emptyForm);
  const [error, setError] = useState("");

  const pageSize = 5;

  const activeCount = buyers.filter((buyer) => buyer.isActive).length;
  const inactiveCount = buyers.length - activeCount;

  const filteredBuyers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return buyers.filter((buyer) => {
      const matchesSearch = [
        buyer.name,
        buyer.code,
        buyer.country ?? "",
        buyer.email ?? "",
        buyer.phone ?? "",
      ].some((value) => value.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && buyer.isActive) ||
        (statusFilter === "inactive" && !buyer.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [buyers, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredBuyers.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedBuyers = filteredBuyers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  function openAddDialog() {
    setEditingBuyer(null);
    setForm({ ...emptyForm });
    setError("");
    setDialogOpen(true);
  }

  function openEditDialog(buyer: Buyer) {
    setEditingBuyer(buyer);
    setForm({
      name: buyer.name,
      code: buyer.code,
      country: buyer.country ?? "",
      email: buyer.email ?? "",
      phone: buyer.phone ?? "",
      isActive: buyer.isActive,
    });
    setError("");
    setDialogOpen(true);
  }

  function updateForm<K extends keyof BuyerForm>(
    field: K,
    value: BuyerForm[K]
  ) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const name = form.name.trim();
    const code = form.code.trim();

    if (!name || !code) {
      setError("Buyer name and buyer code are required.");
      return;
    }

    const duplicateCode = buyers.some(
      (buyer) =>
        buyer.code.toLowerCase() === code.toLowerCase() &&
        buyer.id !== editingBuyer?.id
    );

    if (duplicateCode) {
      setError("This buyer code already exists. Please use another code.");
      return;
    }

    const now = new Date().toISOString();

    if (editingBuyer) {
      setBuyers((previous) =>
        previous.map((buyer) =>
          buyer.id === editingBuyer.id
            ? {
                ...buyer,
                name,
                code,
                country: form.country.trim() || null,
                email: form.email.trim() || null,
                phone: form.phone.trim() || null,
                isActive: form.isActive,
                updatedAt: now,
              }
            : buyer
        )
      );
    } else {
      const newBuyer: Buyer = {
        id: `demo-${Date.now()}`,
        name,
        code,
        country: form.country.trim() || null,
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        isActive: form.isActive,
        createdAt: now,
        updatedAt: now,
      };

      setBuyers((previous) => [newBuyer, ...previous]);
      setPage(1);
    }

    setDialogOpen(false);
  }

  function toggleStatus(buyer: Buyer) {
    const confirmed = window.confirm(
      `Are you sure you want to ${
        buyer.isActive ? "deactivate" : "activate"
      } ${buyer.name}?`
    );

    if (!confirmed) return;

    setBuyers((previous) =>
      previous.map((item) =>
        item.id === buyer.id
          ? {
              ...item,
              isActive: !item.isActive,
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );
  }

  function formatDate(value: string) {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Buyer Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage buyers and their information.
          </p>
        </div>

        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Buyer
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Total Buyers</p>
              <p className="mt-2 text-2xl font-bold">{buyers.length}</p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Active Buyers</p>
              <p className="mt-2 text-2xl font-bold">{activeCount}</p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <UserCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Inactive Buyers</p>
              <p className="mt-2 text-2xl font-bold">{inactiveCount}</p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <UserX className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Buyer table */}
      <Card>
        <CardHeader>
          <CardTitle>All Buyers</CardTitle>
          <p className="text-sm text-muted-foreground">
            Search, view and manage your buyer records.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search name, code, country..."
                className="pl-9"
              />
            </div>

            <select
              aria-label="Filter buyers by status"
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setPage(1);
              }}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Buyer Code</TableHead>
                  <TableHead>Buyer Name</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedBuyers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No buyers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedBuyers.map((buyer) => (
                    <TableRow key={buyer.id}>
                      <TableCell className="font-medium">
                        {buyer.code}
                      </TableCell>
                      <TableCell>{buyer.name}</TableCell>
                      <TableCell>{buyer.country ?? "—"}</TableCell>
                      <TableCell>{buyer.email ?? "—"}</TableCell>
                      <TableCell>{buyer.phone ?? "—"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={buyer.isActive ? "default" : "secondary"}
                        >
                          {buyer.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(buyer.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`View ${buyer.name}`}
                            title="View details"
                            onClick={() => {
                              setSelectedBuyer(buyer);
                              setDetailsOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Edit ${buyer.name}`}
                            title="Edit buyer"
                            onClick={() => openEditDialog(buyer)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Change status for ${buyer.name}`}
                            title={
                              buyer.isActive ? "Deactivate" : "Activate"
                            }
                            onClick={() => toggleStatus(buyer)}
                          >
                            {buyer.isActive ? (
                              <Power className="h-4 w-4 text-destructive" />
                            ) : (
                              <UserCheck className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredBuyers.length === 0
                ? "Showing 0 buyers"
                : `Showing ${(currentPage - 1) * pageSize + 1}–${Math.min(
                    currentPage * pageSize,
                    filteredBuyers.length
                  )} of ${filteredBuyers.length} buyers`}
            </p>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setPage((previous) => previous - 1)}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>

              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((previous) => previous + 1)}
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingBuyer ? "Edit Buyer" : "Add New Buyer"}
            </DialogTitle>
            <DialogDescription>
              Enter the buyer information below. Fields marked with * are
              required.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="buyer-name" className="text-sm font-medium">
                Buyer Name *
              </label>
              <Input
                id="buyer-name"
                value={form.name}
                onChange={(event) => updateForm("name", event.target.value)}
                placeholder="Enter buyer name"
                required
                maxLength={150}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="buyer-code" className="text-sm font-medium">
                Buyer Code *
              </label>
              <Input
                id="buyer-code"
                value={form.code}
                onChange={(event) => updateForm("code", event.target.value)}
                placeholder="e.g. BUY-004"
                required
                maxLength={50}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="buyer-country" className="text-sm font-medium">
                Country
              </label>
              <Input
                id="buyer-country"
                value={form.country}
                onChange={(event) =>
                  updateForm("country", event.target.value)
                }
                placeholder="Enter country"
                maxLength={100}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="buyer-email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="buyer-email"
                type="email"
                value={form.email}
                onChange={(event) => updateForm("email", event.target.value)}
                placeholder="buyer@example.com"
                maxLength={254}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="buyer-phone" className="text-sm font-medium">
                Phone
              </label>
              <Input
                id="buyer-phone"
                type="tel"
                value={form.phone}
                onChange={(event) => updateForm("phone", event.target.value)}
                placeholder="Enter phone number"
                maxLength={30}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="buyer-status" className="text-sm font-medium">
                Status
              </label>
              <select
                id="buyer-status"
                value={form.isActive ? "active" : "inactive"}
                onChange={(event) =>
                  updateForm("isActive", event.target.value === "active")
                }
                className={inputClass}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingBuyer ? "Save Changes" : "Create Buyer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View details dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Buyer Details</DialogTitle>
            <DialogDescription>
              View the selected buyer&apos;s information.
            </DialogDescription>
          </DialogHeader>

          {selectedBuyer && (
            <div className="space-y-4">
              {[
                ["Buyer Name", selectedBuyer.name],
                ["Buyer Code", selectedBuyer.code],
                ["Country", selectedBuyer.country],
                ["Email", selectedBuyer.email],
                ["Phone", selectedBuyer.phone],
                [
                  "Status",
                  selectedBuyer.isActive ? "Active" : "Inactive",
                ],
                ["Created At", formatDate(selectedBuyer.createdAt)],
                ["Last Updated", formatDate(selectedBuyer.updatedAt)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex flex-col gap-1 border-b pb-3 sm:flex-row sm:justify-between"
                >
                  <span className="text-sm text-muted-foreground">
                    {label}
                  </span>
                  <span className="break-all text-sm font-medium">
                    {value || "—"}
                  </span>
                </div>
              ))}

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDetailsOpen(false)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
