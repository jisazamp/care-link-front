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

  Avatar,
  Checkbox,
} from "antd";
import dayjs from "dayjs";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useGetClinicalEvolutions } from "../../../../hooks/useGetClinicalEvolutions/useGetClinicalEvolutions";
import { useGetMedicalReport } from "../../../../hooks/useGetMedicalReport/useGetMedicalReport";
import { useGetUserById } from "../../../../hooks/useGetUserById/useGetUserById";
import { useGetUserMedicalRecord } from "../../../../hooks/useGetUserMedicalRecord/useGetUserMedicalRecord";
import patientImage from "../../../assets/Patients/patient1.jpg";

const { Title } = Typography;

export const ViewReport: React.FC = () => {
  const { id, reportId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Detect if we're in home visit context
  const isHomeVisit = location.pathname.includes('/visitas-domiciliarias/');

  const userQuery = useGetUserById(id);
  const recordQuery = useGetUserMedicalRecord(id);
  const reportQuery = useGetMedicalReport(reportId);
  const evolutionsQuery = useGetClinicalEvolutions(reportId);
  const user = userQuery.data?.data.data;
  const record = recordQuery.data?.data.data;
  const report = reportQuery.data?.data.data;
  const evolutions = evolutionsQuery.data?.data.data;

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
         // No existe campo treatments en ClinicalEvolution, dejar como "No"
         return "No";
       },
     },
    {
      title: "Acciones",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, record: any) => (
        <span>
          <a style={{ marginRight: 8, color: '#9957C2' }} href="#" onClick={() => navigate(getEditReportPath())}>Ver</a>
          <a style={{ color: '#9957C2' }} href="#" onClick={() => console.log('Editar registro:', record)}>Editar</a>
        </span>
      ),
    },
  ];

  // Navigation functions based on context
  const getDetailsPath = () => {
    return isHomeVisit 
      ? `/visitas-domiciliarias/usuarios/${id}/detalles`
      : `/usuarios/${id}/detalles`;
  };

  const getEditReportPath = () => {
    return isHomeVisit 
      ? `/visitas-domiciliarias/usuarios/${id}/reportes/${reportId}`
      : `/usuarios/${id}/reportes/${reportId}`;
  };

<<<<<<< HEAD
<<<<<<< HEAD
=======
  const getNewEvolutionPath = () => {
    return isHomeVisit 
      ? `/visitas-domiciliarias/usuarios/${id}/reportes/${reportId}/detalles/nuevo-reporte-evolucion`
      : `/usuarios/${id}/reportes/${reportId}/detalles/nuevo-reporte-evolucion`;
  };

