"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  buyerApi,
  type GetBuyersParams,
  type CreateBuyerPayload,
  type UpdateBuyerPayload,
} from "@/lib/api/buyer.api";

export const buyerKeys = {
  all: ["buyers"] as const,

  lists: () => [...buyerKeys.all, "list"] as const,

  list: (params: GetBuyersParams) =>
    [...buyerKeys.lists(), params] as const,

  details: () => [...buyerKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...buyerKeys.details(), id] as const,
};

// READ: list
export function useBuyers(params: GetBuyersParams) {
  return useQuery({
    queryKey: buyerKeys.list(params),
    queryFn: () => buyerApi.getAll(params),
  });
}

// READ: single buyer
export function useBuyer(id: string) {
  return useQuery({
    queryKey: buyerKeys.detail(id),
    queryFn: () => buyerApi.getById(id),
    enabled: Boolean(id),
  });
}

// CREATE
export function useCreateBuyer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBuyerPayload) =>
      buyerApi.create(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: buyerKeys.all,
      });
    },
  });
}

// UPDATE: buyer fields or status
export function useUpdateBuyer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateBuyerPayload;
    }) => buyerApi.update(id, payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: buyerKeys.all,
      });
    },
  });
}

// DELETE
export function useDeleteBuyer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => buyerApi.delete(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: buyerKeys.all,
      });
    },
  });
}