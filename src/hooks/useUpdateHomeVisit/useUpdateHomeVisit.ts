import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { HomeVisit } from "../../types";

export interface UpdateHomeVisitData {
  fecha_visita?: string;
  hora_visita?: string;
  estado_visita?: string;
  direccion_visita?: string;
  telefono_visita?: string;
  valor_dia?: number;
  observaciones?: string;
  id_profesional_asignado?: number;
}

interface UpdateHomeVisitResponse {
  data: HomeVisit;
  message: string;
  success: boolean;
}

const updateHomeVisit = ({
  userId,
  visitaId,
  data,
}: {
  userId: number;
  visitaId: number;
  data: UpdateHomeVisitData;
}) =>
  client.put<UpdateHomeVisitResponse>(
    `/api/users/${userId}/home-visits/${visitaId}`,
    data,
  );

export const useUpdateHomeVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateHomeVisit,
    onSuccess: (_, variables) => {
      // Invalidar las consultas relacionadas con visitas domiciliarias
      queryClient.invalidateQueries({
        queryKey: ["user-home-visits", variables.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["all-home-visits"],
      });
    },
  });
};
