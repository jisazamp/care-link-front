import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";
import { queryClient } from "../../main";
import type { Activity } from "../../types";

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
