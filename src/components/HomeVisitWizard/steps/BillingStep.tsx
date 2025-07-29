import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Form, InputNumber, DatePicker, Input, Typography, Descriptions, Tag, Alert } from 'antd';
import { useFormContext, Controller } from 'react-hook-form';
import { FileTextOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { PaymentsForm } from '../../Billing/components/PaymentsForm/PaymentsForm';
import { formatCurrency } from '../../../utils/paymentUtils';

const { TextArea } = Input;
const { Title } = Typography;

// Función local para obtener el estado de la factura
const getEstadoFactura = (pendingBalance: number) => {
  return pendingBalance === 0 ? "PAGADA" : "PENDIENTE";
};

interface BillingStepProps {
  onValidChange: (isValid: boolean) => void;
}

export const BillingStep: React.FC<BillingStepProps> = ({ onValidChange }) => {
  const { watch, setValue, formState: { errors } } = useFormContext();
  const [payments, setPayments] = useState<any[]>([]);
  const [impuestos, setImpuestos] = useState<number>(0);
  const [descuentos, setDescuentos] = useState<number>(0);

  // Observar cambios en los campos
  const fecha_vencimiento = watch('fecha_vencimiento');

  // Valores por defecto para visitas domiciliarias
  const subtotal = 25000; // Valor por día
  const total = subtotal + impuestos - descuentos;

  // Número de factura será generado por el backend
  const numeroFacturaTemporal = "FACT-VD-2025-XXXX"; // Placeholder, será reemplazado por el backend

  // Calcular pagos y saldo pendiente
  const totalPagado = payments.reduce((total, payment) => total + (payment.valor || 0), 0);
  const saldoPendiente = Math.max(0, total - totalPagado);
  const estadoFactura = getEstadoFactura(saldoPendiente);

  // Verificar si el paso es válido (los pagos son opcionales)
  useEffect(() => {
    const isStepValid = true; // El paso de facturación siempre es válido
    onValidChange(isStepValid);
  }, [onValidChange]);

  // Sincronizar con el formulario principal
  useEffect(() => {
    setValue('impuestos', impuestos);
  }, [impuestos, setValue]);

  useEffect(() => {
    setValue('descuentos', descuentos);
  }, [descuentos, setValue]);

  const handlePaymentsChange = (newPayments: any[]) => {
    const formattedPayments = (newPayments || [])
      .filter((p): p is any => p !== undefined && p !== null)
      .map(p => ({
        paymentMethod: p.id_metodo_pago,
        paymentDate: p.fecha_pago,
        amount: p.valor,
        id_tipo_pago: p.id_tipo_pago
      }));
    setValue('payments', formattedPayments);
  };

  return (
    <div>
      <Title level={4} style={{ marginBottom: '24px' }}>
        Configuración de Facturación
      </Title>

      {/* Información de la factura */}
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileTextOutlined style={{ color: '#1890ff' }} />
            <span>Información de la Factura</span>
          </div>
        }
        style={{ marginBottom: 16 }}
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Número de Factura" span={1}>
            <strong style={{ color: '#1890ff' }}>
              {numeroFacturaTemporal}
            </strong>
          </Descriptions.Item>
          <Descriptions.Item label="Estado" span={1}>
            <Tag color={estadoFactura === "PAGADA" ? "green" : "orange"}>
              {estadoFactura}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Fecha de Emisión" span={1}>
            {dayjs().format('DD/MM/YYYY')}
          </Descriptions.Item>
          <Descriptions.Item label="Fecha de Vencimiento" span={1}>
            {fecha_vencimiento ? fecha_vencimiento.format('DD/MM/YYYY') : dayjs().add(30, 'days').format('DD/MM/YYYY')}
          </Descriptions.Item>
          <Descriptions.Item label="Subtotal" span={1}>
            <strong>{formatCurrency(subtotal)}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Total" span={1}>
            <strong style={{ fontSize: 18, color: '#1890ff' }}>
              {formatCurrency(total)}
            </strong>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Servicio incluido */}
      <Card 
        title="Servicio Incluido" 
        style={{ marginBottom: 16 }}
        size="small"
      >
        <Row gutter={16}>
          <Col span={24}>
            <Card size="small">
              <strong>Visita Domiciliaria</strong>
              <br />
              <span style={{ color: '#666' }}>
                Cantidad: 1 visita
              </span>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Formulario de pagos */}
      <Card title="Configuración de Pagos" style={{ marginBottom: 16 }}>
        <PaymentsForm
          payments={payments}
          setPayments={setPayments}
          subtotal={subtotal}
          totalFactura={total}
          onChange={handlePaymentsChange}
          disabled={false}
        />
      </Card>

      {/* Configuración de impuestos y descuentos */}
      <Card 
        title="Configuración de Facturación"
        style={{ marginBottom: 16 }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Impuestos">
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="0.00"
                value={impuestos}
                onChange={(v) => setImpuestos(Number(v) || 0)}
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => Number(value!.replace(/\$\s?|(,*)/g, ''))}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Descuentos">
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="0.00"
                value={descuentos}
                onChange={(v) => setDescuentos(Number(v) || 0)}
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => Number(value!.replace(/\$\s?|(,*)/g, ''))}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Controller
              name="fecha_vencimiento"
              render={({ field }) => (
                <Form.Item
                  label="Fecha de Vencimiento"
                  validateStatus={errors.fecha_vencimiento ? "error" : ""}
                  help={errors.fecha_vencimiento?.message?.toString()}
                >
                  <DatePicker
                    {...field}
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                    placeholder="Seleccione fecha de vencimiento"
                  />
                </Form.Item>
              )}
            />
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={24}>
            <Controller
              name="observaciones_factura"
              render={({ field }) => (
                <Form.Item
                  label="Observaciones de Facturación"
                  validateStatus={errors.observaciones_factura ? "error" : ""}
                  help={errors.observaciones_factura?.message?.toString()}
                >
                  <TextArea
                    {...field}
                    rows={3}
                    placeholder="Ingrese observaciones adicionales para la factura"
                  />
                </Form.Item>
              )}
            />
          </Col>
        </Row>
      </Card>

      {/* Alertas informativas */}
      <Alert
        message="Información de Facturación"
        description="Los pagos son opcionales. Puede configurarlos ahora o más tarde. La factura se creará con el valor por día de $25.000."
        type="info"
        showIcon
        style={{ marginTop: 16 }}
      />
    </div>
  );
};