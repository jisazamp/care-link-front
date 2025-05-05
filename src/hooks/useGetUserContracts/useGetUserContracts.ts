import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { UserContractsResponse } from "../../types";

const getUserContractsById = (id: number | string | undefined) =>
  client.get<UserContractsResponse[]>(`/api/contratos/${id}`);

export const useGetUserContracts = (id: number | string | undefined) =>
  useQuery({
    queryKey: [`user-${id}-contracts`],
    queryFn: () => getUserContractsById(id),
  });
