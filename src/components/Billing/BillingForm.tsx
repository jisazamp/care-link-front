import React, { useEffect,  useState } from "react";
import { Form, Input, InputNumber, DatePicker, Button, Typography, Row, Col, Divider, Card, Select } from "antd";
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
  const [payments, setPayments] = useState<any[]>(initialValues?.pagos || []);

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
      
      // Procesar pagos para asegurar que las fechas estén en el formato correcto
      const processedPayments = (initialValues.pagos || []).map((pago: any) => ({
        ...pago,
        fecha_pago: pago.fecha_pago || ""
      }));
      setPayments(processedPayments);
    } else {
      form.resetFields();
      setTotal(0);
      setPayments([]);
    }
  }, [initialValues]); // Solo depende de initialValues

  // Calcular total en tiempo real
  const handleValuesChange = (_changed: any, all: any) => {
    const subtotal = Number(all.subtotal) || 0;
    const impuestos = Number(all.impuestos) || 0;
    const descuentos = Number(all.descuentos) || 0;
    const newTotal = subtotal + impuestos - descuentos;
    setTotal(newTotal);
  };

  const handleSubmit = (values: any) => {
    // Convertir fechas a string
    const payload = {
      ...values,
      fecha_emision: values.fecha_emision ? values.fecha_emision.format("YYYY-MM-DD") : undefined,
      fecha_vencimiento: values.fecha_vencimiento ? values.fecha_vencimiento.format("YYYY-MM-DD") : undefined,
      total_factura: total,
      pagos: payments,
    };
    onSubmit(payload);
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
        initialValues={initialFormValues}
        onFinish={handleSubmit}
        onValuesChange={handleValuesChange}
      >
        <Form.Item label="Número de Factura" name="numero_factura">
          <Input disabled placeholder="Se genera automáticamente" />
        </Form.Item>
        <Form.Item label="Fecha de Emisión" name="fecha_emision" rules={[{ required: true, message: "Seleccione la fecha de emisión" }]}> 
          <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item label="Fecha de Finalización" name="fecha_vencimiento">
          <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item label="Subtotal" name="subtotal">
          <InputNumber min={0} style={{ width: "100%" }} disabled />
        </Form.Item>
        <Form.Item label="Impuestos" name="impuestos">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Descuentos" name="descuentos">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Total" name="total_factura">
          <InputNumber min={0} style={{ width: "100%" }} disabled />
        </Form.Item>
        <Form.Item label="Estado" name="estado_factura">
          <Select>
            <Select.Option value="PENDIENTE">Pendiente</Select.Option>
            <Select.Option value="PAGADA">Pagada</Select.Option>
            <Select.Option value="VENCIDA">Vencida</Select.Option>
            <Select.Option value="CANCELADA">Cancelada</Select.Option>
            <Select.Option value="ANULADA">Anulada</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Observaciones" name="observaciones">
          <Input.TextArea rows={3} />
        </Form.Item>
        
        <Divider />
        
        {/* Formulario de pagos */}
        <PaymentsForm
          totalFactura={total}
          initialPayments={payments}
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