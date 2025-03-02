import { Card, Typography, Row, Col } from "antd";
import { Line } from "@ant-design/plots";

const { Title, Text } = Typography;

// 📊 Datos de ejemplo para gráficos
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

// 📊 Configuración de gráficos con colores y estilos corregidos
const configVisits = {
  data: dataVisits,
  xField: "date",
  yField: "value",
  smooth: true,
  color: "#7F34B4", // Morado para visitas
  tooltip: { showMarkers: false },
  legend: { position: "top" },
  height: 100,
};

const configPayments = {
  data: dataPayments,
  xField: "date",
  yField: "value",
  smooth: true,
  color: "#1890FF", // Azul para pagos
  tooltip: { showMarkers: false },
  legend: { position: "top" },
  height: 100,
};

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
  return (
    <Row gutter={[16, 16]}>
      {/* Tarjeta 1: Visitas */}
      <Col span={8}>
        <Card className="generic-card">
          <Title level={5}>Visitar del trimestre</Title>
          <Text strong style={{ fontSize: "24px" }}>
            350
          </Text>
          <Line {...configVisits} />
          <Text type="secondary">Visitas por día: 20</Text>
        </Card>
      </Col>

      {/* Tarjeta 2: Pagos */}
      <Col span={8}>
        <Card className="generic-card">
          <Title level={5}>Pagos</Title>
          <Title level={3} style={{ color: "#1890FF" }}>
            $8.000.000
          </Title>
          <Line {...configPayments} />
          <Text type="secondary">
            Cumplimiento de meta <strong>60%</strong>
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
            Aumento <Text type="success">12%</Text> <a href="#">Ver reporte</a>
          </Text>
        </Card>
      </Col>
    </Row>
  );
};
