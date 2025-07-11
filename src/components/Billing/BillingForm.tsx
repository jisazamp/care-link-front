import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, DatePicker, Button, Typography, Row, Col, Divider, Card, Select, message } from "antd";
import dayjs from "dayjs";
import type { Bill } from "../../types";
import { PaymentsForm } from "./components/PaymentsForm";
import { useGetBillPaymentsTotal } from "../../hooks/useGetBillPayments/useGetBillPayments";
import { useGetBillPayments } from "../../hooks/useGetBillPayments/useGetBillPayments";
import { formatCurrency } from "../../utils/paymentUtils";
import { useCreatePayment } from "../../hooks/useCreatePayment/useCreatePayment";

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

  // Hook para obtener el total pagado desde el backend
  const { data: pagosTotal, isLoading: loadingPagosTotal } = useGetBillPaymentsTotal(initialValues?.id_factura);
  // Hook para obtener los pagos consolidados desde el backend
  const { data: pagosConsolidados, isLoading: loadingPagosConsolidados } = useGetBillPayments(initialValues?.id_factura);
  const { createPaymentFnAsync } = useCreatePayment();

  // Preprocesar valores iniciales para fechas
  const initialFormValues = {
    ...initialValues,
    fecha_emision: initialValues?.fecha_emision ? dayjs(initialValues.fecha_emision) : undefined,
    fecha_vencimiento: initialValues?.fecha_vencimiento ? dayjs(initialValues.fecha_vencimiento) : undefined,
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
      let pagosBackend = (pagosConsolidados || []).map((pago: any) => ({
        ...pago,
        fecha_pago: pago.fecha_pago || "",
        saved: true // Marcar como consolidados
      }));
      // Procesar pagos locales (no guardados aún)
      let pagosLocales = (initialValues.pagos || []).filter((p: any) => !pagosBackend.some((pb: any) => pb.id_pago === p.id_pago));
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
  };

  const handleSubmit = async (values: any) => {
    // Convertir fechas a string
    const payload = {
      ...values,
      fecha_emision: values.fecha_emision ? values.fecha_emision.format("YYYY-MM-DD") : undefined,
      fecha_vencimiento: values.fecha_vencimiento ? values.fecha_vencimiento.format("YYYY-MM-DD") : undefined,
      total_factura: total,
      pagos: payments,
    };
    
    console.log("🚀 Actualizando factura...");
    console.log("📊 Estado actual de pagos:", payments);
    
    try {
      // Solo actualizar la factura - los pagos se registran individualmente
      await onSubmit(payload);
      console.log("✅ Factura actualizada exitosamente");
      message.success("Factura actualizada correctamente");
      
    } catch (error) {
      console.error("❌ Error al actualizar la factura:", error);
      message.error("Error al actualizar la factura");
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
                  style={{ fontWeight: 'bold', color: '#1890ff' }}
                />
              </Form.Item>
            </Col>
          )}
          <Col span={initialValues?.numero_factura ? 12 : 24}>
            <Form.Item label="Estado de la Factura">
              <Typography.Text 
                strong 
                type={
                  initialValues?.estado_factura === 'PAGADA' ? 'success' :
                  initialValues?.estado_factura === 'VENCIDA' ? 'danger' : 'warning'
                }
                style={{ fontSize: 16 }}
              >
                {initialValues?.estado_factura || 'PENDIENTE'}
              </Typography.Text>
            </Form.Item>
          </Col>
        </Row>
        {/* Mostrar el total pagado real desde backend */}
        {initialValues?.id_factura && (
          <Row gutter={16} style={{ marginTop: 8 }}>
            <Col span={24}>
              <Typography.Text strong style={{ color: '#52c41a', fontSize: 16 }}>
                Valor Total Pagado:&nbsp;
                {loadingPagosTotal ? 'Cargando...' : formatCurrency(pagosTotal?.total_pagado || 0)}
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
        <Form.Item label="Fecha de Emisión" name="fecha_emision" rules={[{ required: true, message: "Seleccione la fecha de emisión" }]}> 
          <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" disabled={readOnly} />
        </Form.Item>
        <Form.Item label="Fecha de Finalización" name="fecha_vencimiento">
          <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" disabled={readOnly} />
        </Form.Item>
        <Form.Item label="Subtotal" name="subtotal">
          <InputNumber min={0} style={{ width: "100%" }} disabled />
        </Form.Item>
        <Form.Item label="Impuestos" name="impuestos">
          <InputNumber min={0} style={{ width: "100%" }} disabled={readOnly} />
        </Form.Item>
        <Form.Item label="Descuentos" name="descuentos">
          <InputNumber min={0} style={{ width: "100%" }} disabled={readOnly} />
        </Form.Item>
        <Form.Item label="Total" name="total_factura">
          <InputNumber min={0} style={{ width: "100%" }} disabled />
        </Form.Item>
        <Form.Item label="Estado" name="estado_factura">
          <Select disabled={readOnly}>
            <Select.Option value="PENDIENTE">Pendiente</Select.Option>
            <Select.Option value="PAGADA">Pagada</Select.Option>
            <Select.Option value="VENCIDA">Vencida</Select.Option>
            <Select.Option value="CANCELADA">Cancelada</Select.Option>
            <Select.Option value="ANULADA">Anulada</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Observaciones" name="observaciones">
          <Input.TextArea rows={3} disabled={readOnly} />
        </Form.Item>
        
        <Divider />
        
        {/* Formulario de pagos */}
        <PaymentsForm
          payments={payments}
          setPayments={setPayments}
          subtotal={form.getFieldValue("subtotal") || 0}
          totalFactura={total}
          onChange={setPayments}
          disabled={readOnly || loading}
          facturaId={initialValues?.id_factura}
        />
        
        {!readOnly && (
          <Form.Item style={{ textAlign: "right", marginTop: 24 }}>
            <Button type="primary" htmlType="submit" loading={loading} size="large">
              {initialValues?.id_factura ? 'Actualizar Factura' : 'Crear Factura'}
            </Button>
          </Form.Item>
        )}
      </Form>
    </div>
  );
}; 