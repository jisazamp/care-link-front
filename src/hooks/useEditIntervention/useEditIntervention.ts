import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { UserIntervention } from "../../types";

const editIntervention = ({
  intervention,
  id,
}: {
  intervention: Partial<UserIntervention>;
  id: number | string;
}) => client.patch(`/api/user/intervention/${id}`, intervention);

export const useEditIntervention = () => {
  return useMutation({
    mutationKey: ["edit-intervention"],
    mutationFn: editIntervention,
  });
};
