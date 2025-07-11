import React, { useCallback, useMemo } from "react";
import { Form, InputNumber, DatePicker, Button, Select, Card, Row, Col, Space } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useGetPaymentMethods } from "../../../../hooks/useGetPaymentMethods";
import { useGetPaymentTypes } from "../../../../hooks/useGetPaymentTypes";
import { PaymentFormData } from "../../../../utils/paymentUtils";
import { PaymentSummary } from "../PaymentSummary/PaymentSummary";

interface PaymentsFormProps {
  payments: PaymentFormData[];
  setPayments: React.Dispatch<React.SetStateAction<PaymentFormData[]>>;
  subtotal: number; // Nuevo prop para el subtotal
  totalFactura: number;
  onChange?: (payments: PaymentFormData[]) => void;
  disabled?: boolean;
}

export const PaymentsForm: React.FC<PaymentsFormProps> = ({
  payments,
  setPayments,
  subtotal,
  totalFactura,
  onChange,
  disabled,
}) => {
  const [form] = Form.useForm();
  
  // Hooks centralizados
  const { data: paymentMethodsData, isLoading: paymentMethodsLoading } = useGetPaymentMethods();
  const { data: paymentTypesData, isLoading: paymentTypesLoading } = useGetPaymentTypes();

  // Calcular total de pagos usando el estado centralizado
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

  // Cargar datos de métodos y tipos de pago
  const paymentMethods = paymentMethodsData || [];
  const paymentTypes = paymentTypesData || [];

  // Función para verificar si hay pagos guardados
  const hasSavedPayments = useCallback(() => {
    return payments.some(payment => payment.saved === true);
  }, [payments]);

  // Manejar cambios en el formulario para sincronizar con el estado centralizado
  const handleFormChange = useCallback((_changedFields: any, allFields: any) => {
    const formPayments = (allFields.pagos || [])
      .filter((pago: any): pago is any => pago !== undefined && pago !== null);
    
    // Actualizar cada pago en el estado centralizado
    const updatedPayments = formPayments.map((pago: any, index: number) => {
      const existingPayment = payments[index];
      return {
        id_metodo_pago: pago.id_metodo_pago || undefined,
        id_tipo_pago: pago.id_tipo_pago || undefined,
        fecha_pago: pago.fecha_pago ? (typeof pago.fecha_pago === 'string' ? pago.fecha_pago : pago.fecha_pago.format('YYYY-MM-DD')) : "",
        valor: pago.valor || 0,
        saved: existingPayment?.saved || false,
      };
    });
    
    setPayments(updatedPayments);
    onChange?.(updatedPayments);
  }, [payments, setPayments, onChange]);

  // Manejar guardar pagos
  const handleSavePayments = useCallback(async () => {
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
      onChange?.(updatedPayments);

      return true;
    } catch (error) {
      console.error("❌ Error al guardar pagos:", error);
      return false;
    }
  }, [payments, setPayments, onChange]);

  // Preparar pagos para el formulario (convertir fechas a dayjs)
  const formPayments = useMemo(() => {
    return payments.map(payment => ({
      ...payment,
      fecha_pago: payment.fecha_pago ? dayjs(payment.fecha_pago) : undefined
    }));
  }, [payments]);

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
              };

              return (
                <>
                  {fields.map(({ key, name, ...restField }, idx) => (
                    <Card
                      key={`payment-${key}-${idx}`}
                      type="inner"
                      title={
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span>Pago #{idx + 1}</span>
                          {payments[idx]?.saved && (
                            <span style={{ color: '#52c41a', fontSize: '12px' }}>
                              ✓ Guardado
                            </span>
                          )}
                        </div>
                      }
                      style={{ 
                        marginBottom: 32, // Más separación entre pagos
                        borderColor: payments[idx]?.saved ? '#52c41a' : undefined,
                        padding: '24px 16px' // Padding profesional
                      }}
                      extra={
                        <Space>
                          {!disabled && (
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
                            rules={[{ required: true, message: "Seleccione el método de pago" }]}
                            style={{ marginBottom: 24 }}
                          >
                            <Select
                              placeholder="Seleccione método de pago"
                              loading={paymentMethodsLoading}
                              disabled={disabled}
                              size="large"
                            >
                              {paymentMethods.map((method: any) => (
                                <Select.Option key={method.id_metodo_pago} value={method.id_metodo_pago}>
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
                            rules={[{ required: true, message: "Seleccione el tipo de pago" }]}
                            style={{ marginBottom: 24 }}
                          >
                            <Select
                              placeholder="Seleccione tipo de pago"
                              loading={paymentTypesLoading}
                              disabled={disabled}
                              size="large"
                            >
                              {paymentTypes.map((type: any) => (
                                <Select.Option key={type.id_tipo_pago} value={type.id_tipo_pago}>
                                  {type.nombre}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            {...restField}
                            name={[name, "fecha_pago"]}
                            label="Fecha de Pago"
                            rules={[{ required: true, message: "Seleccione la fecha de pago" }]}
                            style={{ marginBottom: 24 }}
                          >
                            <DatePicker
                              style={{ width: "100%" }}
                              format="YYYY-MM-DD"
                              disabled={disabled}
                              size="large"
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            {...restField}
                            name={[name, "valor"]}
                            label="Valor"
                            rules={[
                              { required: true, message: "Ingrese el valor del pago" },
                              { type: "number", min: 0.01, message: "El valor debe ser mayor a 0" }
                            ]}
                            style={{ marginBottom: 24 }}
                          >
                            <InputNumber
                              style={{ width: "100%" }}
                              min={0}
                              step={0.01}
                              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              disabled={disabled}
                              placeholder="0.00"
                              size="large"
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                  
                  {!disabled && (
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={handleAddPayment}
                        block
                        icon={<PlusOutlined />}
                      >
                        Agregar Pago
                      </Button>
                    </Form.Item>
                  )}
                </>
              );
            }}
          </Form.List>
          
          {/* Botón para guardar pagos */}
          {!disabled && (
            <Form.Item style={{ textAlign: "right", marginTop: 24 }}>
              <Button
                type="primary"
                size="large"
                onClick={handleSavePayments}
                disabled={!hasValidPayments || hasSavedPayments()}
                loading={false}
              >
                {hasSavedPayments() ? "Pagos Guardados ✓" : "Guardar Pagos"}
              </Button>
            </Form.Item>
          )}
        </Form>
      </Card>
    </div>
  );
};