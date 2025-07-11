import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { Contract } from "../../types";

const getUserContractsById = async (id: number | string | undefined) => {
  if (!id) return [];
  // El endpoint devuelve directamente un array de contratos
  const response = await client.get<Contract[]>(`/api/contratos/${id}`);
  return response.data;
};

export const useGetUserContracts = (id: number | string | undefined) =>
  useQuery({
    queryKey: ["user-contracts", id],
    queryFn: () => getUserContractsById(id),
    enabled: !!id,
  });
