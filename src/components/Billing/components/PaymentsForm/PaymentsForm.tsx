import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  message,
} from "antd";
import dayjs from "dayjs";
import type React from "react";
import { useCallback, useMemo, useState } from "react";
import { useCreatePayment } from "../../../../hooks/useCreatePayment/useCreatePayment";
import { useDeletePayment } from "../../../../hooks/useDeletePayment";
import { useGetPaymentMethods } from "../../../../hooks/useGetPaymentMethods";
import { useGetPaymentTypes } from "../../../../hooks/useGetPaymentTypes";
import type { PaymentFormData } from "../../../../utils/paymentUtils";
import { PaymentSummary } from "../PaymentSummary/PaymentSummary";

interface PaymentsFormProps {
  payments: PaymentFormData[];
  setPayments: React.Dispatch<React.SetStateAction<PaymentFormData[]>>;
  subtotal: number; // Nuevo prop para el subtotal
  totalFactura: number;
  onChange?: (payments: PaymentFormData[]) => void;
  disabled?: boolean;
  facturaId?: number; // Agregado para registro individual
}

export const PaymentsForm: React.FC<PaymentsFormProps> = ({
  payments,
  setPayments,
  subtotal,
  totalFactura,
  onChange,
  disabled,
  facturaId,
}) => {
  const [form] = Form.useForm();

  // Estado para controlar el auto-completado de formularios
  const [autoCompletedForms, setAutoCompletedForms] = useState<Set<number>>(
    new Set(),
  );

  // Estado para controlar formularios en edición (que fueron re-habilitados)
  const [editingForms, setEditingForms] = useState<Set<number>>(new Set());

  // Hooks centralizados
  const { data: paymentMethodsData, isLoading: paymentMethodsLoading } =
    useGetPaymentMethods();
  const { data: paymentTypesData, isLoading: paymentTypesLoading } =
    useGetPaymentTypes();
  const { addPaymentsToFacturaFnAsync, addPaymentsToFacturaPending } =
    useCreatePayment();
  const { deletePaymentFn, deletePaymentPending } = useDeletePayment();

  // Calcular total de pagos usando el estado centralizado
  const totalPayments = useMemo(() => {
    return payments.reduce((total, payment) => total + (payment.valor || 0), 0);
  }, [payments]);

  // Calcular saldo pendiente
  const pendingBalance = useMemo(() => {
    return Math.max(0, totalFactura - totalPayments);
  }, [totalFactura, totalPayments]);

  // Verificar si hay pagos válidos NUEVOS (no guardados)
  const hasValidNewPayments = useMemo(() => {
    return payments.some(
      (payment) =>
        payment.id_metodo_pago &&
        payment.id_tipo_pago &&
        payment.fecha_pago &&
        payment.valor > 0 &&
        !payment.saved &&
        !payment.id_pago,
    );
  }, [payments]);

  // Cargar datos de métodos y tipos de pago
  const paymentMethods = paymentMethodsData || [];
  const paymentTypes = paymentTypesData || [];

  // Función para verificar si hay pagos guardados
  const hasSavedPayments = useCallback(() => {
    return payments.some((payment) => payment.saved === true);
  }, [payments]);

  // NUEVA FUNCIÓN: Verificar si hay algún pago con tipo "Pago Total"
  const hasTotalPayment = useMemo(() => {
    return payments.some((payment) => payment.id_tipo_pago === 1); // Asumiendo que 1 es "Pago Total"
  }, [payments]);

  // NUEVA FUNCIÓN: Verificar si el último pago está completo
  const isLastPaymentComplete = useMemo(() => {
    if (payments.length === 0) return true; // Si no hay pagos, se puede agregar uno

    const lastPayment = payments[payments.length - 1];
    const lastIndex = payments.length - 1;

    // Verificar si el formulario está marcado como auto-completado
    if (autoCompletedForms.has(lastIndex)) {
      return true;
    }

    // Si el formulario está en edición, no considerarlo completo hasta que se complete nuevamente
    if (editingForms.has(lastIndex)) {
      return false;
    }

    return (
      lastPayment.id_metodo_pago &&
      lastPayment.id_tipo_pago &&
      lastPayment.fecha_pago &&
      lastPayment.valor > 0
    );
  }, [payments, autoCompletedForms, editingForms]);

  // NUEVA FUNCIÓN: Verificar si se puede agregar un nuevo pago
  const canAddNewPayment = useMemo(() => {
    // No se puede agregar si hay un pago total
    if (hasTotalPayment) return false;

    // No se puede agregar si el último pago no está completo
    if (!isLastPaymentComplete) return false;

    // No se puede agregar si hay algún pago en edición
    if (editingForms.size > 0) return false;

    return true;
  }, [hasTotalPayment, isLastPaymentComplete, editingForms]);

  // NUEVA FUNCIÓN: Obtener tipos de pago disponibles según el índice
  const getAvailablePaymentTypes = useCallback(
    (paymentIndex: number) => {
      // Si es el primer pago (índice 0), mostrar todos los tipos
      if (paymentIndex === 0) {
        return paymentTypes;
      }

      // Verificar si el primer pago es "Pago Parcial"
      const firstPayment = payments[0];
      const isFirstPaymentPartial = firstPayment?.id_tipo_pago === 2; // Asumiendo que 2 es "Pago Parcial"

      // Si el primer pago es parcial, filtrar para no mostrar "Pago Total" en pagos siguientes
      if (isFirstPaymentPartial) {
        return paymentTypes.filter((type: any) => type.id_tipo_pago !== 1); // Excluir "Pago Total" (id: 1)
      }

      // Si el primer pago no es parcial, mostrar todos los tipos
      return paymentTypes;
    },
    [paymentTypes, payments],
  );

  // Función para verificar si un formulario está completo
  const isFormComplete = useCallback((pago: any) => {
    return (
      pago.id_metodo_pago &&
      pago.id_tipo_pago &&
      pago.fecha_pago &&
      pago.valor > 0
    );
  }, []);

  // Función para manejar el auto-completado de formularios
  const handleAutoComplete = useCallback((index: number) => {
    setAutoCompletedForms((prev) => new Set([...prev, index]));
    // Remover del estado de edición si estaba ahí
    setEditingForms((prev) => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  }, []);

  // Función para manejar el inicio de edición de un formulario
  const handleStartEditing = useCallback((index: number) => {
    // Remover del auto-completado
    setAutoCompletedForms((prev) => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
    // Agregar al estado de edición
    setEditingForms((prev) => new Set([...prev, index]));
  }, []);

  // Manejar cambios en el formulario para sincronizar con el estado centralizado
  const handleFormChange = useCallback(
    (_changedFields: any, allFields: any) => {
      const formPayments = (allFields.pagos || []).filter(
        (pago: any): pago is any => pago !== undefined && pago !== null,
      );

      // Actualizar cada pago en el estado centralizado SIN registrar automáticamente
      const updatedPayments = formPayments.map((pago: any, index: number) => {
        const existingPayment = payments[index];
        const updatedPayment = {
          id_metodo_pago: pago.id_metodo_pago || undefined,
          id_tipo_pago: pago.id_tipo_pago || undefined,
          fecha_pago: pago.fecha_pago
            ? typeof pago.fecha_pago === "string"
              ? pago.fecha_pago
              : pago.fecha_pago.format("YYYY-MM-DD")
            : "",
          valor: pago.valor || 0,
          saved: existingPayment?.saved || false,
          id_pago: existingPayment?.id_pago,
          id_factura: existingPayment?.id_factura,
        };

        // NO verificar auto-completado aquí - solo sincronizar estado
        return updatedPayment;
      });

      setPayments(updatedPayments);
      onChange?.(updatedPayments);
    },
    [payments, setPayments, onChange],
  );

  // Función para guardar pagos usando la API correcta
  const handleSavePaymentsToFactura = useCallback(async () => {
    console.log("🚀 Iniciando guardado de pagos en factura...");
    console.log(" Factura ID:", facturaId);
    console.log("💳 Pagos actuales:", payments);

    try {
      const validPayments = payments.filter(
        (payment) =>
          payment.id_metodo_pago &&
          payment.id_tipo_pago &&
          payment.fecha_pago &&
          payment.valor > 0 &&
          !payment.saved && // Solo pagos no guardados
          !payment.id_pago, // Solo pagos nuevos
      );

      console.log(" Pagos válidos encontrados:", validPayments);

      if (validPayments.length === 0) {
        console.log("i No hay pagos nuevos válidos para guardar");
        message.info("No hay pagos nuevos para guardar");
        return false;
      }

      console.log("💳 Guardando pagos en factura:", validPayments);

      // Preparar payload para la API correcta
      const paymentsPayload = validPayments.map((payment) => ({
        id_metodo_pago: payment.id_metodo_pago!,
        id_tipo_pago: payment.id_tipo_pago!,
        fecha_pago: payment.fecha_pago,
        valor: payment.valor,
      }));

      console.log("📦 Payload para API:", paymentsPayload);

      if (facturaId) {
        console.log("🌐 Llamando a API:", `/api/facturas/${facturaId}/pagos/`);

        const response = await addPaymentsToFacturaFnAsync({
          facturaId: facturaId,
          payments: paymentsPayload,
        });

        console.log(" Pagos guardados exitosamente:", response);
        message.success("Pagos guardados correctamente");

        // Actualizar el estado local marcando los pagos como guardados
        const updatedPayments = payments.map((payment) => {
          if (!payment.saved && !payment.id_pago && payment.valor > 0) {
            return {
              ...payment,
              saved: true,
              id_factura: facturaId,
            };
          }
          return payment;
        });

        setPayments(updatedPayments);
        onChange?.(updatedPayments);

        console.log(" Estado de pagos actualizado:", updatedPayments);
        return true;
      }
      console.error(" No se pudo identificar la factura");
      message.error("No se pudo identificar la factura");
      return false;
    } catch (error) {
      console.error(" Error al guardar pagos:", error);
      message.error("Error al guardar los pagos");
      return false;
    }
  }, [payments, setPayments, onChange, facturaId, addPaymentsToFacturaFnAsync]);

  // Preparar pagos para el formulario (convertir fechas a dayjs)
  const formPayments = useMemo(() => {
    return payments.map((payment) => ({
      ...payment,
      fecha_pago: payment.fecha_pago ? dayjs(payment.fecha_pago) : undefined,
    }));
  }, [payments]);

  // Función para eliminar pago consolidado
  const handleDeleteConsolidatedPayment = (
    pago: PaymentFormData,
    idx: number,
  ) => {
    Modal.confirm({
      title: "¿Eliminar pago?",
      content:
        "Esta acción eliminará el pago de la base de datos y no se podrá recuperar. ¿Desea continuar?",
      okText: "Sí, eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      onOk: async () => {
        if (!pago.id_pago) return;
        try {
          await deletePaymentFn(pago.id_pago, {
            onSuccess: () => {
              const updatedPayments = payments.filter((_, i) => i !== idx);
              setPayments(updatedPayments);
              form.setFieldsValue({
                pagos: updatedPayments.map((p) => ({
                  ...p,
                  fecha_pago: p.fecha_pago ? dayjs(p.fecha_pago) : undefined,
                })),
              });
              onChange?.(updatedPayments);
              message.success("Pago eliminado correctamente");
            },
            onError: () => {
              message.error("Error al eliminar el pago");
            },
          });
        } catch (error) {
          message.error("Error inesperado al eliminar el pago");
        }
      },
    });
  };

  return (
    <div>
      {/* Resumen de pagos usando componente centralizado */}
      <PaymentSummary
        subtotal={subtotal}
        totalFactura={totalFactura}
        totalPayments={totalPayments}
        pendingBalance={pendingBalance}
        showStatus={true}
        title="Resumen de Pagos"
      />

      {/* Formulario de pagos */}
      <Card title="Gestión de Pagos">
        <Form
          form={form}
          onValuesChange={handleFormChange}
          initialValues={{ pagos: formPayments }}
        >
          <Form.List name="pagos">
            {(fields, { add, remove }) => {
              // Función para agregar pago
              const handleAddPayment = () => {
                // NUEVA VALIDACIÓN: Solo agregar si se puede
                if (!canAddNewPayment) {
                  if (hasTotalPayment) {
                    message.warning(
                      "No se puede agregar más pagos cuando ya existe un pago total",
                    );
                  } else if (!isLastPaymentComplete) {
                    message.warning(
                      "Complete el formulario del pago anterior antes de agregar uno nuevo",
                    );
                  } else if (editingForms.size > 0) {
                    message.warning(
                      "Complete la edición del pago actual antes de agregar uno nuevo",
                    );
                  }
                  return;
                }

                add();
                const newPayment: PaymentFormData = {
                  id_metodo_pago: undefined,
                  id_tipo_pago: undefined,
                  fecha_pago: "",
                  valor: 0,
                  saved: false,
                };
                setPayments([...payments, newPayment]);
              };

              // Función para eliminar pago
              const handleRemovePayment = (name: number, idx: number) => {
                remove(name);
                const updatedPayments = payments.filter((_, i) => i !== idx);
                setPayments(updatedPayments);

                // Limpiar el estado de auto-completado para el índice eliminado
                setAutoCompletedForms((prev) => {
                  const newSet = new Set(prev);
                  newSet.delete(idx);
                  return newSet;
                });
              };

              return (
                <>
                  {fields.map(({ key, name, ...restField }, idx) => {
                    const pago = payments[idx];
                    const isConsolidated =
                      pago?.id_pago || pago?.saved === true;

                    // NUEVA LÓGICA: Determinar si los campos deben estar deshabilitados
                    const isLastField = idx === fields.length - 1;
                    const isAutoCompleted = autoCompletedForms.has(idx);
                    const isBeingEdited = editingForms.has(idx);
                    // Permitir edición de cualquier pago que esté en modo edición
                    const fieldDisabled =
                      disabled ||
                      (isAutoCompleted && !isBeingEdited) ||
                      (!isLastField && !isConsolidated && !isBeingEdited);

                    if (isConsolidated) {
                      // Renderizar solo lectura
                      return (
                        <Card
                          key={`payment-${key}-${idx}`}
                          type="inner"
                          title={
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <span>Pago #{idx + 1}</span>
                              <span
                                style={{ color: "#52c41a", fontSize: "12px" }}
                              >
                                ✓ Consolidado
                              </span>
                              <Button
                                icon={<DeleteOutlined />}
                                danger
                                size="small"
                                loading={deletePaymentPending}
                                onClick={() =>
                                  handleDeleteConsolidatedPayment(pago, idx)
                                }
                                style={{ marginLeft: 8 }}
                              />
                            </div>
                          }
                          style={{
                            marginBottom: 32,
                            borderColor: "#52c41a",
                            padding: "24px 16px",
                            background: "#fafafa",
                          }}
                        >
                          <Row gutter={[24, 24]}>
                            <Col xs={24} md={12}>
                              <div style={{ marginBottom: 24 }}>
                                <b>Método de Pago:</b>{" "}
                                {paymentMethods.find(
                                  (m: any) =>
                                    m.id_metodo_pago === pago.id_metodo_pago,
                                )?.nombre || pago.id_metodo_pago}
                              </div>
                            </Col>
                            <Col xs={24} md={12}>
                              <div style={{ marginBottom: 24 }}>
                                <b>Tipo de Pago:</b>{" "}
                                {paymentTypes.find(
                                  (t: any) =>
                                    t.id_tipo_pago === pago.id_tipo_pago,
                                )?.nombre || pago.id_tipo_pago}
                              </div>
                            </Col>
                            <Col xs={24} md={12}>
                              <div style={{ marginBottom: 24 }}>
                                <b>Fecha de Pago:</b> {pago.fecha_pago}
                              </div>
                            </Col>
                            <Col xs={24} md={12}>
                              <div style={{ marginBottom: 24 }}>
                                <b>Valor:</b> ${" "}
                                {Number(pago.valor).toLocaleString()}
                              </div>
                            </Col>
                          </Row>
                        </Card>
                      );
                    }
                    // Si no es consolidado, render editable
                    if (isAutoCompleted && !isConsolidated) {
                      return (
                        <Card
                          key={`payment-${key}-${idx}`}
                          type="inner"
                          title={
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              <span>Pago #{idx + 1}</span>
                              <span
                                style={{ color: "#52c41a", fontSize: "12px" }}
                              >
                                ✓ Auto-completado
                              </span>
                              <Button
                                icon={<EditOutlined />}
                                size="small"
                                onClick={() => handleStartEditing(idx)}
                                style={{ marginLeft: 8 }}
                              />
                              <Button
                                icon={<DeleteOutlined />}
                                danger
                                size="small"
                                onClick={() => handleRemovePayment(name, idx)}
                                style={{ marginLeft: 4 }}
                              />
                            </div>
                          }
                          style={{
                            marginBottom: 32,
                            borderColor: "#52c41a",
                            background: "#f6ffed",
                            padding: "24px 16px",
                          }}
                        >
                          <Row gutter={[24, 24]}>
                            <Col xs={24} md={12}>
                              <Form.Item
                                {...restField}
                                name={[name, "id_metodo_pago"]}
                                label="Método de Pago"
                                rules={[
                                  {
                                    required: true,
                                    message: "Seleccione el método de pago",
                                  },
                                ]}
                                style={{ marginBottom: 24 }}
                              >
                                <Select
                                  placeholder="Seleccione método de pago"
                                  loading={paymentMethodsLoading}
                                  disabled={fieldDisabled}
                                  size="large"
                                  onBlur={() => {
                                    // Verificar si el formulario está completo al hacer blur
                                    const currentValues =
                                      form.getFieldValue("pagos");
                                    const currentPago = currentValues?.[idx];
                                    if (
                                      currentPago &&
                                      isFormComplete(currentPago) &&
                                      !autoCompletedForms.has(idx)
                                    ) {
                                      handleAutoComplete(idx);
                                    }
                                  }}
                                  onFocus={() => {
                                    // Iniciar edición cuando se enfoca un campo auto-completado
                                    if (autoCompletedForms.has(idx)) {
                                      handleStartEditing(idx);
                                    }
                                  }}
                                >
                                  {paymentMethods.map((method: any) => (
                                    <Select.Option
                                      key={method.id_metodo_pago}
                                      value={method.id_metodo_pago}
                                    >
                                      {method.nombre}
                                    </Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                              <Form.Item
                                {...restField}
                                name={[name, "id_tipo_pago"]}
                                label="Tipo de Pago"
                                rules={[
                                  {
                                    required: true,
                                    message: "Seleccione el tipo de pago",
                                  },
                                ]}
                                style={{ marginBottom: 24 }}
                              >
                                <Select
                                  placeholder="Seleccione tipo de pago"
                                  loading={paymentTypesLoading}
                                  disabled={fieldDisabled}
                                  size="large"
                                  onBlur={() => {
                                    // Verificar si el formulario está completo al hacer blur
                                    const currentValues =
                                      form.getFieldValue("pagos");
                                    const currentPago = currentValues?.[idx];
                                    if (
                                      currentPago &&
                                      isFormComplete(currentPago) &&
                                      !autoCompletedForms.has(idx)
                                    ) {
                                      handleAutoComplete(idx);
                                    }
                                  }}
                                  onFocus={() => {
                                    // Iniciar edición cuando se enfoca un campo auto-completado
                                    if (autoCompletedForms.has(idx)) {
                                      handleStartEditing(idx);
                                    }
                                  }}
                                >
                                  {getAvailablePaymentTypes(idx).map(
                                    (type: any) => (
                                      <Select.Option
                                        key={type.id_tipo_pago}
                                        value={type.id_tipo_pago}
                                      >
                                        {type.nombre}
                                      </Select.Option>
                                    ),
                                  )}
                                </Select>
                              </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                              <Form.Item
                                {...restField}
                                name={[name, "fecha_pago"]}
                                label="Fecha de Pago"
                                rules={[
                                  {
                                    required: true,
                                    message: "Seleccione la fecha de pago",
                                  },
                                ]}
                                style={{ marginBottom: 24 }}
                              >
                                <DatePicker
                                  style={{ width: "100%" }}
                                  format="YYYY-MM-DD"
                                  disabled={fieldDisabled}
                                  size="large"
                                  onBlur={() => {
                                    // Verificar si el formulario está completo al hacer blur
                                    const currentValues =
                                      form.getFieldValue("pagos");
                                    const currentPago = currentValues?.[idx];
                                    if (
                                      currentPago &&
                                      isFormComplete(currentPago) &&
                                      !autoCompletedForms.has(idx)
                                    ) {
                                      handleAutoComplete(idx);
                                    }
                                  }}
                                  onFocus={() => {
                                    // Iniciar edición cuando se enfoca un campo auto-completado
                                    if (autoCompletedForms.has(idx)) {
                                      handleStartEditing(idx);
                                    }
                                  }}
                                />
                              </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                              <Form.Item
                                {...restField}
                                name={[name, "valor"]}
                                label="Valor"
                                rules={[
                                  {
                                    required: true,
                                    message: "Ingrese el valor del pago",
                                  },
                                  {
                                    type: "number",
                                    min: 0.01,
                                    message: "El valor debe ser mayor a 0",
                                  },
                                ]}
                                style={{ marginBottom: 24 }}
                              >
                                <InputNumber
                                  style={{ width: "100%" }}
                                  min={0}
                                  step={0.01}
                                  formatter={(value) =>
                                    `$ ${value}`.replace(
                                      /\B(?=(\d{3})+(?!\d))/g,
                                      ",",
                                    )
                                  }
                                  disabled={fieldDisabled}
                                  placeholder="0.00"
                                  size="large"
                                  onBlur={() => {
                                    // Verificar si el formulario está completo al hacer blur
                                    const currentValues =
                                      form.getFieldValue("pagos");
                                    const currentPago = currentValues?.[idx];
                                    if (
                                      currentPago &&
                                      isFormComplete(currentPago) &&
                                      !autoCompletedForms.has(idx)
                                    ) {
                                      handleAutoComplete(idx);
                                    }
                                  }}
                                  onFocus={() => {
                                    // Iniciar edición cuando se enfoca un campo auto-completado
                                    if (autoCompletedForms.has(idx)) {
                                      handleStartEditing(idx);
                                    }
                                  }}
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        </Card>
                      );
                    }
                    // Si no es consolidado ni auto-completado, render editable
                    return (
                      <Card
                        key={`payment-${key}-${idx}`}
                        type="inner"
                        title={
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <span>Pago #{idx + 1}</span>
                            {isAutoCompleted && !isBeingEdited && (
                              <span
                                style={{ color: "#52c41a", fontSize: "12px" }}
                              >
                                ✓ Auto-completado
                              </span>
                            )}
                            {isBeingEdited && (
                              <span
                                style={{ color: "#faad14", fontSize: "12px" }}
                              >
                                ✏ En edición
                              </span>
                            )}
                          </div>
                        }
                        style={{
                          marginBottom: 32,
                          padding: "24px 16px",
                          ...(isAutoCompleted &&
                            !isBeingEdited && {
                              borderColor: "#52c41a",
                              background: "#f6ffed",
                            }),
                          ...(isBeingEdited && {
                            borderColor: "#faad14",
                            background: "#fffbe6",
                          }),
                        }}
                        extra={
                          <Space>
                            {!disabled && isLastField && (
                              <Button
                                icon={<DeleteOutlined />}
                                danger
                                size="small"
                                onClick={() => handleRemovePayment(name, idx)}
                              />
                            )}
                          </Space>
                        }
                      >
                        <Row gutter={[24, 24]}>
                          <Col xs={24} md={12}>
                            <Form.Item
                              {...restField}
                              name={[name, "id_metodo_pago"]}
                              label="Método de Pago"
                              rules={[
                                {
                                  required: true,
                                  message: "Seleccione el método de pago",
                                },
                              ]}
                              style={{ marginBottom: 24 }}
                            >
                              <Select
                                placeholder="Seleccione método de pago"
                                loading={paymentMethodsLoading}
                                disabled={fieldDisabled}
                                size="large"
                                onBlur={() => {
                                  // Verificar si el formulario está completo al hacer blur
                                  const currentValues =
                                    form.getFieldValue("pagos");
                                  const currentPago = currentValues?.[idx];
                                  if (
                                    currentPago &&
                                    isFormComplete(currentPago) &&
                                    !autoCompletedForms.has(idx)
                                  ) {
                                    handleAutoComplete(idx);
                                  }
                                }}
                                onFocus={() => {
                                  // Iniciar edición cuando se enfoca un campo auto-completado
                                  if (autoCompletedForms.has(idx)) {
                                    handleStartEditing(idx);
                                  }
                                }}
                              >
                                {paymentMethods.map((method: any) => (
                                  <Select.Option
                                    key={method.id_metodo_pago}
                                    value={method.id_metodo_pago}
                                  >
                                    {method.nombre}
                                  </Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12}>
                            <Form.Item
                              {...restField}
                              name={[name, "id_tipo_pago"]}
                              label="Tipo de Pago"
                              rules={[
                                {
                                  required: true,
                                  message: "Seleccione el tipo de pago",
                                },
                              ]}
                              style={{ marginBottom: 24 }}
                            >
                              <Select
                                placeholder="Seleccione tipo de pago"
                                loading={paymentTypesLoading}
                                disabled={fieldDisabled}
                                size="large"
                                onBlur={() => {
                                  // Verificar si el formulario está completo al hacer blur
                                  const currentValues =
                                    form.getFieldValue("pagos");
                                  const currentPago = currentValues?.[idx];
                                  if (
                                    currentPago &&
                                    isFormComplete(currentPago) &&
                                    !autoCompletedForms.has(idx)
                                  ) {
                                    handleAutoComplete(idx);
                                  }
                                }}
                                onFocus={() => {
                                  // Iniciar edición cuando se enfoca un campo auto-completado
                                  if (autoCompletedForms.has(idx)) {
                                    handleStartEditing(idx);
                                  }
                                }}
                              >
                                {getAvailablePaymentTypes(idx).map(
                                  (type: any) => (
                                    <Select.Option
                                      key={type.id_tipo_pago}
                                      value={type.id_tipo_pago}
                                    >
                                      {type.nombre}
                                    </Select.Option>
                                  ),
                                )}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12}>
                            <Form.Item
                              {...restField}
                              name={[name, "fecha_pago"]}
                              label="Fecha de Pago"
                              rules={[
                                {
                                  required: true,
                                  message: "Seleccione la fecha de pago",
                                },
                              ]}
                              style={{ marginBottom: 24 }}
                            >
                              <DatePicker
                                style={{ width: "100%" }}
                                format="YYYY-MM-DD"
                                disabled={fieldDisabled}
                                size="large"
                                onBlur={() => {
                                  // Verificar si el formulario está completo al hacer blur
                                  const currentValues =
                                    form.getFieldValue("pagos");
                                  const currentPago = currentValues?.[idx];
                                  if (
                                    currentPago &&
                                    isFormComplete(currentPago) &&
                                    !autoCompletedForms.has(idx)
                                  ) {
                                    handleAutoComplete(idx);
                                  }
                                }}
                                onFocus={() => {
                                  // Iniciar edición cuando se enfoca un campo auto-completado
                                  if (autoCompletedForms.has(idx)) {
                                    handleStartEditing(idx);
                                  }
                                }}
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} md={12}>
                            <Form.Item
                              {...restField}
                              name={[name, "valor"]}
                              label="Valor"
                              rules={[
                                {
                                  required: true,
                                  message: "Ingrese el valor del pago",
                                },
                                {
                                  type: "number",
                                  min: 0.01,
                                  message: "El valor debe ser mayor a 0",
                                },
                              ]}
                              style={{ marginBottom: 24 }}
                            >
                              <InputNumber
                                style={{ width: "100%" }}
                                min={0}
                                step={0.01}
                                formatter={(value) =>
                                  `$ ${value}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ",",
                                  )
                                }
                                disabled={fieldDisabled}
                                placeholder="0.00"
                                size="large"
                                onBlur={() => {
                                  // Verificar si el formulario está completo al hacer blur
                                  const currentValues =
                                    form.getFieldValue("pagos");
                                  const currentPago = currentValues?.[idx];
                                  if (
                                    currentPago &&
                                    isFormComplete(currentPago) &&
                                    !autoCompletedForms.has(idx)
                                  ) {
                                    handleAutoComplete(idx);
                                  }
                                }}
                                onFocus={() => {
                                  // Iniciar edición cuando se enfoca un campo auto-completado
                                  if (autoCompletedForms.has(idx)) {
                                    handleStartEditing(idx);
                                  }
                                }}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Card>
                    );
                  })}

                  {!disabled && (
                    <Row gutter={16} style={{ marginTop: 8 }}>
                      <Col xs={24}>
                        <Button
                          type="dashed"
                          onClick={handleAddPayment}
                          disabled={!canAddNewPayment}
                          block
                          icon={<PlusOutlined />}
                          size="large"
                          title={
                            !canAddNewPayment
                              ? hasTotalPayment
                                ? "No se puede agregar más pagos cuando ya existe un pago total"
                                : editingForms.size > 0
                                  ? "Complete la edición del pago actual antes de agregar uno nuevo"
                                  : "Complete el formulario del pago anterior antes de agregar uno nuevo"
                              : "Agregar nuevo pago"
                          }
                        >
                          Agregar Pago
                        </Button>
                      </Col>
                    </Row>
                  )}

                  {/* Información sobre auto-completado */}
                  {autoCompletedForms.size > 0 && (
                    <Row gutter={16} style={{ marginTop: 8 }}>
                      <Col xs={24}>
                        <div
                          style={{
                            padding: "8px 12px",
                            background: "#f6ffed",
                            border: "1px solid #b7eb8f",
                            borderRadius: "6px",
                            fontSize: "12px",
                            color: "#52c41a",
                          }}
                        >
                          💡 <strong>Tip:</strong> Los formularios se completan
                          automáticamente cuando llenas todos los campos y haces
                          clic fuera del último campo.
                        </div>
                      </Col>
                    </Row>
                  )}

                  {/* Botón "Guardar Pagos" solo aparece cuando hay facturaId (factura existente) */}
                  {!disabled && facturaId && (
                    <Row gutter={16} style={{ marginTop: 8 }}>
                      <Col xs={24} style={{ textAlign: "right" }}>
                        <div
                          style={{
                            padding: "8px 12px",
                            background: "#e6f7ff",
                            border: "1px solid #91d5ff",
                            borderRadius: "6px",
                            fontSize: "12px",
                            color: "#1890ff",
                            marginBottom: 8,
                          }}
                        >
                          💡 <strong>Nota:</strong> El botón "Guardar Pagos"
                          creará los pagos asociados a esta factura usando la
                          API correcta.
                        </div>
                        <Button
                          type="primary"
                          size="large"
                          onClick={handleSavePaymentsToFactura}
                          disabled={!hasValidNewPayments || hasSavedPayments()}
                          loading={addPaymentsToFacturaPending}
                        >
                          {hasSavedPayments()
                            ? "Pagos Guardados ✓"
                            : "Guardar Pagos"}
                        </Button>
                      </Col>
                    </Row>
                  )}
                </>
              );
            }}
          </Form.List>

          {/* Eliminar cualquier otro Form.Item de 'Guardar Pagos' fuera de este bloque */}
        </Form>
      </Card>
    </div>
  );
};
