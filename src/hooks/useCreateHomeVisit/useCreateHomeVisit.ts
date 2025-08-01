import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../api/client";

export interface CreateHomeVisitData {
  id_usuario: number;
  fecha_visita: string;
  hora_visita: string;
  direccion_visita: string;
  telefono_visita?: string;
  valor_dia: number;
  observaciones?: string;
  id_profesional_asignado?: number;
}

export const useCreateHomeVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateHomeVisitData) => {
      const response = await client.post(
        `/api/users/${data.id_usuario}/home-visits`,
        {
          id_usuario: data.id_usuario,
          fecha_visita: data.fecha_visita,
          hora_visita: data.hora_visita,
          direccion_visita: data.direccion_visita,
          telefono_visita: data.telefono_visita,
          valor_dia: data.valor_dia,
          observaciones: data.observaciones,
          id_profesional_asignado: data.id_profesional_asignado,
        },
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home-visits"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
