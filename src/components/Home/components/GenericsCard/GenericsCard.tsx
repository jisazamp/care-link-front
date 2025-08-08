import { Line } from "@ant-design/plots";
import { Card, Col, Row, Typography, Spin, Space, Tag, Progress, Alert, Tooltip } from "antd";
import {
  DollarOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  RiseOutlined,
  FallOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useGetQuarterlyVisits } from "../../../../hooks/useGetQuarterlyVisits/useGetQuarterlyVisits";
import { useGetMonthlyPayments } from "../../../../hooks/useGetMonthlyPayments/useGetMonthlyPayments";
import { useGetOperationalEfficiency } from "../../../../hooks/useGetOperationalEfficiency/useGetOperationalEfficiency";
import { useGetBillingStats } from "../../../../hooks/useGetBillingStats/useGetBillingStats";

const { Title, Text } = Typography;

// Datos de ejemplo para gráficos
const dataVisits = [
  { date: "Enero", value: 30 },
  { date: "Febrero", value: 45 },
  { date: "Marzo", value: 38 },
  { date: "Abril", value: 50 },
  { date: "Mayo", value: 42 },
  { date: "Junio", value: 48 },
];

const dataPayments = [
  { date: "Enero", value: 500000 },
  { date: "Febrero", value: 800000 },
  { date: "Marzo", value: 700000 },
  { date: "Abril", value: 1000000 },
  { date: "Mayo", value: 850000 },
  { date: "Junio", value: 900000 },
];

const dataEfficiency = [
  { date: "Enero", value: 70 },
  { date: "Febrero", value: 75 },
  { date: "Marzo", value: 80 },
  { date: "Abril", value: 85 },
  { date: "Mayo", value: 78 },
  { date: "Junio", value: 82 },
];

