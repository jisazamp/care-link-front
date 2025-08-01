import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { client } from "../../api/client";
import type { UpdateEstadoAsistenciaRequest } from "../../types";
import { handleScheduleError } from "../../utils/errorHandler";

const updateEstadoAsistencia = ({
  id_cronograma_paciente,
  data,
}: {
  id_cronograma_paciente: number;
  data: UpdateEstadoAsistenciaRequest;
}) =>
  client.patch(
    `/api/cronograma_asistencia/paciente/${id_cronograma_paciente}/estado`,
    data,
  );

export const useUpdateEstadoAsistencia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEstadoAsistencia,
    onSuccess: () => {
      // Invalidar queries relacionadas con cronogramas
      queryClient.invalidateQueries({ queryKey: ["cronograma"] });
    },
    onError: (error: any) => {
      const errorMsg = handleScheduleError(error);
      message.error(errorMsg);
    },
  });
};
