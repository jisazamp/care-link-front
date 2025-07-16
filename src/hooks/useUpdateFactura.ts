import { useMutation } from "@tanstack/react-query";
import { client } from "../api/client";
import { queryClient } from "../main";
import { handleContractError } from "../utils/errorHandler";
import { message } from "antd";
import type { Bill } from "../types";

interface UpdateFacturaData {
  fecha_emision?: string;
  fecha_vencimiento?: string;
  total?: number;
  estado_factura?: string;
  observaciones?: string;
}

const updateFactura = ({ id, data }: { id: number; data: UpdateFacturaData }) =>
  client.patch<{ data: Bill }>(`/api/facturas/${id}`, data);

export const useUpdateFactura = () =>
  useMutation({
    mutationFn: updateFactura,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
      queryClient.invalidateQueries({ queryKey: ["facturacion-completa"] });
      message.success("Factura actualizada exitosamente");
    },
    onError: (error: any) => {
      const errorMsg = handleContractError(error);
      message.error(errorMsg);
    },
  });
