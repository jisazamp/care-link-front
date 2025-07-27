import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../api/client";
import { message } from "antd";

interface UpdateAttendanceStatusData {
  estado_asistencia:
    | "PENDIENTE"
    | "ASISTIO"
    | "NO_ASISTIO"
    | "CANCELADO"
    | "REAGENDADO";
  observaciones?: string;
}

interface UpdateAttendanceStatusResponse {
  data: any;
  message: string;
  success: boolean;
}

const updateAttendanceStatus = async (
  id_cronograma_paciente: number,
  data: UpdateAttendanceStatusData,
) => {
  return client.patch<UpdateAttendanceStatusResponse>(
    `/api/cronograma_asistencia/paciente/${id_cronograma_paciente}/estado`,
    data,
  );
};

export const useUpdateAttendanceStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id_cronograma_paciente,
      data,
    }: {
      id_cronograma_paciente: number;
      data: UpdateAttendanceStatusData;
    }) => updateAttendanceStatus(id_cronograma_paciente, data),
    onSuccess: (response) => {
      message.success(
        response.data.message ||
          "Estado de asistencia actualizado exitosamente",
      );
      // Invalidar queries relacionadas para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ["daily-attendance"] });
      queryClient.invalidateQueries({ queryKey: ["cronograma"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.detail ||
        "Error al actualizar el estado de asistencia";
      message.error(errorMessage);
    },
  });
};
