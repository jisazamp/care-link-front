import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { CronogramaAsistencia } from "../../types";

const getCronogramaByFecha = (fecha: string) =>
  client.get<CronogramaAsistencia[]>(
    `/api/cronograma_asistencia/fecha/${fecha}/pacientes`,
  );

export const useGetCronogramaByFecha = (fecha: string) =>
  useQuery({
    queryKey: [`cronograma-fecha-${fecha}`],
    queryFn: () => getCronogramaByFecha(fecha),
    enabled: !!fecha,
  });
