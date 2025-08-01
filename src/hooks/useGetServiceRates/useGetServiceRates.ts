import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";

interface ServiceRate {
  id: number;
  id_servicio: number;
  anio: number;
  precio_por_dia: number;
  nombre_servicio: string;
}

interface ServiceRatesResponse {
  data: {
    TarifasServicioPorAnio: ServiceRate[];
  };
  message: string;
  success: boolean;
}

const getServiceRates = async () => {
  const response = await client.get<ServiceRatesResponse>(
    "/api/tarifas-servicios",
  );
  return response.data;
};

export const useGetServiceRates = () => {
  return useQuery({
    queryKey: ["service-rates"],
    queryFn: getServiceRates,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
