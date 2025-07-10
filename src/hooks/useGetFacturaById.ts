import { useQuery } from "@tanstack/react-query";
import { client } from "../api/client";
import type { Bill } from "../types";

const getFacturaById = (id: number) =>
  client.get<{ data: Bill }>(`/api/facturas/${id}`);

export const useGetFacturaById = (id: number) =>
  useQuery({
    queryKey: ["factura", id],
    queryFn: () => getFacturaById(id),
    enabled: !!id,
  });
