import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";

export interface AsistenciaDiaria {
  id_cronograma_paciente: number;
  id_usuario: number;
  nombres: string;
  apellidos: string;
  tipo_servicio: string;
  estado_asistencia:
    | "PENDIENTE"
    | "ASISTIO"
    | "NO_ASISTIO"
    | "CANCELADO"
    | "REAGENDADO";
  estado_texto: string;
  color_estado: string;
  requiere_transporte: boolean;
  observaciones?: string;
  fecha_creacion: string;
  fecha_actualizacion?: string;
}

interface AsistenciaDiariaResponse {
  data: AsistenciaDiaria[];
  message: string;
  success: boolean;
}

const getDailyAttendance = (fecha?: string) => {
  const params = fecha ? `?fecha=${fecha}` : "";
  return client.get<AsistenciaDiariaResponse>(
    `/api/asistencia/diaria${params}`,
  );
};

export const useGetDailyAttendance = (fecha?: string) => {
  return useQuery({
    queryKey: ["daily-attendance", fecha],
    queryFn: () => getDailyAttendance(fecha),
    // Refrescar cada 30 segundos para mantener datos actualizados
    refetchInterval: 30000,
    // Refrescar cuando la ventana vuelve a estar activa
    refetchOnWindowFocus: true,
    // Mantener datos frescos
    staleTime: 10000,
  });
};
