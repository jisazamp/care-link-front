import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../api/client";

interface AssignUsersData {
  usuarios_ids: number[];
  estado_participacion?: string;
  observaciones?: string;
}

interface AssignUsersResponse {
  data: { message: string };
  message: string;
  success: boolean;
}

const assignUsersToActivity = (activityId: number, data: AssignUsersData) =>
  client.post<AssignUsersResponse>(`/api/activities/${activityId}/users`, data);

export const useAssignUsersToActivity = (activityId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssignUsersData) => assignUsersToActivity(activityId, data),
    onSuccess: () => {
      // Invalidar las consultas relacionadas
      queryClient.invalidateQueries({ queryKey: ["get-activity-users", activityId] });
      queryClient.invalidateQueries({ queryKey: ["get-upcoming-activities"] });
    },
  });
}; 