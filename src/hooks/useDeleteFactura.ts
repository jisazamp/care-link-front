import { useMutation } from "@tanstack/react-query";
import { client } from "../api/client";
import { queryClient } from "../main";
import { handleContractError } from "../utils/errorHandler";
import { message } from "antd";

const deleteFactura = (id: number) => client.delete(`/api/facturas/${id}`);

export const useDeleteFactura = () =>
  useMutation({
    mutationFn: deleteFactura,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
      queryClient.invalidateQueries({ queryKey: ["facturacion-completa"] });
      message.success("Factura eliminada exitosamente");
    },
    onError: (error: any) => {
      const errorMsg = handleContractError(error);
      message.error(errorMsg);
    },
  });
