import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";

interface PaymentMethod {
  id_metodo_pago: number;
  nombre: string;
}

interface PaymentMethodsResponse {
  data: PaymentMethod[];
  message: string;
  success: boolean;
}

const getPaymentMethods = () =>
  client.get<PaymentMethodsResponse>("/api/metodos_pago");

export const useGetPaymentMethods = () => {
  return useQuery({
    queryKey: ["payment-methods"],
    queryFn: getPaymentMethods,
    select: (response) => response.data.data || [],
  });
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
