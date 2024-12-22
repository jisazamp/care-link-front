import { Controller, useFormContext, FormProvider } from "react-hook-form";
//import dayjs, { Dayjs } from "dayjs";
import {
  Breadcrumb,
  Button,
  Flex,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Layout,
  Row,
  Select,
  Space,
  Table,
  Typography,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Header } from "../Header/Header";
import { BasicHealthData } from "./components/BasicHealthData/BasicHealthData";
import { Sidebar } from "../Sidebar/Sidebar";
import { UserInfo } from "./components/UserInfo/UserInfo";
import { MedicalServices } from "./components/MedicalServices/MedicalServices";
import { EntryData } from "./components/EntryData/EntryData";
import { PhysicalExploration } from "./components/PhysicalExploration/PhysicalExploration";
import { MedicalTreatments } from "./components/MedicalTreatments/MedicalTreatments";
import { SpecialConditions } from "./components/SpecialConditions/SpecialConditions";
import { Vaccines } from "./components/Vaccines/Vaccines";
import { BiophysicalSkills } from "./components/BiophysicalSkills/BiophysicalSkills";
import { Toxicology } from "./components/Toxicology/Toxicology";
import { useForm } from "react-hook-form";

const { Content, Sider } = Layout;
const { Option } = Select;
const { Title, Text } = Typography;

type FormValues = {
  patientId: string;
  fullName: string;
  documentType: string;
  documentNumber: string;
  //  birthDate: Dayjs;
  gender: string;
  medicalHistory: string;
  currentTreatment: string;
};

export const MedicalRecord: React.FC = () => {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <Layout style={{ minHeight: "100vh" }}>
        <Form layout="vertical">
          <Header />
          <Layout>
            <Sider collapsible style={{ backgroundColor: "#FFF" }}>
              <Sidebar />
            </Sider>
            <Content style={{ margin: "16px" }}>
              <Breadcrumb
                items={[{ title: "Inicio" }, { title: "Historia clínica" }]}
                style={{ margin: "16px 0" }}
              />
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <UserInfo />
                </Col>
              </Row>
              <Row style={{ margin: "8px 0" }}>
                <Col span={24}>
                  <MedicalServices />
                </Col>
              </Row>
              <Row style={{ margin: "8px 0" }}>
                <Col span={24}>
                  <EntryData />
                </Col>
              </Row>
              <Row style={{ margin: "8px 0" }}>
                <Col span={24}>
                  <BasicHealthData />
                </Col>
              </Row>
              <Row style={{ margin: "8px 0" }}>
                <Col span={24}>
                  <PhysicalExploration />
                </Col>
              </Row>
              <Row style={{ margin: "8px 0" }}>
                <Col span={24}>
                  <MedicalTreatments />
                </Col>
              </Row>
              <Row style={{ margin: "8px 0" }}>
                <Col span={24}>
                  <SpecialConditions />
                </Col>
              </Row>
              <Row style={{ margin: "8px 0" }}>
                <Col span={24}>
                  <Vaccines />
                </Col>
              </Row>
              <Row style={{ margin: "8px 0" }}>
                <Col span={24}>
                  <BiophysicalSkills />
                </Col>
              </Row>
              <Row style={{ margin: "8px 0" }}>
                <Col span={24}>
                  <Toxicology />
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Card
                    bordered
                    title={
                      <Title level={4}>Habilidades de percepción social</Title>
                    }
                  >
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Comunicación verbal"
                          name="comunicacionVerbal"
                          rules={[
                            {
                              required: true,
                              message: "Por favor seleccione una opción",
                            },
                          ]}
                        >
                          <Select placeholder="Seleccione">
                            <Option value="activa">Activa</Option>
                            <Option value="pasiva">Pasiva</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Comunicación no verbal"
                          name="comunicacionNoVerbal"
                          rules={[
                            {
                              required: true,
                              message: "Por favor seleccione una opción",
                            },
                          ]}
                        >
                          <Select placeholder="Seleccione">
                            <Option value="activa">Activa</Option>
                            <Option value="pasiva">Pasiva</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Estado de ánimo"
                          name="estadoAnimo"
                          rules={[
                            {
                              required: true,
                              message: "Por favor seleccione una opción",
                            },
                          ]}
                        >
                          <Select placeholder="Seleccione">
                            <Option value="alegre">Alegre</Option>
                            <Option value="triste">Triste</Option>
                            <Option value="ansioso">Ansioso</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Ha sufrido maltrato"
                          name="maltrato"
                          rules={[
                            {
                              required: true,
                              message: "Por favor seleccione una opción",
                            },
                          ]}
                        >
                          <Select placeholder="Seleccione">
                            <Option value="si">Sí</Option>
                            <Option value="no">No</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Card
                    className="diagnostico-inicial-card"
                    bordered
                    title={<Title level={4}>Diagnóstico inicial</Title>}
                  >
                    <Form.Item
                      label="Observaciones"
                      name="observacionesDiagnostico"
                      rules={[
                        {
                          required: true,
                          message: "Por favor ingrese las observaciones",
                        },
                      ]}
                    >
                      <Input.TextArea
                        rows={4}
                        placeholder="Ingrese las observaciones del diagnóstico inicial"
                      />
                    </Form.Item>
                  </Card>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Card
                    className="pruebas-test-card"
                    bordered
                    title={
                      <div className="table-header">
                        <Title level={4}>Pruebas y Test</Title>
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          className="add-button"
                        >
                          Nuevo
                        </Button>
                      </div>
                    }
                  >
                    <Table
                      className="pruebas-test-table"
                      columns={[
                        {
                          title: "Profesional",
                          dataIndex: "profesional",
                          key: "profesional",
                          align: "center",
                        },
                        {
                          title: "Tipo de prueba",
                          dataIndex: "tipoPrueba",
                          key: "tipoPrueba",
                          align: "center",
                        },
                        {
                          title: "Fecha",
                          dataIndex: "fecha",
                          key: "fecha",
                          align: "center",
                        },
                        {
                          title: "Acciones",
                          key: "acciones",
                          align: "center",
                          render: () => (
                            <Space>
                              <Button type="link" style={{ color: "#1890ff" }}>
                                Ver
                              </Button>
                              <Button type="link" style={{ color: "#faad14" }}>
                                Editar
                              </Button>
                            </Space>
                          ),
                        },
                      ]}
                      dataSource={[
                        {
                          key: "1",
                          profesional: "Sara Manuela Gomez",
                          tipoPrueba: "Escala de Yesavage",
                          fecha: "10/11/2024",
                        },
                      ]}
                      pagination={false}
                    />
                  </Card>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Card
                    className="adjuntar-documentos-card"
                    bordered
                    title={
                      <div className="table-header">
                        <Title level={4}>Adjuntar documentos</Title>
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          className="add-button"
                        >
                          Agregar
                        </Button>
                      </div>
                    }
                  >
                    <div style={{ textAlign: "center", padding: "16px" }}>
                      <Text>No se han adjuntado documentos.</Text>
                    </div>
                  </Card>
                </Col>
              </Row>
              <Row gutter={[16, 16]} justify="end">
                <Col>
                  <Button type="default" style={{ marginRight: 8 }}>
                    Restablecer
                  </Button>
                  <Button
                    type="primary"
                    style={{
                      backgroundColor: "#722ed1",
                      borderColor: "#722ed1",
                    }}
                  >
                    Guardar y continuar
                  </Button>
                </Col>
              </Row>
            </Content>
          </Layout>
        </Form>
      </Layout>
    </FormProvider>
  );
};
