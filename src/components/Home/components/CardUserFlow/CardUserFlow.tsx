import {
  CaretUpOutlined,
  CaretDownOutlined,
  EllipsisOutlined,
  InfoCircleOutlined,
  UserAddOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  DollarOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  Card,
  Col,
  Divider,
  Row,
  Space,
  Table,
  Tooltip,
  Typography,
  Spin,
  Tag,
  Alert,
  Progress,
  Button,
  Avatar,
  Statistic,
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

const { Text } = Typography;

// Datos ficticios para los gráficos mejorados
const userChartData = [
  { name: "Lun", value: 80, target: 75 },
  { name: "Mar", value: 90, target: 75 },
  { name: "Mié", value: 70, target: 75 },
  { name: "Jue", value: 85, target: 75 },
  { name: "Vie", value: 100, target: 75 },
];

const attendanceChartData = [
  { name: "Lun", value: 75, target: 80 },
  { name: "Mar", value: 85, target: 80 },
  { name: "Mié", value: 65, target: 80 },
  { name: "Jue", value: 90, target: 80 },
  { name: "Vie", value: 95, target: 80 },
];

export const CardUserFlow = () => {
  const { data: userFlowData, isLoading, error } = useGetUserFlow();
  const navigate = useNavigate();

  // Columnas de la tabla mejoradas con tamaños aumentados y centrado
  const columnsUserFlow = [
    {
      title: "Usuarios",
      dataIndex: "nombre_completo",
      key: "nombre_completo",
      align: "center" as const,
      render: (nombre: string, record: any) => (
        <div style={{ textAlign: "center" }}>
          <Space direction="vertical" size="small">
            <Avatar size="default" style={{ backgroundColor: "#7f34b4" }}>
              {nombre.charAt(0)}
            </Avatar>
            <div>
              <Text strong style={{ fontSize: 14 }}>
                {nombre}
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {record.tipo_usuario}
              </Text>
            </div>
          </Space>
        </div>
      ),
    },
    {
      title: "Contrato",
      dataIndex: "estado_contrato",
      key: "estado_contrato",
      align: "center" as const,
      render: (estado: string, record: any) => (
        <div style={{ textAlign: "center" }}>
          <Space direction="vertical" size="small">
            <Tag 
              color={
                estado === "ACTIVO" ? "success" :
                estado === "PENDIENTE" ? "processing" :
                estado === "VENCIDO" ? "error" : "default"
              }
              style={{ fontSize: 12 }}
            >
              {estado}
            </Tag>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.valor_total_contrato?.toLocaleString()}
            </Text>
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/usuarios/${record.id_usuario}/contrato/${record.id_contrato}`)}
              style={{ padding: 0, height: 'auto', fontSize: 12 }}
            >
              Ver
            </Button>
          </Space>
        </div>
      ),
    },
    {
      title: "Visitas del mes",
      dataIndex: "visitas_mes",
      key: "visitas_mes",
      align: "center" as const,
      render: (visitas: number, record: any) => (
        <div style={{ textAlign: "center" }}>
          <Space direction="vertical" size="small">
            <div style={{ textAlign: "center", marginBottom: 4 }}>
              <Text strong style={{ fontSize: 16, color: "#7f34b4" }}>{visitas}</Text>
            </div>
            <div style={{ fontSize: 12 }}>
              <Text type="success">{record.visitas_realizadas_mes}</Text>
              <br />
              <Text type="warning">{record.visitas_pendientes_mes}</Text>
              <br />
              <Text type="danger">{record.visitas_canceladas_mes}</Text>
            </div>
            <Progress
              percent={record.tasa_asistencia_usuario}
              size="small"
              showInfo={false}
              strokeColor={
                record.tasa_asistencia_usuario >= 80 ? "#52c41a" :
                record.tasa_asistencia_usuario >= 60 ? "#faad14" : "#ff4d4f"
              }
            />
          </Space>
        </div>
      ),
    },

  ];

  if (isLoading) {
    return (
      <Card
        title={
          <Space>
            <UserAddOutlined style={{ color: "#7f34b4" }} />
            <span>Flujo de usuarios</span>
          </Space>
        }
        extra={<EllipsisOutlined />}
        className="user-flow-card"
        style={{ width: "100%", minWidth: 280 }}
      >
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        title={
          <Space>
            <UserAddOutlined style={{ color: "#7f34b4" }} />
            <span>Flujo de usuarios</span>
          </Space>
        }
        extra={<EllipsisOutlined />}
        className="user-flow-card"
        style={{ width: "100%", minWidth: 280 }}
      >
        <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
          <ExclamationCircleOutlined style={{ fontSize: 24, marginBottom: 8 }} />
          <br />
          Error al cargar los datos
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={
        <Space>
          <UserAddOutlined style={{ color: "#7f34b4" }} />
          <span>Flujo de usuarios</span>
        </Space>
      }
      extra={<EllipsisOutlined />}
      className="user-flow-card"
      style={{ width: "100%", minWidth: 280 }}
    >
        {/* Alertas y recomendaciones */}
        {userFlowData?.stats.alertas && userFlowData.stats.alertas.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            {userFlowData.stats.alertas.map((alerta, index) => (
              <Alert
                key={index}
                message={alerta}
                type="warning"
                showIcon
                style={{ marginBottom: 8, fontSize: 11 }}
              />
            ))}
          </div>
        )}

        {/* Sección de Estadísticas Mejoradas */}
        <Row gutter={16} justify="space-between" style={{ marginBottom: 16 }}>
          <Col span={12}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Text strong style={{ fontSize: 12 }}>Usuarios del mes</Text>
                <Tooltip title="Número de usuarios activos en el mes actual">
                  <InfoCircleOutlined style={{ color: "#aaa", fontSize: 12 }} />
                </Tooltip>
              </div>
              
              <Statistic
                value={userFlowData?.stats.usuarios_mes || 0}
                valueStyle={{ color: "#7f34b4", fontSize: 20 }}
                suffix={
                  <Space size="small">
                    {userFlowData?.stats.usuarios_mes_trend && userFlowData.stats.usuarios_mes_trend > 0 ? (
                      <CaretUpOutlined style={{ color: "green" }} />
                    ) : (
                      <CaretDownOutlined style={{ color: "red" }} />
                    )}
                    <Text 
                      type={userFlowData?.stats.usuarios_mes_trend && userFlowData.stats.usuarios_mes_trend > 0 ? "success" : "danger"}
                      style={{ fontSize: 10 }}
                    >
                      {userFlowData?.stats.usuarios_mes_trend || 0}%
                    </Text>
                  </Space>
                }
              />
              
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
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#d9d9d9"
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Space>
          </Col>

          <Col span={12}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Text strong style={{ fontSize: 12 }}>Tasa de asistencia</Text>
                <Tooltip title="Porcentaje de asistencia general en el mes">
                  <InfoCircleOutlined style={{ color: "#aaa", fontSize: 12 }} />
                </Tooltip>
              </div>
              
              <Statistic
                value={userFlowData?.stats.tasa_asistencia || 0}
                valueStyle={{ color: "#7f34b4", fontSize: 20 }}
                suffix={
                  <Space size="small">
                    {userFlowData?.stats.tasa_asistencia_trend && userFlowData.stats.tasa_asistencia_trend > 0 ? (
                      <CaretUpOutlined style={{ color: "green" }} />
                    ) : (
                      <CaretDownOutlined style={{ color: "red" }} />
                    )}
                    <Text 
                      type={userFlowData?.stats.tasa_asistencia_trend && userFlowData.stats.tasa_asistencia_trend > 0 ? "success" : "danger"}
                      style={{ fontSize: 10 }}
                    >
                      {userFlowData?.stats.tasa_asistencia_trend || 0}%
                    </Text>
                  </Space>
                }
              />
              
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
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#d9d9d9"
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Space>
          </Col>
        </Row>

        {/* Métricas adicionales */}
        <Row gutter={8} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Statistic
              title="Nuevos"
              value={userFlowData?.stats.nuevos_usuarios_mes || 0}
              valueStyle={{ fontSize: 14, color: "#52c41a" }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Activos"
              value={userFlowData?.stats.usuarios_activos_mes || 0}
              valueStyle={{ fontSize: 14, color: "#1890ff" }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Retención"
              value={userFlowData?.stats.tasa_retencion || 0}
              suffix="%"
              valueStyle={{ fontSize: 14, color: "#722ed1" }}
            />
          </Col>
        </Row>

        <Divider style={{ margin: "12px 0" }} />

        {/* Tabla de flujo de usuarios mejorada */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <Text strong style={{ fontSize: 12 }}>Usuarios recientes</Text>
            <Space size="small">
              <Tag color="success" style={{ fontSize: 10 }}>
                {userFlowData?.stats.contratos_activos || 0} activos
              </Tag>
              {userFlowData?.stats.contratos_por_vencer && userFlowData.stats.contratos_por_vencer > 0 && (
                <Tag color="warning" style={{ fontSize: 10 }}>
                  {userFlowData.stats.contratos_por_vencer} por vencer
                </Tag>
              )}
            </Space>
          </div>
        </div>
        
        <Table
          dataSource={userFlowData?.users || []}
          columns={columnsUserFlow}
          pagination={{ 
            pageSize: 5,
            size: "small",
            showSizeChanger: false,
            showQuickJumper: false,
          }}
          rowKey="id_usuario"
          size="small"
          scroll={{ y: 200 }}
          className="user-flow-table"
        />

        {/* Resumen ejecutivo */}
        <div style={{ marginTop: 12 }}>
          <Text type="secondary" style={{ fontSize: 10 }}>
            <DollarOutlined style={{ marginRight: 4 }} />
            Valor total contratos: ${userFlowData?.stats.valor_total_contratos?.toLocaleString() || 0}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: 10 }}>
            <CalendarOutlined style={{ marginRight: 4 }} />
            Promedio visitas: {userFlowData?.stats.promedio_visitas_por_usuario || 0}/usuario
          </Text>
        </div>
      </Card>
  );
};
