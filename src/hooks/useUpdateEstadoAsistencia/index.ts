import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { UpdateEstadoAsistenciaRequest } from "../../types";

const updateEstadoAsistencia = (data: UpdateEstadoAsistenciaRequest) =>
  client.patch("/api/cronograma_asistencia/estado", data);

export const useUpdateEstadoAsistencia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEstadoAsistencia,
    onSuccess: () => {
      // Invalidar queries relacionadas con cronogramas
      queryClient.invalidateQueries({ queryKey: ["cronograma"] });
    },
  });
};
