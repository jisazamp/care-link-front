import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { HomeVisit } from "../../types";

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

interface CreateHomeVisitResponse {
  data: HomeVisit;
  message: string;
  success: boolean;
}

const createHomeVisit = ({
  userId,
  data,
}: {
  userId: number | string;
  data: CreateHomeVisitData;
}) =>
  client.post<CreateHomeVisitResponse>(
    `/api/users/${userId}/home-visits`,
    data,
  );

export const useCreateHomeVisit = (userId: number | string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateHomeVisitData) =>
      createHomeVisit({ userId: userId!, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-home-visits", userId],
      });
    },
  });
};
