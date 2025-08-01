import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import { client } from "../../api/client";
import { queryClient } from "../../main";

interface ReagendarPacienteData {
  estado_asistencia: string;
  observaciones: string;
  nueva_fecha: string;
}

const reagendarPaciente = (
  id_cronograma_paciente: number,
  data: ReagendarPacienteData,
) =>
  client.post(
    `/api/cronograma_asistencia/paciente/${id_cronograma_paciente}/reagendar`,
    data,
  );

export const useReagendarPaciente = () =>
  useMutation({
    mutationFn: ({
      id_cronograma_paciente,
      data,
    }: {
      id_cronograma_paciente: number;
      data: ReagendarPacienteData;
    }) => reagendarPaciente(id_cronograma_paciente, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cronogramas"] });
      message.success("Paciente reagendado exitosamente");
    },
    onError: (error: any) => {
      message.error(
        `Error al reagendar paciente: ${error?.response?.data?.detail || error.message}`,
      );
    },
  });
