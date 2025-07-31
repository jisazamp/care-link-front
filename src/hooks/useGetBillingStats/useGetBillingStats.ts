import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";

interface BillingStatsData {
  total_facturas: number;
  facturas_pendientes: number;
  facturas_pagadas: number;
  facturas_vencidas: number;
  valor_total: number;
  valor_pagado: number;
  valor_pendiente: number;
  promedio_por_factura: number;
  porcentaje_pagadas: number;
  porcentaje_valor_pagado: number;
}

interface BillingStatsResponse {
  data: BillingStatsData;
}

export const useGetBillingStats = () => {
  return useQuery({
    queryKey: ["billing-stats"],
    queryFn: async (): Promise<BillingStatsData> => {
      const response = await client.get<BillingStatsResponse>(
        "/api/facturas/estadisticas",
      );
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};
