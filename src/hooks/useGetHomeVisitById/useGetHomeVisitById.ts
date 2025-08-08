import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";

export const useGetHomeVisitById = (visitaId: string | undefined) => {
  return useQuery({
    queryKey: ["home-visit", visitaId],
    queryFn: async () => {
      if (!visitaId) return null;
      console.log("=== DEBUG useGetHomeVisitById ===");
      console.log("visitaId:", visitaId);
      const res = await client.get<any>(`/api/home-visits/${visitaId}`);
      console.log("Response:", res);
      console.log("Response.data:", res.data);
      return res;
    },
    enabled: !!visitaId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3,
    retryDelay: 1000,
  });
};