>>>>>>> dd9c3e5 (aplicaciones de navegación entre módulos de  visitas domiciliarias)
=======
>>>>>>> ca2a7c6 (Update ViewReport.tsx)
  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", padding: 24 }}>
      {/* Breadcrumbs y título del usuario */}
      <div style={{ maxWidth: 1214, margin: "0 auto 16px 0", paddingLeft: 24, paddingRight: 24 }}>
        <div className="breadcrumbs" style={{ fontSize: 14, color: "#8C8C8C", marginBottom: 20 }}>
          <Link to="/inicio">Inicio</Link> /{" "}
          <Link to={isHomeVisit ? "/visitas-domiciliarias/usuarios" : "/usuarios"}>
            {isHomeVisit ? "Visitas Domiciliarias" : "Usuarios"}
          </Link> /{" "}
          <Link to={getDetailsPath()}>{user?.nombres} {user?.apellidos}</Link> /{" "}
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
      <Row gutter={[0, 24]} style={{ width: '100%', margin: 0 }}>
        <Col span={24} style={{ width: '100%' }}>
          {/* Tarjeta de información básica del paciente */}
          <Card className="card-legacy" style={{ marginBottom: "24px", padding: "32px 48px", borderRadius: 0, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", width: '100%', minHeight: 120 }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', width: '100%' }}>
              <Avatar src={patientImage} size={72} style={{ marginRight: 32, flexShrink: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'row', gap: 48, width: '100%' }}>
                {/* Columna izquierda: datos personales */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 320, textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 4 }}>{user?.nombres} {user?.apellidos}</div>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>{user?.n_documento}</div>
                  <div style={{ fontSize: 15, color: '#222', marginBottom: 2 }}>
                    {user?.genero} - {user?.fecha_nacimiento ? dayjs(user?.fecha_nacimiento).format('YYYY/MM/DD') : '-'} - <span style={{ fontWeight: 700 }}>{user?.fecha_nacimiento ? dayjs().diff(dayjs(user?.fecha_nacimiento), 'years') + ' años' : '-'}</span>
                  </div>
                  <div style={{ fontSize: 15, color: '#222', marginBottom: 2 }}>{user?.estado_civil}{user?.profesion ? ` - ${user?.profesion}` : ''}</div>
                </div>
                {/* Columna derecha: datos de contacto, más cerca y alineados a la izquierda */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 220, textAlign: 'left' }}>
                  <div style={{ fontSize: 15, color: '#222', marginBottom: 2 }}>{user?.direccion}</div>
                  <div style={{ fontSize: 15, color: '#222', marginBottom: 2 }}>{user?.telefono}{user?.email ? ` - ${user?.email}` : ''}</div>
                  {record?.eps && <div style={{ fontSize: 15, color: '#222', marginBottom: 2 }}>EPS: {record?.eps}</div>}
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={24} style={{ width: '100%' }}>
          {/* Tarjeta de Reporte clínico */}
          <Card className="card-legacy" style={{ marginBottom: "24px", padding: "0 0 32px 0", borderRadius: 0, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", width: '100%' }}>
            {/* Encabezado con acciones */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '32px 48px 0 48px' }}>
              <div style={{ fontWeight: 500, fontSize: 18, color: '#222', textAlign: 'left' }}>
                {encabezadoReporte}
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <Button
                  type="default"
                  icon={<EditOutlined />}
                  style={{ display: 'flex', alignItems: 'center', fontWeight: 500, color: '#7f34b4', borderColor: '#7f34b4', borderRadius: 2, background: '#fff', padding: '0 16px', height: 32 }}
                  onClick={() => navigate(getEditReportPath())}
                >
                  Editar
                </Button>
                <Button
                  type="default"
                  shape="circle"
                  icon={<DeleteOutlined />}
                  style={{ color: '#f32013', borderColor: '#f32013', background: '#fff', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  // onClick={handleDeleteReport} // Aquí puedes agregar la lógica de eliminación
                />
              </div>
            </div>
            {/* Divisor horizontal */}
            <div style={{ borderBottom: '2px solid #f0f0f0', margin: '24px 0 0 0', width: '100%' }} />
            {/* Cuerpo de la tarjeta: filas independientes */}
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', padding: '32px 48px 0 48px', gap: 0 }}>
              {/* Fila: Tipo de reporte */}
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', minHeight: 32 }}>
                <div style={{ borderLeft: '2px solid #e0e0e0', padding: '0 16px 0 8px', fontWeight: 600, color: '#222', minWidth: 180 }}>Tipo de reporte</div>
                <div style={{ color: '#222', fontSize: 15, flex: 1 }}>{report?.tipo_reporte ?? '-'}</div>
              </div>
              {/* Fila: Motivo de consulta */}
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', minHeight: 32 }}>
                <div style={{ borderLeft: '2px solid #e0e0e0', padding: '0 16px 0 8px', fontWeight: 600, color: '#222', minWidth: 180 }}>Motivo de consulta</div>
                <div style={{ color: '#222', fontSize: 15, flex: 1 }}>{report?.motivo_consulta || <span style={{ color: '#bbb' }}>Agregar motivo de consulta</span>}</div>
              </div>
                             {/* Fila: Exploración física */}
               <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', minHeight: 32 }}>
                 <div style={{ borderLeft: '2px solid #e0e0e0', padding: '0 16px 0 8px', fontWeight: 600, color: '#222', minWidth: 180 }}>Exploración física</div>
                 <div style={{ color: '#222', fontSize: 15, flex: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>
                   <div><span style={{ fontWeight: 600 }}>Peso:</span> {exploracion.peso}</div>
                 </div>
               </div>
              {/* Fila: Diagnóstico */}
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', minHeight: 32 }}>
                <div style={{ borderLeft: '2px solid #e0e0e0', padding: '0 16px 0 8px', fontWeight: 600, color: '#222', minWidth: 180 }}>Diagnóstico</div>
                <div style={{ color: '#222', fontSize: 15, flex: 1 }}>{report?.diagnosticos || '-'}</div>
              </div>
              {/* Fila: Observaciones */}
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', minHeight: 32 }}>
                <div style={{ borderLeft: '2px solid #e0e0e0', padding: '0 16px 0 8px', fontWeight: 600, color: '#222', minWidth: 180 }}>Observaciones</div>
                <div style={{ color: '#bbb', fontSize: 15, flex: 1 }}>{report?.observaciones || 'Campo para agregar observaciones internas'}</div>
              </div>
              {/* Fila: Remisión */}
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', minHeight: 32 }}>
                <div style={{ borderLeft: '2px solid #e0e0e0', padding: '0 16px 0 8px', fontWeight: 600, color: '#222', minWidth: 180 }}>Remisión</div>
                <div style={{ color: '#222', fontSize: 15, flex: 1 }}>{report?.remision || '-'}</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={24} style={{ width: '100%' }}>
          <Card className="card-legacy" style={{ marginBottom: "24px", padding: "16px 32px", borderRadius: 0, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", backgroundColor: "#FFFFFF", width: '100%' }}>
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
        <Col span={24} style={{ width: '100%' }}>
          <Card className="card-legacy" style={{ marginBottom: "24px", padding: "16px 32px", borderRadius: 0, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", backgroundColor: "#FFFFFF", width: '100%' }}>
            <Row justify="space-between" align="middle">
              <Col>
                <Title level={5} style={{ fontWeight: "bold", color: "#333333" }}>
                  Reportes de Evolución Clínica
                </Title>
              </Col>
              <Col>
                <Button type="primary" icon={<PlusCircleOutlined />} onClick={() => navigate(getEditReportPath())}>
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
    </div>
  );
};
