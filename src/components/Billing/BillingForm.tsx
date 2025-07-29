import { DownloadOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Typography,
  message,
} from "antd";
import dayjs from "dayjs";
import type React from "react";
import { useEffect, useState } from "react";
import { useDownloadPDF } from "../../hooks/useDownloadPDF";
import { useGetBillPaymentsTotal } from "../../hooks/useGetBillPayments/useGetBillPayments";
import { useGetBillPayments } from "../../hooks/useGetBillPayments/useGetBillPayments";
import type { Bill } from "../../types";
import { formatCurrency } from "../../utils/paymentUtils";
import { PaymentsForm } from "./components/PaymentsForm";

interface BillingFormProps {
  initialValues?: Partial<Bill>;
  onSubmit: (values: any) => void;
  loading?: boolean;
  readOnly?: boolean;
}

export const BillingForm: React.FC<BillingFormProps> = ({
  initialValues,
  onSubmit,
  loading,
  readOnly = false,
}) => {
  const [form] = Form.useForm();
  const [total, setTotal] = useState<number>(0);
  const [payments, setPayments] = useState<any[]>(initialValues?.pagos || []);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [hasNewPayments, setHasNewPayments] = useState(false);

  // Hook para descargar PDF
  const { downloadPDF, isDownloading: isDownloadingPDF } = useDownloadPDF();

  // Hook para obtener el total pagado desde el backend
  const { data: pagosTotal, isLoading: loadingPagosTotal } =
    useGetBillPaymentsTotal(initialValues?.id_factura);
  // Hook para obtener los pagos consolidados desde el backend
  const { data: pagosConsolidados } = useGetBillPayments(
    initialValues?.id_factura,
  );
  // Determinar si es edición de factura existente
  const isEdit = Boolean(initialValues?.id_factura);

  // Verificar si el botón "Actualizar Factura" debe estar habilitado
  const shouldEnableUpdateButton = isFormDirty || hasNewPayments;

  // Preprocesar valores iniciales para fechas
  const initialFormValues = {
    ...initialValues,
    fecha_emision: initialValues?.fecha_emision
      ? dayjs(initialValues.fecha_emision)
      : undefined,
    fecha_vencimiento: initialValues?.fecha_vencimiento
      ? dayjs(initialValues.fecha_vencimiento)
      : undefined,
    subtotal: initialValues?.subtotal ?? 0,
    impuestos: initialValues?.impuestos ?? 0,
    descuentos: initialValues?.descuentos ?? 0,
    observaciones: initialValues?.observaciones ?? "",
    estado_factura: initialValues?.estado_factura ?? "PENDIENTE",
  };

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialFormValues);
      // Calcular total inicial
      const subtotal = Number(initialValues.subtotal) || 0;
      const impuestos = Number(initialValues.impuestos) || 0;
      const descuentos = Number(initialValues.descuentos) || 0;
      setTotal(subtotal + impuestos - descuentos);
      // Procesar pagos consolidados del backend
      const pagosBackend = (pagosConsolidados || []).map((pago: any) => ({
        ...pago,
        fecha_pago: pago.fecha_pago || "",
        saved: true, // Marcar como consolidados
      }));
      // Procesar pagos locales (no guardados aún)
      let pagosLocales = (initialValues.pagos || []).filter(
        (p: any) => !pagosBackend.some((pb: any) => pb.id_pago === p.id_pago),
      );
      setPayments([...pagosBackend, ...pagosLocales]);
    } else {
      form.resetFields();
      setTotal(0);
      setPayments([]);
    }
  }, [initialValues, pagosConsolidados]);

  // Calcular total en tiempo real
  const handleValuesChange = (_changed: any, all: any) => {
    const subtotal = Number(all.subtotal) || 0;
    const impuestos = Number(all.impuestos) || 0;
    const descuentos = Number(all.descuentos) || 0;
    const newTotal = subtotal + impuestos - descuentos;
    setTotal(newTotal);

    // Detectar si hay cambios en el formulario (solo para facturas existentes)
    if (isEdit) {
      const hasChanges =
        all.descuentos !== initialValues?.descuentos ||
        all.estado_factura !== initialValues?.estado_factura ||
        all.observaciones !== initialValues?.observaciones;

      console.log(" Cambios detectados en formulario:", {
        descuentos: {
          actual: all.descuentos,
          inicial: initialValues?.descuentos,
        },
        estado_factura: {
          actual: all.estado_factura,
          inicial: initialValues?.estado_factura,
        },
        observaciones: {
          actual: all.observaciones,
          inicial: initialValues?.observaciones,
        },
        hasChanges,
      });

      setIsFormDirty(hasChanges);
    }
  };

  // Función para manejar cambios en los pagos
  const handlePaymentsChange = (newPayments: any[]) => {
    console.log("💳 Cambios en pagos detectados:", newPayments);
    setPayments(newPayments);

    // Detectar si hay pagos nuevos (no guardados)
    if (isEdit) {
      const hasNewPayments = newPayments.some(
        (payment) => !payment.saved && !payment.id_pago && payment.valor > 0,
      );
      console.log("🆕 Pagos nuevos detectados:", hasNewPayments);
      setHasNewPayments(hasNewPayments);
    }
  };

  const handleSubmit = async (values: any) => {
    // Convertir fechas a string y asegurar que los valores numéricos se envíen correctamente
    const payload = {
      ...values,
      fecha_emision: values.fecha_emision
        ? values.fecha_emision.format("YYYY-MM-DD")
        : undefined,
      fecha_vencimiento: values.fecha_vencimiento
        ? values.fecha_vencimiento.format("YYYY-MM-DD")
        : undefined,
      subtotal: Number(values.subtotal) || 0,
      impuestos: Number(values.impuestos) || 0,
      descuentos: Number(values.descuentos) || 0,
      total_factura: total,
      pagos: payments,
    };

    try {
      // Solo actualizar la factura - los pagos se registran individualmente
      await onSubmit(payload);
      message.success("Factura actualizada correctamente");
    } catch (error) {
      console.error(" Error al actualizar la factura:", error);
      message.error("Error al actualizar la factura");
    }
  };

  // Función para descargar PDF
  const handleDownloadPDF = async () => {
    if (!initialValues?.id_factura) {
      message.warning("No se puede descargar PDF de una factura nueva");
      return;
    }

    try {
      await downloadPDF(initialValues.id_factura);
      message.success("PDF descargado correctamente");
    } catch (error) {
      console.error("Error descargando PDF:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error al descargar el PDF";
      message.error(errorMessage);
    }
  };

  return (
    <div>
      {/* Información de la factura */}
      <Card title="Información de la Factura" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          {initialValues?.numero_factura && (
            <Col span={12}>
              <Form.Item label="Número de Factura">
                <Input
                  value={initialValues.numero_factura}
                  disabled
                  style={{ fontWeight: "bold", color: "#1890ff" }}
                />
              </Form.Item>
            </Col>
          )}
          <Col span={initialValues?.numero_factura ? 12 : 24}>
            <Form.Item label="Estado de la Factura">
              <Typography.Text
                strong
                type={
                  initialValues?.estado_factura === "PAGADA"
                    ? "success"
                    : initialValues?.estado_factura === "VENCIDA"
                      ? "danger"
                      : "warning"
                }
                style={{ fontSize: 16 }}
              >
                {initialValues?.estado_factura || "PENDIENTE"}
              </Typography.Text>
            </Form.Item>
          </Col>
        </Row>
        {/* Mostrar el total pagado real desde backend */}
        {initialValues?.id_factura && (
          <Row gutter={16} style={{ marginTop: 8 }}>
            <Col span={24}>
              <Typography.Text
                strong
                style={{ color: "#52c41a", fontSize: 16 }}
              >
                Valor Total Pagado:&nbsp;
                {loadingPagosTotal
                  ? "Cargando..."
                  : formatCurrency(pagosTotal?.total_pagado || 0)}
              </Typography.Text>
            </Col>
          </Row>
        )}
      </Card>

      <Form
        form={form}
        layout="vertical"
        initialValues={initialFormValues}
        onFinish={handleSubmit}
        onValuesChange={handleValuesChange}
        disabled={readOnly}
      >
        <Form.Item label="Número de Factura" name="numero_factura">
          <Input disabled placeholder="Se genera automáticamente" />
        </Form.Item>
        <Form.Item
          label="Fecha de Emisión"
          name="fecha_emision"
          rules={[
            { required: true, message: "Seleccione la fecha de emisión" },
          ]}
        >
          <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" disabled />
        </Form.Item>
        <Form.Item label="Fecha de Finalización" name="fecha_vencimiento">
          <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" disabled />
        </Form.Item>
        <Form.Item label="Subtotal" name="subtotal">
          <InputNumber min={0} style={{ width: "100%" }} disabled />
        </Form.Item>
        <Form.Item label="Impuestos" name="impuestos">
          <InputNumber min={0} style={{ width: "100%" }} disabled />
        </Form.Item>
        <Form.Item label="Descuentos" name="descuentos">
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            disabled={!isEdit ? readOnly : false}
          />
        </Form.Item>
        <Form.Item label="Total" name="total_factura">
          <InputNumber min={0} style={{ width: "100%" }} disabled />
        </Form.Item>
        <Form.Item label="Estado" name="estado_factura">
          <Select disabled={!isEdit ? readOnly : false}>
            <Select.Option value="PENDIENTE">Pendiente</Select.Option>
            <Select.Option value="PAGADA">Pagada</Select.Option>
            <Select.Option value="VENCIDA">Vencida</Select.Option>
            <Select.Option value="CANCELADA">Cancelada</Select.Option>
            <Select.Option value="ANULADA">Anulada</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Observaciones" name="observaciones">
          <Input.TextArea rows={3} disabled={!isEdit ? readOnly : false} />
        </Form.Item>

        <Divider />

        {/* Formulario de pagos */}
        <PaymentsForm
          payments={payments}
          setPayments={setPayments}
          subtotal={form.getFieldValue("subtotal") || 0}
          totalFactura={total}
          onChange={handlePaymentsChange}
          disabled={readOnly || loading}
          facturaId={initialValues?.id_factura}
        />

        {!readOnly && (
          <Form.Item style={{ textAlign: "right", marginTop: 24 }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              {isEdit && !shouldEnableUpdateButton && (
                <div
                  style={{
                    padding: "8px 12px",
                    background: "#fff7e6",
                    border: "1px solid #ffd591",
                    borderRadius: "6px",
                    fontSize: "12px",
                    color: "#d46b08",
                    textAlign: "center",
                  }}
                >
                  💡 <strong>Información:</strong> Edita algún campo de la
                  factura o agrega un pago para habilitar el botón "Actualizar
                  Factura".
                </div>
              )}
              <Space>
                {initialValues?.id_factura && (
                  <Button
                    type="default"
                    icon={<DownloadOutlined />}
                    onClick={handleDownloadPDF}
                    loading={isDownloadingPDF}
                    size="large"
                  >
                    {isDownloadingPDF ? "Descargando..." : "Descargar PDF"}
                  </Button>
                )}
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  disabled={isEdit && !shouldEnableUpdateButton}
                  title={
                    isEdit && !shouldEnableUpdateButton
                      ? "Edita algún campo o agrega un pago para habilitar la actualización"
                      : ""
                  }
                >
                  {initialValues?.id_factura
                    ? "Actualizar Factura"
                    : "Crear Factura"}
                </Button>
              </Space>
            </Space>
          </Form.Item>
        )}
      </Form>
    </div>
  );
};
