import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";

const deleteIntervention = ({
  id,
  interventionId,
}: {
  id: number;
  interventionId: number;
}) => client.delete(`/api/records/${id}/intervention/${interventionId}`);

export const useDeleteInterventionMutation = () => {
  return useMutation({
    mutationKey: ["delete-intervention"],
    mutationFn: deleteIntervention,
  });
};
