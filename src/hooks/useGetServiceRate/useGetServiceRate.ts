import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";

interface ServiceRateResponse {
  data: {
    id_servicio: number;
    anio: number;
    precio_por_dia: number;
  };
  message: string;
  success: boolean;
}

const getServiceRate = (serviceId: number, year: number) => {
  return client.get<ServiceRateResponse>(
    `/api/tarifas-servicio/${serviceId}/${year}`,
  );
};

export const useGetServiceRate = (serviceId: number, year: number) => {
  return useQuery({
    queryKey: ["service-rate", serviceId, year],
    queryFn: () => getServiceRate(serviceId, year),
    enabled: !!serviceId && !!year,
  });
};
