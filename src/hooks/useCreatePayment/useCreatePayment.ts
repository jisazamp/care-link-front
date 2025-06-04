import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { Payment } from "../../types";

const createPayment = (data: Omit<Payment, "id_pago">) =>
  client.post("/api/pagos/registrar", data);

const useCreatePayment = () => {
  const {
    mutate: createPaymentFn,
    isPending: createPaymentPending,
    data: createPaymentData,
  } = useMutation({
    mutationKey: ["create-payment"],
    mutationFn: createPayment,
  });

  return { createPaymentFn, createPaymentData, createPaymentPending };
};

export { useCreatePayment };
