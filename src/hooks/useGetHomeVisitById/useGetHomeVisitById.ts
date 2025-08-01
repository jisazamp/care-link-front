import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";

export const useGetHomeVisitById = (visitaId: string | undefined) => {
  return useQuery({
    queryKey: ["home-visit", visitaId],
    queryFn: async () => {
      if (!visitaId) return null;
      const res = await client.get<any>(`/api/home-visits/${visitaId}`);
      return res.data;
    },
    enabled: !!visitaId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3,
    retryDelay: 1000,
  });
};
