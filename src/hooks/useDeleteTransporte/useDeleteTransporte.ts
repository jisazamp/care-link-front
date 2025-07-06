import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";
import { queryClient } from "../../main";

const deleteTransporte = (id: number) => client.delete(`/api/transporte/${id}`);

export const useDeleteTransporte = () => {
  return useMutation({
    mutationFn: deleteTransporte,
    mutationKey: ["delete-transporte"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ruta-transporte"] });
      queryClient.invalidateQueries({ queryKey: ["cronogramas"] });
    },
  });
};
