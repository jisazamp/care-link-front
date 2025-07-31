import { Line } from "@ant-design/plots";
import { Card, Col, Row, Typography, Spin, Space, Tag, Progress } from "antd";
import { DollarOutlined, FileTextOutlined, ClockCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
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
  const { data: quarterlyVisitsData, isLoading: isLoadingVisits, error: errorVisits } = useGetQuarterlyVisits();
  const { data: monthlyPaymentsData, isLoading: isLoadingPayments, error: errorPayments } = useGetMonthlyPayments();
  const { data: operationalEfficiencyData, isLoading: isLoadingEfficiency, error: errorEfficiency } = useGetOperationalEfficiency();
  const { data: billingStats, isLoading: isLoadingBillingStats, error: errorBillingStats } = useGetBillingStats();

  // Configuración dinámica para el gráfico de visitas
  const configVisitsDynamic = {
    data: quarterlyVisitsData?.monthly_data || dataVisits,
    xField: "month",
    yField: "visits",
    smooth: true,
    color: "#7F34B4", // Morado para visitas
    tooltip: { 
      showMarkers: false,
      formatter: (datum: any) => {
        return {
          name: datum.month,
          value: `${datum.visits || 0} visitas`
        };
      }
    },
    legend: { position: "top" },
    height: 100,
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
          value: `$${(datum.payments || 0).toLocaleString()}`
        };
      }
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
          value: `${datum.efficiency || 0}%`
        };
      }
    },
    legend: { position: "top" },
    height: 100,
  };

  if (isLoadingVisits || isLoadingPayments || isLoadingEfficiency || isLoadingBillingStats) {
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
      {/* Tarjeta 1: Visitas */}
      <Col span={8}>
        <Card className="generic-card">
          <Title level={5}>Visitas del trimestre</Title>
          <Text strong style={{ fontSize: "24px" }}>
            {quarterlyVisitsData?.total_quarterly_visits || 0}
          </Text>
          <Line {...configVisitsDynamic} />
          <Text type="secondary">
            Visitas por día: {quarterlyVisitsData?.average_daily_visits || 0}
          </Text>
        </Card>
      </Col>

      {/* Tarjeta 2: Pagos - MEJORADA */}
      <Col span={8}>
        <Card className="generic-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <DollarOutlined style={{ color: '#9957C2', fontSize: 18 }} />
            <Title level={5} style={{ margin: 0 }}>Pagos</Title>
          </div>
          
          {/* Valor principal */}
          <Title level={3} style={{ color: "#9957C2", marginBottom: 8 }}>
            ${((billingStats?.valor_pagado ?? 0) || (monthlyPaymentsData?.total_payments ?? 0) || 0).toLocaleString()}
          </Title>

          {/* Métricas rápidas */}
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

          {/* Barra de progreso de cobranza */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Cobranza
              </Text>
              <Text strong style={{ fontSize: 12, color: '#9957C2' }}>
                {billingStats?.porcentaje_valor_pagado ?? 0}%
              </Text>
            </div>
            <Progress 
              percent={billingStats?.porcentaje_valor_pagado ?? 0} 
              size="small" 
              strokeColor="#9957C2"
              showInfo={false}
            />
          </div>

          {/* Gráfico de tendencia */}
          <Line {...configPaymentsDynamic} />

          {/* Información adicional */}
          <div style={{ marginTop: 8 }}>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>
              Cumplimiento de meta <strong>{monthlyPaymentsData?.overall_goal_achievement ?? 0}%</strong>
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Pendiente: ${(billingStats?.valor_pendiente ?? 0).toLocaleString()}
            </Text>
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
            Aumento <Text type="success">{operationalEfficiencyData?.growth_percentage || 0}%</Text> Ver reporte
          </Text>
        </Card>
      </Col>
    </Row>
  );
};
