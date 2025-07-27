import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { HomeVisit } from "../../types";

interface GetUserFirstHomeVisitResponse {
  data: HomeVisit | null;
  message: string;
  success: boolean;
}

const getUserFirstHomeVisit = (userId: number | string) =>
  client.get<GetUserFirstHomeVisitResponse>(`/api/users/${userId}/home-visits`);

export const useGetUserFirstHomeVisit = (
  userId: number | string | undefined,
) => {
  return useQuery({
    queryKey: ["user-first-home-visit", userId],
    queryFn: () => getUserFirstHomeVisit(userId!),
    enabled: !!userId,
    retry: 3,
    retryDelay: 1000,
    staleTime: 5000, // 5 segundos para evitar refetch innecesario
    refetchOnWindowFocus: true, // Refetch cuando la ventana vuelve a estar activa
    refetchOnMount: true, // Refetch cuando el componente se monta
    select: (data) => {
      // Retornar la primera visita (la más reciente por fecha de creación)
      const visitas = data.data.data;
      return visitas && Array.isArray(visitas) && visitas.length > 0
        ? visitas[0]
        : null;
    },
  });
};
