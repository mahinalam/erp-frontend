
"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Factory,
  Layers3,
  Pencil,
  Plus,
  Power,
  Search,
  Shirt,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";

type Season = "SS" | "AW";
type StyleStatus = "DEVELOPMENT" | "SAMPLED" | "APPROVED" | "PRODUCTION";

type Buyer = {
  id: string;
  name: string;
  code: string;
};

type Style = {
  id: string;
  styleNo: string;
  name: string;
  season: Season;
  year: number;
  description: string | null;
  productType: string | null;
  fabricType: string | null;
  productImage: string | null;
  buyerId: string;
  status: StyleStatus;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type StyleForm = {
  styleNo: string;
  name: string;
  season: Season;
  year: string;
  description: string;
  productType: string;
  fabricType: string;
  productImage: string;
  buyerId: string;
  status: StyleStatus;
  isActive: boolean;
};

const initialBuyers: Buyer[] = [
  { id: "demo-buyer-1", name: "H&M", code: "HM" },
  { id: "demo-buyer-2", name: "Zara", code: "ZARA" },
  { id: "demo-buyer-3", name: "C&A", code: "CA" },
];

const initialStyles: Style[] = [
  {
    id: "demo-style-1",
    styleNo: "ST-2026-001",
    name: "Classic Denim Jeans",
    season: "AW",
    year: 2026,
    description: "Classic five-pocket denim jeans.",
    productType: "Denim Pant",
    fabricType: "Cotton Denim",
    productImage: null,
    buyerId: "demo-buyer-1",
    status: "PRODUCTION",
    isActive: true,
    createdAt: "2026-08-10T09:00:00.000Z",
    updatedAt: "2026-08-10T09:00:00.000Z",
  },
  {
    id: "demo-style-2",
    styleNo: "ST-2026-002",
    name: "Cargo Trouser",
    season: "AW",
    year: 2026,
    description: "Casual cargo trouser with side pockets.",
    productType: "Cargo Pant",
    fabricType: "Cotton Twill",
    productImage: null,
    buyerId: "demo-buyer-2",
    status: "APPROVED",
    isActive: true,
    createdAt: "2026-08-12T09:00:00.000Z",
    updatedAt: "2026-08-12T09:00:00.000Z",
  },
  {
    id: "demo-style-3",
    styleNo: "ST-2026-003",
    name: "Basic Knit T-Shirt",
    season: "SS",
    year: 2027,
    description: null,
    productType: "T-Shirt",
    fabricType: "Single Jersey",
    productImage: null,
    buyerId: "demo-buyer-3",
    status: "DEVELOPMENT",
    isActive: true,
    createdAt: "2026-08-15T09:00:00.000Z",
    updatedAt: "2026-08-15T09:00:00.000Z",
  },
  {
    id: "demo-style-4",
    styleNo: "ST-2026-004",
    name: "Slim Fit Denim",
    season: "AW",
    year: 2026,
    description: null,
    productType: "Denim Pant",
    fabricType: "Stretch Denim",
    productImage: null,
    buyerId: "demo-buyer-1",
    status: "SAMPLED",
    isActive: false,
    createdAt: "2026-08-18T09:00:00.000Z",
    updatedAt: "2026-08-18T09:00:00.000Z",
  },
];

const emptyForm: StyleForm = {
  styleNo: "",
  name: "",
  season: "SS",
  year: String(new Date().getFullYear()),
  description: "",
  productType: "",
  fabricType: "",
  productImage: "",
  buyerId: "",
  status: "DEVELOPMENT",
  isActive: true,
};

const statusLabels: Record<StyleStatus, string> = {
  DEVELOPMENT: "Development",
  SAMPLED: "Sampled",
  APPROVED: "Approved",
  PRODUCTION: "In Production",
};

const statusClasses: Record<StyleStatus, string> = {
  DEVELOPMENT: "border-slate-200 bg-slate-100 text-slate-700",
  SAMPLED: "border-blue-200 bg-blue-50 text-blue-700",
  APPROVED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  PRODUCTION: "border-violet-200 bg-violet-50 text-violet-700",
};

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0 space-y-1.5">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const controlClass =
  "flex h-10 w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50";

export default function StyleManagement() {
  const [styles, setStyles] = useState<Style[]>(initialStyles);
  const [buyers] = useState<Buyer[]>(initialBuyers);
  const [search, setSearch] = useState("");
  const [buyerFilter, setBuyerFilter] = useState("ALL");
  const [seasonFilter, setSeasonFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editingStyle, setEditingStyle] = useState<Style | null>(null);
  const [viewingStyle, setViewingStyle] = useState<Style | null>(null);
  const [form, setForm] = useState<StyleForm>(emptyForm);
  const [error, setError] = useState("");

  const getBuyerName = (buyerId: string) =>
    buyers.find((buyer) => buyer.id === buyerId)?.name ?? "Unknown buyer";

  const stats = useMemo(
    () => ({
      total: styles.length,
      development: styles.filter((s) => s.status === "DEVELOPMENT").length,
      approved: styles.filter((s) => s.status === "APPROVED").length,
      production: styles.filter((s) => s.status === "PRODUCTION").length,
    }),
    [styles],
  );

  const filteredStyles = useMemo(() => {
    const term = search.trim().toLowerCase();

    return styles.filter((style) => {
      const matchesSearch =
        !term ||
        style.styleNo.toLowerCase().includes(term) ||
        style.name.toLowerCase().includes(term) ||
        (style.productType ?? "").toLowerCase().includes(term) ||
        getBuyerName(style.buyerId).toLowerCase().includes(term);

      const matchesBuyer =
        buyerFilter === "ALL" || style.buyerId === buyerFilter;
      const matchesSeason =
        seasonFilter === "ALL" || style.season === seasonFilter;
      const matchesStatus =
        statusFilter === "ALL" || style.status === statusFilter;
      const matchesActive =
        activeFilter === "ALL" ||
        (activeFilter === "ACTIVE" ? style.isActive : !style.isActive);

      return (
        matchesSearch &&
        matchesBuyer &&
        matchesSeason &&
        matchesStatus &&
        matchesActive
      );
    });
  }, [styles, search, buyerFilter, seasonFilter, statusFilter, activeFilter, buyers]);

  const totalPages = Math.max(1, Math.ceil(filteredStyles.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleStyles = filteredStyles.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  function updateForm<K extends keyof StyleForm>(
    key: K,
    value: StyleForm[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function openAddDialog() {
    setEditingStyle(null);
    setForm({
      ...emptyForm,
      year: String(new Date().getFullYear()),
      buyerId: buyers[0]?.id ?? "",
    });
    setError("");
    setDialogOpen(true);
  }

  function openEditDialog(style: Style) {
    setEditingStyle(style);
    setForm({
      styleNo: style.styleNo,
      name: style.name,
      season: style.season,
      year: String(style.year),
      description: style.description ?? "",
      productType: style.productType ?? "",
      fabricType: style.fabricType ?? "",
      productImage: style.productImage ?? "",
      buyerId: style.buyerId,
      status: style.status,
      isActive: style.isActive,
    });
    setError("");
    setDialogOpen(true);
  }

  function saveStyle(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const styleNo = form.styleNo.trim();
    const name = form.name.trim();
    const year = Number(form.year);

    if (!styleNo || !name || !form.buyerId || !form.year) {
      setError("Style No., Style Name, Year এবং Buyer পূরণ করো।");
      return;
    }

    if (!Number.isInteger(year) || year < 2000 || year > 2100) {
      setError("Year 2000 থেকে 2100-এর মধ্যে একটি পূর্ণসংখ্যা হতে হবে।");
      return;
    }

    const duplicate = styles.some(
      (style) =>
        style.styleNo.toLowerCase() === styleNo.toLowerCase() &&
        style.id !== editingStyle?.id,
    );

    if (duplicate) {
      setError("এই Style No. ইতিমধ্যে ব্যবহার করা হয়েছে।");
      return;
    }

    const now = new Date().toISOString();

    const values = {
      styleNo,
      name,
      season: form.season,
      year,
      description: form.description.trim() || null,
      productType: form.productType.trim() || null,
      fabricType: form.fabricType.trim() || null,
      productImage: form.productImage.trim() || null,
      buyerId: form.buyerId,
      status: form.status,
      isActive: form.isActive,
    };

    if (editingStyle) {
      setStyles((current) =>
        current.map((style) =>
          style.id === editingStyle.id
            ? { ...style, ...values, updatedAt: now }
            : style,
        ),
      );
    } else {
      const newStyle: Style = {
        id: `demo-style-${Date.now()}`,
        ...values,
        createdAt: now,
        updatedAt: now,
      };

      setStyles((current) => [newStyle, ...current]);
      setPage(1);
    }

    setDialogOpen(false);
  }

  function toggleActive(style: Style) {
    setStyles((current) =>
      current.map((item) =>
        item.id === style.id
          ? {
              ...item,
              isActive: !item.isActive,
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    );
  }

  function clearFilters() {
    setSearch("");
    setBuyerFilter("ALL");
    setSeasonFilter("ALL");
    setStatusFilter("ALL");
    setActiveFilter("ALL");
    setPage(1);
  }

  return (
    <div className="min-w-0 flex-1 space-y-6 p-4 pt-0 md:p-6 md:pt-0">
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Shirt className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Style Management
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage garment styles, buyers, seasons and development status.
              </p>
            </div>
          </div>
        </div>

        <Button onClick={openAddDialog} className="shrink-0">
          <Plus className="mr-2 size-4" />
          Add Style
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Styles"
          value={stats.total}
          description="All registered styles"
          icon={<Layers3 className="size-5" />}
        />
        <StatCard
          title="Development"
          value={stats.development}
          description="Styles in development"
          icon={<CalendarDays className="size-5" />}
        />
        <StatCard
          title="Approved"
          value={stats.approved}
          description="Approved for next steps"
          icon={<CheckCircle2 className="size-5" />}
        />
        <StatCard
          title="In Production"
          value={stats.production}
          description="Styles in production"
          icon={<Factory className="size-5" />}
        />
      </div>

      {/* Search and filters */}
      <Card className="min-w-0">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Search className="size-4 text-muted-foreground" />
            <CardTitle className="text-base">Search & Filters</CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <div className="relative min-w-0 xl:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search style no., name, buyer..."
                className="pl-9"
              />
            </div>

            <select
              aria-label="Filter by buyer"
              className={controlClass}
              value={buyerFilter}
              onChange={(event) => {
                setBuyerFilter(event.target.value);
                setPage(1);
              }}
            >
              <option value="ALL">All Buyers</option>
              {buyers.map((buyer) => (
                <option key={buyer.id} value={buyer.id}>
                  {buyer.name}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter by season"
              className={controlClass}
              value={seasonFilter}
              onChange={(event) => {
                setSeasonFilter(event.target.value);
                setPage(1);
              }}
            >
              <option value="ALL">All Seasons</option>
              <option value="SS">Spring / Summer (SS)</option>
              <option value="AW">Autumn / Winter (AW)</option>
            </select>

            <select
              aria-label="Filter by style status"
              className={controlClass}
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setPage(1);
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="DEVELOPMENT">Development</option>
              <option value="SAMPLED">Sampled</option>
              <option value="APPROVED">Approved</option>
              <option value="PRODUCTION">In Production</option>
            </select>
          </div>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-2">
              <span className="text-sm text-muted-foreground">Availability:</span>
              <select
                aria-label="Filter by availability"
                className={`${controlClass} max-w-40`}
                value={activeFilter}
                onChange={(event) => {
                  setActiveFilter(event.target.value);
                  setPage(1);
                }}
              >
                <option value="ALL">All styles</option>
                <option value="ACTIVE">Active only</option>
                <option value="INACTIVE">Inactive only</option>
              </select>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="self-start sm:self-auto"
            >
              <X className="mr-1.5 size-4" />
              Clear filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Styles table */}
      <Card className="min-w-0 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
          <div>
            <CardTitle className="text-base">All Styles</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {filteredStyles.length}{" "}
              {filteredStyles.length === 1 ? "style" : "styles"} found
            </p>
          </div>
          <Badge variant="secondary">{styles.length} total</Badge>
        </CardHeader>

        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="border-y bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Style</th>
                  <th className="px-4 py-3 font-medium">Buyer</th>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Season / Year</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Availability</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {visibleStyles.map((style) => (
                  <tr
                    key={style.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted/40">
                          <Shirt className="size-5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground">
                            {style.styleNo}
                          </p>
                          <p className="mt-0.5 max-w-56 truncate text-muted-foreground">
                            {style.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-medium">{getBuyerName(style.buyerId)}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {buyers.find((b) => b.id === style.buyerId)?.code ?? "—"}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <p>{style.productType || "—"}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {style.fabricType || "No fabric specified"}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <Badge variant="outline">{style.season}</Badge>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {style.year}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <Badge
                        variant="outline"
                        className={statusClasses[style.status]}
                      >
                        {statusLabels[style.status]}
                      </Badge>
                    </td>

                    <td className="px-4 py-4">
                      <Badge
                        variant="outline"
                        className={
                          style.isActive
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-slate-100 text-slate-600"
                        }
                      >
                        <span
                          className={`mr-1.5 size-1.5 rounded-full ${
                            style.isActive ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        {style.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`View ${style.styleNo}`}
                          title="View details"
                          onClick={() => {
                            setViewingStyle(style);
                            setViewOpen(true);
                          }}
                        >
                          <Eye className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Edit ${style.styleNo}`}
                          title="Edit style"
                          onClick={() => openEditDialog(style)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`${style.isActive ? "Deactivate" : "Activate"} ${style.styleNo}`}
                          title={style.isActive ? "Deactivate" : "Activate"}
                          onClick={() => toggleActive(style)}
                        >
                          <Power
                            className={`size-4 ${
                              style.isActive
                                ? "text-emerald-600"
                                : "text-muted-foreground"
                            }`}
                          />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {visibleStyles.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-14 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center gap-2">
                        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                          <Shirt className="size-6 text-muted-foreground" />
                        </div>
                        <p className="font-medium">No styles found</p>
                        <p className="text-sm text-muted-foreground">
                          Try changing your search or filters.
                        </p>
                        <Button variant="outline" size="sm" onClick={clearFilters}>
                          Clear filters
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredStyles.length === 0
                ? "Showing 0 styles"
                : `Showing ${(safePage - 1) * pageSize + 1}–${Math.min(
                    safePage * pageSize,
                    filteredStyles.length,
                  )} of ${filteredStyles.length} styles`}
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="mr-1 size-4" />
                Previous
              </Button>
              <span className="min-w-16 text-center text-sm text-muted-foreground">
                Page {safePage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
                <ChevronRight className="ml-1 size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingStyle ? "Edit Style" : "Add New Style"}
            </DialogTitle>
            <DialogDescription>
              Enter the style details. Fields marked with * are required.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={saveStyle} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Style No." required>
                <Input
                  value={form.styleNo}
                  onChange={(e) => updateForm("styleNo", e.target.value)}
                  placeholder="e.g. ST-2026-005"
                  required
                />
              </Field>

              <Field label="Style Name" required>
                <Input
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  placeholder="Enter style name"
                  required
                />
              </Field>

              <Field label="Buyer" required>
                <select
                  className={controlClass}
                  value={form.buyerId}
                  onChange={(e) => updateForm("buyerId", e.target.value)}
                  required
                >
                  <option value="">Select buyer</option>
                  {buyers.map((buyer) => (
                    <option key={buyer.id} value={buyer.id}>
                      {buyer.name} ({buyer.code})
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Status" required>
                <select
                  className={controlClass}
                  value={form.status}
                  onChange={(e) =>
                    updateForm("status", e.target.value as StyleStatus)
                  }
                >
                  <option value="DEVELOPMENT">Development</option>
                  <option value="SAMPLED">Sampled</option>
                  <option value="APPROVED">Approved</option>
                  <option value="PRODUCTION">In Production</option>
                </select>
              </Field>

              <Field label="Season" required>
                <select
                  className={controlClass}
                  value={form.season}
                  onChange={(e) =>
                    updateForm("season", e.target.value as Season)
                  }
                >
                  <option value="SS">Spring / Summer (SS)</option>
                  <option value="AW">Autumn / Winter (AW)</option>
                </select>
              </Field>

              <Field label="Year" required>
                <Input
                  type="number"
                  min={2000}
                  max={2100}
                  step={1}
                  value={form.year}
                  onChange={(e) => updateForm("year", e.target.value)}
                  placeholder="2026"
                  required
                />
              </Field>

              <Field label="Product Type">
                <Input
                  value={form.productType}
                  onChange={(e) => updateForm("productType", e.target.value)}
                  placeholder="e.g. Denim Pant"
                />
              </Field>

              <Field label="Fabric Type">
                <Input
                  value={form.fabricType}
                  onChange={(e) => updateForm("fabricType", e.target.value)}
                  placeholder="e.g. Cotton Denim"
                />
              </Field>

              <div className="sm:col-span-2">
                <Field label="Product Image URL">
                  <Input
                    type="url"
                    value={form.productImage}
                    onChange={(e) => updateForm("productImage", e.target.value)}
                    placeholder="https://example.com/style-image.jpg"
                  />
                </Field>
              </div>

              <div className="sm:col-span-2">
                <Field label="Description">
                  <textarea
                    className={`${controlClass} min-h-24 resize-y`}
                    value={form.description}
                    onChange={(e) => updateForm("description", e.target.value)}
                    placeholder="Add style description (optional)"
                    rows={3}
                  />
                </Field>
              </div>

              <div className="sm:col-span-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-3">
                  <input
                    type="checkbox"
                    className="size-4 accent-primary"
                    checked={form.isActive}
                    onChange={(e) => updateForm("isActive", e.target.checked)}
                  />
                  <span>
                    <span className="block text-sm font-medium">
                      Active Style
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      Enable this style for use in the system.
                    </span>
                  </span>
                </label>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingStyle ? "Save Changes" : "Create Style"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View details dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Style Details</DialogTitle>
            <DialogDescription>
              Full details for the selected style.
            </DialogDescription>
          </DialogHeader>

          {viewingStyle && (
            <div className="space-y-5">
              <div className="flex items-start gap-4 rounded-xl border bg-muted/20 p-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Shirt className="size-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="break-words text-lg font-semibold">
                    {viewingStyle.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {viewingStyle.styleNo}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className={statusClasses[viewingStyle.status]}
                    >
                      {statusLabels[viewingStyle.status]}
                    </Badge>
                    <Badge variant="outline">
                      {viewingStyle.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Detail label="Buyer" value={getBuyerName(viewingStyle.buyerId)} />
                <Detail
                  label="Buyer Code"
                  value={
                    buyers.find((b) => b.id === viewingStyle.buyerId)?.code ?? "—"
                  }
                />
                <Detail label="Season" value={viewingStyle.season} />
                <Detail label="Year" value={String(viewingStyle.year)} />
                <Detail label="Product Type" value={viewingStyle.productType} />
                <Detail label="Fabric Type" value={viewingStyle.fabricType} />
                <Detail label="Created At" value={formatDate(viewingStyle.createdAt)} />
                <Detail label="Last Updated" value={formatDate(viewingStyle.updatedAt)} />
                <div className="sm:col-span-2">
                  <Detail
                    label="Product Image URL"
                    value={viewingStyle.productImage}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Detail
                    label="Description"
                    value={viewingStyle.description}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setViewOpen(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setViewOpen(false);
                    openEditDialog(viewingStyle);
                  }}
                >
                  <Pencil className="mr-2 size-4" />
                  Edit Style
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="min-w-0">
      <CardContent className="flex items-start justify-between gap-3 p-5">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="min-w-0 space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="break-words text-sm">{value || "—"}</p>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
