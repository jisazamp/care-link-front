import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../api/client";

interface UpdateUserActivityStatusData {
  estado_participacion: string;
  observaciones?: string;
}

interface UpdateUserActivityStatusResponse {
  data: { message: string };
  message: string;
  success: boolean;
}

const updateUserActivityStatus = (
  activityUserId: number,
  data: UpdateUserActivityStatusData,
) =>
  client.patch<UpdateUserActivityStatusResponse>(
    `/api/activities/users/${activityUserId}/status`,
    data,
  );

export const useUpdateUserActivityStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      activityUserId,
      data,
    }: {
      activityUserId: number;
      data: UpdateUserActivityStatusData;
    }) => updateUserActivityStatus(activityUserId, data),
    onSuccess: () => {
      // Invalidar las consultas relacionadas
      queryClient.invalidateQueries({ queryKey: ["get-activity-users"] });
      queryClient.invalidateQueries({ queryKey: ["get-upcoming-activities"] });
    },
  });
};
