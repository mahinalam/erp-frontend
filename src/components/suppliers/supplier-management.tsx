
"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Eye,
  Power,
  Truck,
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

type Supplier = {
  id: string;
  name: string;
  code: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type SupplierForm = {
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
};

const emptyForm: SupplierForm = {
  name: "",
  code: "",
  email: "",
  phone: "",
  address: "",
  isActive: true,
};

// Demo data only. No database connection yet.
const initialSuppliers: Supplier[] = [
  {
    id: "demo-1",
    name: "ABC Accessories Ltd.",
    code: "SUP-001",
    email: "sales@example.com",
    phone: "+880 1711-000001",
    address: "Dhaka, Bangladesh",
    isActive: true,
    createdAt: "2026-10-01T09:00:00.000Z",
    updatedAt: "2026-10-01T09:00:00.000Z",
  },
  {
    id: "demo-2",
    name: "Denim Thread House",
    code: "SUP-002",
    email: "contact@example.com",
    phone: "+880 1811-000002",
    address: "Gazipur, Bangladesh",
    isActive: true,
    createdAt: "2026-10-05T09:00:00.000Z",
    updatedAt: "2026-10-05T09:00:00.000Z",
  },
  {
    id: "demo-3",
    name: "Global Trims Supplier",
    code: "SUP-003",
    email: null,
    phone: "+880 1911-000003",
    address: "Narayanganj, Bangladesh",
    isActive: false,
    createdAt: "2026-10-10T09:00:00.000Z",
    updatedAt: "2026-10-10T09:00:00.000Z",
  },
];

const inputClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

export default function SupplierManagement() {
  const [suppliers, setSuppliers] =
    useState<Supplier[]>(initialSuppliers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] =
    useState<Supplier | null>(null);
  const [selectedSupplier, setSelectedSupplier] =
    useState<Supplier | null>(null);
  const [form, setForm] = useState<SupplierForm>(emptyForm);
  const [error, setError] = useState("");

  const pageSize = 5;

  const activeCount = suppliers.filter(
    (supplier) => supplier.isActive
  ).length;
  const inactiveCount = suppliers.length - activeCount;

  const filteredSuppliers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return suppliers.filter((supplier) => {
      const matchesSearch = [
        supplier.name,
        supplier.code,
        supplier.email ?? "",
        supplier.phone ?? "",
        supplier.address ?? "",
      ].some((value) => value.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && supplier.isActive) ||
        (statusFilter === "inactive" && !supplier.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [suppliers, search, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSuppliers.length / pageSize)
  );
  const currentPage = Math.min(page, totalPages);

  const paginatedSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  function openAddDialog() {
    setEditingSupplier(null);
    setForm({ ...emptyForm });
    setError("");
    setDialogOpen(true);
  }

  function openEditDialog(supplier: Supplier) {
    setEditingSupplier(supplier);
    setForm({
      name: supplier.name,
      code: supplier.code,
      email: supplier.email ?? "",
      phone: supplier.phone ?? "",
      address: supplier.address ?? "",
      isActive: supplier.isActive,
    });
    setError("");
    setDialogOpen(true);
  }

  function updateForm<K extends keyof SupplierForm>(
    field: K,
    value: SupplierForm[K]
  ) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const name = form.name.trim();
    const code = form.code.trim();

    if (!name || !code) {
      setError("Supplier name and supplier code are required.");
      return;
    }

    const duplicateCode = suppliers.some(
      (supplier) =>
        supplier.code.toLowerCase() === code.toLowerCase() &&
        supplier.id !== editingSupplier?.id
    );

    if (duplicateCode) {
      setError("This supplier code already exists.");
      return;
    }

    const now = new Date().toISOString();

    if (editingSupplier) {
      setSuppliers((previous) =>
        previous.map((supplier) =>
          supplier.id === editingSupplier.id
            ? {
                ...supplier,
                name,
                code,
                email: form.email.trim() || null,
                phone: form.phone.trim() || null,
                address: form.address.trim() || null,
                isActive: form.isActive,
                updatedAt: now,
              }
            : supplier
        )
      );
    } else {
      const newSupplier: Supplier = {
        id: `demo-${Date.now()}`,
        name,
        code,
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        address: form.address.trim() || null,
        isActive: form.isActive,
        createdAt: now,
        updatedAt: now,
      };

      setSuppliers((previous) => [newSupplier, ...previous]);
      setPage(1);
    }

    setDialogOpen(false);
  }

  function toggleStatus(supplier: Supplier) {
    const confirmed = window.confirm(
      `Are you sure you want to ${
        supplier.isActive ? "deactivate" : "activate"
      } ${supplier.name}?`
    );

    if (!confirmed) return;

    setSuppliers((previous) =>
      previous.map((item) =>
        item.id === supplier.id
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
    <div className="min-w-0 flex-1 space-y-6 p-4 md:p-6">
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Supplier Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your suppliers and contact information.
          </p>
        </div>

        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Suppliers
              </p>
              <p className="mt-2 text-2xl font-bold">
                {suppliers.length}
              </p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <Truck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Active Suppliers
              </p>
              <p className="mt-2 text-2xl font-bold">
                {activeCount}
              </p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <UserCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">
                Inactive Suppliers
              </p>
              <p className="mt-2 text-2xl font-bold">
                {inactiveCount}
              </p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <UserX className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supplier table */}
      <Card>
        <CardHeader>
          <CardTitle>All Suppliers</CardTitle>
          <p className="text-sm text-muted-foreground">
            Search, view and manage your supplier records.
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
                placeholder="Search name, code, email, address..."
                className="pl-9"
              />
            </div>

            <select
              aria-label="Filter suppliers by status"
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
                  <TableHead>Supplier Code</TableHead>
                  <TableHead>Supplier Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedSuppliers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No suppliers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedSuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">
                        {supplier.code}
                      </TableCell>
                      <TableCell>{supplier.name}</TableCell>
                      <TableCell>{supplier.email ?? "—"}</TableCell>
                      <TableCell>{supplier.phone ?? "—"}</TableCell>
                      <TableCell className="max-w-48 truncate">
                        {supplier.address ?? "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            supplier.isActive ? "default" : "secondary"
                          }
                        >
                          {supplier.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDate(supplier.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`View ${supplier.name}`}
                            title="View details"
                            onClick={() => {
                              setSelectedSupplier(supplier);
                              setDetailsOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Edit ${supplier.name}`}
                            title="Edit supplier"
                            onClick={() => openEditDialog(supplier)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Change status for ${supplier.name}`}
                            title={
                              supplier.isActive ? "Deactivate" : "Activate"
                            }
                            onClick={() => toggleStatus(supplier)}
                          >
                            <Power
                              className={`h-4 w-4 ${
                                supplier.isActive ? "text-destructive" : ""
                              }`}
                            />
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
              {filteredSuppliers.length === 0
                ? "Showing 0 suppliers"
                : `Showing ${(currentPage - 1) * pageSize + 1}–${Math.min(
                    currentPage * pageSize,
                    filteredSuppliers.length
                  )} of ${filteredSuppliers.length} suppliers`}
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
              {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
            </DialogTitle>
            <DialogDescription>
              Enter supplier information. Name and code are required.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="supplier-name" className="text-sm font-medium">
                Supplier Name *
              </label>
              <Input
                id="supplier-name"
                value={form.name}
                onChange={(event) =>
                  updateForm("name", event.target.value)
                }
                placeholder="Enter supplier name"
                required
                maxLength={150}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="supplier-code" className="text-sm font-medium">
                Supplier Code *
              </label>
              <Input
                id="supplier-code"
                value={form.code}
                onChange={(event) =>
                  updateForm("code", event.target.value)
                }
                placeholder="e.g. SUP-004"
                required
                maxLength={50}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="supplier-email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="supplier-email"
                type="email"
                value={form.email}
                onChange={(event) =>
                  updateForm("email", event.target.value)
                }
                placeholder="supplier@example.com"
                maxLength={254}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="supplier-phone" className="text-sm font-medium">
                Phone
              </label>
              <Input
                id="supplier-phone"
                type="tel"
                value={form.phone}
                onChange={(event) =>
                  updateForm("phone", event.target.value)
                }
                placeholder="Enter phone number"
                maxLength={30}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="supplier-address"
                className="text-sm font-medium"
              >
                Address
              </label>
              <textarea
                id="supplier-address"
                value={form.address}
                onChange={(event) =>
                  updateForm("address", event.target.value)
                }
                placeholder="Enter supplier address"
                maxLength={500}
                rows={3}
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="supplier-status"
                className="text-sm font-medium"
              >
                Status
              </label>
              <select
                id="supplier-status"
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
                {editingSupplier ? "Save Changes" : "Create Supplier"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View details dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Supplier Details</DialogTitle>
            <DialogDescription>
              View the selected supplier&apos;s information.
            </DialogDescription>
          </DialogHeader>

          {selectedSupplier && (
            <div className="space-y-4">
              {(
                [
                  ["Supplier Name", selectedSupplier.name],
                  ["Supplier Code", selectedSupplier.code],
                  ["Email", selectedSupplier.email],
                  ["Phone", selectedSupplier.phone],
                  ["Address", selectedSupplier.address],
                  [
                    "Status",
                    selectedSupplier.isActive ? "Active" : "Inactive",
                  ],
                  ["Created At", formatDate(selectedSupplier.createdAt)],
                  ["Last Updated", formatDate(selectedSupplier.updatedAt)],
                ] as [string, string | null][]
              ).map(([label, value]) => (
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
