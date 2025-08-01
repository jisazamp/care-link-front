import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";

interface PaymentType {
  id_tipo_pago: number;
  nombre: string;
}

interface PaymentTypesResponse {
  data: PaymentType[];
  message: string;
  success: boolean;
}

const getPaymentTypes = () =>
  client.get<PaymentTypesResponse>("/api/tipos_pago");

export const useGetPaymentTypes = () => {
  return useQuery({
    queryKey: ["payment-types"],
    queryFn: getPaymentTypes,
    select: (response) => response.data.data || [],
  });
};
