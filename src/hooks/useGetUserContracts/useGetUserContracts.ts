import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { UserContractsResponse } from "../../types";

const getUserContractsById = (id: number | string | undefined) => {
  if (id) {
    return client.get<UserContractsResponse[]>(`/api/contratos/${id}`);
  }
  // Si no hay ID, obtener todos los contratos
  return client.get<UserContractsResponse[]>("/api/contratos");
};

export const useGetUserContracts = (id: number | string | undefined) =>
  useQuery({
    queryKey: id ? [`user-${id}-contracts`] : ["all-contracts"],
    queryFn: () => getUserContractsById(id),
  });
