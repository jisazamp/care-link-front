import { useState, useCallback, useMemo } from "react";
import { PaymentFormData } from "../../utils/paymentUtils";

interface UsePaymentsProps {
  totalFactura: number;
  initialPayments?: PaymentFormData[];
  onPaymentsChange?: (payments: PaymentFormData[]) => void;
}

export const usePayments = ({
  totalFactura,
  initialPayments = [],
  onPaymentsChange,
}: UsePaymentsProps) => {
  const [payments, setPayments] = useState<PaymentFormData[]>(initialPayments);

  // Calcular total de pagos
  const totalPayments = useMemo(() => {
    return payments.reduce((total, payment) => total + (payment.valor || 0), 0);
  }, [payments]);

  // Calcular saldo pendiente
  const pendingBalance = useMemo(() => {
    return Math.max(0, totalFactura - totalPayments);
  }, [totalFactura, totalPayments]);

  // Verificar si hay pagos válidos
  const hasValidPayments = useMemo(() => {
    return payments.some(
      (payment) =>
        payment.id_metodo_pago &&
        payment.id_tipo_pago &&
        payment.fecha_pago &&
        payment.valor > 0,
    );
  }, [payments]);

  // Agregar pago
  const addPayment = useCallback(() => {
    const newPayment: PaymentFormData = {
      id_metodo_pago: undefined,
      id_tipo_pago: undefined,
      fecha_pago: "",
      valor: 0,
      saved: false,
    };
    const updatedPayments = [...payments, newPayment];
    setPayments(updatedPayments);
    onPaymentsChange?.(updatedPayments);
  }, [payments, onPaymentsChange]);

  // Remover pago
  const removePayment = useCallback(
    (index: number) => {
      const updatedPayments = payments.filter((_, i) => i !== index);
      setPayments(updatedPayments);
      onPaymentsChange?.(updatedPayments);
    },
    [payments, onPaymentsChange],
  );

  // Actualizar pago
  const updatePayment = useCallback(
    (index: number, payment: PaymentFormData) => {
      const updatedPayments = [...payments];
      updatedPayments[index] = payment;
      setPayments(updatedPayments);
      onPaymentsChange?.(updatedPayments);
    },
    [payments, onPaymentsChange],
  );

  // Guardar pagos (simulado por ahora)
  const savePayments = useCallback(async () => {
    try {
      const validPayments = payments.filter(
        (payment) =>
          payment.id_metodo_pago &&
          payment.id_tipo_pago &&
          payment.fecha_pago &&
          payment.valor > 0,
      );

      if (validPayments.length === 0) {
        console.error("❌ No hay pagos válidos para guardar");
        return false;
      }

      // Simular guardado exitoso
      console.log("✅ Pagos preparados para guardar:", validPayments);

      // Marcar pagos como guardados
      const updatedPayments = payments.map((payment) => ({
        ...payment,
        saved: true,
      }));
      setPayments(updatedPayments);
      onPaymentsChange?.(updatedPayments);

      return true;
    } catch (error) {
      console.error("❌ Error al guardar pagos:", error);
      return false;
    }
  }, [payments, onPaymentsChange]);

  return {
    payments,
    totalPayments,
    pendingBalance,
    hasValidPayments,
    addPayment,
    removePayment,
    updatePayment,
    savePayments,
  };
};
