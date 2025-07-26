import React from "react";
import {
  Table,
  Card,
  Tag,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Statistic,
  DatePicker,
  Select,
  Input,
  message,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  CalendarOutlined,
  UserOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useGetAllHomeVisits } from "../../hooks/useGetAllHomeVisits/useGetAllHomeVisits";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;

export const HomeVisitsList: React.FC = () => {
  const navigate = useNavigate();
  const { data: homeVisitsData, isLoading, error } = useGetAllHomeVisits();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDIENTE":
        return "orange";
      case "REALIZADA":
        return "green";
      case "CANCELADA":
        return "red";
      case "REPROGRAMADA":
        return "blue";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDIENTE":
        return "Pendiente";
      case "REALIZADA":
        return "Realizada";
      case "CANCELADA":
        return "Cancelada";
      case "REPROGRAMADA":
        return "Reprogramada";
      default:
        return status;
    }
  };

  const columns = [
    {
      title: "Paciente",
      dataIndex: "paciente_nombre",
      key: "paciente_nombre",
      render: (text: string, record: any) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            ID: {record.id_usuario}
          </div>
        </div>
      ),
    },
    {
      title: "Fecha y Hora",
      key: "fecha_hora",
      render: (record: any) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {dayjs(record.fecha_visita).format("DD/MM/YYYY")}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            {dayjs(record.hora_visita, "HH:mm:ss").format("HH:mm")}
          </div>
        </div>
      ),
    },
    {
      title: "Dirección",
      dataIndex: "direccion_visita",
      key: "direccion_visita",
      render: (text: string) => (
        <div style={{ maxWidth: 200 }}>
          <EnvironmentOutlined style={{ marginRight: 4, color: "#666" }} />
          {text}
        </div>
      ),
    },
    {
      title: "Teléfono",
      dataIndex: "telefono_visita",
      key: "telefono_visita",
      render: (text: string) => (
        <div>
          <PhoneOutlined style={{ marginRight: 4, color: "#666" }} />
          {text || "No disponible"}
        </div>
      ),
    },
    {
      title: "Profesional",
      dataIndex: "profesional_asignado",
      key: "profesional_asignado",
      render: (text: string) => (
        <div>
          <UserOutlined style={{ marginRight: 4, color: "#666" }} />
          {text || "Sin asignar"}
        </div>
      ),
    },
    {
      title: "Estado",
      dataIndex: "estado_visita",
      key: "estado_visita",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: "Valor",
      dataIndex: "valor_dia",
      key: "valor_dia",
      render: (value: number) => (
        <div style={{ fontWeight: 500, color: "#52c41a" }}>
          ${value?.toLocaleString() || "0"}
        </div>
      ),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (record: any) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => navigate(`/visitas-domiciliarias/usuarios/${record.id_usuario}/detalles`)}
          >
            Ver Detalles
          </Button>
        </Space>
      ),
    },
  ];

  const calculateStats = () => {
    if (!homeVisitsData?.data.data) return { total: 0, pendientes: 0, realizadas: 0, canceladas: 0 };

    const visitas = homeVisitsData.data.data;
    return {
      total: visitas.length,
      pendientes: visitas.filter((v: any) => v.estado_visita === "PENDIENTE").length,
      realizadas: visitas.filter((v: any) => v.estado_visita === "REALIZADA").length,
      canceladas: visitas.filter((v: any) => v.estado_visita === "CANCELADA").length,
    };
  };

  const stats = calculateStats();

  if (error) {
    message.error("Error al cargar las visitas domiciliarias");
  }

  return (
    <div style={{ padding: "24px" }}>
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col span={24}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Title level={3}>Visitas Domiciliarias Programadas (Futuras)</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/visitas-domiciliarias/nueva")}
            >
              Nueva Visita
            </Button>
          </div>
        </Col>
      </Row>

      {/* Estadísticas */}
      <Row gutter={16} style={{ marginBottom: "24px" }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total de Visitas"
              value={stats.total}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Pendientes"
              value={stats.pendientes}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Realizadas"
              value={stats.realizadas}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Canceladas"
              value={stats.canceladas}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filtros */}
      <Card style={{ marginBottom: "24px" }}>
        <Row gutter={16}>
          <Col span={4}>
            <Select
              placeholder="Filtrar por estado"
              style={{ width: "100%" }}
              allowClear
            >
              <Option value="PENDIENTE">Pendiente</Option>
              <Option value="REALIZADA">Realizada</Option>
              <Option value="CANCELADA">Cancelada</Option>
              <Option value="REPROGRAMADA">Reprogramada</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Mostrar visitas"
              style={{ width: "100%" }}
              defaultValue="futuras"
            >
              <Option value="futuras">Solo futuras</Option>
              <Option value="todas">Todas las visitas</Option>
            </Select>
          </Col>
          <Col span={4}>
            <DatePicker
              placeholder="Filtrar por fecha"
              style={{ width: "100%" }}
            />
          </Col>
          <Col span={6}>
            <Input
              placeholder="Buscar por paciente"
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col span={6}>
            <Button type="primary" icon={<SearchOutlined />}>
              Filtrar
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Tabla */}
      <Card>
        <Table
          columns={columns}
          dataSource={homeVisitsData?.data.data || []}
          loading={isLoading}
          rowKey="id_visitadomiciliaria"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} de ${total} visitas`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
}; 