import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";
import { queryClient } from "../../main";

const deleteActivity = (id?: string | number) =>
  client.delete(`/api/activities/${id}`);
export const useDeleteActivity = () =>
  useMutation({
    mutationKey: ["delete-activity"],
    mutationFn: deleteActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-activities"] });
    },
  });
