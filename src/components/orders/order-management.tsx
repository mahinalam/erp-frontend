
"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Package,
  Pencil,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
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

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PRODUCTION"
  | "SHIPPED"
  | "CANCELLED";

type BuyerOption = {
  id: string;
  name: string;
  code: string;
};

type StyleOption = {
  id: string;
  styleNo: string;
  name: string;
};

type OrderItem = {
  id: string;
  styleId: string;
  color: string;
  size: string;
  quantity: number;
  unitPrice: number;
};

type Order = {
  id: string;
  orderNo: string;
  buyerId: string;
  orderDate: string;
  shipmentDate: string | null;
  status: OrderStatus;
  totalQty: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
};

type ItemForm = {
  styleId: string;
  color: string;
  size: string;
  quantity: string;
  unitPrice: string;
};

type OrderForm = {
  orderNo: string;
  buyerId: string;
  orderDate: string;
  shipmentDate: string;
  status: OrderStatus;
  items: ItemForm[];
};

const initialBuyers: BuyerOption[] = [
  { id: "demo-buyer-1", name: "H&M", code: "HM" },
  { id: "demo-buyer-2", name: "Zara", code: "ZARA" },
  { id: "demo-buyer-3", name: "C&A", code: "CA" },
];

const initialStyles: StyleOption[] = [
  {
    id: "demo-style-1",
    styleNo: "ST-2026-001",
    name: "Classic Denim Jeans",
  },
  {
    id: "demo-style-2",
    styleNo: "ST-2026-002",
    name: "Cargo Trouser",
  },
  {
    id: "demo-style-3",
    styleNo: "ST-2026-003",
    name: "Basic Knit T-Shirt",
  },
];

const initialOrders: Order[] = [
  {
    id: "demo-order-1",
    orderNo: "ORD-2026-001",
    buyerId: "demo-buyer-1",
    orderDate: "2026-08-10",
    shipmentDate: "2026-11-20",
    status: "IN_PRODUCTION",
    totalQty: 1200,
    createdAt: "2026-08-10T09:00:00.000Z",
    updatedAt: "2026-08-10T09:00:00.000Z",
    items: [
      {
        id: "demo-item-1",
        styleId: "demo-style-1",
        color: "Dark Blue",
        size: "M",
        quantity: 700,
        unitPrice: 12.5,
      },
      {
        id: "demo-item-2",
        styleId: "demo-style-1",
        color: "Black",
        size: "L",
        quantity: 500,
        unitPrice: 13,
      },
    ],
  },
  {
    id: "demo-order-2",
    orderNo: "ORD-2026-002",
    buyerId: "demo-buyer-2",
    orderDate: "2026-08-15",
    shipmentDate: "2026-12-05",
    status: "CONFIRMED",
    totalQty: 800,
    createdAt: "2026-08-15T09:00:00.000Z",
    updatedAt: "2026-08-15T09:00:00.000Z",
    items: [
      {
        id: "demo-item-3",
        styleId: "demo-style-2",
        color: "Olive",
        size: "M",
        quantity: 800,
        unitPrice: 15,
      },
    ],
  },
  {
    id: "demo-order-3",
    orderNo: "ORD-2026-003",
    buyerId: "demo-buyer-3",
    orderDate: "2026-08-20",
    shipmentDate: null,
    status: "PENDING",
    totalQty: 500,
    createdAt: "2026-08-20T09:00:00.000Z",
    updatedAt: "2026-08-20T09:00:00.000Z",
    items: [
      {
        id: "demo-item-4",
        styleId: "demo-style-3",
        color: "White",
        size: "S",
        quantity: 500,
        unitPrice: 5.5,
      },
    ],
  },
  {
    id: "demo-order-4",
    orderNo: "ORD-2026-004",
    buyerId: "demo-buyer-1",
    orderDate: "2026-08-22",
    shipmentDate: "2026-10-15",
    status: "SHIPPED",
    totalQty: 1500,
    createdAt: "2026-08-22T09:00:00.000Z",
    updatedAt: "2026-08-22T09:00:00.000Z",
    items: [
      {
        id: "demo-item-5",
        styleId: "demo-style-1",
        color: "Blue",
        size: "L",
        quantity: 1500,
        unitPrice: 12,
      },
    ],
  },
];

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  IN_PRODUCTION: "In Production",
  SHIPPED: "Shipped",
  CANCELLED: "Cancelled",
};

