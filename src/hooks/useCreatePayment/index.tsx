import { useMutation } from "@tanstack/react-query";
import { client } from "../../api/client";
import { queryClient } from "../../main";
import { message } from "antd";

interface PaymentData {
  id_metodo_pago: number;
  id_tipo_pago: number;
  fecha_pago: string;
  valor: number;
}

const createPayment = (facturaId: number, payments: PaymentData[]) =>
  client.post(`/api/facturas/${facturaId}/pagos/`, payments);

export const useCreatePayment = () =>
  useMutation({
    mutationFn: ({ facturaId, payments }: { facturaId: number; payments: PaymentData[] }) =>
      createPayment(facturaId, payments),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      message.success("Pagos agregados exitosamente");
    },
    onError: (error: any) => {
      message.error("Error al agregar pagos: " + (error?.response?.data?.detail || error.message));
    },
  }); 