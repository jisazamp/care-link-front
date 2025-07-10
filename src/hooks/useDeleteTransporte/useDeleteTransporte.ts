import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import { client } from "../../api/client";
import { queryClient } from "../../main";
import { handleTransportError } from "../../utils/errorHandler";

const deleteTransporte = (id: number) => client.delete(`/api/transporte/${id}`);

export const useDeleteTransporte = () => {
  return useMutation({
    mutationFn: deleteTransporte,
    mutationKey: ["delete-transporte"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ruta-transporte"] });
      queryClient.invalidateQueries({ queryKey: ["cronogramas"] });
    },
    onError: (error: any) => {
      const errorMsg = handleTransportError(error);
      message.error(errorMsg);
    },
  });
};
