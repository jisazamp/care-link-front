import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";

interface UserFlowItem {
  id_usuario: number;
  nombre_completo: string;
  id_contrato: number;
  visitas_mes: number;
  // Nuevos campos mejorados
  estado_contrato: string;
  valor_total_contrato: number;
  fecha_fin_contrato?: string;
  visitas_realizadas_mes: number;
  visitas_pendientes_mes: number;
  visitas_canceladas_mes: number;
  ultima_fecha_visita?: string;
  proxima_visita?: string;
  tasa_asistencia_usuario: number;
  telefono?: string;
  email?: string;
  tipo_usuario: string;
}

interface UserFlowStats {
  // Métricas básicas
  usuarios_mes: number;
  tasa_asistencia: number;
  usuarios_mes_trend: number;
  tasa_asistencia_trend: number;

  // Nuevas métricas avanzadas
  nuevos_usuarios_mes: number;
  usuarios_activos_mes: number;
  usuarios_inactivos_mes: number;
  tasa_retencion: number;

  // Métricas de asistencia detalladas
  tasa_asistencia_usuarios: number;
  tasa_asistencia_profesionales: number;
  citas_perdidas_mes: number;
  citas_programadas_mes: number;
  citas_asistidas_mes: number;

  // Métricas de visitas
  total_visitas_mes: number;
  visitas_realizadas_mes: number;
  visitas_pendientes_mes: number;
  visitas_canceladas_mes: number;
  promedio_visitas_por_usuario: number;

  // Métricas de contratos
  contratos_activos: number;
  contratos_por_vencer: number;
  contratos_vencidos: number;
  valor_total_contratos: number;

  // Alertas y recomendaciones
  alertas: string[];
  recomendaciones: string[];
}

interface UserFlowResponse {
  stats: UserFlowStats;
  users: UserFlowItem[];
  // Nuevos campos para análisis avanzado
  tendencias_mensuales: Record<string, number>;
  distribucion_por_tipo: Record<string, number>;
  metricas_por_profesional: Record<string, number>;
}

export const useGetUserFlow = () => {
  return useQuery({
    queryKey: ["user-flow"],
    queryFn: async (): Promise<UserFlowResponse> => {
      const response = await client.get("/api/user-flow");
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};
