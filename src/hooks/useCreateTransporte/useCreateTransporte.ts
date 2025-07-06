import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";
import { queryClient } from "../../main";
import type {
  CronogramaTransporte,
  CreateTransporteRequest,
} from "../../types";

const createTransporte = (data: CreateTransporteRequest) =>
  client.post<{ data: CronogramaTransporte }>("/api/transporte/crear", data);

export const useCreateTransporte = () => {
  return useMutation({
    mutationFn: createTransporte,
    mutationKey: ["create-transporte"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ruta-transporte"] });
      queryClient.invalidateQueries({ queryKey: ["cronogramas"] });
    },
  });
};
