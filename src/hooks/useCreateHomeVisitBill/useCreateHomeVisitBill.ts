import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../api/client";

interface CreateHomeVisitBillData {
  user_id: number;
  bill_data: {
    id_visita_domiciliaria: number;
    fecha_emision: string;
    fecha_vencimiento?: string | null;
    subtotal: number;
    impuestos: number;
    descuentos: number;
    total_factura: number;
    observaciones?: string;
  };
}

export const useCreateHomeVisitBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateHomeVisitBillData) => {
      const response = await client.post(
        `/api/users/${data.user_id}/home-visits/bills`,
        data.bill_data,
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["home-visit-bills"] });
      queryClient.invalidateQueries({ queryKey: ["home-visits"] });
    },
  });
};
