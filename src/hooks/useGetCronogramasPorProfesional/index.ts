import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { CronogramaAsistencia } from "../../types";

const getCronogramasPorProfesional = (profesionalId: number) =>
  client.get<CronogramaAsistencia[]>(
    `/api/cronograma_asistencia/${profesionalId}`,
  );

export const useGetCronogramasPorProfesional = (profesionalId: number) =>
  useQuery({
    queryKey: [`cronograma-profesional-${profesionalId}`],
    queryFn: () => getCronogramasPorProfesional(profesionalId),
    enabled: !!profesionalId,
  });
