import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { CronogramaAsistencia } from "../../types";

interface CronogramaResponse {
  data: CronogramaAsistencia[];
  status_code: number;
  message: string;
  error: null;
}

const getCronogramasPorRango = (fechaInicio: string, fechaFin: string) =>
  client.get<CronogramaResponse>(
    `/api/cronograma_asistencia/rango/${fechaInicio}/${fechaFin}`,
  );

export const useGetCronogramasPorRango = (
  fechaInicio: string,
  fechaFin: string,
) =>
  useQuery({
    queryKey: [`cronograma-rango-${fechaInicio}-${fechaFin}`],
    queryFn: () => getCronogramasPorRango(fechaInicio, fechaFin),
    enabled: !!fechaInicio && !!fechaFin,
  });