const statusClasses: Record<OrderStatus, string> = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-700",
  CONFIRMED: "border-blue-200 bg-blue-50 text-blue-700",
  IN_PRODUCTION: "border-violet-200 bg-violet-50 text-violet-700",
  SHIPPED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  CANCELLED: "border-red-200 bg-red-50 text-red-700",
};

const controlClass =
  "flex h-10 w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30";

const emptyItem: ItemForm = {
  styleId: "",
  color: "",
  size: "",
  quantity: "1",
  unitPrice: "0",
};

function localDate() {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000)
    .toISOString()
    .slice(0, 10);
}

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value.slice(0, 10)}T00:00:00Z`));
}

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
      <label className="text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [buyers] = useState<BuyerOption[]>(initialBuyers);
  const [styles] = useState<StyleOption[]>(initialStyles);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [buyerFilter, setBuyerFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [form, setForm] = useState<OrderForm>({
    orderNo: "",
    buyerId: "",
    orderDate: localDate(),
    shipmentDate: "",
    status: "PENDING",
    items: [{ ...emptyItem }],
  });
  const [error, setError] = useState("");

  const getBuyer = (buyerId: string) =>
    buyers.find((buyer) => buyer.id === buyerId);

  const getStyle = (styleId: string) =>
    styles.find((style) => style.id === styleId);

  const totalOrderValue = (items: OrderItem[]) =>
    items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  const stats = useMemo(
    () => ({
      total: orders.length,
      pending: orders.filter((order) => order.status === "PENDING").length,
      production: orders.filter(
        (order) => order.status === "IN_PRODUCTION",
      ).length,
      shipped: orders.filter((order) => order.status === "SHIPPED").length,
      quantity: orders.reduce((sum, order) => sum + order.totalQty, 0),
    }),
    [orders],
  );

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();

    return orders.filter((order) => {
      const buyerName = getBuyer(order.buyerId)?.name ?? "";
      const matchesSearch =
        !term ||
        order.orderNo.toLowerCase().includes(term) ||
        buyerName.toLowerCase().includes(term) ||
        order.items.some((item) =>
          (getStyle(item.styleId)?.styleNo ?? "").toLowerCase().includes(term),
        );

      const matchesStatus =
        statusFilter === "ALL" || order.status === statusFilter;
      const matchesBuyer =
        buyerFilter === "ALL" || order.buyerId === buyerFilter;

      return matchesSearch && matchesStatus && matchesBuyer;
    });
  }, [orders, search, statusFilter, buyerFilter, buyers, styles]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleOrders = filteredOrders.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  const formQuantity = form.items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0,
  );

  const formValue = form.items.reduce(
    (sum, item) =>
      sum +
      (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0,
  );

  function updateForm<K extends keyof OrderForm>(
    key: K,
    value: OrderForm[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateItem(index: number, key: keyof ItemForm, value: string) {
    setForm((current) => ({
      ...current,
      items: current.items.map((item, i) =>
        i === index ? { ...item, [key]: value } : item,
      ),
    }));
  }

  function openAddDialog() {
    setEditingOrder(null);
    setForm({
      orderNo: "",
      buyerId: buyers[0]?.id ?? "",
      orderDate: localDate(),
      shipmentDate: "",
      status: "PENDING",
      items: [{ ...emptyItem }],
    });
    setError("");
    setDialogOpen(true);
  }

  function openEditDialog(order: Order) {
    setEditingOrder(order);
    setForm({
      orderNo: order.orderNo,
      buyerId: order.buyerId,
      orderDate: order.orderDate.slice(0, 10),
      shipmentDate: order.shipmentDate?.slice(0, 10) ?? "",
      status: order.status,
      items: order.items.map((item) => ({
        styleId: item.styleId,
        color: item.color,
        size: item.size,
        quantity: String(item.quantity),
        unitPrice: String(item.unitPrice),
      })),
    });
    setError("");
    setDialogOpen(true);
  }

  function saveOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const orderNo = form.orderNo.trim();

    if (!orderNo || !form.buyerId || !form.orderDate) {
      setError("Order No., Buyer এবং Order Date পূরণ করো।");
      return;
    }

    if (
      form.shipmentDate &&
      form.shipmentDate < form.orderDate
    ) {
      setError("Shipment Date, Order Date-এর আগে হতে পারবে না।");
      return;
    }

    const duplicate = orders.some(
      (order) =>
        order.orderNo.toLowerCase() === orderNo.toLowerCase() &&
        order.id !== editingOrder?.id,
    );

    if (duplicate) {
      setError("এই Order No. ইতিমধ্যে ব্যবহার করা হয়েছে।");
      return;
    }

    if (form.items.length === 0) {
      setError("কমপক্ষে একটি order item যোগ করো।");
      return;
    }

    for (let index = 0; index < form.items.length; index++) {
      const item = form.items[index];
      const quantity = Number(item.quantity);
      const unitPrice = Number(item.unitPrice);

      if (
        !item.styleId ||
        !item.color.trim() ||
        !item.size.trim() ||
        item.quantity.trim() === "" ||
        item.unitPrice.trim() === "" ||
        !Number.isInteger(quantity) ||
        quantity <= 0 ||
        !Number.isFinite(unitPrice) ||
        unitPrice < 0
      ) {
        setError(
          `Order item ${index + 1}: Style, Color, Size, valid Quantity এবং Unit Price দাও।`,
        );
        return;
      }
    }

    const now = new Date().toISOString();

    const items: OrderItem[] = form.items.map((item, index) => ({
      id: editingOrder?.items[index]?.id ?? `demo-item-${Date.now()}-${index}`,
      styleId: item.styleId,
      color: item.color.trim(),
      size: item.size.trim(),
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
    }));

    const orderData = {
      orderNo,
      buyerId: form.buyerId,
      orderDate: form.orderDate,
      shipmentDate: form.shipmentDate || null,
      status: form.status,
      totalQty: items.reduce((sum, item) => sum + item.quantity, 0),
      items,
    };

    if (editingOrder) {
      setOrders((current) =>
        current.map((order) =>
          order.id === editingOrder.id
            ? { ...order, ...orderData, updatedAt: now }
            : order,
        ),
      );
    } else {
      const newOrder: Order = {
        id: `demo-order-${Date.now()}`,
        ...orderData,
        createdAt: now,
        updatedAt: now,
      };

      setOrders((current) => [newOrder, ...current]);
      setPage(1);
    }

    setDialogOpen(false);
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("ALL");
    setBuyerFilter("ALL");
    setPage(1);
  }

  return (
    <div className="min-w-0 flex-1 space-y-6 p-4 pt-0 md:p-6 md:pt-0">
      {/* Heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShoppingCart className="size-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight">
              Order Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage customer orders, styles, quantities and shipment dates.
            </p>
          </div>
        </div>

        <Button onClick={openAddDialog} className="shrink-0">
          <Plus className="mr-2 size-4" />
          Create Order
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Orders"
          value={stats.total}
          description="All registered orders"
          icon={<FileText className="size-5" />}
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          description="Awaiting confirmation"
          icon={<CalendarDays className="size-5" />}
        />
        <StatCard
          title="In Production"
          value={stats.production}
          description="Currently being produced"
          icon={<Package className="size-5" />}
        />
        <StatCard
          title="Shipped"
          value={stats.shipped}
          description="Orders marked as shipped"
          icon={<CheckCircle2 className="size-5" />}
        />
      </div>

      {/* Quantity overview */}
      <Card>
        <CardContent className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Total Ordered Quantity
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {stats.quantity.toLocaleString()} pcs
            </p>
          </div>
          <Badge variant="outline" className="w-fit">
            Calculated from Order Items
          </Badge>
        </CardContent>
      </Card>

      {/* Search and filters */}
      <Card className="min-w-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Search & Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="relative min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search order no., buyer, style..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
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
              aria-label="Filter by order status"
              className={controlClass}
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setPage(1);
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="IN_PRODUCTION">In Production</option>
              <option value="SHIPPED">Shipped</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="mt-3 flex justify-end">
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="mr-1.5 size-4" />
              Clear filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders table */}
      <Card className="min-w-0 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
          <div>
            <CardTitle className="text-base">All Orders</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {filteredOrders.length} orders found
            </p>
          </div>
          <Badge variant="secondary">{orders.length} total</Badge>
        </CardHeader>

        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="border-y bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Buyer</th>
                  <th className="px-4 py-3 font-medium">Order Date</th>
                  <th className="px-4 py-3 font-medium">Shipment Date</th>
                  <th className="px-4 py-3 font-medium">Items / Qty</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {visibleOrders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-5 py-4">
                      <p className="font-medium">{order.orderNo}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "item" : "items"}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-medium">
                        {getBuyer(order.buyerId)?.name ?? "Unknown buyer"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {getBuyer(order.buyerId)?.code ?? "—"}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4">
                      {formatDate(order.orderDate)}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4">
                      {formatDate(order.shipmentDate)}
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-medium">
                        {order.totalQty.toLocaleString()} pcs
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {money(totalOrderValue(order.items))}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <Badge
                        variant="outline"
                        className={statusClasses[order.status]}
                      >
                        {statusLabels[order.status]}
                      </Badge>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="View order"
                          aria-label={`View ${order.orderNo}`}
                          onClick={() => {
                            setViewingOrder(order);
                            setViewOpen(true);
                          }}
                        >
                          <Eye className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Edit order"
                          aria-label={`Edit ${order.orderNo}`}
                          onClick={() => openEditDialog(order)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {visibleOrders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-14 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center gap-2">
                        <ShoppingCart className="size-8 text-muted-foreground" />
                        <p className="font-medium">No orders found</p>
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
              {filteredOrders.length === 0
                ? "Showing 0 orders"
                : `Showing ${(safePage - 1) * pageSize + 1}–${Math.min(
                    safePage * pageSize,
                    filteredOrders.length,
                  )} of ${filteredOrders.length} orders`}
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

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingOrder ? "Edit Order" : "Create New Order"}
            </DialogTitle>
            <DialogDescription>
              Add order details and one or more style items.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={saveOrder} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Order No." required>
                <Input
                  value={form.orderNo}
                  onChange={(e) => updateForm("orderNo", e.target.value)}
                  placeholder="e.g. ORD-2026-005"
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

              <Field label="Order Date" required>
                <Input
                  type="date"
                  value={form.orderDate}
                  onChange={(e) => updateForm("orderDate", e.target.value)}
                  required
                />
              </Field>

              <Field label="Shipment Date">
                <Input
                  type="date"
                  value={form.shipmentDate}
                  min={form.orderDate || undefined}
                  onChange={(e) => updateForm("shipmentDate", e.target.value)}
                />
              </Field>

              <Field label="Order Status" required>
                <select
                  className={controlClass}
                  value={form.status}
                  onChange={(e) =>
                    updateForm("status", e.target.value as OrderStatus)
                  }
                >
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="IN_PRODUCTION">In Production</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </Field>
            </div>

            {/* Order items */}
            <div className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-semibold">Order Items</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a style and enter its color, size and quantity.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateForm("items", [...form.items, { ...emptyItem }])
                  }
                >
                  <Plus className="mr-1.5 size-4" />
                  Add Item
                </Button>
              </div>

              {form.items.map((item, index) => (
                <div
                  key={index}
                  className="space-y-4 rounded-xl border p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">Item {index + 1}</p>
                    {form.items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        title="Remove item"
                        aria-label={`Remove item ${index + 1}`}
                        onClick={() =>
                          updateForm(
                            "items",
                            form.items.filter((_, i) => i !== index),
                          )
                        }
                      >
                        <Trash2 className="size-4 text-red-500" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Style" required>
                      <select
                        className={controlClass}
                        value={item.styleId}
                        onChange={(e) =>
                          updateItem(index, "styleId", e.target.value)
                        }
                        required
                      >
                        <option value="">Select style</option>
                        {styles.map((style) => (
                          <option key={style.id} value={style.id}>
                            {style.styleNo} — {style.name}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Color" required>
                      <Input
                        value={item.color}
                        onChange={(e) =>
                          updateItem(index, "color", e.target.value)
                        }
                        placeholder="e.g. Dark Blue"
                        required
                      />
                    </Field>

                    <Field label="Size" required>
                      <Input
                        value={item.size}
                        onChange={(e) =>
                          updateItem(index, "size", e.target.value)
                        }
                        placeholder="e.g. M, L, XL or 32"
                        required
                      />
                    </Field>

                    <Field label="Quantity (pcs)" required>
                      <Input
                        type="number"
                        min={1}
                        step={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, "quantity", e.target.value)
                        }
                        required
                      />
                    </Field>

                    <Field label="Unit Price (USD)" required>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateItem(index, "unitPrice", e.target.value)
                        }
                        required
                      />
                    </Field>

                    <div className="flex flex-col justify-center rounded-lg bg-muted/50 px-3 py-2">
                      <span className="text-xs text-muted-foreground">
                        Item Total
                      </span>
                      <span className="mt-1 font-semibold">
                        {money(
                          (Number(item.quantity) || 0) *
                            (Number(item.unitPrice) || 0),
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculated summary */}
            <div className="grid grid-cols-1 gap-3 rounded-xl border bg-muted/20 p-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Order Quantity
                </p>
                <p className="mt-1 text-xl font-semibold">
                  {formQuantity.toLocaleString()} pcs
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Order Value
                </p>
                <p className="mt-1 text-xl font-semibold">
                  {money(formValue)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Calculated from item quantities × unit prices.
                </p>
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
                {editingOrder ? "Save Changes" : "Create Order"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View order details */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Review order information and all related items.
            </DialogDescription>
          </DialogHeader>

          {viewingOrder && (
            <div className="space-y-5">
              <div className="flex flex-col gap-3 rounded-xl border bg-muted/20 p-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-lg font-semibold">
                    {viewingOrder.orderNo}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {getBuyer(viewingOrder.buyerId)?.name ?? "Unknown buyer"}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={statusClasses[viewingOrder.status]}
                >
                  {statusLabels[viewingOrder.status]}
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Detail
                  label="Order Date"
                  value={formatDate(viewingOrder.orderDate)}
                />
                <Detail
                  label="Shipment Date"
                  value={formatDate(viewingOrder.shipmentDate)}
                />
                <Detail
                  label="Total Quantity"
                  value={`${viewingOrder.totalQty.toLocaleString()} pcs`}
                />
                <Detail
                  label="Total Order Value"
                  value={money(totalOrderValue(viewingOrder.items))}
                />
              </div>

              <div>
                <h3 className="mb-3 font-semibold">Order Items</h3>
                <div className="overflow-x-auto rounded-lg border">
                  <table className="w-full min-w-[550px] text-left text-sm">
                    <thead className="border-b bg-muted/40 text-muted-foreground">
                      <tr>
                        <th className="px-3 py-2 font-medium">Style</th>
                        <th className="px-3 py-2 font-medium">Color / Size</th>
                        <th className="px-3 py-2 text-right font-medium">Qty</th>
                        <th className="px-3 py-2 text-right font-medium">Unit Price</th>
                        <th className="px-3 py-2 text-right font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {viewingOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-3 py-3">
                            <p className="font-medium">
                              {getStyle(item.styleId)?.styleNo ?? "Unknown style"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {getStyle(item.styleId)?.name ?? ""}
                            </p>
                          </td>
                          <td className="px-3 py-3">
                            {item.color} / {item.size}
                          </td>
                          <td className="px-3 py-3 text-right">
                            {item.quantity.toLocaleString()}
                          </td>
                          <td className="px-3 py-3 text-right">
                            {money(item.unitPrice)}
                          </td>
                          <td className="px-3 py-3 text-right font-medium">
                            {money(item.quantity * item.unitPrice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setViewOpen(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setViewOpen(false);
                    openEditDialog(viewingOrder);
                  }}
                >
                  <Pencil className="mr-2 size-4" />
                  Edit Order
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
