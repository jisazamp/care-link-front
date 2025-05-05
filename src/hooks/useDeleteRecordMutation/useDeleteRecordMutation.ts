import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";

const deleteRecord = (id: number) => client.delete(`/api/records/${id}`);

export const useDeleteRecordMutation = () => {
  return useMutation({
    mutationFn: deleteRecord,
    mutationKey: ["delete-family-member"],
  });
};
