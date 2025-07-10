import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { Payment } from "../../types";

interface PaymentsResponse {
  data: Payment[];
  message: string;
  success: boolean;
}

const getBillPayments = async (billId: number | undefined) => {
  if (!billId) return { data: { data: [], message: "", success: true } };
  return client.get<PaymentsResponse>(`/api/pagos/factura/${billId}`);
};

export const useGetBillPayments = (billId: number | undefined) => {
  return useQuery({
    queryKey: ["bill-payments", billId],
    queryFn: () => getBillPayments(billId),
    enabled: !!billId,
    select: (response: any) => response.data?.data || [],
  });
};
