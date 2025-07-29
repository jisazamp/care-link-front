import React, { useCallback, useEffect, useState } from "react";
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

  // Debug: Log de datos recibidos (solo en desarrollo)
  if (homeVisitsData?.data.data && process.env.NODE_ENV === "development") {
    console.log(
      "🔍 HomeVisitsList - Total de visitas:",
      homeVisitsData.data.data.length,
    );
    const estados = homeVisitsData.data.data.reduce((acc: any, v: any) => {
      acc[v.estado_visita] = (acc[v.estado_visita] || 0) + 1;
      return acc;
    }, {});
    console.log("🔍 HomeVisitsList - Estados de visitas:", estados);
  }

  // Estados para los filtros
  const [filters, setFilters] = useState({
    estado: undefined,
    tipoVisitas: "todas", // Cambiado de "futuras" a "todas" para mostrar todas las visitas por defecto
    fecha: null,
    paciente: "",
  });

  // Estado para los datos filtrados
  const [filteredData, setFilteredData] = useState<any[]>([]);

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
      render: (text: string) => (
        <div style={{ fontWeight: 500 }}>{text || "Sin paciente"}</div>
      ),
    },
    {
      title: "Fecha y Hora",
      key: "fecha_hora",
      render: (record: any) => {
        if (!record.fecha_visita || !record.hora_visita) {
          return (
            <div style={{ color: "#faad14", fontStyle: "italic" }}>
              Pendiente de programación
            </div>
          );
        }
        return (
          <div>
            <div style={{ fontWeight: 500 }}>
              {dayjs(record.fecha_visita).format("DD/MM/YYYY")}
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {dayjs(record.hora_visita, "HH:mm:ss").format("HH:mm")}
            </div>
          </div>
        );
      },
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
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
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
            onClick={() =>
              navigate(
                `/visitas-domiciliarias/usuarios/${record.id_usuario}/detalles`,
              )
            }
          >
            Ver Detalles
          </Button>
        </Space>
      ),
    },
  ];

  const calculateStats = () => {
    if (!homeVisitsData?.data.data)
      return { total: 0, pendientes: 0, realizadas: 0, canceladas: 0 };

    // Usar datos filtrados para las estadísticas
    const visitas =
      filteredData.length > 0 ? filteredData : homeVisitsData.data.data;
    return {
      total: visitas.length,
      pendientes: visitas.filter((v: any) => v.estado_visita === "PENDIENTE")
        .length,
      realizadas: visitas.filter((v: any) => v.estado_visita === "REALIZADA")
        .length,
      canceladas: visitas.filter((v: any) => v.estado_visita === "CANCELADA")
        .length,
    };
  };

  // Función para aplicar filtros
  const applyFilters = useCallback(() => {
    if (!homeVisitsData?.data.data) {
      setFilteredData([]);
      return;
    }

    let filtered = [...homeVisitsData.data.data];

    // Filtrar por estado
    if (filters.estado) {
      filtered = filtered.filter(
        (visita: any) => visita.estado_visita === filters.estado,
      );
    }

    // Filtrar por tipo de visitas (futuras o todas)
    if (filters.tipoVisitas === "futuras") {
      const now = dayjs();
      filtered = filtered.filter((visita: any) => {
        if (!visita.fecha_visita || !visita.hora_visita) return false;
        const visitaDateTime = dayjs(
          `${visita.fecha_visita} ${visita.hora_visita}`,
        );
        return visitaDateTime.isAfter(now);
      });
    }

    // Filtrar por fecha
    if (filters.fecha) {
      const filterDate = dayjs(filters.fecha).format("YYYY-MM-DD");
      filtered = filtered.filter((visita: any) => {
        if (!visita.fecha_visita) return false;
        return dayjs(visita.fecha_visita).format("YYYY-MM-DD") === filterDate;
      });
    }

    // Filtrar por paciente
    if (filters.paciente) {
      filtered = filtered.filter((visita: any) => {
        const pacienteNombre = visita.paciente_nombre?.toLowerCase() || "";
        return pacienteNombre.includes(filters.paciente.toLowerCase());
      });
    }

    setFilteredData(filtered);
  }, [homeVisitsData, filters]);

  // Aplicar filtros cuando cambien los datos o filtros
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Función para manejar cambios en filtros
  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Función para limpiar filtros
  const clearFilters = () => {
    setFilters({
      estado: undefined,
      tipoVisitas: "todas", // Cambiado de "futuras" a "todas"
      fecha: null,
      paciente: "",
    });
  };

  const stats = calculateStats();

  if (error) {
    message.error("Error al cargar las visitas domiciliarias");
  }

  return (
    <div style={{ padding: "24px" }}>
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col span={24}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Title level={3}>Visitas Domiciliarias</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/visitas-domiciliarias/usuarios")}
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
        {/* Indicador de filtros activos */}
        {(filters.estado || filters.fecha || filters.paciente) && (
          <div
            style={{
              marginBottom: "16px",
              padding: "8px 12px",
              backgroundColor: "#f0f9ff",
              border: "1px solid #91d5ff",
              borderRadius: "6px",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#1890ff",
                marginBottom: "4px",
              }}
            >
              🔍 Filtros activos:
            </div>
            <div style={{ fontSize: "11px", color: "#666" }}>
              {filters.estado && (
                <span style={{ marginRight: "8px" }}>
                  Estado: {filters.estado}
                </span>
              )}
              {filters.fecha && (
                <span style={{ marginRight: "8px" }}>
                  Fecha: {dayjs(filters.fecha).format("DD/MM/YYYY")}
                </span>
              )}
              {filters.paciente && (
                <span style={{ marginRight: "8px" }}>
                  Paciente: {filters.paciente}
                </span>
              )}
              <span style={{ marginRight: "8px" }}>
                Tipo:{" "}
                {filters.tipoVisitas === "futuras"
                  ? "Solo futuras"
                  : "Todas las visitas"}
              </span>
            </div>
          </div>
        )}
        <Row gutter={16}>
          <Col span={4}>
            <Select
              placeholder="Filtrar por estado"
              style={{ width: "100%" }}
              allowClear
              value={filters.estado}
              onChange={(value) => handleFilterChange("estado", value)}
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
              value={filters.tipoVisitas}
              onChange={(value) => handleFilterChange("tipoVisitas", value)}
            >
              <Option value="futuras">Solo futuras</Option>
              <Option value="todas">Todas las visitas</Option>
            </Select>
          </Col>
          <Col span={4}>
            <DatePicker
              placeholder="Filtrar por fecha"
              style={{ width: "100%" }}
              value={filters.fecha}
              onChange={(value) => handleFilterChange("fecha", value)}
            />
          </Col>
          <Col span={6}>
            <Input
              placeholder="Buscar por paciente"
              prefix={<SearchOutlined />}
              value={filters.paciente}
              onChange={(e) => handleFilterChange("paciente", e.target.value)}
            />
          </Col>
          <Col span={3}>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={applyFilters}
            >
              Filtrar
            </Button>
          </Col>
          <Col span={3}>
            <Button onClick={clearFilters}>Limpiar</Button>
          </Col>
        </Row>
      </Card>

      {/* Tabla */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
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
          locale={{
            emptyText: (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div
                  style={{
                    fontSize: "48px",
                    color: "#d9d9d9",
                    marginBottom: "16px",
                  }}
                >
                  📋
                </div>
                <div style={{ color: "#666", marginBottom: "8px" }}>
                  No hay visitas que coincidan con los filtros
                </div>
                <div style={{ fontSize: "12px", color: "#999" }}>
                  Intenta ajustar los filtros o crear una nueva visita
                </div>
              </div>
            ),
          }}
        />
      </Card>
    </div>
  );
};
