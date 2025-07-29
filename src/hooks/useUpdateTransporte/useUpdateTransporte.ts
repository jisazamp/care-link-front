import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import { client } from "../../api/client";
import { queryClient } from "../../main";
import { handleTransportError } from "../../utils/errorHandler";
import type {
  CronogramaTransporte,
  UpdateTransporteRequest,
} from "../../types";

const updateTransporte = (data: {
  id: number;
  data: UpdateTransporteRequest;
}) =>
  client.patch<{ data: CronogramaTransporte }>(
    `/api/transporte/${data.id}`,
    data.data,
  );

const updateTransporteHorarios = (data: {
  id: number;
  data: { hora_recogida?: string; hora_entrega?: string };
}) =>
  client.patch<{ data: CronogramaTransporte }>(
    `/api/transporte/${data.id}/horarios`,
    data.data,
  );

export const useUpdateTransporte = () => {
  return useMutation({
    mutationFn: updateTransporte,
    mutationKey: ["update-transporte"],
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

export const useUpdateTransporteHorarios = () => {
  return useMutation({
    mutationFn: updateTransporteHorarios,
    mutationKey: ["update-transporte-horarios"],
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
