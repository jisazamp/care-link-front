import { Line } from "@ant-design/plots";
import { Card, Col, Row, Typography, Spin } from "antd";
import { useGetQuarterlyVisits } from "../../../../hooks/useGetQuarterlyVisits/useGetQuarterlyVisits";
import { useGetMonthlyPayments } from "../../../../hooks/useGetMonthlyPayments/useGetMonthlyPayments";

const { Title, Text } = Typography;

//  Datos de ejemplo para gráficos
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

//  Configuración de gráficos con colores y estilos corregidos

const configEfficiency = {
  data: dataEfficiency,
  xField: "date",
  yField: "value",
  smooth: true,
  color: "#13C2C2", // Verde para eficiencia operativa
  tooltip: { showMarkers: false },
  legend: { position: "top" },
  height: 100,
};

export const GenericsCards = () => {
  const { data: quarterlyVisitsData, isLoading: isLoadingVisits, error: errorVisits } = useGetQuarterlyVisits();
  const { data: monthlyPaymentsData, isLoading: isLoadingPayments, error: errorPayments } = useGetMonthlyPayments();



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
    color: "#1890FF", // Azul para pagos
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

  if (isLoadingVisits || isLoadingPayments) {
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

  if (errorVisits || errorPayments) {
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

      {/* Tarjeta 2: Pagos */}
      <Col span={8}>
        <Card className="generic-card">
          <Title level={5}>Pagos</Title>
          <Title level={3} style={{ color: "#1890FF" }}>
            ${(monthlyPaymentsData?.total_payments || 0).toLocaleString()}
          </Title>
          <Line {...configPaymentsDynamic} />
          <Text type="secondary">
            Cumplimiento de meta <strong>{monthlyPaymentsData?.overall_goal_achievement || 0}%</strong>
          </Text>
        </Card>
      </Col>

      {/* Tarjeta 3: Eficiencia Operativa */}
      <Col span={8}>
        <Card className="generic-card">
          <Title level={5}>Eficiencia operativa</Title>
          <Title level={3} style={{ color: "#13C2C2" }}>
            78%
          </Title>
          <Line {...configEfficiency} />
          <Text type="secondary">
            Aumento <Text type="success">12%</Text> Ver reporte
          </Text>
        </Card>
      </Col>
    </Row>
  );
};
