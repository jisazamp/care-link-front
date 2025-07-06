import { useQuery } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { RutaDiaria } from "../../types";

const getRutaTransporte = (fecha: string) =>
  client.get<{ success: boolean; message: string; data: RutaDiaria }>(
    `/api/transporte/ruta/${fecha}`,
  );

export const useGetRutaTransporte = (fecha: string) =>
  useQuery({
    queryKey: [`ruta-transporte-${fecha}`],
    queryFn: () => getRutaTransporte(fecha),
    enabled: !!fecha,
  });
