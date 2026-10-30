import { api } from "./axios";

export interface Buyer {
  id: string;
  name: string;
  code: string;
  country: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    lastPage: number;
  };
}

export interface GetBuyersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "all" | "active" | "inactive";
}

export interface CreateBuyerPayload {
  name: string;
  country: string;
  email: string;
  phone: string;
}

export interface UpdateBuyerPayload
  extends Partial<CreateBuyerPayload> {
  isActive?: boolean;
}

export const buyerApi = {
  async getAll(params: GetBuyersParams = {}) {
    const response = await api.get<ApiResponse<Buyer[]>>(
      "/buyers",
      { params },
    );

    return response.data;
  },

  async getById(id: string) {
    const response = await api.get<ApiResponse<Buyer>>(
      `/buyers/${id}`,
    );

    return response.data;
  },

  async create(payload: CreateBuyerPayload) {
    const response = await api.post<ApiResponse<Buyer>>(
      "/buyers",
      payload,
    );

    return response.data;
  },

  async update(id: string, payload: UpdateBuyerPayload) {
    const response = await api.patch<ApiResponse<Buyer>>(
      `/buyers/${id}`,
      payload,
    );

    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(
      `/buyers/${id}`,
    );

    return response.data;
  },
};