import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import { client } from "../api/client";
import { queryClient } from "../main";
import type { Bill } from "../types";
import { handleContractError } from "../utils/errorHandler";

interface UpdateFacturaData {
  fecha_emision?: string;
  fecha_vencimiento?: string;
  total_factura?: number;
  subtotal?: number;
  impuestos?: number;
  descuentos?: number;
  estado_factura?: string;
  observaciones?: string;
  pagos?: any[];
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
