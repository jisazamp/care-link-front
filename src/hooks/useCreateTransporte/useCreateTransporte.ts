import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import { client } from "../../api/client";
import { queryClient } from "../../main";
import type {
  CreateTransporteRequest,
  CronogramaTransporte,
} from "../../types";
import { handleTransportError } from "../../utils/errorHandler";

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
    onError: (error: any) => {
      const errorMsg = handleTransportError(error);
      message.error(errorMsg);
    },
  });
};
