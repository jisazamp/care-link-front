import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { CronogramaTransporte } from "../../types";

const getTransportePaciente = (idCronogramaPaciente: number) =>
  client.get<{ data: CronogramaTransporte }>(
    `/api/transporte/paciente/${idCronogramaPaciente}`,
  );

export const useGetTransportePaciente = (idCronogramaPaciente: number) =>
  useQuery({
    queryKey: [`transporte-paciente-${idCronogramaPaciente}`],
    queryFn: () => getTransportePaciente(idCronogramaPaciente),
    enabled: !!idCronogramaPaciente,
  });
