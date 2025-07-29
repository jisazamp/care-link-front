import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Col, Progress, Row, Statistic, Tooltip, Typography } from "antd";
import type React from "react";

const { Text } = Typography;

interface BillingStatsProps {
  stats: {
    total: number;
    pendientes: number;
    pagadas: number;
    vencidas: number;
    totalValor: number;
    valorPendiente: number;
    valorPagado?: number;
  };
}

export const BillingStats: React.FC<BillingStatsProps> = ({ stats }) => {
  const porcentajePagadas =
    stats.total > 0 ? Math.round((stats.pagadas / stats.total) * 100) : 0;
  const porcentajePendientes =
    stats.total > 0 ? Math.round((stats.pendientes / stats.total) * 100) : 0;
  const porcentajeVencidas =
    stats.total > 0 ? Math.round((stats.vencidas / stats.total) * 100) : 0;
  const valorPagado =
    stats.valorPagado || stats.totalValor - stats.valorPendiente;
  const porcentajeValorPagado =
    stats.totalValor > 0
      ? Math.round((valorPagado / stats.totalValor) * 100)
      : 0;
  const promedioPorFactura =
    stats.total > 0 ? Math.round(stats.totalValor / stats.total) : 0;

  return (
    <div style={{ marginBottom: 24 }}>
      {/* Primera fila: indicadores de cantidad */}
      <Row gutter={[16, 16]} style={{ marginBottom: 8 }}>
        <Col xs={24} sm={12} md={4}>
          <Statistic
            title="Total Facturas"
            value={stats.total}
            prefix={<FileTextOutlined />}
            valueStyle={{ color: "#1890ff" }}
          />
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Statistic
            title="Pendientes"
            value={`${stats.pendientes} (${porcentajePendientes}%)`}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: "#faad14" }}
          />
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Statistic
            title="Pagadas"
            value={`${stats.pagadas} (${porcentajePagadas}%)`}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: "#52c41a" }}
          />
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Statistic
            title="Vencidas"
            value={`${stats.vencidas} (${porcentajeVencidas}%)`}
            prefix={<CloseCircleOutlined />}
            valueStyle={{ color: "#ff4d4f" }}
          />
        </Col>
      </Row>
      {/* Segunda fila: indicadores de valor */}
      <Row gutter={[16, 16]} style={{ marginBottom: 8 }}>
        <Col xs={24} sm={12} md={4}>
          <Statistic
            title="Valor Total"
            value={stats.totalValor}
            prefix={<DollarOutlined />}
            valueStyle={{ color: "#722ed1" }}
            formatter={(value) => `$${value?.toLocaleString()}`}
          />
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Statistic
            title="Valor Pagado"
            value={`$${valorPagado.toLocaleString()} (${porcentajeValorPagado}%)`}
            prefix={<DollarOutlined />}
            valueStyle={{ color: "#52c41a" }}
          />
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Statistic
            title="Valor Pendiente"
            value={`$${stats.valorPendiente.toLocaleString()}`}
            prefix={<DollarOutlined />}
            valueStyle={{ color: "#fa8c16" }}
          />
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Statistic
            title="Promedio por Factura"
            value={`$${promedioPorFactura.toLocaleString()}`}
            prefix={<DollarOutlined />}
            valueStyle={{ color: "#13c2c2" }}
          />
        </Col>
      </Row>
      {/* Barras de progreso con explicación */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <div style={{ marginTop: 8 }}>
            <Tooltip title="Porcentaje de facturas que han sido completamente pagadas respecto al total de facturas.">
              <Text type="secondary" style={{ fontSize: 13 }}>
                Progreso de Facturas Pagadas: Indica el % de facturas saldadas
                en su totalidad.
              </Text>
            </Tooltip>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span>Progreso de Facturas Pagadas</span>
              <span>{porcentajePagadas}%</span>
            </div>
            <Progress
              percent={porcentajePagadas}
              status={porcentajePagadas === 100 ? "success" : "active"}
              strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
            />
          </div>
        </Col>
        <Col xs={24} md={12}>
          <div style={{ marginTop: 8 }}>
            <Tooltip title="Porcentaje del valor total facturado que ya ha sido pagado (incluye pagos parciales y totales).">
              <Text type="secondary" style={{ fontSize: 13 }}>
                Progreso de Valor Pagado: Indica el % del dinero total facturado
                que ya fue cobrado.
              </Text>
            </Tooltip>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span>Progreso de Valor Pagado</span>
              <span>{porcentajeValorPagado}%</span>
            </div>
            <Progress
              percent={porcentajeValorPagado}
              status={porcentajeValorPagado === 100 ? "success" : "active"}
              strokeColor={{ "0%": "#faad14", "100%": "#52c41a" }}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};
