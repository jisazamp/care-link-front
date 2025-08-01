import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";

export const useGetHomeVisitBill = (visitaId: string | undefined) => {
  return useQuery({
    queryKey: ["home-visit-bill", visitaId],
    queryFn: async () => {
      if (!visitaId) return null;
      try {
        const res = await client.get<any>(
          `/api/home-visits/${visitaId}/factura`,
        );
        return res.data;
      } catch (error: any) {
        if (error.response?.status === 404) {
          return {
            data: null,
            message: "No hay factura asociada",
            status_code: 404,
          };
        }
        throw error;
      }
    },
    enabled: !!visitaId,
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: 1000,
  });
};
