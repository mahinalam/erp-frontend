import type { Buyer } from "@/lib/api/buyer.api";

export type BuyerFormValues = {
  name: string;
  country: string;
  email: string;
  phone: string;
  isActive: boolean;
};

export type BuyerStatusFilter = "all" | "active" | "inactive";

export const PAGE_SIZE = 5;

export const emptyBuyerForm: BuyerFormValues = {
  name: "",
  country: "",
  email: "",
  phone: "",
  isActive: true,
};

export function buyerToForm(buyer: Buyer): BuyerFormValues {
  return {
    name: buyer.name ?? "",
    country: buyer.country ?? "",
    email: buyer.email ?? "",
    phone: buyer.phone ?? "",
    isActive: buyer.isActive,
  };
}

export function formatBuyerDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message.trim()
    ? error.message
    : fallback;
}
