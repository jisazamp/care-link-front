import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";
import { queryClient } from "../../main";
import type { Activity } from "../../types";

const editActivity = ({
  data,
  id,
}: {
  data: Partial<Activity>;
  id?: number | string;
}) => client.patch(`/api/activities/${id}`, data);
export const useEditActivity = (id?: number | string) =>
  useMutation({
    mutationKey: ["edit-activity"],
    mutationFn: editActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`get-activity-${id}`] });
    },
  });
