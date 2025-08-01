import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Col,
  Descriptions,
  Divider,
  Layout,
  Row,
  Table,
  Typography,
} from "antd";
import type React from "react";
import avatar from "../assets/Patients/patient1.jpg";

const { Content } = Layout;
const { Title } = Typography;

const dataSource = [
  {
    key: "1",
    professional: "Sara Manuela Gomez",
    reportType: "Enfermería",
    date: "10/11/2024",
    treatments: "Sí",
    actions: "",
  },
  {
    key: "2",
    professional: "Juan Pablo Ruiz",
    reportType: "Ortopedia",
    date: "10/11/2024",
    treatments: "No",
    actions: "",
  },
];

const columns = [
  {
    title: "",
    dataIndex: "checkbox",
    key: "checkbox",
    render: () => <Checkbox />,
  },
  {
    title: "Profesional",
    dataIndex: "professional",
    key: "professional",
  },
  {
    title: "Tipo Reporte",
    dataIndex: "reportType",
    key: "reportType",
  },
  {
    title: "Fecha",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Registro de tratamientos",
    dataIndex: "treatments",
    key: "treatments",
    render: (text: string) => (
      <span>
        {text} | <a href="https://google.com">Ver</a>
      </span>
    ),
  },
  {
    title: "Acciones",
    dataIndex: "actions",
    key: "actions",
    render: () => (
      <span>
        <a style={{ marginRight: 8 }} href="https://google.com">
          Ver
        </a>
        <a href="https://google.com">Editar</a>
      </span>
    ),
  },
];

export const ShowMedicalReport: React.FC = () => {
  return (
    <Content>
      <Card
        className="main-frame"
        style={{ border: "none", backgroundColor: "transparent" }}
      >
        <Card
          className="inner-frame"
          style={{
            margin: "16px",
            borderRadius: "8px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
          }}
        >
          <Row gutter={[16, 16]}>
            {/* Primera tarjeta: Información del paciente */}
            <Col span={24}>
              <Card
                className="card-legacy"
                style={{
                  marginBottom: "16px",
                  padding: "16px 24px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Row align="middle" gutter={24}>
                  <Col>
                    <Avatar src={avatar} size={96} />
                  </Col>
                  <Col flex="auto">
                    <Descriptions
                      column={3}
                      size="small"
                      labelStyle={{
                        fontWeight: 500,
                        color: "#495057",
                        fontSize: 14,
                      }}
                      contentStyle={{ color: "#333333", fontSize: 14 }}
                      style={{ width: "100%" }}
                    >
                      <Descriptions.Item label="Documento">
                        1036688393
                      </Descriptions.Item>
                      <Descriptions.Item label="Edad">
                        52 años
                      </Descriptions.Item>
                      <Descriptions.Item label="Género">
                        Masculino
                      </Descriptions.Item>
                      <Descriptions.Item label="Dirección">
                        calle 3 # 78 - 19
                      </Descriptions.Item>
                      <Descriptions.Item label="Teléfono">
                        3016414872
                      </Descriptions.Item>
                      <Descriptions.Item label="Email">
                        davidrestrepove@gmail.com
                      </Descriptions.Item>
                      <Descriptions.Item label="Tipo de Sangre">
                        O+
                      </Descriptions.Item>
                      <Descriptions.Item label="Estado Civil">
                        Divorciado
                      </Descriptions.Item>
                      <Descriptions.Item label="EPS">SURA</Descriptions.Item>
                      <Descriptions.Item label="N° Afiliación">
                        6043214545
                      </Descriptions.Item>
                      <Descriptions.Item label="Fecha de Ingreso">
                        05-05-2025
                      </Descriptions.Item>
                    </Descriptions>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Segunda tarjeta: Detalles del Reporte Clínico */}
            <Col span={24}>
              <Card
                className="card-legacy"
                style={{
                  marginBottom: "16px",
                  padding: "16px 24px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <Row justify="space-between" align="middle">
                  <Col>
                    <Title
                      level={5}
                      style={{ fontWeight: "bold", color: "#333333" }}
                    >
                      Detalles del Reporte Clínico
                    </Title>
                  </Col>
                  <Col>
                    <Button type="text" icon={<EditOutlined />} />
                    <Button type="text" icon={<DeleteOutlined />} />
                  </Col>
                </Row>
                <Divider style={{ margin: "12px 0" }} />
                <Descriptions
                  column={2}
                  size="small"
                  labelStyle={{
                    fontWeight: 500,
                    color: "#495057",
                    fontSize: 14,
                  }}
                  contentStyle={{ color: "#333333", fontSize: 14 }}
                  style={{ width: "100%" }}
                >
                  <Descriptions.Item label="Tipo de Reporte">
                    psicologia
                  </Descriptions.Item>
                  <Descriptions.Item label="Motivo de Consulta">
                    Agregar motivo de consulta
                  </Descriptions.Item>
                  <Descriptions.Item label="Diagnóstico" span={2}>
                    UN DIAGNÓSTICO
                  </Descriptions.Item>
                  <Descriptions.Item label="Observaciones" span={2}>
                    Campo para agregar observaciones internas
                  </Descriptions.Item>
                  <Descriptions.Item label="Remisión" span={2}>
                    especialista
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            {/* Tercera tarjeta: Tratamiento y recomendaciones */}
            <Col span={24}>
              <Card
                className="card-legacy"
                style={{
                  marginBottom: "16px",
                  padding: "16px 24px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <Title
                  level={5}
                  style={{ fontWeight: "bold", color: "#333333" }}
                >
                  Tratamiento y recomendaciones
                </Title>
                <Divider style={{ margin: "12px 0" }} />
                <Row>
                  <Col
                    span={6}
                    style={{ display: "flex", alignItems: "flex-start" }}
                  >
                    <Title
                      level={4}
                      style={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        color: "#495057",
                      }}
                    >
                      Recomendaciones
                    </Title>
                  </Col>
                  <Col span={18}>
                    <ul
                      style={{
                        paddingLeft: "20px",
                        color: "#333333",
                        fontSize: "14px",
                        lineHeight: "1.6",
                      }}
                    >
                      <li>
                        Limpiar la herida con suero fisiológico estéril y secar
                        con gasas sin frotar.
                      </li>
                      <li>
                        Aplicar un antiséptico tópico, según la indicación
                        médica.
                      </li>
                      <li>
                        Cubrir la herida con apósito estéril y asegurarlo,
                        evitando la presión excesiva.
                      </li>
                      <li>
                        Cambiar el apósito cada 24 horas o antes si está húmedo
                        o sucio.
                      </li>
                      <li>
                        Observar y documentar signos de infección:
                        enrojecimiento, calor, hinchazón o exudado purulento.
                      </li>
                      <li>
                        Administrar analgésicos según prescripción médica.
                      </li>
                    </ul>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Cuarta tarjeta: Reportes de Evolución Clínica */}
            <Col span={24}>
              <Card
                className="card-legacy"
                style={{
                  marginBottom: "16px",
                  padding: "16px 24px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <Row justify="space-between" align="middle">
                  <Col>
                    <Title
                      level={5}
                      style={{ fontWeight: "bold", color: "#333333" }}
                    >
                      Reportes de Evolución Clínica
                    </Title>
                  </Col>
                  <Col>
                    <Button type="primary" icon={<PlusCircleOutlined />}>
                      Agregar
                    </Button>
                  </Col>
                </Row>
                <Divider style={{ margin: "12px 0" }} />
                <Table
                  dataSource={dataSource}
                  columns={columns}
                  pagination={false}
                />
              </Card>
            </Col>
          </Row>
        </Card>
      </Card>
    </Content>
  );
};
