import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../api/client";

interface RemoveUsersResponse {
  data: { message: string };
  message: string;
  success: boolean;
}

const removeUsersFromActivity = (activityId: number, userIds: number[]) =>
  client.delete<RemoveUsersResponse>(`/api/activities/${activityId}/users`, {
    data: { user_ids: userIds },
  });

export const useRemoveUsersFromActivity = (activityId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userIds: number[]) => removeUsersFromActivity(activityId, userIds),
    onSuccess: () => {
      // Invalidar las consultas relacionadas
      queryClient.invalidateQueries({ queryKey: ["get-activity-users", activityId] });
      queryClient.invalidateQueries({ queryKey: ["get-upcoming-activities"] });
    },
  });
}; 