import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { Bill } from "../../types";

interface BillsResponse {
  data: Bill[];
  message: string;
  success: boolean;
}

const getBillByContractId = async (contractId: number) => {
  if (!contractId) return { data: { data: [], message: "", success: true } };
  return client.get<BillsResponse>(`/api/contratos/${contractId}/facturas`);
};

export const useGetBill = (contractId: number) => {
  return useQuery({
    queryKey: ["contract-bills", contractId],
    queryFn: () => getBillByContractId(contractId),
    enabled: !!contractId,
    select: (response: any) => response.data?.data || [],
  });
};
