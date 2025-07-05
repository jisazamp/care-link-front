import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { ReagendarPacienteRequest } from "../../types";

const reagendarPaciente = (data: ReagendarPacienteRequest) =>
  client.post("/api/cronograma_asistencia/reagendar", data);

export const useReagendarPaciente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reagendarPaciente,
    onSuccess: () => {
      // Invalidar queries relacionadas con cronogramas
      queryClient.invalidateQueries({ queryKey: ["cronograma"] });
    },
  });
};
