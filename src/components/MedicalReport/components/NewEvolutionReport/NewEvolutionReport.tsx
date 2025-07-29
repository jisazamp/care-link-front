import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Typography,
  message,
} from "antd";
import dayjs from "dayjs";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { useCreateClinicalEvolution } from "../../../../hooks/useCreateClinicalEvolution/useCreateClinicalEvolution";
import { useGetMedicalReport } from "../../../../hooks/useGetMedicalReport/useGetMedicalReport";
import { useGetProfessionals } from "../../../../hooks/useGetProfessionals/useGetProfessionals";
import { useGetUserById } from "../../../../hooks/useGetUserById/useGetUserById";
import patientImage from "../../../assets/Patients/patient1.jpg";

const { Title, Text } = Typography;

export const NewEvolutionReport: React.FC = () => {
  const { id, reportId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Detect if we're in home visit context
  const isHomeVisit = location.pathname.includes("/visitas-domiciliarias/");

  const professionalsQuery = useGetProfessionals();
  const createEvolution = useCreateClinicalEvolution(reportId);
  const userQuery = useGetUserById(id);
  const reportQuery = useGetMedicalReport(reportId);
  const user = userQuery.data?.data.data;
  const report = reportQuery.data?.data.data;

  const [form] = Form.useForm();

  // Navigation functions based on context
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

  const handleFinish = async (values: any) => {
    await createEvolution.mutateAsync({
      fecha_evolucion: values.date.format("YYYY-MM-DD"),
      id_profesional: values.professional,
      id_reporteclinico: Number(reportId),
      observacion_evolucion: values.observation,
      tipo_report: values.reportType,
    });
    message.success("Reporte de evolución creado exitosamente");
    navigate(getReportDetailsPath());
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", padding: 24 }}>
      <div
        style={{
          maxWidth: 1214,
          margin: "0 auto 24px 0",
          paddingLeft: 32,
          paddingRight: 32,
        }}
      >
        <div
          className="breadcrumbs"
          style={{ fontSize: 14, color: "#8C8C8C", marginBottom: 24 }}
        >
          <Link to="/inicio">Inicio</Link> /{" "}
          <Link
            to={isHomeVisit ? "/visitas-domiciliarias/usuarios" : "/usuarios"}
          >
            {isHomeVisit ? "Visitas Domiciliarias" : "Usuarios"}
          </Link>{" "}
          /{" "}
          <Link to={getDetailsPath()}>
            {user?.nombres} {user?.apellidos}
          </Link>{" "}
          / <Link to={getReportDetailsPath()}>Detalle reporte clínico</Link> /{" "}
          <span className="current" style={{ color: "#222", fontWeight: 500 }}>
            Nuevo reporte de evolución
          </span>
        </div>
        <h1
          className="page-title"
          style={{
            fontSize: 20,
            fontWeight: 500,
            color: "#222",
            margin: "0 0 12px 0",
          }}
        >
          Nuevo reporte de evolución clínica
        </h1>
      </div>
      {/* Framer principal */}
      <Card
        className="main-frame"
        style={{
          width: "100%",
          margin: "0 auto",
          borderRadius: 8,
          background: "#fff",
          padding: 0,
          border: "none",
        }}
      >
        {/* Tarjeta de información del paciente */}
        <Card
          style={{
            width: "100%",
            margin: "24px 0 24px 0",
            borderRadius: 8,
            padding: "24px 32px",
          }}
          bordered={false}
        >
          <Row align="middle" gutter={32}>
            <Col>
              <Avatar src={patientImage} size={80} />
            </Col>
            <Col flex="auto">
              <Title level={5} style={{ margin: 0, fontWeight: 600 }}>
                {user?.nombres} {user?.apellidos}
              </Title>
              <Text strong>Documento:</Text> {user?.n_documento} &nbsp;|
              <Text strong> Género:</Text> {user?.genero} &nbsp;|
              <Text strong> Edad:</Text>{" "}
              {user?.fecha_nacimiento
                ? `${dayjs().diff(dayjs(user?.fecha_nacimiento), "years")} años`
                : "-"}{" "}
              &nbsp;|
              <Text strong> Estado Civil:</Text> {user?.estado_civil}
              <br />
              <Text strong>Dirección:</Text> {user?.direccion} &nbsp;|
              <Text strong>Teléfono:</Text> {user?.telefono} &nbsp;|
              <Text strong>Email:</Text> {user?.email}
            </Col>
          </Row>
        </Card>
        {/* Tarjeta de información del reporte clínico asociado */}
        <Card
          style={{
            width: "100%",
            margin: "0 0 24px 0",
            borderRadius: 8,
            padding: "24px 32px",
          }}
          bordered={false}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <Title
                level={5}
                style={{
                  fontWeight: "bold",
                  color: "#333333",
                  margin: 0,
                  fontSize: 20,
                  letterSpacing: 0.2,
                }}
              >
                Asociado a: Reporte clínico -{" "}
                {report?.id_reporteclinico || reportId}{" "}
                {report?.fecha_registro
                  ? dayjs(report.fecha_registro).format("DD-MM-YYYY")
                  : ""}{" "}
                - Realizado por:{" "}
                {report?.profesional
                  ? `${report.profesional.nombres} ${report.profesional.apellidos}`
                  : ""}
              </Title>
            </Col>
          </Row>
          <Divider style={{ margin: "16px 0" }} />
          <Row gutter={32}>
            <Col span={8}>
              <Text strong>Motivo de consulta:</Text>
              <br />
              {report?.motivo_consulta}
            </Col>
            <Col span={8}>
              <Text strong>Diagnóstico:</Text>
              <br />
              {report?.diagnosticos}
            </Col>
            <Col span={8}>
              <Text strong>Remisión:</Text>
              <br />
              {report?.remision}
            </Col>
          </Row>
          <Row style={{ marginTop: 12 }}>
            <Col span={24}>
              <Text strong>Observaciones:</Text> {report?.observaciones}
            </Col>
          </Row>
        </Card>
        {/* Sección de formulario de evolución */}
        <Card
          style={{
            width: "100%",
            margin: "0 0 24px 0",
            borderRadius: 8,
            padding: "24px 32px",
          }}
          bordered={false}
        >
          <Title
            level={5}
            style={{
              fontWeight: "bold",
              color: "#333333",
              marginBottom: 0,
              fontSize: 18,
              letterSpacing: 0.1,
            }}
          >
            Datos del reporte de evolución
          </Title>
          <Divider style={{ margin: "16px 0" }} />
          <Form
            layout="vertical"
            form={form}
            onFinish={handleFinish}
            style={{ width: "100%" }}
          >
            <Row gutter={32}>
              <Col span={12}>
                <Form.Item
                  label="Profesional"
                  name="professional"
                  rules={[{ required: true, message: "Campo requerido" }]}
                >
                  <Select
                    placeholder="Seleccione un profesional"
                    loading={professionalsQuery.isLoading}
                    showSearch
                    filterOption={(input, option) =>
                      !!option?.label.toLowerCase().includes(input)
                    }
                    options={
                      professionalsQuery.data?.data.data.map((p: any) => ({
                        label: `${p.nombres} ${p.apellidos}`,
                        value: p.id_profesional,
                      })) ?? []
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Tipo de reporte"
                  name="reportType"
                  rules={[{ required: true, message: "Campo requerido" }]}
                >
                  <Select placeholder="Seleccione el tipo de reporte">
                    <Select.Option value="enfermeria">Enfermería</Select.Option>
                    <Select.Option value="psicologia">Psicología</Select.Option>
                    <Select.Option value="nutricion">Nutrición</Select.Option>
                    <Select.Option value="fisioterapia">
                      Fisioterapia
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={32}>
              <Col span={12}>
                <Form.Item
                  label="Fecha de registro"
                  name="date"
                  rules={[{ required: true, message: "Campo requerido" }]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Observación"
                  name="observation"
                  rules={[{ required: true, message: "Campo requerido" }]}
                >
                  <Input.TextArea rows={4} />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="end" style={{ marginTop: 24 }}>
              <Button
                style={{ marginRight: 12 }}
                className="main-button-white"
                onClick={() => form.resetFields()}
              >
                Restablecer
              </Button>
              <Button
                htmlType="submit"
                type="primary"
                loading={createEvolution.isPending}
              >
                Guardar evolución
              </Button>
            </Row>
          </Form>
        </Card>
      </Card>
    </div>
  );
};
