import type { PaymentMethod } from "../../types";
import { client } from "../../api/client";
import { useQuery } from "@tanstack/react-query";

const getPaymentMethods = () =>
  client.get<{ data: PaymentMethod[] }>("/api/metodos_pago");

const useGetPaymentMethods = () => {
  const { data: paymentMethodsData, isLoading: paymentMethodsLoading } =
    useQuery({
      queryKey: ["payment-methods"],
      queryFn: getPaymentMethods,
      staleTime: Number.POSITIVE_INFINITY,
    });
  return { paymentMethodsData, paymentMethodsLoading };
};

const getTipoPago = () =>
  client.get<{ data: { id_tipo_pago: number; nombre: string }[] }>(
    "/api/tipo_pago",
  );

export const useGetTipoPago = () =>
  useQuery({
    queryKey: ["tipo_pago"],
    queryFn: getTipoPago,
  });

export { useGetPaymentMethods };
