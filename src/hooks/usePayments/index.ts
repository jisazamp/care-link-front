import { useState, useCallback, useMemo } from "react";
import {
  PaymentFormData,
  validatePayment,
  validatePayments,
  calculateTotalPayments,
  calculatePendingBalance,
  hasValidPayment,
} from "../../utils/paymentUtils";

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

  // Calcular totales usando utilidades centralizadas
  const totalPayments = useMemo(
    () => calculateTotalPayments(payments),
    [payments],
  );

  const pendingBalance = useMemo(
    () => calculatePendingBalance(totalFactura, payments),
    [totalFactura, payments],
  );

  const hasValidPayments = useMemo(() => {
    const result = hasValidPayment(payments);
    return result;
  }, [payments]);

  // Función centralizada para agregar pago
  const addPayment = useCallback(() => {
    const newPayment: PaymentFormData = {
      id_metodo_pago: undefined as any, // Usar undefined en lugar de 0
      id_tipo_pago: undefined as any, // Usar undefined en lugar de 0
      fecha_pago: "",
      valor: 0,
      saved: false,
    };

    const updatedPayments = [...payments, newPayment];
    setPayments(updatedPayments);
    onPaymentsChange?.(updatedPayments);
  }, [payments, onPaymentsChange]);

  // Función centralizada para eliminar pago
  const removePayment = useCallback(
    (index: number) => {
      const updatedPayments = payments.filter((_, i) => i !== index);
      setPayments(updatedPayments);
      onPaymentsChange?.(updatedPayments);
    },
    [payments, onPaymentsChange],
  );

  // Función centralizada para actualizar pago
  const updatePayment = useCallback(
    (index: number, payment: PaymentFormData) => {
      const updatedPayments = payments.map((p, i) =>
        i === index ? payment : p,
      );
      setPayments(updatedPayments);
      onPaymentsChange?.(updatedPayments);
    },
    [payments, onPaymentsChange],
  );

  // Función centralizada para validar todos los pagos
  const validateAllPayments = useCallback(() => {
    return validatePayments(payments);
  }, [payments]);

  // Función centralizada para guardar pagos
  const savePayments = useCallback(async () => {
    const validation = validateAllPayments();

    if (!validation.isValid) {
      console.error("Error de validación:", validation.errors[0]);
      return false;
    }

    try {
      // Aquí se enviarían los pagos al backend
      console.log("Pagos guardados exitosamente");

      // Actualizar el estado para reflejar que los pagos están guardados
      setPayments((prevPayments) => {
        const updatedPayments = prevPayments.map((payment) =>
          validatePayment(payment).isValid
            ? { ...payment, saved: true }
            : payment,
        );
        onPaymentsChange?.(updatedPayments);
        return updatedPayments;
      });

      return true;
    } catch (error) {
      console.error("Error al guardar los pagos:", error);
      return false;
    }
  }, [payments, validateAllPayments, onPaymentsChange]);

  // Función centralizada para resetear pagos
  const resetPayments = useCallback(() => {
    setPayments([]);
    onPaymentsChange?.([]);
  }, [onPaymentsChange]);

  return {
    // Estado
    payments,
    totalPayments,
    pendingBalance,
    hasValidPayments,

    // Acciones
    addPayment,
    removePayment,
    updatePayment,
    savePayments,
    resetPayments,

    // Validaciones
    validateAllPayments,
  };
};
