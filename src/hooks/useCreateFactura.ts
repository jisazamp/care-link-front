import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../api/client";
import type { Bill } from "../types";

interface CreateFacturaData {
  id_contrato: number;
  fecha_emision: string;
  fecha_vencimiento: string;
  subtotal: number;
  impuestos: number;
  descuentos: number;
  total_factura: number;
  observaciones?: string;
}

interface CreateFacturaResponse {
  data: Bill;
  message: string;
  success: boolean;
}

const createFactura = (data: CreateFacturaData) =>
  client.post<CreateFacturaResponse>("/api/facturas", data);

export const useCreateFactura = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-factura"],
    mutationFn: createFactura,
    onSuccess: (response) => {
      // Invalidar queries relacionadas con facturas
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
      queryClient.invalidateQueries({ queryKey: ["contract-bills"] });

      const data = response.data;
      if (data.success) {
        console.log("✅ Factura creada exitosamente:", data.message);
      } else {
        console.error("❌ Error al crear factura:", data.message);
      }
    },
    onError: (error: any) => {
      console.error("❌ Error al crear factura:", error);
    },
  });
};
