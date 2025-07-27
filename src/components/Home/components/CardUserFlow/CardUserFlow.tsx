import {
  CaretUpOutlined,
  EllipsisOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Card,
  Col,
  Divider,
  Row,
  Space,
  Table,
  Tooltip,
  Typography,
  Spin,
} from "antd";
import {
  CartesianGrid,
  Tooltip as ChartTooltip,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { useGetUserFlow } from "../../../../hooks/useGetUserFlow/useGetUserFlow";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

// Datos ficticios para los gráficos (se mantienen para el diseño visual)
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

export const CardUserFlow = () => {
  const { data: userFlowData, isLoading, error } = useGetUserFlow();
  const navigate = useNavigate();

  // Columnas de la tabla
  const columnsUserFlow = [
    { 
      title: "Usuarios", 
      dataIndex: "nombre_completo", 
      key: "nombre_completo" 
    },
    {
      title: "Contrato",
      dataIndex: "id_contrato",
      key: "id_contrato",
      render: (id_contrato: number, record: any) => (
        <a 
          style={{ color: "#7f34b4" }} 
          onClick={() => navigate(`/usuarios/${record.id_usuario}/contrato/${id_contrato}`)}
        >
          Ver
        </a>
      ),
    },
    {
      title: "Visitas del mes",
      dataIndex: "visitas_mes",
      key: "visitas_mes",
      render: (visitas: number) => (
        <Space>
          <Badge color="purple" />
          {visitas}
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Col span={6}>
        <Card
          title="Flujo de usuarios"
          extra={<EllipsisOutlined />}
          className="user-flow-card"
          style={{ width: "100%", minWidth: 280 }}
        >
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Spin size="large" />
          </div>
        </Card>
      </Col>
    );
  }

  if (error) {
    return (
      <Col span={6}>
        <Card
          title="Flujo de usuarios"
          extra={<EllipsisOutlined />}
          className="user-flow-card"
          style={{ width: "100%", minWidth: 280 }}
        >
          <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
            Error al cargar los datos
          </div>
        </Card>
      </Col>
    );
  }

  return (
    <Col span={6}>
      <Card
        title="Flujo de usuarios"
        extra={<EllipsisOutlined />}
        className="user-flow-card"
        style={{ width: "100%", minWidth: 280 }}
      >
        {/* Sección de Estadísticas */}
        <Row gutter={16} justify="space-between">
          <Col span={12}>
            <Space direction="vertical">
              <Text strong>Usuarios del mes</Text>
              <Tooltip title="Número de usuarios registrados en el mes">
                <InfoCircleOutlined style={{ marginLeft: 5, color: "#aaa" }} />
              </Tooltip>
              <Title level={2}>{userFlowData?.stats.usuarios_mes || 0}</Title>
              <Space>
                <CaretUpOutlined style={{ color: "green" }} />
                <Text type="success">{userFlowData?.stats.usuarios_mes_trend || 0}</Text>
              </Space>
            </Space>
            <ResponsiveContainer width="100%" height={50}>
              <LineChart data={userChartData}>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <CartesianGrid strokeDasharray="3 3" />
                <ChartTooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#7f34b4"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Col>

          <Col span={12}>
            <Space direction="vertical">
              <Text strong>Tasa de asistencia</Text>
              <Tooltip title="Porcentaje de asistencia general en el mes">
                <InfoCircleOutlined style={{ marginLeft: 5, color: "#aaa" }} />
              </Tooltip>
              <Title level={2}>{userFlowData?.stats.tasa_asistencia || 0}%</Title>
              <Space>
                <CaretUpOutlined style={{ color: "green" }} />
                <Text type="success">{userFlowData?.stats.tasa_asistencia_trend || 0}</Text>
              </Space>
            </Space>
            <ResponsiveContainer width="100%" height={50}>
              <LineChart data={attendanceChartData}>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <CartesianGrid strokeDasharray="3 3" />
                <ChartTooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#7f34b4"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Col>
        </Row>

        <Divider />

        {/* Tabla de flujo de usuarios */}
        <Table
          dataSource={userFlowData?.users || []}
          columns={columnsUserFlow}
          pagination={{ pageSize: 5 }}
          rowKey="id_usuario"
        />
      </Card>
    </Col>
  );
};
