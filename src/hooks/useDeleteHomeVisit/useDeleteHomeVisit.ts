import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../api/client";

interface DeleteHomeVisitResponse {
  data: { deleted: boolean };
  message: string;
  success: boolean;
}

const deleteHomeVisit = (visitaId: number) =>
  client.delete<DeleteHomeVisitResponse>(`/api/home-visits/${visitaId}`);

export const useDeleteHomeVisit = (userId: number | string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteHomeVisit,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-home-visits", userId],
      });
    },
  });
};
