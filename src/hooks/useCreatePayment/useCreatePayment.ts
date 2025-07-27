import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "../../api/client";
import type { Payment } from "../../types";

interface CreatePaymentRequest {
  id_factura: number;
  id_metodo_pago: number;
  id_tipo_pago: number;
  fecha_pago: string;
  valor: number;
}

interface CreatePaymentResponse {
  data: Payment;
  message: string;
  success: boolean;
}

const createPayment = (data: CreatePaymentRequest) =>
  client.post<CreatePaymentResponse>("/api/pagos/registrar", data);

const addPaymentsToFactura = (
  facturaId: number,
  payments: Omit<Payment, "id_pago" | "id_factura">[],
) => client.post(`/api/facturas/${facturaId}/pagos/`, payments);

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  const createPaymentMutation = useMutation({
    mutationKey: ["create-payment"],
    mutationFn: createPayment,
    onSuccess: (response) => {
      // Invalidar queries relacionadas con pagos
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["bill-payments"] });
      queryClient.invalidateQueries({ queryKey: ["facturas"] });

      const data = response.data;
      if (data.success) {
        console.log(" Pago registrado exitosamente:", data.message);
      } else {
        console.error(" Error al registrar pago:", data.message);
      }
    },
    onError: (error: any) => {
      // Manejar errores específicos de pagos
      if (error.response?.status === 400) {
        const errorMessage =
          error.response.data?.message || "Error de validación en pago";
        console.error(" Error de validación:", errorMessage);
      } else {
        console.error(" Error inesperado al registrar pago:", error);
      }
    },
  });

  // Nueva función para registrar pago individual inmediatamente
  const registerIndividualPayment = useMutation({
    mutationKey: ["register-individual-payment"],
    mutationFn: createPayment,
    onSuccess: (response) => {
      // Invalidar queries relacionadas con pagos
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["bill-payments"] });
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
      console.log(" Pago individual registrado exitosamente:", response.data);
    },
    onError: (error: any) => {
      console.error(" Error al registrar pago individual:", error);
    },
  });

  const addPaymentsToFacturaMutation = useMutation({
    mutationKey: ["add-payments-to-factura"],
    mutationFn: ({
      facturaId,
      payments,
    }: {
      facturaId: number;
      payments: Omit<Payment, "id_pago" | "id_factura">[];
    }) => addPaymentsToFactura(facturaId, payments),
    onSuccess: () => {
      // Invalidar queries relacionadas con pagos y facturas
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["bill-payments"] });
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
      console.log(" Pagos agregados a factura exitosamente");
    },
    onError: (error: any) => {
      console.error(" Error al agregar pagos a factura:", error);
    },
  });

  return {
    createPaymentFn: createPaymentMutation.mutate,
    createPaymentFnAsync: createPaymentMutation.mutateAsync,
    createPaymentData: createPaymentMutation.data,
    createPaymentPending: createPaymentMutation.isPending,
    registerIndividualPaymentFn: registerIndividualPayment.mutate,
    registerIndividualPaymentFnAsync: registerIndividualPayment.mutateAsync,
    registerIndividualPaymentPending: registerIndividualPayment.isPending,
    addPaymentsToFacturaFn: addPaymentsToFacturaMutation.mutate,
    addPaymentsToFacturaFnAsync: addPaymentsToFacturaMutation.mutateAsync,
    addPaymentsToFacturaPending: addPaymentsToFacturaMutation.isPending,
  };
};
