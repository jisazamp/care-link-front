import type { UserContractsResponse } from "../../types";
import { client } from "../../api/client";
import { useQuery } from "@tanstack/react-query";

const getUserContractsById = (id: number | string | undefined) =>
  client.get<UserContractsResponse[]>(`/api/contratos/${id}`);

export const useGetUserContracts = (id: number | string | undefined) =>
  useQuery({
    queryKey: [`user-${id}-contracts`],
    queryFn: () => getUserContractsById(id),
  });
