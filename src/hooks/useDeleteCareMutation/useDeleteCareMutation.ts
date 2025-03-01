import { client } from "../../api/client";
import { useMutation } from "@tanstack/react-query";

const deleteCare = ({ id, careId }: { id: number; careId: number }) =>
  client.delete(`/api/records/${id}/care/${careId}`);

export const useDeleteCareMutation = () => {
  return useMutation({
    mutationKey: [`delete-care`],
    mutationFn: deleteCare,
  });
};
