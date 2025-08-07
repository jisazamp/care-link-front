import { Drawer, Typography, Table, Tag, Space, Statistic, Row, Col, Card, Button, Spin } from "antd";
import { 
  UserOutlined, 
  CalendarOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ClockCircleOutlined,
  CloseOutlined,
  DownloadOutlined,
  PrinterOutlined
} from "@ant-design/icons";
import { useGetPatientAttendanceReport } from "../../../hooks/useGetPatientAttendanceReport";
import dayjs from "dayjs";

const { Text } = Typography;

interface PatientAttendanceReportProps {
  patientId: number | null;
  visible: boolean;
  onClose: () => void;
}

export const PatientAttendanceReport: React.FC<PatientAttendanceReportProps> = ({
  patientId,
  visible,
  onClose,
}) => {
  const { data: reportData, isLoading, error } = useGetPatientAttendanceReport(
    patientId || 0,
    undefined,
    undefined,
    visible && !!patientId
  );

  // 🔴 DEBUG: Agregar logs para depuración
  console.log("PatientAttendanceReport Debug:", {
    patientId,
    visible,
    isLoading,
    error,
    reportData,
    hasData: !!reportData?.data?.data,
    hasPaciente: !!(reportData?.data?.data as any)?.paciente,
    paciente: (reportData?.data?.data as any)?.paciente
  });

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "ASISTIO":
        return "success";
      case "NO_ASISTIO":
        return "error";
      case "PENDIENTE":
        return "processing";
      case "CANCELADO":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case "ASISTIO":
        return "✅ ASISTIÓ";
      case "NO_ASISTIO":
        return "❌ NO ASISTIÓ";
      case "PENDIENTE":
        return "⏳ PENDIENTE";
      case "CANCELADO":
        return "🚫 CANCELADO";
      default:
        return estado;
    }
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case "ASISTIO":
        return <CheckCircleOutlined />;
      case "NO_ASISTIO":
        return <CloseCircleOutlined />;
      case "PENDIENTE":
        return <ClockCircleOutlined />;
      default:
        return null;
    }
  };

  const columns: any[] = [
    {
      title: "FECHA",
      dataIndex: "fecha",
      key: "fecha",
      render: (fecha: string) => dayjs(fecha).format("DD/MM/YYYY"),
      sorter: (a: any, b: any) => dayjs(a.fecha).unix() - dayjs(b.fecha).unix(),
    },
    {
      title: "ESTADO",
      dataIndex: "estado_asistencia",
      key: "estado_asistencia",
      render: (estado: string) => (
        <Tag color={getStatusColor(estado)} icon={getStatusIcon(estado)}>
          {getStatusText(estado)}
        </Tag>
      ),
      filters: [
        { text: "Asistió", value: "ASISTIO" },
        { text: "No Asistió", value: "NO_ASISTIO" },
        { text: "Pendiente", value: "PENDIENTE" },
        { text: "Cancelado", value: "CANCELADO" },
      ],
      onFilter: (value: any, record: any) => record.estado_asistencia === value,
    },
    {
      title: "PROFESIONAL",
      dataIndex: "profesional_nombre",
      key: "profesional",
      render: (nombre: string, record: any) => 
        `${nombre} ${record.profesional_apellidos}`,
    },
    {
      title: "OBSERVACIONES",
      dataIndex: "observaciones",
      key: "observaciones",
      render: (observaciones: string) => observaciones || "-",
      ellipsis: true,
    },
    {
      title: "TRANSPORTE",
      dataIndex: "requiere_transporte",
      key: "transporte",
      render: (requiere: boolean) => (
        <Tag color={requiere ? "blue" : "default"}>
          {requiere ? "Sí" : "No"}
        </Tag>
      ),
    },
  ];

  const handleExport = () => {
    // Implementar exportación a PDF/Excel
    console.log("Exportar informe");
  };

  const handlePrint = () => {
    // Implementar impresión
    window.print();
  };

  if (!patientId) return null;

  if (isLoading) {
    return (
      <Drawer
        title="📊 Informe de Asistencia del Paciente"
        placement="right"
        width={800}
        open={visible}
        onClose={onClose}
        extra={
          <Button icon={<CloseOutlined />} onClick={onClose}>
            Cerrar
          </Button>
        }
      >
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
          <div style={{ marginTop: "16px" }}>
            <Text>Cargando informe de asistencia...</Text>
          </div>
        </div>
      </Drawer>
    );
  }

  if (error) {
    return (
      <Drawer
        title="📊 Informe de Asistencia del Paciente"
        placement="right"
        width={800}
        open={visible}
        onClose={onClose}
        extra={
          <Button icon={<CloseOutlined />} onClick={onClose}>
            Cerrar
          </Button>
        }
      >
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Text type="danger">
            Error al cargar el informe: {error.message}
          </Text>
        </div>
      </Drawer>
    );
  }

  // Verificar que tenemos datos válidos
  if (!(reportData?.data?.data as any)?.paciente) {
    return (
      <Drawer
        title="📊 Informe de Asistencia del Paciente"
        placement="right"
        width={800}
        open={visible}
        onClose={onClose}
        extra={
          <Button icon={<CloseOutlined />} onClick={onClose}>
            Cerrar
          </Button>
        }
      >
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Text type="warning">
            No se encontraron datos del paciente para mostrar el informe.
          </Text>
        </div>
      </Drawer>
    );
  }

  const paciente = (reportData?.data?.data as any)?.paciente;
  const estadisticas = (reportData?.data?.data as any)?.estadisticas;
  const detalles = (reportData?.data?.data as any)?.detalles || [];

  return (
    <Drawer
      title={
        <Space>
          <UserOutlined />
          <span>
            {paciente?.nombres && paciente?.apellidos
              ? `${paciente.nombres} ${paciente.apellidos}`
              : "Informe de Asistencia"
            }
          </span>
        </Space>
      }
      placement="right"
      width={800}
      onClose={onClose}
      open={visible}
      extra={
        <Space>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>
            Exportar
          </Button>
          <Button icon={<PrinterOutlined />} onClick={handlePrint}>
            Imprimir
          </Button>
          <Button icon={<CloseOutlined />} onClick={onClose}>
            Cerrar
          </Button>
        </Space>
      }
    >
      <div>
        {/* Información del Paciente */}
        <Card style={{ marginBottom: "16px" }}>
          <Row gutter={16}>
            <Col span={12}>
              <Text strong>Paciente:</Text>
              <br />
              <Text>
                {paciente?.nombres} {paciente?.apellidos}
              </Text>
              <br />
              <Text type="secondary">
                CC: {paciente?.n_documento}
              </Text>
            </Col>
            <Col span={12}>
              <Text strong>Período:</Text>
              <br />
              <Text>
                {dayjs(estadisticas?.periodo_inicio).format("DD/MM/YYYY")} - 
                {dayjs(estadisticas?.periodo_fin).format("DD/MM/YYYY")}
              </Text>
            </Col>
          </Row>
        </Card>

        {/* Estadísticas */}
        <Row gutter={16} style={{ marginBottom: "24px" }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Agendado"
                value={estadisticas?.total_agendado || 0}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Asistió"
                value={estadisticas?.total_asistio || 0}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="No Asistió"
                value={estadisticas?.total_no_asistio || 0}
                prefix={<CloseCircleOutlined />}
                valueStyle={{ color: "#ff4d4f" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Pendiente"
                value={estadisticas?.total_pendiente || 0}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Porcentaje de Asistencia */}
        <Card style={{ marginBottom: "24px" }}>
          <Row gutter={16}>
            <Col span={12}>
              <Statistic
                title="Porcentaje de Asistencia"
                value={estadisticas?.porcentaje_asistencia || 0}
                suffix="%"
                valueStyle={{
                  color: (estadisticas?.porcentaje_asistencia || 0) >= 80 
                    ? "#52c41a" 
                    : (estadisticas?.porcentaje_asistencia || 0) >= 60 
                      ? "#faad14" 
                      : "#ff4d4f"
                }}
              />
            </Col>
            <Col span={12}>
              <div style={{ textAlign: "center", paddingTop: "20px" }}>
                <Text type="secondary">
                  {estadisticas?.total_asistio || 0} de {estadisticas?.total_agendado || 0} citas
                </Text>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Tabla de Detalles */}
        <Card title="📋 Detalle por Fecha">
          <Table
            columns={columns}
            dataSource={detalles}
            rowKey="id_cronograma_paciente"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} de ${total} registros`,
            }}
            scroll={{ x: 600 }}
          />
        </Card>
      </div>
    </Drawer>
  );
};