export const GenericsCards = () => {
  const {
    data: quarterlyVisitsData,
    isLoading: isLoadingVisits,
    error: errorVisits,
  } = useGetQuarterlyVisits();
  const {
    data: monthlyPaymentsData,
    isLoading: isLoadingPayments,
    error: errorPayments,
  } = useGetMonthlyPayments();
  const {
    data: operationalEfficiencyData,
    isLoading: isLoadingEfficiency,
    error: errorEfficiency,
  } = useGetOperationalEfficiency();
  const {
    data: billingStats,
    isLoading: isLoadingBillingStats,
    error: errorBillingStats,
  } = useGetBillingStats();



  // Configuración dinámica para el gráfico de visitas - MEJORADA
  const configVisitsDynamic = {
    data: quarterlyVisitsData?.monthly_data || dataVisits,
    xField: "month",
    yField: "visits",
    smooth: true,
    color: "#7F34B4", // Morado para visitas
    point: {
      size: 4,
      shape: 'circle',
      style: {
        fill: '#7F34B4',
        stroke: '#fff',
        lineWidth: 2,
      },
    },
    tooltip: {
      showMarkers: true,
      formatter: (datum: any) => {
        const visits = datum.visits || 0;
        const percentage = quarterlyVisitsData?.total_quarterly_visits ? 
          ((visits / quarterlyVisitsData.total_quarterly_visits) * 100).toFixed(1) : 0;
        
        return {
          name: datum.month,
          value: `${visits} visitas (${percentage}%)`,
        };
      },
    },
    legend: { position: "top" },
    height: 100,
    area: {
      style: {
        fill: 'l(270) 0:#7F34B4 0.5:#7F34B4 1:#7F34B4',
        fillOpacity: 0.1,
      },
    },
    grid: {
      line: {
        style: {
          stroke: '#f0f0f0',
          lineWidth: 1,
        },
      },
    },
    axis: {
      x: {
        line: {
          style: {
            stroke: '#f0f0f0',
            lineWidth: 1,
          },
        },
      },
      y: {
        line: {
          style: {
            stroke: '#f0f0f0',
            lineWidth: 1,
          },
        },
      },
    },
  };

  // Configuración dinámica para el gráfico de pagos
  const configPaymentsDynamic = {
    data: monthlyPaymentsData?.monthly_data || dataPayments,
    xField: "month",
    yField: "payments",
    smooth: true,
    color: "#9957C2", // Color principal del sistema
    tooltip: {
      showMarkers: false,
      formatter: (datum: any) => {
        return {
          name: datum.month,
          value: `$${(datum.payments || 0).toLocaleString()}`,
        };
      },
    },
    legend: { position: "top" },
    height: 100,
  };

  // Configuración dinámica para el gráfico de eficiencia operativa
  const configEfficiencyDynamic = {
    data: operationalEfficiencyData?.monthly_data || dataEfficiency,
    xField: "month",
    yField: "efficiency",
    smooth: true,
    color: "#13C2C2", // Verde para eficiencia operativa
    tooltip: {
      showMarkers: false,
      formatter: (datum: any) => {
        return {
          name: datum.month,
          value: `${datum.efficiency || 0}%`,
        };
      },
    },
    legend: { position: "top" },
    height: 100,
  };

  if (
    isLoadingVisits ||
    isLoadingPayments ||
    isLoadingEfficiency ||
    isLoadingBillingStats
  ) {
    return (
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card className="generic-card">
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Spin size="large" />
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card className="generic-card">
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Spin size="large" />
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card className="generic-card">
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Spin size="large" />
            </div>
          </Card>
        </Col>
      </Row>
    );
  }

  if (errorVisits || errorPayments || errorEfficiency || errorBillingStats) {
    return (
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card className="generic-card">
            <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
              Error al cargar datos
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card className="generic-card">
            <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
              Error al cargar datos
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card className="generic-card">
            <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
              Error al cargar datos
            </div>
          </Card>
        </Col>
      </Row>
    );
  }

  return (
    <Row gutter={[16, 16]}>
      {/* Tarjeta 1: Visitas - MEJORADA CON MÁS INFORMACIÓN */}
      <Col span={8}>
        <Card className="generic-card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <CalendarOutlined style={{ color: "#7F34B4", fontSize: 18 }} />
              <Title level={5} style={{ margin: 0 }}>
                Visitas del trimestre
              </Title>
            </div>
            <Tag 
              color={
                (quarterlyVisitsData?.total_quarterly_visits ?? 0) > 10 ? 'success' :
                (quarterlyVisitsData?.total_quarterly_visits ?? 0) > 5 ? 'processing' :
                (quarterlyVisitsData?.total_quarterly_visits ?? 0) > 0 ? 'warning' : 'default'
              }
              style={{ fontSize: 10 }}
            >
              {quarterlyVisitsData?.total_quarterly_visits ?? 0} visitas
            </Tag>
          </div>

          {/* Métricas principales */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <Text strong style={{ fontSize: "24px", color: "#7F34B4" }}>
                {quarterlyVisitsData?.total_quarterly_visits || 0}
              </Text>
              <div style={{ textAlign: "right" }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Promedio diario
                </Text>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#7F34B4" }}>
                  {quarterlyVisitsData?.average_daily_visits || 0}
                </div>
              </div>
            </div>
            
            {/* Indicadores de rendimiento */}
            <Space size="small" style={{ marginBottom: 8 }}>
              <Tag color="default" style={{ fontSize: 10 }}>
                <CalendarOutlined style={{ marginRight: 4 }} />
                {quarterlyVisitsData?.monthly_data?.length || 0} meses
              </Tag>
              <Tag 
                color={
                  (quarterlyVisitsData?.average_daily_visits ?? 0) > 1 ? 'success' :
                  (quarterlyVisitsData?.average_daily_visits ?? 0) > 0.5 ? 'processing' : 'warning'
                }
                style={{ fontSize: 10 }}
              >
                <RiseOutlined style={{ marginRight: 4 }} />
                {quarterlyVisitsData?.average_daily_visits || 0}/día
              </Tag>
            </Space>
          </div>

          {/* Gráfico mejorado */}
          <div style={{ marginBottom: 12 }}>
            <Line {...configVisitsDynamic} />
          </div>

                      {/* Información adicional mejorada */}
            <div style={{ marginTop: 8 }}>
              {/* Métricas de rendimiento */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Completitud
                </Text>
                <Text strong style={{ fontSize: 12, color: "#7F34B4" }}>
                  {quarterlyVisitsData?.completion_rate ?? 0}%
                </Text>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Eficiencia
                </Text>
                <Text strong style={{ fontSize: 12, color: "#7F34B4" }}>
                  {quarterlyVisitsData?.efficiency_rate ?? 0}%
                </Text>
              </div>

              {/* Estados de visitas */}
              <div style={{ marginTop: 8, marginBottom: 8 }}>
                <Text type="secondary" style={{ fontSize: 11, marginBottom: 4, display: 'block' }}>
                  Estados del trimestre:
                </Text>
                <Space size="small">
                  <Tag color="success" style={{ fontSize: 10 }}>
                    ✓ {quarterlyVisitsData?.completed_visits ?? 0} realizadas
                  </Tag>
                  <Tag color="warning" style={{ fontSize: 10 }}>
                    ⏳ {quarterlyVisitsData?.pending_visits ?? 0} pendientes
                  </Tag>
                  <Tag color="error" style={{ fontSize: 10 }}>
                    ✗ {quarterlyVisitsData?.cancelled_visits ?? 0} canceladas
                  </Tag>
                  <Tag color="processing" style={{ fontSize: 10 }}>
                    🔄 {quarterlyVisitsData?.rescheduled_visits ?? 0} reprogramadas
                  </Tag>
                </Space>
              </div>

              {/* Mes con más visitas y tendencia */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Mes con más visitas
                </Text>
                <Text strong style={{ fontSize: 12, color: "#7F34B4" }}>
                  {(() => {
                    const monthlyData = quarterlyVisitsData?.monthly_data || [];
                    if (monthlyData.length === 0) return 'N/A';
                    const maxVisits = Math.max(...monthlyData.map((m: any) => m.visits || 0));
                    const maxMonth = monthlyData.find((m: any) => (m.visits || 0) === maxVisits);
                    return maxMonth ? `${maxMonth.month} (${maxVisits})` : 'N/A';
                  })()}
                </Text>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Tendencia
                </Text>
                <Text 
                  strong 
                  style={{ 
                    fontSize: 12, 
                    color: (() => {
                      const monthlyData = quarterlyVisitsData?.monthly_data || [];
                      if (monthlyData.length < 2) return '#666';
                      const firstHalf = monthlyData.slice(0, Math.ceil(monthlyData.length / 2));
                      const secondHalf = monthlyData.slice(Math.ceil(monthlyData.length / 2));
                      const firstAvg = firstHalf.reduce((sum: number, m: any) => sum + (m.visits || 0), 0) / firstHalf.length;
                      const secondAvg = secondHalf.reduce((sum: number, m: any) => sum + (m.visits || 0), 0) / secondHalf.length;
                      return secondAvg > firstAvg ? '#52c41a' : secondAvg < firstAvg ? '#ff4d4f' : '#666';
                    })()
                  }}
                >
                  {(() => {
                    const monthlyData = quarterlyVisitsData?.monthly_data || [];
                    if (monthlyData.length < 2) return 'Estable';
                    const firstHalf = monthlyData.slice(0, Math.ceil(monthlyData.length / 2));
                    const secondHalf = monthlyData.slice(Math.ceil(monthlyData.length / 2));
                    const firstAvg = firstHalf.reduce((sum: number, m: any) => sum + (m.visits || 0), 0) / firstHalf.length;
                    const secondAvg = secondHalf.reduce((sum: number, m: any) => sum + (m.visits || 0), 0) / secondHalf.length;
                    return secondAvg > firstAvg ? '↗️ Creciente' : secondAvg < firstAvg ? '↘️ Decreciente' : '→ Estable';
                  })()}
                </Text>
              </div>

              {/* Alertas contextuales mejoradas */}
              {(quarterlyVisitsData?.total_quarterly_visits ?? 0) === 0 && (
                <Alert
                  message="Sin visitas este trimestre"
                  description="No se han registrado visitas domiciliarias en el trimestre actual"
                  type="info"
                  showIcon
                  style={{ marginTop: 8, fontSize: 11 }}
                />
              )}
              
              {(quarterlyVisitsData?.completion_rate ?? 0) < 70 && (quarterlyVisitsData?.total_quarterly_visits ?? 0) > 0 && (
                <Alert
                  message="Baja tasa de completitud"
                  description={`Solo ${quarterlyVisitsData?.completion_rate ?? 0}% de visitas completadas`}
                  type="warning"
                  showIcon
                  style={{ marginTop: 8, fontSize: 11 }}
                />
              )}
              
              {(quarterlyVisitsData?.efficiency_rate ?? 0) < 80 && (quarterlyVisitsData?.total_quarterly_visits ?? 0) > 0 && (
                <Alert
                  message="Baja eficiencia operativa"
                  description={`${quarterlyVisitsData?.efficiency_rate ?? 0}% de eficiencia - Revisar cancelaciones`}
                  type="warning"
                  showIcon
                  style={{ marginTop: 8, fontSize: 11 }}
                />
              )}
              
              {(quarterlyVisitsData?.completion_rate ?? 0) >= 90 && (quarterlyVisitsData?.total_quarterly_visits ?? 0) > 0 && (
                <Alert
                  message="Excelente rendimiento"
                  description={`${quarterlyVisitsData?.completion_rate ?? 0}% de completitud - Excelente trabajo`}
                  type="success"
                  showIcon
                  style={{ marginTop: 8, fontSize: 11 }}
                />
              )}
            </div>
        </Card>
      </Col>

      {/* Tarjeta 2: Pagos - INFORMATIVA SIN NAVEGACIÓN */}
      <Col span={8}>
        <Card className="generic-card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <DollarOutlined style={{ color: "#9957C2", fontSize: 18 }} />
            <Title level={5} style={{ margin: 0, marginLeft: 8 }}>
              Pagos
            </Title>
          </div>

          {/* Valor principal con indicador de estado */}
          <div style={{ marginBottom: 8 }}>
            <Title level={3} style={{ color: "#9957C2", margin: 0 }}>
              $
              {(
                (billingStats?.valor_pagado ?? 0) ||
                (monthlyPaymentsData?.total_payments ?? 0) ||
                0
              ).toLocaleString()}
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {(billingStats?.total_facturas ?? 0) > 0 ? 'Total facturado' : 'Sin facturas activas'}
            </Text>
          </div>

          {/* Métricas rápidas informativas */}
          <Space size="small" style={{ marginBottom: 12 }}>
            <Tag color="default" style={{ fontSize: 11 }}>
              <FileTextOutlined style={{ marginRight: 4 }} />
              {billingStats?.total_facturas ?? 0} facturas
            </Tag>
            <Tag color="processing" style={{ fontSize: 11 }}>
              <CheckCircleOutlined style={{ marginRight: 4 }} />
              {billingStats?.facturas_pagadas ?? 0} pagadas
            </Tag>
            <Tag color="warning" style={{ fontSize: 11 }}>
              <ClockCircleOutlined style={{ marginRight: 4 }} />
              {billingStats?.facturas_pendientes ?? 0} pendientes
            </Tag>
          </Space>

          {/* Barra de progreso de cobranza mejorada */}
          <div style={{ marginBottom: 12 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <Text type="secondary" style={{ fontSize: 12 }}>
                Cobranza
              </Text>
              <Text strong style={{ fontSize: 12, color: "#9957C2" }}>
                {billingStats?.porcentaje_valor_pagado ?? 0}%
              </Text>
            </div>
            <Progress
              percent={billingStats?.porcentaje_valor_pagado ?? 0}
              size="small"
              strokeColor="#9957C2"
              showInfo={false}
              status={billingStats?.porcentaje_valor_pagado === 100 ? 'success' : 'active'}
            />
          </div>

          {/* Gráfico de tendencia mejorado */}
          <div style={{ marginBottom: 8 }}>
            <Line {...configPaymentsDynamic} />
          </div>

          {/* Información adicional con alertas */}
          <div style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Cumplimiento de meta
              </Text>
              <Text 
                strong 
                style={{ 
                  fontSize: 12, 
                  color: (monthlyPaymentsData?.overall_goal_achievement ?? 0) >= 80 ? '#52c41a' : 
                         (monthlyPaymentsData?.overall_goal_achievement ?? 0) >= 50 ? '#faad14' : '#ff4d4f'
                }}
              >
                {monthlyPaymentsData?.overall_goal_achievement ?? 0}%
              </Text>
            </div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Pendiente: ${(billingStats?.valor_pendiente ?? 0).toLocaleString()}
            </Text>
            
            {/* Alertas contextuales */}
            {(billingStats?.facturas_pendientes ?? 0) > 0 && (
              <div style={{ marginTop: 8 }}>
                <Text type="danger" style={{ fontSize: 11 }}>
                  ⚠️ {billingStats?.facturas_pendientes} facturas pendientes
                </Text>
              </div>
            )}
            
            {(billingStats?.valor_pendiente ?? 0) > 0 && (
              <div style={{ marginTop: 4 }}>
                <Text type="warning" style={{ fontSize: 11 }}>
                  💰 ${(billingStats?.valor_pendiente ?? 0).toLocaleString()} por cobrar
                </Text>
              </div>
            )}
            
            {/* Alertas informativas sin navegación */}
            {(billingStats?.facturas_vencidas_count ?? 0) > 0 && (
              <Alert
                message={`${billingStats?.facturas_vencidas_count} facturas vencidas`}
                description={`$${(billingStats?.valor_vencido ?? 0).toLocaleString()} en facturas vencidas`}
                type="error"
                showIcon
                style={{ marginTop: 8, fontSize: 11 }}
              />
            )}
            
            {(billingStats?.porcentaje_valor_pagado ?? 0) < 50 && (
              <Alert
                message="Cobranza baja"
                description={`Solo ${billingStats?.porcentaje_valor_pagado}% de cobranza efectiva`}
                type="warning"
                showIcon
                style={{ marginTop: 8, fontSize: 11 }}
              />
            )}
            
            {(billingStats?.cumplimiento_meta_mensual ?? 0) < 50 && (
              <Alert
                message="Meta mensual baja"
                description={`${billingStats?.cumplimiento_meta_mensual}% de cumplimiento de meta`}
                type="info"
                showIcon
                style={{ marginTop: 8, fontSize: 11 }}
              />
            )}
            
            {/* Indicador de salud financiera */}
            {billingStats?.salud_financiera && (
              <div style={{ marginTop: 8 }}>
                <Tooltip title={`Salud financiera: ${billingStats.salud_financiera}`}>
                  <Tag 
                    color={
                      billingStats.salud_financiera === 'EXCELENTE' ? 'success' :
                      billingStats.salud_financiera === 'BUENA' ? 'processing' :
                      billingStats.salud_financiera === 'REGULAR' ? 'warning' : 'error'
                    }
                    style={{ fontSize: 10 }}
                  >
                    {billingStats.salud_financiera === 'EXCELENTE' ? <RiseOutlined /> : 
                     billingStats.salud_financiera === 'CRÍTICA' ? <FallOutlined /> : 
                     <InfoCircleOutlined />} {billingStats.salud_financiera}
                  </Tag>
                </Tooltip>
              </div>
            )}
            
            {/* Resumen ejecutivo cuando no hay datos */}
            {(!billingStats || (billingStats.total_facturas === 0 && billingStats.valor_pagado > 0)) && (
              <Alert
                message="Resumen ejecutivo"
                description={
                  <div>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      • Total histórico: ${(billingStats?.valor_pagado ?? 0).toLocaleString()}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      • Sin facturas activas este mes
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      • Considere crear nuevas facturas
                    </Text>
                  </div>
                }
                type="info"
                showIcon
                style={{ marginTop: 8, fontSize: 11 }}
              />
            )}
          </div>
        </Card>
      </Col>

      {/* Tarjeta 3: Eficiencia Operativa */}
      <Col span={8}>
        <Card className="generic-card">
          <Title level={5}>Eficiencia operativa</Title>
          <Title level={3} style={{ color: "#13C2C2" }}>
            {operationalEfficiencyData?.overall_efficiency || 0}%
          </Title>
          <Line {...configEfficiencyDynamic} />
          <Text type="secondary">
            Aumento{" "}
            <Text type="success">
              {operationalEfficiencyData?.growth_percentage || 0}%
            </Text>{" "}
            Ver reporte
          </Text>
        </Card>
      </Col>
    </Row>
  );
};
