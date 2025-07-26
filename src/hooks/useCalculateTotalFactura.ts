import { useMutation } from "@tanstack/react-query";
import { client } from "../api/client";

interface CalculateTotalFacturaData {
  subtotal: number;
  impuestos: number;
  descuentos: number;
}

interface CalculateTotalFacturaResponse {
  data: number;
  message: string;
  success: boolean;
}

const calculateTotalFactura = (data: CalculateTotalFacturaData) =>
  client.post<CalculateTotalFacturaResponse>(
    "/api/calcular/total_factura",
    data,
  );

export const useCalculateTotalFactura = () => {
  return useMutation({
    mutationKey: ["calculate-total-factura"],
    mutationFn: calculateTotalFactura,
    onSuccess: (response) => {
      const data = response.data;
      if (data.success) {
        console.log(" Total calculado exitosamente:", data.data);
      } else {
        console.error(" Error al calcular total:", data.message);
      }
    },
    onError: (error: any) => {
      console.error(" Error al calcular total de factura:", error);
    },
  });
};
