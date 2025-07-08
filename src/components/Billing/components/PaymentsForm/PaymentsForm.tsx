import React, { useEffect, useMemo, useCallback, useState } from "react";
import { Form, InputNumber, DatePicker, Button, Select, Card, Row, Col, Typography, Space, Divider, message, Alert, Badge } from "antd";
import { PlusOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useGetPaymentMethods } from "../../../../hooks/useGetPaymentMethods";
import { useGetPaymentTypes } from "../../../../hooks/useGetPaymentTypes";
import dayjs from "dayjs";

const { Text, Title } = Typography;

interface PaymentFormData {
  id_metodo_pago: number;
  id_tipo_pago: number;
  fecha_pago: string;
  valor: number;
}

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
  const { paymentMethodsData, paymentMethodsLoading: loadingMethods } = useGetPaymentMethods();
  const { data: paymentTypesData, isLoading: loadingTypes } = useGetPaymentTypes();

  // Estado local para pagos registrados
  const [registeredPayments, setRegisteredPayments] = useState<PaymentFormData[]>(initialPayments);

  // Siempre inicializa como array vacío y filtra valores nulos
  const pagos = useMemo(() => (registeredPayments || []).filter(Boolean), [registeredPayments]);

  // Inicializar pagos si vienen del backend
  useEffect(() => {
    if (initialPayments.length > 0) {
      setRegisteredPayments(initialPayments);
      const formattedPayments = initialPayments.map(p => ({
        ...p,
        fecha_pago: dayjs(p.fecha_pago)
      }));
      form.setFieldsValue({ pagos: formattedPayments });
    }
  }, [initialPayments, form]);

  // Calcular total pagado y saldo pendiente
  const pagosValidos = useMemo(() =>
    Array.isArray(pagos) ? pagos.filter(p => p && typeof p.valor === 'number') : [],
    [pagos]
  );
  const totalPagado = useMemo(
    () => pagosValidos.reduce((acc, p) => acc + (p.valor || 0), 0),
    [pagosValidos]
  );
  const saldoPendiente = (Number(totalFactura) || 0) - totalPagado;
  const isOverpaid = totalPagado > totalFactura;
  const isFullyPaid = saldoPendiente <= 0;

  // Sincroniza pagos con el padre solo si cambia realmente
  useEffect(() => {
    if (onChange) {
      onChange(pagos);
    }
  }, [pagos, onChange]);

  const getEstadoFactura = useCallback(() => {
    if (isOverpaid) return { text: "SOBREPAGADA", color: "error", badge: "error" };
    if (isFullyPaid) return { text: "PAGADA", color: "success", badge: "success" };
    if (saldoPendiente > 0) return { text: "PENDIENTE", color: "warning", badge: "processing" };
    return { text: "PENDIENTE", color: "default", badge: "default" };
  }, [isOverpaid, isFullyPaid, saldoPendiente]);

  const estadoFactura = getEstadoFactura();

  // Validar tipo de pago total
  const validatePaymentType = useCallback((tipoPago: number, valor: number, existingPayments: any[]) => {
    if (tipoPago === 1) { // Pago Total
      if (existingPayments.length > 0) {
        message.error("Solo se permite un pago total por factura");
        return false;
      }
      if (Math.abs(valor - totalFactura) > 0.01) {
        message.error("El valor del pago total debe ser igual al total de la factura");
        return false;
      }
    }
    return true;
  }, [totalFactura]);

  // Manejar cambios en el formulario
  const handleFormChange = useCallback((changedFields: any, allFields: any) => {
    const currentPayments = allFields.pagos || [];
    
    // Validar cada pago
    currentPayments.forEach((pago: any, index: number) => {
      if (pago.id_tipo_pago && pago.valor) {
        const otherPayments = currentPayments.filter((_: any, i: number) => i !== index);
        validatePaymentType(pago.id_tipo_pago, pago.valor, otherPayments);
      }
    });
  }, [validatePaymentType]);

  return (
    <div>
      <Title level={4}>
        Pagos de la Factura
        <Badge 
          status={estadoFactura.badge as any} 
          text={estadoFactura.text} 
          style={{ marginLeft: 12 }}
        />
      </Title>
      
      <Form 
        form={form} 
        layout="vertical" 
        initialValues={{ pagos: initialPayments }}
        onValuesChange={handleFormChange}
      >
        <Form.List name="pagos">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, idx) => (
                <Card
                  key={key}
                  type="inner"
                  title={`Pago #${idx + 1}`}
                  style={{ marginBottom: 16 }}
                  extra={
                    <Space>
                      {!disabled && (
                        <Button
                          icon={<DeleteOutlined />}
                          danger
                          size="small"
                          onClick={() => remove(name)}
                        />
                      )}
                      {!disabled && (
                        <Button
                          type="primary"
                          size="small"
                          onClick={async () => {
                            try {
                              const values = await form.validateFields();
                              const pago = values.pagos[idx];
                              // Validar que no esté ya registrado
                              if (registeredPayments.some(p =>
                                p.id_metodo_pago === pago.id_metodo_pago &&
                                p.id_tipo_pago === pago.id_tipo_pago &&
                                p.fecha_pago === pago.fecha_pago &&
                                p.valor === pago.valor
                              )) {
                                message.info("Este pago ya fue registrado.");
                                return;
                              }
                              setRegisteredPayments(prev => [...prev, pago]);
                              message.success("Pago registrado correctamente");
                            } catch (err) {
                              message.error("Complete todos los campos del pago antes de registrar.");
                            }
                          }}
                        >
                          Registrar pago
                        </Button>
                      )}
                    </Space>
                  }
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        label="Método de pago"
                        name={[name, "id_metodo_pago"]}
                        rules={[{ required: true, message: "Seleccione un método" }]}
                      >
                        <Select
                          loading={loadingMethods}
                          disabled={disabled}
                          options={paymentMethodsData?.data?.data?.map((m: any) => ({
                            value: m.id_metodo_pago,
                            label: m.nombre,
                          })) || []}
                          placeholder="Seleccione método de pago"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        label="Tipo de pago"
                        name={[name, "id_tipo_pago"]}
                        rules={[{ required: true, message: "Seleccione un tipo" }]}
                      >
                        <Select
                          loading={loadingTypes}
                          disabled={disabled}
                          options={paymentTypesData?.data?.data?.map((t: any) => ({
                            value: t.id_tipo_pago,
                            label: t.nombre,
                          })) || []}
                          placeholder="Seleccione tipo de pago"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        {...restField}
                        label="Fecha de pago"
                        name={[name, "fecha_pago"]}
                        rules={[{ required: true, message: "Seleccione la fecha" }]}
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
                        label="Valor"
                        name={[name, "valor"]}
                        rules={[
                          { required: true, message: "Ingrese el valor" },
                          { type: 'number', min: 0, message: "El valor debe ser mayor a 0" }
                        ]}
                      >
                        <InputNumber
                          min={0}
                          max={totalFactura + totalPagado}
                          style={{ width: "100%" }}
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
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Agregar pago
                  </Button>
                </Form.Item>
              )}
            </>
          )}
        </Form.List>
      </Form>

      <Divider />

      {/* Resumen de pagos */}
      <Card size="small" title="Resumen de Pagos">
        <Space direction="vertical" style={{ width: "100%" }}>
          <Row justify="space-between">
            <Col>
              <Text strong>Total de la factura:</Text>
            </Col>
            <Col>
              <Text strong style={{ fontSize: 16 }}>
                $ {Number(totalFactura).toLocaleString()}
              </Text>
            </Col>
          </Row>
          <Row justify="space-between">
            <Col>
              <Text>Total pagado:</Text>
            </Col>
            <Col>
              <Text style={{ fontSize: 14 }}>
                $ {totalPagado.toLocaleString()}
              </Text>
            </Col>
          </Row>
          <Row justify="space-between">
            <Col>
              <Text strong>Saldo pendiente:</Text>
            </Col>
            <Col>
              <Text strong type={saldoPendiente > 0 ? "danger" : "success"} style={{ fontSize: 16 }}>
                $ {saldoPendiente.toLocaleString()}
              </Text>
            </Col>
          </Row>
          <Row justify="space-between">
            <Col>
              <Text strong>Total menos pagos registrados:</Text>
            </Col>
            <Col>
              <Text strong style={{ color: '#722ed1', fontSize: 16 }}>
                $ {(Number(totalFactura) - totalPagado).toLocaleString()}
              </Text>
            </Col>
          </Row>
          <Divider style={{ margin: "8px 0" }} />
          <Row justify="space-between">
            <Col>
              <Text strong>Estado de la factura:</Text>
            </Col>
            <Col>
              <Badge 
                status={estadoFactura.badge as any} 
                text={
                  <Text strong type={estadoFactura.color as any}>
                    {estadoFactura.text}
                  </Text>
                }
              />
            </Col>
          </Row>
        </Space>
      </Card>

      {/* Alertas informativas */}
      {isOverpaid && (
        <Alert
          message="Advertencia"
          description="El total de los pagos excede el total de la factura. Revise los valores ingresados."
          type="warning"
          showIcon
          icon={<ExclamationCircleOutlined />}
          style={{ marginTop: 16 }}
        />
      )}

      {isFullyPaid && !isOverpaid && (
        <Alert
          message="Factura Pagada"
          description="La factura ha sido pagada completamente."
          type="success"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}

      {saldoPendiente > 0 && !isOverpaid && (
        <Alert
          message="Pago Pendiente"
          description={`Falta por pagar $${saldoPendiente.toLocaleString()}. Puede realizar pagos parciales.`}
          type="info"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}
    </div>
  );
};