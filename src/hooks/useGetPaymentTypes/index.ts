import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";

const getPaymentTypes = () =>
  client.get<{ data: { id_tipo_pago: number; nombre: string }[] }>(
    "/api/tipos_pago",
  );

export const useGetPaymentTypes = () =>
  useQuery({
    queryKey: ["payment-types"],
    queryFn: getPaymentTypes,
  });
