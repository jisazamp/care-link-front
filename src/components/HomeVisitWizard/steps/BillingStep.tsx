import React, { useEffect } from 'react';
import { Card, Row, Col, Form, InputNumber, DatePicker, Input, Typography, Alert, Divider } from 'antd';
import { useFormContext } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import { BillingStepProps } from '../types';

const { TextArea } = Input;
const { Title, Text } = Typography;

export const BillingStep: React.FC<BillingStepProps> = ({ isEditing, onValidChange }) => {
  const { watch, formState: { errors } } = useFormContext();

  // Observar cambios en los campos
  const impuestos = watch('impuestos');
  const descuentos = watch('descuentos');
  const fecha_vencimiento = watch('fecha_vencimiento');

  // Verificar si el paso es válido
  useEffect(() => {
    // Para edición, el paso siempre es válido ya que no se crea factura
    if (isEditing) {
      onValidChange(true);
      return;
    }

    // Para creación, validar campos básicos
    const isImpuestosValid = typeof impuestos === 'number' && impuestos >= 0;
    const isDescuentosValid = typeof descuentos === 'number' && descuentos >= 0;
    const isFechaVencimientoValid = !fecha_vencimiento || fecha_vencimiento.isValid();
    
    const isStepValid = isImpuestosValid && isDescuentosValid && isFechaVencimientoValid;
    onValidChange(!!isStepValid);
  }, [impuestos, descuentos, fecha_vencimiento, isEditing, onValidChange]);

  // Calcular total
  const calcularTotal = () => {
    const subtotal = 25000; // Valor por día
    const impuestosValue = impuestos || 0;
    const descuentosValue = descuentos || 0;
    return subtotal + impuestosValue - descuentosValue;
  };

  return (
    <div>
      <Title level={4} style={{ marginBottom: '24px' }}>
        Configuración de Facturación
      </Title>

      {/* Alerta informativa para edición */}
      {isEditing && (
        <Alert
          message="Modo de Edición"
          description="En modo de edición, la facturación se maneja por separado. Los cambios en la visita no afectan la factura existente."
          type="info"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      )}

      {/* Información de facturación existente para edición */}
      {isEditing && (
        <Card title="Información de Facturación Existente" style={{ marginBottom: '24px' }}>
          <Text type="secondary">
            Esta visita ya tiene una factura asociada. Para modificar la factura, 
            diríjase al módulo de facturación.
          </Text>
        </Card>
      )}

      {/* Formulario de facturación solo para creación */}
      {!isEditing && (
        <Card title="Datos de Facturación">
          <Row gutter={16}>
            <Col span={8}>
              <Controller
                name="impuestos"
                render={({ field }) => (
                  <Form.Item
                    label="Impuestos"
                    validateStatus={errors.impuestos ? "error" : ""}
                    help={errors.impuestos?.message?.toString()}
                  >
                    <InputNumber
                      {...field}
                      style={{ width: "100%" }}
                      prefix="$"
                      placeholder="0"
                      min={0}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                )}
              />
            </Col>
            
            <Col span={8}>
              <Controller
                name="descuentos"
                render={({ field }) => (
                  <Form.Item
                    label="Descuentos"
                    validateStatus={errors.descuentos ? "error" : ""}
                    help={errors.descuentos?.message?.toString()}
                  >
                    <InputNumber
                      {...field}
                      style={{ width: "100%" }}
                      prefix="$"
                      placeholder="0"
                      min={0}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                )}
              />
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
                      placeholder="Seleccione la fecha"
                      disabledDate={(current) => {
                        return current && current < dayjs().startOf('day');
                      }}
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
                    label="Observaciones de Factura"
                    validateStatus={errors.observaciones_factura ? "error" : ""}
                    help={errors.observaciones_factura?.message?.toString()}
                  >
                    <TextArea
                      {...field}
                      rows={3}
                      placeholder="Ingrese observaciones adicionales sobre la factura"
                    />
                  </Form.Item>
                )}
              />
            </Col>
          </Row>

          {/* Resumen de facturación */}
          <Divider orientation="left">Resumen de Facturación</Divider>
          <Row gutter={16}>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <Text strong>Subtotal</Text>
                <br />
                <Text style={{ fontSize: '18px', color: '#1890ff' }}>
                  $25.000
                </Text>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <Text strong>Impuestos</Text>
                <br />
                <Text style={{ fontSize: '18px', color: '#52c41a' }}>
                  ${(impuestos || 0).toLocaleString()}
                </Text>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <Text strong>Descuentos</Text>
                <br />
                <Text style={{ fontSize: '18px', color: '#faad14' }}>
                  ${(descuentos || 0).toLocaleString()}
                </Text>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <Text strong>Total</Text>
                <br />
                <Text style={{ fontSize: '20px', color: '#1890ff', fontWeight: 'bold' }}>
                  ${calcularTotal().toLocaleString()}
                </Text>
              </div>
            </Col>
          </Row>
        </Card>
      )}

      {/* Información adicional para edición */}
      {isEditing && (
        <Card title="Información Adicional" size="small">
          <Text type="secondary">
            <ul>
              <li>Los cambios en la visita se aplicarán inmediatamente</li>
              <li>Si cambia la fecha o hora, el estado se actualizará a "REPROGRAMADA"</li>
              <li>La facturación se maneja por separado en el módulo correspondiente</li>
              <li>Los pagos asociados no se verán afectados por estos cambios</li>
            </ul>
          </Text>
        </Card>
      )}
    </div>
  );
};