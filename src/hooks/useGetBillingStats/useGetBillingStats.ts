import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";

interface BillingStatsData {
  // Estadísticas generales
  total_facturas: number;
  total_pagos: number;
  facturas_pendientes: number;
  facturas_pagadas: number;
  facturas_vencidas: number;
  facturas_canceladas: number;
  facturas_anuladas: number;

  // Valores monetarios
  valor_total_facturado: number;
  valor_pagado: number;
  valor_pendiente: number;
  promedio_por_factura: number;

  // Estadísticas del mes actual
  facturas_mes: number;
  pagos_mes: number;
  valor_facturado_mes: number;
  valor_pagado_mes: number;

  // Porcentajes
  porcentaje_pagadas: number;
  porcentaje_valor_pagado: number;
  cumplimiento_meta_mensual: number;

  // Alertas y métricas adicionales
  facturas_vencidas_count: number;
  valor_vencido: number;
  meta_mensual: number;

  // Indicadores de salud financiera
  salud_financiera: "EXCELENTE" | "BUENA" | "REGULAR" | "CRÍTICA";

  // Tendencia
  tendencia_facturacion: "CRECIENTE" | "ESTABLE" | "DECRECIENTE";
  tendencia_cobranza: "CRECIENTE" | "ESTABLE" | "DECRECIENTE";
}

export const useGetBillingStats = () => {
  return useQuery({
    queryKey: ["billing-stats"],
    queryFn: async (): Promise<BillingStatsData> => {
      const response = await client.get<{ data: BillingStatsData }>(
        "/api/facturas/estadisticas",
      );
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};
