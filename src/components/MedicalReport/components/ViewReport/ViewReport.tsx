import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  Row,
  Table,
  Typography,
  Descriptions,
  Avatar,
  Checkbox,
} from "antd";
import dayjs from "dayjs";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useGetClinicalEvolutions } from "../../../../hooks/useGetClinicalEvolutions/useGetClinicalEvolutions";
import { useGetMedicalReport } from "../../../../hooks/useGetMedicalReport/useGetMedicalReport";
import { useGetUserById } from "../../../../hooks/useGetUserById/useGetUserById";
import { useGetUserMedicalRecord } from "../../../../hooks/useGetUserMedicalRecord/useGetUserMedicalRecord";
import patientImage from "../../../assets/Patients/patient1.jpg";

const { Title, Text } = Typography;

export const ViewReport: React.FC = () => {
  const { id, reportId } = useParams();

  const userQuery = useGetUserById(id);
  const recordQuery = useGetUserMedicalRecord(id);
  const reportQuery = useGetMedicalReport(reportId);
  const evolutionsQuery = useGetClinicalEvolutions(reportId);
  const user = userQuery.data?.data.data;
  const record = recordQuery.data?.data.data;
  const report = reportQuery.data?.data.data;
  const evolutions = evolutionsQuery.data?.data.data;

  const navigate = useNavigate();

  // Recomendaciones: usar el campo real si existe, si no, placeholder
  const recomendaciones = report?.recomendaciones
    ? report.recomendaciones.split(/\n|;/).filter(Boolean)
    : [
        "No hay recomendaciones registradas para este reporte clínico."
      ];

  // Encabezado de reporte clínico
  const numeroReporte = report?.id_reporteclinico || reportId || "001";
  const fechaReporte = report?.fecha_registro
    ? dayjs(report.fecha_registro).format("DD-MM-YYYY")
    : dayjs().format("DD-MM-YYYY");
  const profesional = report?.profesional
    ? `${report.profesional.nombres} ${report.profesional.apellidos}`
    : "Nombre del profesional";
  const encabezadoReporte = `Reporte clínico - ${numeroReporte} ${fechaReporte} - Realizado por: ${profesional}`;

  // Exploración física: usar campos reales de MedicalReport
  const exploracion = {
    peso: report?.peso !== undefined ? `${report.peso} kg` : "-",
    presion: report?.presion_arterial !== undefined ? `${report.presion_arterial} mmHg` : "-",
    frecuencia: report?.Frecuencia_cardiaca !== undefined ? `${report.Frecuencia_cardiaca} lpm` : "-",
    temperatura: report?.temperatura_corporal !== undefined ? `${report.temperatura_corporal}°C` : "-",
    pulsioximetria: report?.saturacionOxigeno !== undefined ? `${report.saturacionOxigeno}%` : "-", // Si no existe, dejar "-"
  };

  // Columnas para la tabla de evolución clínica
  const columns = [
    {
      title: <Checkbox disabled />, // Checkbox en el header
      dataIndex: "checkbox",
      key: "checkbox",
      render: () => <Checkbox />,
      width: 40,
    },
    {
      title: "Profesional",
      dataIndex: "profesional",
      key: "profesional",
      render: (_: any, record: any) => `${record.profesional?.nombres ?? ""} ${record.profesional?.apellidos ?? ""}`,
    },
    {
      title: "Tipo Reporte",
      dataIndex: "tipo_report",
      key: "tipo_report",
    },
    {
      title: "Fecha",
      dataIndex: "fecha_evolucion",
      key: "fecha_evolucion",
      render: (_: any, record: any) => record.fecha_evolucion ? dayjs(record.fecha_evolucion).format("DD-MM-YYYY") : "",
    },
    {
      title: "Registro de tratamientos",
      dataIndex: "treatments",
      key: "treatments",
      render: (_: any, record: any) => {
        // No existe campo treatments en ClinicalEvolution, dejar como "No" o adaptar si se agrega
        return (
          <span>
            {"No"} |
            <a href="#" style={{ color: '#9957C2', marginLeft: 4 }}>Ver</a>
          </span>
        );
      },
    },
    {
      title: "Acciones",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, record: any) => (
        <span>
          <a style={{ marginRight: 8, color: '#9957C2' }} href="#">Ver</a>
          <a style={{ color: '#9957C2' }} href="#">Editar</a>
        </span>
      ),
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", padding: 24 }}>
      {/* Breadcrumbs y título del usuario */}
      <div style={{ maxWidth: 1214, margin: "0 auto 16px 0", paddingLeft: 24, paddingRight: 24 }}>
        <div className="breadcrumbs" style={{ fontSize: 14, color: "#8C8C8C", marginBottom: 20 }}>
          <Link to="/inicio">Inicio</Link> /{" "}
          <Link to="/usuarios">Usuarios</Link> /{" "}
          <Link to={`/usuarios/${id}/detalles`}>{user?.nombres} {user?.apellidos}</Link> /{" "}
          <span className="current" style={{ color: "#222", fontWeight: 500 }}>Vista detalle reporte clínico</span>
        </div>
        <h1 className="page-title" style={{
          fontSize: 20,
          fontWeight: 500,
          color: "#222",
          margin: "0 0 12px 0",
          textTransform: "capitalize",
          lineHeight: "20px"
        }}>
          {user?.nombres} {user?.apellidos}
        </h1>
      </div>
      <Card className="main-frame" style={{ border: "none", backgroundColor: "transparent" }}>
        <Card className="inner-frame" style={{ margin: "auto 16px auto", borderRadius: "8px", boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)", backgroundColor: "#fff" }}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card className="card-legacy" style={{ marginBottom: "16px", padding: "16px 24px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
                <Row align="middle" gutter={24}>
                  <Col>
                    <Avatar src={patientImage} size={96} />
                  </Col>
                  <Col flex="auto">
                    <Title level={5} style={{ margin: 0, fontWeight: 600 }}>{user?.nombres} {user?.apellidos}</Title>
                    <Descriptions
                      column={3}
                      size="small"
                      labelStyle={{ fontWeight: 500, color: "#495057", fontSize: 14 }}
                      contentStyle={{ color: "#333333", fontSize: 14 }}
                      style={{ width: "100%" }}
                    >
                      <Descriptions.Item label="Documento">{user?.n_documento}</Descriptions.Item>
                      <Descriptions.Item label="Edad">{user?.fecha_nacimiento ? dayjs().diff(dayjs(user?.fecha_nacimiento), "years") + " años" : "-"}</Descriptions.Item>
                      <Descriptions.Item label="Género">{user?.genero}</Descriptions.Item>
                      <Descriptions.Item label="Dirección">{user?.direccion}</Descriptions.Item>
                      <Descriptions.Item label="Teléfono">{user?.telefono}</Descriptions.Item>
                      <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
                      <Descriptions.Item label="Tipo de Sangre">{record?.tipo_sangre}</Descriptions.Item>
                      <Descriptions.Item label="Estado Civil">{user?.estado_civil}</Descriptions.Item>
                      <Descriptions.Item label="EPS">{record?.eps}</Descriptions.Item>
                      <Descriptions.Item label="N° Afiliación">{record?.telefono_emermedica}</Descriptions.Item> {/* No existe campo de afiliación, se deja teléfono emergencia */}
                      <Descriptions.Item label="Fecha de Ingreso">{user?.fecha_registro ? dayjs(user?.fecha_registro).format("DD-MM-YYYY") : "-"}</Descriptions.Item>
                    </Descriptions>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Segunda tarjeta: Detalles del Reporte Clínico */}
            <Col span={24}>
              <Card className="card-legacy" style={{ marginBottom: "16px", padding: "16px 24px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", backgroundColor: "#FFFFFF" }}>
                <Row justify="space-between" align="middle">
                  <Col>
                    <Title level={5} style={{ fontWeight: "bold", color: "#333333", margin: 0 }}>
                      {encabezadoReporte}
                    </Title>
                  </Col>
                  <Col>
                    <Button type="text" icon={<EditOutlined />} />
                    <Button type="text" icon={<DeleteOutlined />} />
                  </Col>
                </Row>
                <Divider style={{ margin: "12px 0" }} />
                <Row gutter={32}>
                  <Col span={12}>
                    <Descriptions
                      column={1}
                      size="small"
                      labelStyle={{ fontWeight: 500, color: "#495057", fontSize: 14 }}
                      contentStyle={{ color: "#333333", fontSize: 14 }}
                      style={{ width: "100%" }}
                    >
                      <Descriptions.Item label="Tipo de Reporte">{report?.tipo_reporte}</Descriptions.Item>
                      <Descriptions.Item label="Motivo de Consulta">{report?.motivo_consulta}</Descriptions.Item>
                    </Descriptions>
                  </Col>
                  <Col span={12}>
                    <Descriptions
                      column={1}
                      size="small"
                      labelStyle={{ fontWeight: 500, color: "#495057", fontSize: 14 }}
                      contentStyle={{ color: "#333333", fontSize: 14 }}
                      style={{ width: "100%" }}
                    >
                      <Descriptions.Item label="Exploración física">
                        <div>
                          <div>Peso: {exploracion.peso}</div>
                          <div>Presión arterial: {exploracion.presion}</div>
                          <div>Frecuencia cardíaca: {exploracion.frecuencia}</div>
                          <div>Temperatura corporal: {exploracion.temperatura}</div>
                          <div>Pulsioximetría: {exploracion.pulsioximetria}</div>
                        </div>
                      </Descriptions.Item>
                    </Descriptions>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Descriptions
                      column={1}
                      size="small"
                      labelStyle={{ fontWeight: 500, color: "#495057", fontSize: 14 }}
                      contentStyle={{ color: "#333333", fontSize: 14 }}
                      style={{ width: "100%" }}
                    >
                      <Descriptions.Item label="Diagnóstico">{report?.diagnostico}</Descriptions.Item>
                      <Descriptions.Item label="Observaciones">{report?.observaciones}</Descriptions.Item>
                      <Descriptions.Item label="Remisión">{report?.remision}</Descriptions.Item>
                    </Descriptions>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Tercera tarjeta: Tratamiento y recomendaciones */}
            <Col span={24}>
              <Card className="card-legacy" style={{ marginBottom: "16px", padding: "16px 24px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", backgroundColor: "#FFFFFF" }}>
                <Title level={5} style={{ fontWeight: "bold", color: "#333333" }}>
                  Tratamiento y recomendaciones
                </Title>
                <Divider style={{ margin: "12px 0" }} />
                <Row>
                  <Col span={6} style={{ display: "flex", alignItems: "flex-start" }}>
                    <Title level={4} style={{ fontWeight: "bold", fontSize: "16px", color: "#495057" }}>
                      Recomendaciones
                    </Title>
                  </Col>
                  <Col span={18}>
                    <ul style={{ paddingLeft: "20px", color: "#333333", fontSize: "14px", lineHeight: "1.6" }}>
                      {recomendaciones.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Cuarta tarjeta: Reportes de Evolución Clínica */}
            <Col span={24}>
              <Card className="card-legacy" style={{ marginBottom: "16px", padding: "16px 24px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", backgroundColor: "#FFFFFF" }}>
                <Row justify="space-between" align="middle">
                  <Col>
                    <Title level={5} style={{ fontWeight: "bold", color: "#333333" }}>
                      Reportes de Evolución Clínica
                    </Title>
                  </Col>
                  <Col>
                    <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => navigate(`/usuarios/${id}/reportes/${reportId}/detalles/nuevo-reporte-evolucion`)}>
                      Agregar
                    </Button>
                  </Col>
                </Row>
                <Divider style={{ margin: "12px 0" }} />
                <Table
                  rowKey="id_TipoReporte"
                  columns={columns}
                  dataSource={evolutions}
                  pagination={false}
                  locale={{ emptyText: "No hay reportes clínicos registrados" }}
                  style={{ marginBottom: 0 }}
                />
              </Card>
            </Col>
          </Row>
        </Card>
      </Card>
    </div>
  );
};
