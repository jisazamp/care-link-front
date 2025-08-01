import { useQuery } from "@tanstack/react-query";
import { client } from "../api/client";

export const useGetFacturacionCompleta = () =>
  useQuery({
    queryKey: ["facturacion-completa"],
    queryFn: async () => {
      const res = await client.get<any>("/api/facturacion/completa");
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
