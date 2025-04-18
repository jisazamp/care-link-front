import type { Contract, Service } from "../../types";
import { client } from "../../api/client";
import { useQuery } from "@tanstack/react-query";

const getContractById = (id: number | string | undefined) =>
  client.get<Contract & { servicios: Service[] }>(`/api/contrato/${id}`);

export const useGetContractById = (id: number | string | undefined) =>
  useQuery({
    queryKey: [`get-contract-${id}`],
    queryFn: () => getContractById(id),
    enabled: !!id,
  });
