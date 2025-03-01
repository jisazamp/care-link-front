import { client } from "../../api/client";
import { useMutation } from "@tanstack/react-query";

const deleteRecord = (id: number) => client.delete(`/api/records/${id}`);

export const useDeleteRecordMutation = () => {
  return useMutation({
    mutationFn: deleteRecord,
    mutationKey: ["delete-family-member"],
  });
};
