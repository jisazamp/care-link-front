import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";

const deleteCare = ({ id, careId }: { id: number; careId: number }) =>
  client.delete(`/api/records/${id}/care/${careId}`);

export const useDeleteCareMutation = () => {
  return useMutation({
    mutationKey: ["delete-care"],
    mutationFn: deleteCare,
  });
};
