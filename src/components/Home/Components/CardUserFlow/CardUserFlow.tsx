import { Card, Table, Typography, Row, Col, Space, Badge, Tooltip, Divider } from "antd";
import { InfoCircleOutlined, CaretUpOutlined, EllipsisOutlined } from "@ant-design/icons";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer } from "recharts";

const { Title, Text } = Typography;

// Datos ficticios para los gráficos
const userChartData = [
  { name: "Lun", value: 80 },
  { name: "Mar", value: 90 },
  { name: "Mié", value: 70 },
  { name: "Jue", value: 85 },
  { name: "Vie", value: 100 },
];

const attendanceChartData = [
  { name: "Lun", value: 75 },
  { name: "Mar", value: 85 },
  { name: "Mié", value: 65 },
  { name: "Jue", value: 90 },
  { name: "Vie", value: 95 },
];

// Columnas de la tabla
const columnsUserFlow = [
  { title: "Usuarios", dataIndex: "user", key: "user" },
  {
    title: "Contrato",
    dataIndex: "contract",
    key: "contract",
    render: () => <a style={{ color: "#7f34b4" }}>Ver</a>,
  },
  {
    title: "Visitas del mes",
    dataIndex: "visits",
    key: "visits",
    render: (visits: number) => (
      <Space>
        <Badge color="purple" />
        {visits}
      </Space>
    ),
  },
];

// Datos de usuarios
const userFlowData = [
  { key: "1", user: "Nombre usuario", contract: "Ver", visits: 5 },
  { key: "2", user: "Nombre usuario", contract: "Ver", visits: 10 },
  { key: "3", user: "Nombre usuario", contract: "Ver", visits: 3 },
  { key: "4", user: "Nombre usuario", contract: "Ver", visits: 5 },
  { key: "5", user: "Nombre usuario", contract: "Ver", visits: 10 },
];

export const CardUserFlow = () => (
  <Col span={6}>  {/*  Ajustado al 25% del ancho (6 de 24 columnas) */}
    <Card
      title="Flujo de usuarios"
      extra={<EllipsisOutlined />}
      className="user-flow-card"
      style={{ width: "100%", minWidth: 280 }} //  Ancho controlado
    >
      {/* Sección de Estadísticas */}
      <Row gutter={16} justify="space-between">
        <Col span={12}>
          <Space direction="vertical">
            <Text strong>Usuarios del mes</Text>
            <Tooltip title="Número de usuarios registrados en el mes">
              <InfoCircleOutlined style={{ marginLeft: 5, color: "#aaa" }} />
            </Tooltip>
            <Title level={2}>100</Title>
            <Space>
              <CaretUpOutlined style={{ color: "green" }} />
              <Text type="success">17.1</Text>
            </Space>
          </Space>
          <ResponsiveContainer width="100%" height={50}>
            <LineChart data={userChartData}>
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <CartesianGrid strokeDasharray="3 3" />
              <ChartTooltip />
              <Line type="monotone" dataKey="value" stroke="#7f34b4" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Col>

        <Col span={12}>
          <Space direction="vertical">
            <Text strong>Tasa de asistencia</Text>
            <Tooltip title="Porcentaje de asistencia general en el mes">
              <InfoCircleOutlined style={{ marginLeft: 5, color: "#aaa" }} />
            </Tooltip>
            <Title level={2}>90%</Title>
            <Space>
              <CaretUpOutlined style={{ color: "green" }} />
              <Text type="success">26.2</Text>
            </Space>
          </Space>
          <ResponsiveContainer width="100%" height={50}>
            <LineChart data={attendanceChartData}>
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <CartesianGrid strokeDasharray="3 3" />
              <ChartTooltip />
              <Line type="monotone" dataKey="value" stroke="#7f34b4" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Col>
      </Row>

      <Divider />

      {/*  Tabla de flujo de usuarios */}
      <Table dataSource={userFlowData} columns={columnsUserFlow} pagination={{ pageSize: 5 }} />
    </Card>
  </Col>
);
