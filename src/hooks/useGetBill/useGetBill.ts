import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { Bill } from "../../types";

const getBillByContractId = (contractId: number) =>
  client.get<Bill[]>(`/api/contratos/${contractId}/facturas`);

export const useGetBill = (contractId: number) => {
  return useQuery({
    queryKey: [`contract-${contractId}-bills`],
    queryFn: () => getBillByContractId(contractId),
    enabled: !!contractId,
  });
};
