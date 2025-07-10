import React, { useCallback, useMemo } from "react";
import { Form, InputNumber, DatePicker, Button, Select, Card, Row, Col, Space } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useGetPaymentMethods } from "../../../../hooks/useGetPaymentMethods";
import { useGetPaymentTypes } from "../../../../hooks/useGetPaymentTypes";
import { usePayments } from "../../../../hooks/usePayments";
import { PaymentFormData } from "../../../../utils/paymentUtils";
import { PaymentSummary } from "../PaymentSummary/PaymentSummary";

interface PaymentsFormProps {
  totalFactura: number;
  initialPayments?: PaymentFormData[];
  onChange?: (payments: PaymentFormData[]) => void;
  disabled?: boolean;
}

export const PaymentsForm: React.FC<PaymentsFormProps> = ({
  totalFactura,
  initialPayments = [],
  onChange,
  disabled,
}) => {
  const [form] = Form.useForm();
  
  // Hooks centralizados
  const { paymentMethodsData, paymentMethodsLoading } = useGetPaymentMethods();
  const { data: paymentTypesData, isLoading: paymentTypesLoading } = useGetPaymentTypes();
  
  // Procesar pagos iniciales para convertir fechas a objetos dayjs
  const processedInitialPayments = useMemo(() => {
    return initialPayments.map(payment => ({
      ...payment,
      fecha_pago: payment.fecha_pago || ""
    }));
  }, [initialPayments]);
  
  // Usar los pagos directamente desde props
  const payments = processedInitialPayments;
  const totalPayments = payments.reduce((acc, p) => acc + (p.valor || 0), 0);
  const pendingBalance = Math.max(0, totalFactura - totalPayments);
  const hasValidPayments = payments.length > 0 && payments.every(p => p.valor > 0);
  // Las funciones addPayment, removePayment, savePayments, updatePayment deben ser reemplazadas por versiones que usen onChange

  // Cargar datos de métodos y tipos de pago
  const paymentMethods = paymentMethodsData?.data?.data || [];
  const paymentTypes = paymentTypesData?.data?.data || [];

  // Función para verificar si hay pagos guardados
  const hasSavedPayments = useCallback(() => {
    return payments.some(payment => payment.saved === true);
  }, [payments]);

  // Manejar cambios en el formulario para sincronizar con el padre
  const handleFormChange = useCallback((_changedFields: any, allFields: any) => {
    const formPayments = (allFields.pagos || [])
      .filter((pago: any): pago is any => pago !== undefined && pago !== null)
      .map((pago: any) => ({
        ...pago,
        fecha_pago: pago.fecha_pago ? (typeof pago.fecha_pago === 'string' ? pago.fecha_pago : pago.fecha_pago.format('YYYY-MM-DD')) : "",
        valor: pago.valor || 0,
      }));
    onChange?.(formPayments);
  }, [onChange]);

  // Manejar guardar pagos (simulado)
  const handleSavePayments = useCallback(async () => {
    // Aquí podrías implementar lógica de guardado si es necesario
    console.log("Pagos guardados exitosamente");
  }, []);

  // Preparar pagos para el formulario (convertir fechas a dayjs)
  const formPayments = useMemo(() => {
    return payments.map(payment => ({
      ...payment,
      fecha_pago: payment.fecha_pago ? dayjs(payment.fecha_pago) : undefined
    }));
  }, [payments]);

  return (
    <div>
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
                const newPayments = [
                  ...payments,
                  { id_metodo_pago: undefined, id_tipo_pago: undefined, fecha_pago: '', valor: 0 }
                ];
                onChange?.(newPayments);
              };

              // Función para eliminar pago
              const handleRemovePayment = (name: number, idx: number) => {
                remove(name);
                const newPayments = payments.filter((_, i) => i !== idx);
                onChange?.(newPayments);
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
                        marginBottom: 16,
                        borderColor: payments[idx]?.saved ? '#52c41a' : undefined
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
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, "id_metodo_pago"]}
                            label="Método de Pago"
                            rules={[{ required: true, message: "Seleccione el método de pago" }]}
                          >
                            <Select
                              placeholder="Seleccione método de pago"
                              loading={paymentMethodsLoading}
                              disabled={disabled}
                            >
                              {paymentMethods.map((method: any) => (
                                <Select.Option key={method.id_metodo_pago} value={method.id_metodo_pago}>
                                  {method.nombre}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, "id_tipo_pago"]}
                            label="Tipo de Pago"
                            rules={[{ required: true, message: "Seleccione el tipo de pago" }]}
                          >
                            <Select
                              placeholder="Seleccione tipo de pago"
                              loading={paymentTypesLoading}
                              disabled={disabled}
                            >
                              {paymentTypes.map((type: any) => (
                                <Select.Option key={type.id_tipo_pago} value={type.id_tipo_pago}>
                                  {type.nombre}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, "fecha_pago"]}
                            label="Fecha de Pago"
                            rules={[{ required: true, message: "Seleccione la fecha de pago" }]}
                          >
                            <DatePicker
                              style={{ width: "100%" }}
                              format="YYYY-MM-DD"
                              disabled={disabled}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            name={[name, "valor"]}
                            label="Valor"
                            rules={[
                              { required: true, message: "Ingrese el valor del pago" },
                              { type: "number", min: 0.01, message: "El valor debe ser mayor a 0" }
                            ]}
                          >
                            <InputNumber
                              style={{ width: "100%" }}
                              min={0}
                              step={0.01}
                              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              disabled={disabled}
                              placeholder="0.00"
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