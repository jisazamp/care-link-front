import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Layout,
  Row,
  Table,
  Typography,
} from "antd";
import type React from "react";
import avatar from "../assets/Patients/patient1.jpg";

const { Content } = Layout;
const { Title, Text } = Typography;

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
                <Row align="middle">
                  <Col flex="96px">
                    <img
                      src={avatar}
                      alt="Avatar del paciente"
                      style={{
                        width: "96px",
                        height: "96px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  </Col>
                  <Col flex="auto">
                    <Row>
                      <Col span={12}>
                        <div style={{ lineHeight: "1.5", color: "#212529" }}>
                          <Title
                            level={5}
                            style={{ margin: 0, fontWeight: 600 }}
                          >
                            JUAN ANTONIO LOPEZ ORREGO
                          </Title>
                          <Text style={{ fontSize: "14px", color: "#495057" }}>
                            44567890 - Masculino - 1956/11/08 - 68 años
                          </Text>
                          <br />
                          <Text style={{ fontSize: "14px", color: "#495057" }}>
                            Casado - Pensionado
                          </Text>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div style={{ lineHeight: "1.5", color: "#212529" }}>
                          <Text style={{ fontSize: "14px", color: "#495057" }}>
                            CLL 45 - 60-20 INT 101
                          </Text>
                          <br />
                          <Text style={{ fontSize: "14px", color: "#495057" }}>
                            315 6789 6789 - juanantonio@gmail.com
                          </Text>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Segunda tarjeta: Tipo de reporte */}
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
                      Reporte clínico - 001 10-20-2024 - Realizado por: SARA
                      MANUELA GONZALEZ
                    </Title>
                  </Col>
                  <Col>
                    <Button type="text" icon={<EditOutlined />} />
                    <Button type="text" icon={<DeleteOutlined />} />
                  </Col>
                </Row>
                <Divider style={{ margin: "12px 0" }} />
                <Row>
                  <Col span={12}>
                    <div style={{ paddingBottom: "8px" }}>
                      <Title
                        level={5}
                        style={{
                          fontWeight: "bold",
                          fontSize: "14px",
                          color: "#495057",
                        }}
                      >
                        Tipo de reporte
                      </Title>
                      <Text style={{ fontSize: "14px", color: "#333333" }}>
                        Enfermería
                      </Text>
                    </div>
                    <div style={{ paddingBottom: "8px" }}>
                      <Title
                        level={5}
                        style={{
                          fontWeight: "bold",
                          fontSize: "14px",
                          color: "#495057",
                        }}
                      >
                        Motivo de consulta
                      </Title>
                      <Text style={{ fontSize: "14px", color: "#333333" }}>
                        Usuario se cayó en la mañana mientras se bañaba
                      </Text>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ paddingBottom: "8px" }}>
                      <Title
                        level={5}
                        style={{
                          fontWeight: "bold",
                          fontSize: "14px",
                          color: "#495057",
                        }}
                      >
                        Exploración física
                      </Title>
                      <Text style={{ fontSize: "14px", color: "#333333" }}>
                        Peso: 65 kg
                      </Text>
                      <br />
                      <Text style={{ fontSize: "14px", color: "#333333" }}>
                        Presión arterial: 110 mm
                      </Text>
                      <br />
                      <Text style={{ fontSize: "14px", color: "#333333" }}>
                        Frecuencia cardíaca: 80 lpm
                      </Text>
                      <br />
                      <Text style={{ fontSize: "14px", color: "#333333" }}>
                        Temperatura corporal: 38° - Fiebre leve
                      </Text>
                      <br />
                      <Text style={{ fontSize: "14px", color: "#333333" }}>
                        Pulsioximetría: 95%
                      </Text>
                    </div>
                  </Col>
                </Row>
                <Divider style={{ margin: "12px 0" }} />
                <Row>
                  <Col span={24}>
                    <Title
                      level={5}
                      style={{
                        fontWeight: "bold",
                        fontSize: "14px",
                        color: "#495057",
                      }}
                    >
                      Diagnóstico
                    </Title>
                    <Text style={{ fontSize: "14px", color: "#333333" }}>
                      Integridad de la piel alterada relacionada con herida en
                      la rodilla izquierda debido a traumatismo leve
                    </Text>
                  </Col>
                </Row>
                <Divider style={{ margin: "12px 0" }} />
                <Row>
                  <Col span={24}>
                    <Title
                      level={5}
                      style={{
                        fontWeight: "bold",
                        fontSize: "14px",
                        color: "#495057",
                      }}
                    >
                      Observaciones
                    </Title>
                    <Text style={{ fontSize: "14px", color: "#666666" }}>
                      Visible solo para el propietario del reporte.
                    </Text>
                  </Col>
                </Row>
                <Divider style={{ margin: "12px 0" }} />
                <Row>
                  <Col span={24}>
                    <Title
                      level={5}
                      style={{
                        fontWeight: "bold",
                        fontSize: "14px",
                        color: "#495057",
                      }}
                    >
                      Remisión
                    </Title>
                    <Text style={{ fontSize: "14px", color: "#666666" }}>
                      Ortopedia
                    </Text>
                  </Col>
                </Row>
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
