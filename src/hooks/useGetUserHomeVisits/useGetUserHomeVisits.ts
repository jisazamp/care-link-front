import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { HomeVisit } from "../../types";

interface HomeVisitsResponse {
  data: HomeVisit[];
  message: string;
  success: boolean;
}

const getUserHomeVisits = (userId: number | string) =>
  client.get<HomeVisitsResponse>(`/api/users/${userId}/home-visits`);

export const useGetUserHomeVisits = (userId: number | string | undefined) => {
  return useQuery({
    queryKey: ["user-home-visits", userId],
    queryFn: () => getUserHomeVisits(userId!),
    enabled: !!userId,
    // Refrescar cada 30 segundos para actualizar estados automáticamente
    refetchInterval: 30000, // 30 segundos - más frecuente
    // Refrescar cuando la ventana vuelve a estar activa
    refetchOnWindowFocus: true,
    // Mantener datos frescos
    staleTime: 10000, // 10 segundos - datos más frescos
  });
};
