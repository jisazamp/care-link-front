import React from 'react';
import { Card, Row, Col, Typography, Divider, Badge } from 'antd';
import { formatCurrency } from '../../../../utils/paymentUtils';

const { Text, Title } = Typography;

interface PaymentSummaryProps {
  subtotal: number; // Nuevo prop para el subtotal
  totalFactura: number;
  totalPayments: number;
  pendingBalance: number;
  showStatus?: boolean;
  title?: string;
}

// Exportar función para obtener el estado visual de la factura de forma centralizada
export const getEstadoFactura = (pendingBalance: number) => {
  return pendingBalance === 0 ? "PAGADA" : "PENDIENTE";
};

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  subtotal,
  totalFactura,
  totalPayments,
  pendingBalance,
  showStatus = true,
  title = "Resumen de Pagos"
}) => {
  const getStatusInfo = () => {
    if (pendingBalance === 0) {
      return {
        status: "success" as const,
        text: "Factura Pagada Completamente",
        color: "#52c41a"
      };
    } else if (pendingBalance < totalFactura) {
      return {
        status: "processing" as const,
        text: "Pago Parcial",
        color: "#faad14"
      };
    } else {
      return {
        status: "default" as const,
        text: "Sin Pagos Registrados",
        color: "#d9d9d9"
      };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Card title={title} style={{ marginBottom: 16 }}>
      <Row gutter={16}>
        <Col span={6}>
          <div style={{ textAlign: "center" }}>
            <Title level={4} type="secondary">
              Subtotal
            </Title>
            <Text strong style={{ fontSize: 18, color: "#595959" }}>
              {formatCurrency(subtotal)}
            </Text>
          </div>
        </Col>
        <Col span={6}>
          <div style={{ textAlign: "center" }}>
            <Title level={4} type="secondary">
              Total Factura
            </Title>
            <Text strong style={{ fontSize: 18, color: "#1890ff" }}>
              {formatCurrency(totalFactura)}
            </Text>
          </div>
        </Col>
        <Col span={6}>
          <div style={{ textAlign: "center" }}>
            <Title level={4} type="secondary">
              Total Pagado
            </Title>
            <Text strong style={{ fontSize: 18, color: "#52c41a" }}>
              {formatCurrency(totalPayments)}
            </Text>
          </div>
        </Col>
        <Col span={6}>
          <div style={{ textAlign: "center" }}>
            <Title level={4} type="secondary">
              Saldo Pendiente
            </Title>
            <Text strong style={{ fontSize: 18, color: pendingBalance > 0 ? "#faad14" : "#52c41a" }}>
              {formatCurrency(pendingBalance)}
            </Text>
          </div>
        </Col>
      </Row>
      {showStatus && (
        <>
          <Divider />
          <div style={{ textAlign: "center" }}>
            <Badge 
              status={statusInfo.status}
              text={
                <Text strong style={{ color: statusInfo.color }}>
                  {statusInfo.text}
                </Text>
              }
            />
          </div>
        </>
      )}
    </Card>
  );
}; 