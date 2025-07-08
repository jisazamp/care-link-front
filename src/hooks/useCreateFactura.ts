import { useMutation } from "@tanstack/react-query";
import { client } from "../api/client";
import { queryClient } from "../main";
import { handleContractError } from "../utils/errorHandler";
import { message } from "antd";
import type { Bill } from "../types";

interface CreateFacturaData {
  id_contrato: number;
  fecha_emision: string;
  fecha_vencimiento: string;
  total: number;
  pagos: Array<{
    id_metodo_pago: number;
    id_tipo_pago: number;
    fecha_pago: string;
    valor: number;
  }>;
}

const createFactura = (data: CreateFacturaData) =>
  client.post<{ data: Bill }>("/api/facturas", data);

export const useCreateFactura = () =>
  useMutation({
    mutationFn: createFactura,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
      message.success("Factura creada exitosamente");
    },
    onError: (error: any) => {
      const errorMsg = handleContractError(error);
      message.error(errorMsg);
    },
  });
