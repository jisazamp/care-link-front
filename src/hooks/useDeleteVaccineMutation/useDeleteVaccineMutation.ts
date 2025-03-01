import { client } from "../../api/client";
import { useMutation } from "@tanstack/react-query";

const deleteVaccine = ({ id, vaccineId }: { id: number; vaccineId: number }) =>
  client.delete(`/api/records/${id}/vaccine/${vaccineId}`);

export const useDeleteVaccineMutation = () => {
  return useMutation({
    mutationKey: [`delete-vaccine`],
    mutationFn: deleteVaccine,
  });
};
