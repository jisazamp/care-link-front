import React, { useCallback, useMemo } from "react";
import { Form, InputNumber, DatePicker, Button, Select, Card, Row, Col, Space, Modal, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useGetPaymentMethods } from "../../../../hooks/useGetPaymentMethods";
import { useGetPaymentTypes } from "../../../../hooks/useGetPaymentTypes";
import { PaymentFormData } from "../../../../utils/paymentUtils";
import { PaymentSummary } from "../PaymentSummary/PaymentSummary";
import { useCreatePayment } from "../../../../hooks/useCreatePayment/useCreatePayment";
import { useDeletePayment } from "../../../../hooks/useDeletePayment";

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
  
  // Hooks centralizados
  const { data: paymentMethodsData, isLoading: paymentMethodsLoading } = useGetPaymentMethods();
  const { data: paymentTypesData, isLoading: paymentTypesLoading } = useGetPaymentTypes();
  const { registerIndividualPaymentFnAsync, registerIndividualPaymentPending } = useCreatePayment();
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
    return payments.some(payment => payment.saved === true);
  }, [payments]);



  // Manejar cambios en el formulario para sincronizar con el estado centralizado
  const handleFormChange = useCallback((_changedFields: any, allFields: any) => {
    const formPayments = (allFields.pagos || [])
      .filter((pago: any): pago is any => pago !== undefined && pago !== null);
    
    // Actualizar cada pago en el estado centralizado SIN registrar automáticamente
    const updatedPayments = formPayments.map((pago: any, index: number) => {
      const existingPayment = payments[index];
      const updatedPayment = {
        id_metodo_pago: pago.id_metodo_pago || undefined,
        id_tipo_pago: pago.id_tipo_pago || undefined,
        fecha_pago: pago.fecha_pago ? (typeof pago.fecha_pago === 'string' ? pago.fecha_pago : pago.fecha_pago.format('YYYY-MM-DD')) : "",
        valor: pago.valor || 0,
        saved: existingPayment?.saved || false,
        id_pago: existingPayment?.id_pago,
        id_factura: existingPayment?.id_factura
      };
      
      // NO registrar automáticamente - solo sincronizar estado
      return updatedPayment;
    });
    
    setPayments(updatedPayments);
    onChange?.(updatedPayments);
  }, [payments, setPayments, onChange]);

  // Manejar guardar pagos - AHORA registra los pagos individualmente
  const handleSavePayments = useCallback(async () => {
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

      if (validPayments.length === 0) {
        console.log("ℹ️ No hay pagos nuevos válidos para guardar");
        return false;
      }

      console.log("💳 Registrando pagos individuales:", validPayments);

      // Registrar cada pago individualmente
      const updatedPayments = [...payments];
      
      for (let i = 0; i < validPayments.length; i++) {
        const payment = validPayments[i];
        const paymentIndex = payments.findIndex(p => 
          p.id_metodo_pago === payment.id_metodo_pago &&
          p.id_tipo_pago === payment.id_tipo_pago &&
          p.fecha_pago === payment.fecha_pago &&
          p.valor === payment.valor &&
          !p.saved &&
          !p.id_pago
        );

        if (paymentIndex !== -1 && facturaId) {
          try {
            console.log(`💳 Registrando pago ${i + 1}/${validPayments.length}:`, payment);
            
            const response = await registerIndividualPaymentFnAsync({
              id_factura: facturaId,
              id_metodo_pago: payment.id_metodo_pago!,
              id_tipo_pago: payment.id_tipo_pago!,
              fecha_pago: payment.fecha_pago,
              valor: payment.valor
            });

            console.log("✅ Pago individual registrado:", response);
            
            // Actualizar el estado local marcando el pago como registrado
            updatedPayments[paymentIndex] = {
              ...payment,
              id_pago: response.data?.data?.id_pago,
              id_factura: facturaId,
              saved: true
            };
            
          } catch (error) {
            console.error(`❌ Error al registrar pago ${i + 1}:`, error);
            // Continuar con el siguiente pago aunque falle uno
          }
        }
      }
      
      setPayments(updatedPayments);
      onChange?.(updatedPayments);

      console.log("✅ Proceso de registro de pagos completado");
      return true;
      
    } catch (error) {
      console.error("❌ Error al guardar pagos:", error);
      return false;
    }
  }, [payments, setPayments, onChange, facturaId, registerIndividualPaymentFnAsync]);

  // Preparar pagos para el formulario (convertir fechas a dayjs)
  const formPayments = useMemo(() => {
    return payments.map(payment => ({
      ...payment,
      fecha_pago: payment.fecha_pago ? dayjs(payment.fecha_pago) : undefined
    }));
  }, [payments]);

  // Función para eliminar pago consolidado
  const handleDeleteConsolidatedPayment = (pago: PaymentFormData, idx: number) => {
    Modal.confirm({
      title: "¿Eliminar pago?",
      content: "Esta acción eliminará el pago de la base de datos y no se podrá recuperar. ¿Desea continuar?",
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
              form.setFieldsValue({ pagos: updatedPayments.map(p => ({
                ...p,
                fecha_pago: p.fecha_pago ? dayjs(p.fecha_pago) : undefined
              })) });
              onChange?.(updatedPayments);
              message.success("Pago eliminado correctamente");
            },
            onError: () => {
              message.error("Error al eliminar el pago");
            }
          });
        } catch (error) {
          message.error("Error inesperado al eliminar el pago");
        }
      }
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
                  {fields.map(({ key, name, ...restField }, idx) => {
                    const pago = payments[idx];
                    const isConsolidated = pago?.id_pago || pago?.saved === true;
                    if (isConsolidated) {
                      // Renderizar solo lectura
                      return (
                        <Card
                          key={`payment-${key}-${idx}`}
                          type="inner"
                          title={
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span>Pago #{idx + 1}</span>
                              <span style={{ color: '#52c41a', fontSize: '12px' }}>
                                ✓ Consolidado
                              </span>
                              <Button
                                icon={<DeleteOutlined />}
                                danger
                                size="small"
                                loading={deletePaymentPending}
                                onClick={() => handleDeleteConsolidatedPayment(pago, idx)}
                                style={{ marginLeft: 8 }}
                              />
                            </div>
                          }
                          style={{ 
                            marginBottom: 32,
                            borderColor: '#52c41a',
                            padding: '24px 16px',
                            background: '#fafafa'
                          }}
                        >
                          <Row gutter={[24, 24]}>
                            <Col xs={24} md={12}>
                              <div style={{ marginBottom: 24 }}>
                                <b>Método de Pago:</b> {paymentMethods.find((m: any) => m.id_metodo_pago === pago.id_metodo_pago)?.nombre || pago.id_metodo_pago}
                              </div>
                            </Col>
                            <Col xs={24} md={12}>
                              <div style={{ marginBottom: 24 }}>
                                <b>Tipo de Pago:</b> {paymentTypes.find((t: any) => t.id_tipo_pago === pago.id_tipo_pago)?.nombre || pago.id_tipo_pago}
                              </div>
                            </Col>
                            <Col xs={24} md={12}>
                              <div style={{ marginBottom: 24 }}>
                                <b>Fecha de Pago:</b> {pago.fecha_pago}
                              </div>
                            </Col>
                            <Col xs={24} md={12}>
                              <div style={{ marginBottom: 24 }}>
                                <b>Valor:</b> $ {Number(pago.valor).toLocaleString()}
                              </div>
                            </Col>
                          </Row>
                        </Card>
                      );
                    }
                    // Si no es consolidado, render editable
                    return (
                      <Card
                        key={`payment-${key}-${idx}`}
                        type="inner"
                        title={
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span>Pago #{idx + 1}</span>
                          </div>
                        }
                        style={{ 
                          marginBottom: 32,
                          padding: '24px 16px'
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
                    );
                  })}
                  
                  {!disabled && (
                    <Row gutter={16} style={{ marginTop: 8 }}>
                      <Col xs={24} md={16}>
                        <Button
                          type="dashed"
                          onClick={handleAddPayment}
                          block
                          icon={<PlusOutlined />}
                          size="large"
                        >
                          Agregar Pago
                        </Button>
                      </Col>
                      <Col xs={24} md={8} style={{ textAlign: 'right', marginTop: 0 }}>
                        <Button
                          type="primary"
                          size="large"
                          onClick={handleSavePayments}
                          disabled={!hasValidNewPayments || hasSavedPayments()}
                          loading={registerIndividualPaymentPending}
                        >
                          {hasSavedPayments() ? "Pagos Guardados ✓" : "Guardar Pagos"}
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