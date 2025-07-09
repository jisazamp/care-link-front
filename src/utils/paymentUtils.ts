import dayjs from "dayjs";

// Tipos centralizados
export interface PaymentFormData {
  id_metodo_pago: number | undefined;
  id_tipo_pago: number | undefined;
  fecha_pago: string;
  valor: number;
  saved?: boolean; // Indica si el pago ha sido guardado
}

export interface PaymentValidationResult {
  isValid: boolean;
  errors: string[];
}

// Función centralizada de validación de pagos
export const validatePayment = (
  payment: PaymentFormData | undefined,
): PaymentValidationResult => {
  const errors: string[] = [];

  // Si el pago es undefined o null, retorna inválido
  if (!payment) {
    errors.push("Pago incompleto o vacío");
    return {
      isValid: false,
      errors,
    };
  }

  if (!payment.id_metodo_pago) {
    errors.push("Método de pago es requerido");
  }

  if (!payment.id_tipo_pago) {
    errors.push("Tipo de pago es requerido");
  }

  if (!payment.fecha_pago) {
    errors.push("Fecha de pago es requerida");
  }

  if (!payment.valor || payment.valor <= 0) {
    errors.push("El valor debe ser mayor a 0");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Función centralizada para validar múltiples pagos
export const validatePayments = (payments: (PaymentFormData | undefined)[]) => {
  const results = (payments || [])
    .filter(Boolean) // Elimina undefined/null
    .map(validatePayment);

  const isValid = results.every((r) => r.isValid);
  const errors = results.flatMap((r) => r.errors);

  return { isValid, errors };
};

// Función centralizada para formatear moneda
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Función centralizada para calcular total de pagos
export const calculateTotalPayments = (
  payments: (PaymentFormData | undefined)[],
): number => {
  return (payments || [])
    .filter(
      (payment): payment is PaymentFormData =>
        payment !== undefined && payment !== null,
    )
    .reduce((total, payment) => total + (payment.valor || 0), 0);
};

// Función centralizada para calcular saldo pendiente
export const calculatePendingBalance = (
  totalFactura: number,
  payments: PaymentFormData[],
): number => {
  const totalPayments = calculateTotalPayments(payments);
  return Math.max(0, totalFactura - totalPayments);
};

// Función centralizada para verificar si hay al menos un pago válido
export const hasValidPayment = (payments: PaymentFormData[]): boolean => {
  // Si no hay pagos, retornar false
  if (!payments || payments.length === 0) {
    return false;
  }

  // Verificar que haya al menos un pago válido
  const validPayments = payments.filter(
    (payment) => validatePayment(payment).isValid,
  );

  // Retornar true si hay al menos un pago válido
  return validPayments.length > 0;
};

// Función centralizada para preparar pagos para envío al backend
export const preparePaymentsForSubmission = (payments: PaymentFormData[]) => {
  return payments.map((payment) => ({
    ...payment,
    fecha_pago: dayjs(payment.fecha_pago).format("YYYY-MM-DD"),
    valor: Number(payment.valor),
  }));
};

// Función centralizada para validar tipo de pago (parcial vs total)
export const validatePaymentType = (
  tipoPagoId: number,
  valor: number,
  totalFactura: number,
  otrosPagos: PaymentFormData[],
): PaymentValidationResult => {
  const errors: string[] = [];

  // Si es pago total, verificar que cubra exactamente el total
  if (tipoPagoId === 1) {
    // Asumiendo que 1 es "Pago Total"
    const totalOtrosPagos = calculateTotalPayments(otrosPagos);
    const totalConEstePago = totalOtrosPagos + valor;

    if (totalConEstePago !== totalFactura) {
      errors.push(
        `El pago total debe ser exactamente ${formatCurrency(totalFactura)}`,
      );
    }
  }

  // Si es pago parcial, verificar que no exceda el total
  if (tipoPagoId === 2) {
    // Asumiendo que 2 es "Pago Parcial"
    const totalOtrosPagos = calculateTotalPayments(otrosPagos);
    const totalConEstePago = totalOtrosPagos + valor;

    if (totalConEstePago > totalFactura) {
      errors.push(
        `El total de pagos no puede exceder ${formatCurrency(totalFactura)}`,
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
