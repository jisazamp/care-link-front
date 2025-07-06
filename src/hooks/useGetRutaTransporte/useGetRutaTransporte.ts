import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { RutaDiaria } from "../../types";

const getRutaTransporte = (fecha: string, idProfesional: number) =>
  client.get<RutaDiaria>(
    `/api/transporte/ruta/${fecha}?id_profesional=${idProfesional}`,
  );

export const useGetRutaTransporte = (fecha: string, idProfesional: number) =>
  useQuery({
    queryKey: [`ruta-transporte-${fecha}-${idProfesional}`],
    queryFn: () => getRutaTransporte(fecha, idProfesional),
    enabled: !!fecha && !!idProfesional,
  });
