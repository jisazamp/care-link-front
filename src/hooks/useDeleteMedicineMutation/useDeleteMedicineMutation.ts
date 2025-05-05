import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";

const deleteMedicine = ({
  id,
  medicineId,
}: {
  id: number;
  medicineId: number;
}) => client.delete(`/api/records/${id}/medicine/${medicineId}`);

export const useDeleteMedicineMutation = () => {
  return useMutation({
    mutationKey: ["delete-medicine"],
    mutationFn: deleteMedicine,
  });
};
