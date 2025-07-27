import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";

interface UserFlowItem {
  id_usuario: number;
  nombre_completo: string;
  id_contrato: number;
  visitas_mes: number;
}

interface UserFlowStats {
  usuarios_mes: number;
  tasa_asistencia: number;
  usuarios_mes_trend: number;
  tasa_asistencia_trend: number;
}

interface UserFlowResponse {
  stats: UserFlowStats;
  users: UserFlowItem[];
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
