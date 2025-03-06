import type { Activity } from "../../types";
import { client } from "../../api/client";
import { queryClient } from "../../main";
import { useMutation } from "@tanstack/react-query";

const createActivity = (data: Omit<Activity, "id">) =>
  client.post("/api/activities", data);
export const useCreateActivity = () =>
  useMutation({
    mutationKey: ["create-activity"],
    mutationFn: createActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-activities"] });
    },
  });
