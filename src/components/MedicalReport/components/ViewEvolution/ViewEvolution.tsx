import { Button, Card, Col, Divider, Row, Typography, Avatar } from "antd";
import dayjs from "dayjs";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { useGetClinicalEvolution } from "../../../../hooks/useGetClinicalEvolution/useGetClinicalEvolution";
import { useGetUserById } from "../../../../hooks/useGetUserById/useGetUserById";
import { useGetMedicalReport } from "../../../../hooks/useGetMedicalReport/useGetMedicalReport";
import { useGetUserMedicalRecord } from "../../../../hooks/useGetUserMedicalRecord/useGetUserMedicalRecord";
import patientImage from "../../../assets/Patients/patient1.jpg";

const { Title, Text } = Typography;

export const ViewEvolution: React.FC = () => {
  const { id, reportId, evolutionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Detect if we're in home visit context
  const isHomeVisit = location.pathname.includes('/visitas-domiciliarias/');

  const { data: evolutionData, isLoading: evolutionLoading } = useGetClinicalEvolution(evolutionId);
  const { data: userData } = useGetUserById(id);
  const { data: reportData } = useGetMedicalReport(reportId);
  const { data: medicalRecordData } = useGetUserMedicalRecord(id);

  const evolution = evolutionData?.data?.data;
  const user = userData?.data?.data;
  const report = reportData?.data?.data;
  const medicalRecord = medicalRecordData?.data?.data;

  const getDetailsPath = () => {
    return isHomeVisit 
      ? `/visitas-domiciliarias/usuarios/${id}/detalles`
      : `/usuarios/${id}/detalles`;
  };

  const getReportDetailsPath = () => {
    return isHomeVisit 
      ? `/visitas-domiciliarias/usuarios/${id}/reportes/${reportId}/detalles`
      : `/usuarios/${id}/reportes/${reportId}/detalles`;
  };

  const getEditEvolutionPath = () => {
    return isHomeVisit 
      ? `/visitas-domiciliarias/usuarios/${id}/reportes/${reportId}/detalles/nuevo-reporte-evolucion/${evolutionId}`
      : `/usuarios/${id}/reportes/${reportId}/detalles/nuevo-reporte-evolucion/${evolutionId}`;
  };

  if (evolutionLoading) {
    return <Card loading={true} />;
  }

  if (!evolution) {
    return <Card>Evolución clínica no encontrada</Card>;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", padding: 24 }}>
      <div style={{ maxWidth: 1214, margin: "0 auto 24px 0", paddingLeft: 32, paddingRight: 32 }}>
        <div className="breadcrumbs" style={{ fontSize: 14, color: "#8C8C8C", marginBottom: 24 }}>
          <Link to="/inicio">Inicio</Link> /{" "}
          <Link to={isHomeVisit ? "/visitas-domiciliarias/usuarios" : "/usuarios"}>
            {isHomeVisit ? "Visitas Domiciliarias" : "Usuarios"}
          </Link> /{" "}
          <Link to={getDetailsPath()}>{user?.nombres} {user?.apellidos}</Link> /{" "}
          <Link to={getReportDetailsPath()}>Detalle reporte clínico</Link> /{" "}
          <span className="current" style={{ color: "#222", fontWeight: 500 }}>
            Ver reporte de evolución
          </span>
        </div>
        <h1 className="page-title" style={{ fontSize: 20, fontWeight: 500, color: "#222", margin: "0 0 12px 0" }}>
          Ver reporte de evolución clínica
        </h1>
      </div>
      {/* Framer principal */}
      <Card className="main-frame" style={{ width: "100%", margin: "0 auto", borderRadius: 8, background: "#fff", padding: 0, border: "none" }}>
        {/* Tarjeta de información del paciente */}
        <Card style={{ width: "100%", margin: "24px 0 24px 0", borderRadius: 8, padding: "24px 32px" }} bordered={false}>
          <Row align="middle" gutter={32}>
            <Col>
              <Avatar src={patientImage} size={80} />
            </Col>
            <Col flex="auto">
              <Title level={5} style={{ margin: 0, fontWeight: 600 }}>{user?.nombres} {user?.apellidos}</Title>
              <Text strong>Documento:</Text> {user?.n_documento} &nbsp;|
              <Text strong> Género:</Text> {user?.genero} &nbsp;|
              <Text strong> Edad:</Text> {user?.fecha_nacimiento ? dayjs().diff(dayjs(user?.fecha_nacimiento), "years") + " años" : "-"} &nbsp;|
              <Text strong> Estado Civil:</Text> {user?.estado_civil}
              <br />
              <Text strong>Dirección:</Text> {user?.direccion} &nbsp;|
              <Text strong>Teléfono:</Text> {user?.telefono} &nbsp;|
              <Text strong>Email:</Text> {user?.email}
            </Col>
          </Row>
        </Card>
        {/* Tarjeta de información del reporte clínico asociado */}
        <Card style={{ width: "100%", margin: "0 0 24px 0", borderRadius: 8, padding: "24px 32px" }} bordered={false}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={5} style={{ fontWeight: "bold", color: "#333333", margin: 0, fontSize: 20, letterSpacing: 0.2 }}>Asociado a: Reporte clínico - {report?.id_reporteclinico || reportId} {report?.fecha_registro ? dayjs(report.fecha_registro).format("DD-MM-YYYY") : ""} - Realizado por: {report?.profesional ? `${report.profesional.nombres} ${report.profesional.apellidos}` : ""}</Title>
            </Col>
          </Row>
          <Divider style={{ margin: "16px 0" }} />
          <Row gutter={32}>
            <Col span={8}><Text strong>Motivo de consulta:</Text><br />{report?.motivo_consulta || "Agregar motivo de consulta"}</Col>
            <Col span={8}><Text strong>Diagnóstico:</Text><br />{medicalRecord?.diagnosticos || "-"}</Col>
            <Col span={8}><Text strong>Remisión:</Text><br />{report?.remision || "-"}</Col>
          </Row>
          <Row style={{ marginTop: 12 }}>
            <Col span={24}><Text strong>Observaciones:</Text> {report?.observaciones || "Observaciones internas Datos del diagnóstico"}</Col>
          </Row>
        </Card>
        {/* Sección de datos de evolución en solo lectura */}
        <Card style={{ width: "100%", margin: "0 0 24px 0", borderRadius: 8, padding: "24px 32px" }} bordered={false}>
          <Title level={5} style={{ fontWeight: "bold", color: "#333333", marginBottom: 0, fontSize: 18, letterSpacing: 0.1 }}>Datos del reporte de evolución</Title>
          <Divider style={{ margin: "16px 0" }} />
          <Row gutter={32}>
            <Col span={12}>
              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ display: "block", marginBottom: 8 }}>Profesional</Text>
                <Text>{evolution.profesional?.nombres} {evolution.profesional?.apellidos}</Text>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ display: "block", marginBottom: 8 }}>Tipo de reporte</Text>
                <Text>{evolution.tipo_report}</Text>
              </div>
            </Col>
          </Row>
          <Row gutter={32}>
            <Col span={12}>
              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ display: "block", marginBottom: 8 }}>Fecha de registro</Text>
                <Text>{evolution.fecha_evolucion ? dayjs(evolution.fecha_evolucion).format("DD-MM-YYYY") : "-"}</Text>
              </div>
            </Col>
            <Col span={24}>
              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ display: "block", marginBottom: 8 }}>Observación</Text>
                <Text style={{ whiteSpace: "pre-wrap" }}>{evolution.observacion_evolucion}</Text>
              </div>
            </Col>
          </Row>
          <Row justify="end" style={{ marginTop: 24 }}>
            <Button style={{ marginRight: 12 }} className="main-button-white" onClick={() => navigate(getReportDetailsPath())}>
              Volver
            </Button>
            <Button type="primary" onClick={() => navigate(getEditEvolutionPath())}>
              Editar evolución
            </Button>
          </Row>
        </Card>
      </Card>
    </div>
  );
}; 