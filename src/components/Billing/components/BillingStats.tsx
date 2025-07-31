import React from 'react';
import { Row, Col, Statistic, Progress, Tooltip, Typography, Card, Divider } from 'antd';
import {
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

const { Text, Title } = Typography;

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
  const porcentajePagadas = stats.total > 0 ? Math.round((stats.pagadas / stats.total) * 100) : 0;
  const porcentajePendientes = stats.total > 0 ? Math.round((stats.pendientes / stats.total) * 100) : 0;
  const porcentajeVencidas = stats.total > 0 ? Math.round((stats.vencidas / stats.total) * 100) : 0;
  const valorPagado = stats.valorPagado || (stats.totalValor - stats.valorPendiente);
  const porcentajeValorPagado = stats.totalValor > 0 ? Math.round((valorPagado / stats.totalValor) * 100) : 0;
  const promedioPorFactura = stats.total > 0 ? Math.round(stats.totalValor / stats.total) : 0;

  // Colores del sistema - minimalistas
  const primaryColor = '#9957C2'; // Color principal del sistema
  const textColor = '#262626'; // Color de texto principal
  const secondaryTextColor = '#8c8c8c'; // Color de texto secundario
  const negativeColor = '#ff4d4f'; // Solo para valores negativos
  const neutralColor = '#595959'; // Color neutro para iconos

  return (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileTextOutlined style={{ color: primaryColor }} />
          <Title level={4} style={{ margin: 0, color: textColor }}>
            Resumen de Facturación
          </Title>
        </div>
      }
      style={{ marginBottom: 24 }}
    >
      {/* Sección 1: Métricas de Cantidad */}
      <div style={{ marginBottom: 24 }}>
        <Text strong style={{ fontSize: 16, color: textColor, marginBottom: 16, display: 'block' }}>
          Estado de Facturas
        </Text>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title={<Text style={{ color: secondaryTextColor }}>Total Facturas</Text>}
              value={stats.total}
              prefix={<FileTextOutlined style={{ color: neutralColor }} />}
              valueStyle={{ color: textColor, fontSize: 24, fontWeight: 600 }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title={<Text style={{ color: secondaryTextColor }}>Pendientes</Text>}
              value={`${stats.pendientes} (${porcentajePendientes}%)`}
              prefix={<ClockCircleOutlined style={{ color: neutralColor }} />}
              valueStyle={{ color: textColor, fontSize: 24, fontWeight: 600 }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title={<Text style={{ color: secondaryTextColor }}>Pagadas</Text>}
              value={`${stats.pagadas} (${porcentajePagadas}%)`}
              prefix={<CheckCircleOutlined style={{ color: neutralColor }} />}
              valueStyle={{ color: textColor, fontSize: 24, fontWeight: 600 }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title={<Text style={{ color: secondaryTextColor }}>Vencidas</Text>}
              value={`${stats.vencidas} (${porcentajeVencidas}%)`}
              prefix={<CloseCircleOutlined style={{ color: neutralColor }} />}
              valueStyle={{ color: textColor, fontSize: 24, fontWeight: 600 }}
            />
          </Col>
        </Row>
      </div>

      <Divider style={{ margin: '16px 0' }} />

      {/* Sección 2: Métricas de Valor */}
      <div style={{ marginBottom: 24 }}>
        <Text strong style={{ fontSize: 16, color: textColor, marginBottom: 16, display: 'block' }}>
          Información Financiera
        </Text>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title={<Text style={{ color: secondaryTextColor }}>Valor Total</Text>}
              value={stats.totalValor}
              prefix={<DollarOutlined style={{ color: primaryColor }} />}
              valueStyle={{ color: primaryColor, fontSize: 24, fontWeight: 600 }}
              formatter={(value) => `$${value?.toLocaleString()}`}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title={<Text style={{ color: secondaryTextColor }}>Valor Pagado</Text>}
              value={`$${valorPagado.toLocaleString()} (${porcentajeValorPagado}%)`}
              prefix={<DollarOutlined style={{ color: primaryColor }} />}
              valueStyle={{ color: primaryColor, fontSize: 24, fontWeight: 600 }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title={<Text style={{ color: secondaryTextColor }}>Valor Pendiente</Text>}
              value={`$${stats.valorPendiente.toLocaleString()}`}
              prefix={<DollarOutlined style={{ color: neutralColor }} />}
              valueStyle={{ color: textColor, fontSize: 24, fontWeight: 600 }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title={<Text style={{ color: secondaryTextColor }}>Promedio por Factura</Text>}
              value={`$${promedioPorFactura.toLocaleString()}`}
              prefix={<DollarOutlined style={{ color: primaryColor }} />}
              valueStyle={{ color: primaryColor, fontSize: 24, fontWeight: 600 }}
            />
          </Col>
        </Row>
      </div>

      <Divider style={{ margin: '16px 0' }} />

      {/* Sección 3: Barras de Progreso */}
      <div>
        <Text strong style={{ fontSize: 16, color: textColor, marginBottom: 16, display: 'block' }}>
          Progreso de Cobranza
        </Text>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ color: secondaryTextColor, fontSize: 14 }}>
                  Facturas Completamente Pagadas
                </Text>
                <Text strong style={{ color: textColor }}>
                  {porcentajePagadas}%
                </Text>
              </div>
              <Progress
                percent={porcentajePagadas}
                status={porcentajePagadas === 100 ? 'success' : 'active'}
                strokeColor={primaryColor}
                showInfo={false}
                size="small"
              />
              <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
                {stats.pagadas} de {stats.total} facturas completamente saldadas
              </Text>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ color: secondaryTextColor, fontSize: 14 }}>
                  Valor Total Cobrado
                </Text>
                <Text strong style={{ color: textColor }}>
                  {porcentajeValorPagado}%
                </Text>
              </div>
              <Progress
                percent={porcentajeValorPagado}
                status={porcentajeValorPagado === 100 ? 'success' : 'active'}
                strokeColor={primaryColor}
                showInfo={false}
                size="small"
              />
              <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
                ${valorPagado.toLocaleString()} de ${stats.totalValor.toLocaleString()} cobrados
              </Text>
            </div>
          </Col>
        </Row>
      </div>
    </Card>
  );
}; 