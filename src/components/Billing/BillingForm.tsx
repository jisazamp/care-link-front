import React, { useEffect, useMemo, useState } from "react";
import { Form, Input, InputNumber, DatePicker, Button, Typography, Row, Col, Divider, Card, Alert } from "antd";
import dayjs from "dayjs";
import type { Bill } from "../../types";
import { PaymentsForm } from "./components/PaymentsForm";

interface BillingFormProps {
  initialValues?: Partial<Bill>;
  onSubmit: (values: any) => void;
  loading?: boolean;
}

export const BillingForm: React.FC<BillingFormProps> = ({
  initialValues,
  onSubmit,
  loading,
}) => {
  const [form] = Form.useForm();
  const [total, setTotal] = useState<number>(0);
  const [payments, setPayments] = useState<any[]>([]);

  // Convertir fechas string a objetos dayjs para los valores iniciales
  const processedInitialValues = useMemo(() => {
    if (!initialValues) return undefined;
    return {
      ...initialValues,
      fecha_emision: initialValues.fecha_emision && initialValues.fecha_emision !== 'null' && initialValues.fecha_emision !== ''
        ? dayjs(initialValues.fecha_emision) 
        : dayjs(),
      fecha_vencimiento: initialValues.fecha_vencimiento && initialValues.fecha_vencimiento !== 'null' && initialValues.fecha_vencimiento !== ''
        ? dayjs(initialValues.fecha_vencimiento) 
        : undefined,
    };
  }, [initialValues]);

  useEffect(() => {
    if (processedInitialValues) {
      form.setFieldsValue(processedInitialValues);
      // Calcular total inicial
      const subtotal = Number(processedInitialValues.subtotal) || 0;
      const impuestos = Number(processedInitialValues.impuestos) || 0;
      const descuentos = Number(processedInitialValues.descuentos) || 0;
      setTotal(subtotal + impuestos - descuentos);
    } else {
      form.resetFields();
      setTotal(0);
    }
  }, [processedInitialValues, form]);

  // Calcular total en tiempo real
  const handleValuesChange = (_changed: any, all: any) => {
    const subtotal = Number(all.subtotal) || 0;
    const impuestos = Number(all.impuestos) || 0;
    const descuentos = Number(all.descuentos) || 0;
    const newTotal = subtotal + impuestos - descuentos;
    setTotal(newTotal);
  };

  const handleSubmit = (values: any) => {
    const data = {
      ...values,
      id_contrato: initialValues?.id_contrato || values.id_contrato,
      fecha_emision: values.fecha_emision && values.fecha_emision.format
        ? values.fecha_emision.format("YYYY-MM-DD")
        : values.fecha_emision,
      fecha_vencimiento: values.fecha_vencimiento && values.fecha_vencimiento.format
        ? values.fecha_vencimiento.format("YYYY-MM-DD")
        : values.fecha_vencimiento,
      total_factura: total,
      pagos: payments,
    };
    onSubmit(data);
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
      </Card>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={handleValuesChange}
      >
        {/* Fechas - Solo lectura */}
        <Card title="Fechas" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Fecha de emisión"
                name="fecha_emision"
                rules={[{ required: true, message: "La fecha de emisión es obligatoria" }]}
              >
                <DatePicker 
                  style={{ width: "100%" }} 
                  format="YYYY-MM-DD" 
                  disabled 
                  inputReadOnly 
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Fecha de vencimiento"
                name="fecha_vencimiento"
              >
                <DatePicker 
                  style={{ width: "100%" }} 
                  format="YYYY-MM-DD" 
                  disabled 
                  inputReadOnly 
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Valores de la factura */}
        <Card title="Valores de la Factura" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Subtotal"
                name="subtotal"
                rules={[{ required: true, message: "El subtotal es obligatorio" }]}
              >
                <InputNumber 
                  style={{ width: "100%" }} 
                  min={0} 
                  placeholder="0.00"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Impuestos"
                name="impuestos"
                rules={[{ required: true, message: "Los impuestos son obligatorios" }]}
              >
                <InputNumber 
                  style={{ width: "100%" }} 
                  min={0} 
                  placeholder="0.00"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Descuentos"
                name="descuentos"
                rules={[{ required: true, message: "Los descuentos son obligatorios" }]}
              >
                <InputNumber 
                  style={{ width: "100%" }} 
                  min={0} 
                  placeholder="0.00"
                />
              </Form.Item>
            </Col>
          </Row>
          
          {/* Total calculado */}
          <Row>
            <Col span={24}>
              <Form.Item label="Total de la Factura">
                <Typography.Text strong style={{ fontSize: 20, color: '#1890ff' }}>
                  $ {total.toLocaleString()}
                </Typography.Text>
              </Form.Item>
            </Col>
          </Row>

          {/* Alertas de validación */}
          {total < 0 && (
            <Alert
              message="Error en el cálculo"
              description="El total no puede ser negativo. Revise los valores de descuentos."
              type="error"
              showIcon
              style={{ marginTop: 8 }}
            />
          )}
        </Card>

        {/* Observaciones */}
        <Card title="Observaciones" style={{ marginBottom: 16 }}>
          <Form.Item name="observaciones">
            <Input.TextArea rows={3} placeholder="Ingrese observaciones adicionales..." />
          </Form.Item>
        </Card>
        
        <Divider />
        
        {/* Formulario de pagos */}
        <PaymentsForm
          totalFactura={total}
          initialPayments={initialValues?.pagos || []}
          onChange={setPayments}
          disabled={loading}
        />
        
        <Form.Item style={{ textAlign: "right", marginTop: 24 }}>
          <Button type="primary" htmlType="submit" loading={loading} size="large">
            {initialValues?.id_factura ? 'Actualizar Factura' : 'Crear Factura'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}; 