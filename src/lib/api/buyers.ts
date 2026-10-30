
import { apiRequest } from "./client";

export interface Buyer {
  id: string;
  name: string;
  code: string;
  country: string | null;
  email: string | null;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BuyerListResponse {
  data: Buyer[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}

export interface CreateBuyerPayload {
  name: string;
  country?: string;
  email?: string;
  phone?: string;
}

export type UpdateBuyerPayload = Partial<CreateBuyerPayload>;

export const buyersApi = {
//   getAll(params?: {
//     page?: number;
//     limit?: number;
//     search?: string;
//   }) {
//     const query = new URLSearchParams();

//     if (params?.page) query.set("page", String(params.page));
//     if (params?.limit) query.set("limit", String(params.limit));
//     if (params?.search) query.set("search", params.search);

//     return apiRequest<BuyerListResponse>(
//       `/buyers?${query.toString()}`,
//     );
//   },

getAll(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: "all" | "active" | "inactive";
}) {
  const query = new URLSearchParams();

  query.set("page", String(params?.page ?? 1));
  query.set("limit", String(params?.limit ?? 5));
  query.set("status", params?.status ?? "all");

  if (params?.search) {
    query.set("search", params.search);
  }

  return apiRequest<BuyerListResponse>(
    `/buyers?${query.toString()}`,
  );
},

  getById(id: string) {
    return apiRequest<Buyer>(`/buyers/${id}`);
  },

  create(payload: CreateBuyerPayload) {
    return apiRequest<Buyer>("/buyers", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update(id: string, payload: UpdateBuyerPayload) {
    return apiRequest<Buyer>(`/buyers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  delete(id: string) {
    return apiRequest<Buyer>(`/buyers/${id}`, {
      method: "DELETE",
    });
  },
};
