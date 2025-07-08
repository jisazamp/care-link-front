import React from "react";
import { Card, Descriptions, Tag, Typography, Row, Col, Divider, Badge, Space } from "antd";
import { FileTextOutlined, CalendarOutlined, DollarOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import type { Bill } from "../../types";
import dayjs from "dayjs";

const { Title, Text } = Typography;

interface BillingDetailsProps {
  bill: Bill;
}

export const BillingDetails: React.FC<BillingDetailsProps> = ({ bill }) => {
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'PAGADA':
        return { color: 'success', icon: <CheckCircleOutlined /> };
      case 'VENCIDA':
        return { color: 'error', icon: <ExclamationCircleOutlined /> };
      case 'PENDIENTE':
        return { color: 'warning', icon: <ClockCircleOutlined /> };
      default:
        return { color: 'default', icon: <ClockCircleOutlined /> };
    }
  };

  const estadoInfo = getEstadoColor(bill.estado_factura || 'PENDIENTE');
  
  // Calcular totales
  const subtotal = Number(bill.subtotal) || 0;
  const impuestos = Number(bill.impuestos) || 0;
  const descuentos = Number(bill.descuentos) || 0;
  const totalFactura = Number(bill.total_factura) || 0;
  
  // Calcular total pagado
  const totalPagado = bill.pagos?.reduce((acc, pago) => acc + (Number(pago.valor) || 0), 0) || 0;
  const saldoPendiente = totalFactura - totalPagado;

  return (
    <div style={{ padding: "16px" }}>
      <Card>
        {/* Encabezado de la factura */}
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={3} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileTextOutlined style={{ color: '#1890ff' }} />
              Factura #{bill.numero_factura || 'N/A'}
            </Title>
          </Col>
          <Col>
            <Badge 
              status={estadoInfo.color as any} 
              text={
                <Tag color={estadoInfo.color} icon={estadoInfo.icon}>
                  {bill.estado_factura || 'PENDIENTE'}
                </Tag>
              }
            />
          </Col>
        </Row>

        {/* Información principal */}
        <Descriptions bordered column={2} style={{ marginBottom: 24 }}>
          <Descriptions.Item label="Número de Factura" span={1}>
            <Text strong style={{ color: '#1890ff' }}>
              {bill.numero_factura || 'N/A'}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="ID de Factura" span={1}>
            <Text code>{bill.id_factura}</Text>
          </Descriptions.Item>
          
          <Descriptions.Item label="Fecha de Emisión" span={1}>
            <Space>
              <CalendarOutlined />
              <Text>
                {bill.fecha_emision 
                  ? dayjs(bill.fecha_emision).format('DD/MM/YYYY')
                  : 'N/A'
                }
              </Text>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Fecha de Vencimiento" span={1}>
            <Space>
              <CalendarOutlined />
              <Text>
                {bill.fecha_vencimiento 
                  ? dayjs(bill.fecha_vencimiento).format('DD/MM/YYYY')
                  : 'N/A'
                }
              </Text>
            </Space>
          </Descriptions.Item>
          
          <Descriptions.Item label="ID de Contrato" span={1}>
            <Text code>{bill.id_contrato}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Observaciones" span={1}>
            <Text type="secondary">
              {bill.observaciones || 'Sin observaciones'}
            </Text>
          </Descriptions.Item>
        </Descriptions>

        {/* Valores de la factura */}
        <Card title="Valores de la Factura" size="small" style={{ marginBottom: 24 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Card size="small">
                <Text type="secondary">Subtotal</Text>
                <br />
                <Text strong style={{ fontSize: 16 }}>
                  $ {subtotal.toLocaleString()}
                </Text>
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small">
                <Text type="secondary">Impuestos</Text>
                <br />
                <Text strong style={{ fontSize: 16, color: '#52c41a' }}>
                  + $ {impuestos.toLocaleString()}
                </Text>
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small">
                <Text type="secondary">Descuentos</Text>
                <br />
                <Text strong style={{ fontSize: 16, color: '#ff4d4f' }}>
                  - $ {descuentos.toLocaleString()}
                </Text>
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small" style={{ backgroundColor: '#f0f8ff' }}>
                <Text type="secondary">Total</Text>
                <br />
                <Text strong style={{ fontSize: 18, color: '#1890ff' }}>
                  $ {totalFactura.toLocaleString()}
                </Text>
              </Card>
            </Col>
          </Row>
        </Card>

        {/* Estado de pagos */}
        <Card title="Estado de Pagos" size="small" style={{ marginBottom: 24 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Card size="small">
                <Text type="secondary">Total Factura</Text>
                <br />
                <Text strong style={{ fontSize: 16 }}>
                  $ {totalFactura.toLocaleString()}
                </Text>
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small">
                <Text type="secondary">Total Pagado</Text>
                <br />
                <Text strong style={{ fontSize: 16, color: '#52c41a' }}>
                  $ {totalPagado.toLocaleString()}
                </Text>
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small">
                <Text type="secondary">Saldo Pendiente</Text>
                <br />
                <Text strong style={{ fontSize: 16, color: saldoPendiente > 0 ? '#ff4d4f' : '#52c41a' }}>
                  $ {saldoPendiente.toLocaleString()}
                </Text>
              </Card>
            </Col>
          </Row>
        </Card>

        {/* Lista de pagos */}
        {bill.pagos && bill.pagos.length > 0 && (
          <Card title="Pagos Realizados" size="small">
            {bill.pagos.map((pago, index) => (
              <Card 
                key={index} 
                size="small" 
                style={{ marginBottom: 8 }}
                title={`Pago #${index + 1}`}
              >
                <Row gutter={16}>
                  <Col span={6}>
                    <Text type="secondary">Método:</Text>
                    <br />
                    <Text strong>{pago.metodo_pago?.nombre || `ID: ${pago.id_metodo_pago}`}</Text>
                  </Col>
                  <Col span={6}>
                    <Text type="secondary">Tipo:</Text>
                    <br />
                    <Text strong>{pago.tipo_pago?.nombre || `ID: ${pago.id_tipo_pago}`}</Text>
                  </Col>
                  <Col span={6}>
                    <Text type="secondary">Fecha:</Text>
                    <br />
                    <Text>
                      {pago.fecha_pago 
                        ? dayjs(pago.fecha_pago).format('DD/MM/YYYY')
                        : 'N/A'
                      }
                    </Text>
                  </Col>
                  <Col span={6}>
                    <Text type="secondary">Valor:</Text>
                    <br />
                    <Text strong style={{ color: '#52c41a' }}>
                      $ {Number(pago.valor).toLocaleString()}
                    </Text>
                  </Col>
                </Row>
              </Card>
            ))}
          </Card>
        )}

        {/* Alertas de estado */}
        {saldoPendiente > 0 && (
          <Card size="small" style={{ marginTop: 16, backgroundColor: '#fff7e6' }}>
            <Space>
              <ClockCircleOutlined style={{ color: '#faad14' }} />
              <Text type="warning">
                La factura tiene un saldo pendiente de ${saldoPendiente.toLocaleString()}
              </Text>
            </Space>
          </Card>
        )}

        {saldoPendiente <= 0 && totalPagado > 0 && (
          <Card size="small" style={{ marginTop: 16, backgroundColor: '#f6ffed' }}>
            <Space>
              <CheckCircleOutlined style={{ color: '#52c41a' }} />
              <Text type="success">
                La factura ha sido pagada completamente
              </Text>
            </Space>
          </Card>
        )}
      </Card>
    </div>
  );
}; 