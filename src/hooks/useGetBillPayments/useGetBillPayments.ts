import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { Payment } from "../../types";

const getBillPayments = (billId: number) =>
  client.get<Payment[]>(`/api/pagos/factura/${billId}`);

export const useGetBillPayments = (billId: number) => {
  return useQuery({
    queryKey: [`bill-${billId}-payments`, billId],
    queryFn: () => getBillPayments(billId),
    enabled: !!billId,
  });
};
