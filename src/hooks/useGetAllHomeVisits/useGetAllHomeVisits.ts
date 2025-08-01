import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { HomeVisit } from "../../types";

interface GetAllHomeVisitsResponse {
  data: HomeVisit[];
  message: string;
  success: boolean;
}

const getAllHomeVisits = () =>
  client.get<GetAllHomeVisitsResponse>("/api/home-visits");

export const useGetAllHomeVisits = () => {
  return useQuery({
    queryKey: ["all-home-visits"],
    queryFn: getAllHomeVisits,
    // Refrescar cada minuto para actualizar estados automáticamente
    refetchInterval: 60000, // 60 segundos
    // Refrescar cuando la ventana vuelve a estar activa
    refetchOnWindowFocus: true,
    // Mantener datos frescos
    staleTime: 30000, // 30 segundos
  });
};
