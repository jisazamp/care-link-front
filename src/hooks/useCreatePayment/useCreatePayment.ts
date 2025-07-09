import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { Payment } from "../../types";

const createPayment = (data: Omit<Payment, "id_pago">) =>
  client.post("/api/pagos/", data);

const addPaymentsToFactura = (
  facturaId: number,
  payments: Omit<Payment, "id_pago" | "id_factura">[],
) => client.post(`/api/facturas/${facturaId}/pagos/`, payments);

const useCreatePayment = () => {
  const {
    mutate: createPaymentFn,
    mutateAsync: createPaymentFnAsync,
    isPending: createPaymentPending,
    data: createPaymentData,
  } = useMutation({
    mutationKey: ["create-payment"],
    mutationFn: createPayment,
  });

  const {
    mutate: addPaymentsToFacturaFn,
    mutateAsync: addPaymentsToFacturaFnAsync,
    isPending: addPaymentsToFacturaPending,
  } = useMutation({
    mutationKey: ["add-payments-to-factura"],
    mutationFn: ({
      facturaId,
      payments,
    }: {
      facturaId: number;
      payments: Omit<Payment, "id_pago" | "id_factura">[];
    }) => addPaymentsToFactura(facturaId, payments),
  });

  return {
    createPaymentFn,
    createPaymentFnAsync,
    createPaymentData,
    createPaymentPending,
    addPaymentsToFacturaFn,
    addPaymentsToFacturaFnAsync,
    addPaymentsToFacturaPending,
  };
};

export { useCreatePayment };
