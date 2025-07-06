import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { client } from "../../api/client";
import { handleScheduleError } from "../../utils/errorHandler";
import type { UpdateEstadoAsistenciaRequest } from "../../types";

interface ReagendarPacienteRequest extends UpdateEstadoAsistenciaRequest {
  nueva_fecha: string; // Formato YYYY-MM-DD
}

const reagendarPaciente = ({
  id_cronograma_paciente,
  data,
}: {
  id_cronograma_paciente: number;
  data: ReagendarPacienteRequest;
}) =>
  client.post(
    `/api/cronograma_asistencia/paciente/${id_cronograma_paciente}/reagendar`,
    data,
  );

export const useReagendarPaciente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reagendarPaciente,
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
