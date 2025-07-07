import { useQuery } from "@tanstack/react-query";
import { client } from "../api/client";
import type { Bill } from "../types";

const getFacturas = (contratoId?: number) =>
  contratoId
    ? client.get<{ data: Bill[] }>(`/api/contratos/${contratoId}/facturas`)
    : client.get<{ data: Bill[] }>(`/api/facturas`);

export const useGetFacturas = (contratoId?: number) =>
  useQuery({
    queryKey: contratoId ? ["facturas", contratoId] : ["facturas"],
    queryFn: () => getFacturas(contratoId),
  });
