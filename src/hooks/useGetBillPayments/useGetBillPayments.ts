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

interface BillPaymentsTotalResponse {
  id_factura: number;
  total_pagado: number;
}

const getBillPaymentsTotal = async (billId: number | undefined) => {
  if (!billId) return { id_factura: 0, total_pagado: 0 };
  const res = await client.get<BillPaymentsTotalResponse>(
    `/api/facturas/${billId}/pagos/total`,
  );
  return res.data;
};

export const useGetBillPaymentsTotal = (billId: number | undefined) => {
  return useQuery({
    queryKey: ["bill-payments-total", billId],
    queryFn: () => getBillPaymentsTotal(billId),
    enabled: !!billId,
    select: (data) => data,
  });
};
