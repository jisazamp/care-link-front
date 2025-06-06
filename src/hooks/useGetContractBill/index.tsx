import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { Bill } from "../../types";

const getContractBill = (contractId: number | undefined) =>
  client.get<{ data: Bill }>(`/api/contratos/${contractId}/factura`);

const useGetContractBill = (contractId: number | undefined) => {
  const { data: contractBillData, isPending: contractBillLoading } = useQuery({
    queryKey: [`contract-${contractId}-bill`],
    queryFn: () => getContractBill(contractId),
    enabled: !!contractId,
  });

  return { contractBillData, contractBillLoading };
};

export { useGetContractBill };
