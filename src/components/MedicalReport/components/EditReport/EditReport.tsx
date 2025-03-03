import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { UserOutlined } from "@ant-design/icons";
import { useGetMedicalReport } from "../../../../hooks/useGetMedicalReport/useGetMedicalReport";
import { useGetUserById } from "../../../../hooks/useGetUserById/useGetUserById";
import { useParams } from "react-router-dom";

const { Text } = Typography;

export const EditReport: React.FC = () => {
  const { reportId, id } = useParams();

  const userQuery = useGetUserById(id);
  const reportQuery = useGetMedicalReport(reportId);
  const user = userQuery.data?.data.data;
  const report = reportQuery.data?.data.data;

  const handleFinish = (values: unknown) => {
    console.log("Reporte actualizado:", values);
  };

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "100%",
        minHeight: "100vh",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <Card
        style={{ width: "100%", marginBottom: 16 }}
        loading={userQuery.isLoading}
      >
        <Row align="middle" gutter={16}>
          <Col>
            <Avatar size={80} icon={<UserOutlined />} />
          </Col>
          <Col flex="auto">
            <Typography.Title
              level={4}
            >{`${user?.nombres} ${user?.apellidos}`}</Typography.Title>
            <Text strong>{user?.n_documento}</Text> - {user?.genero} -{" "}
            {dayjs(user?.fecha_nacimiento).format("DD-MM-YYYY")} -{" "}
            <Text strong>
              {dayjs().diff(dayjs(user?.fecha_nacimiento), "years")} años
            </Text>
            <br />
            {user?.estado_civil}
            <br />
            <Text>{user?.direccion}</Text>
            <br />
            {user?.telefono} - {user?.email}
          </Col>
        </Row>
      </Card>
      <Card
        style={{ marginBottom: 16, width: "100%" }}
        loading={reportQuery.isLoading}
      >
        <Text strong>Asociado a:</Text> Reporte clínico - {reportId} -{" "}
        <Text strong>Realizado por:</Text>{" "}
        {`${report?.profesional?.nombres} ${report?.profesional?.apellidos}`}
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={24}>
            <Card style={{ backgroundColor: "#f5f5f5", borderRadius: 8 }}>
              <Row gutter={16}>
                <Col span={24}>
                  <Text strong>Motivo de consulta:</Text>
                  <p>{report?.motivo_consulta}</p>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Text strong>Diagnóstico:</Text>
                  <p>{report?.diagnostico}</p>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Text strong>Remisión:</Text>
                  <p>{report?.remision.toUpperCase()}</p>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Card>
      <Card
        title="Datos del Reporte de Evolución"
        style={{ marginBottom: 16, width: "100%" }}
      >
        <Form layout="vertical" onFinish={handleFinish}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Profesional" name="professional">
                <Select disabled defaultValue="Andrea Salazar" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Tipo de reporte" name="reportType">
                <Select
                  mode="multiple"
                  placeholder="Seleccione el tipo de reporte"
                  defaultValue={["Enfermería"]}
                >
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
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Fecha de registro" name="date">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Observación" name="observation">
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card style={{ width: "100%", textAlign: "right" }}>
        <Button style={{ marginRight: 8 }}>Restablecer</Button>
        <Button type="primary" htmlType="submit" onClick={handleFinish}>
          Guardar
        </Button>
      </Card>
    </div>
  );
};
