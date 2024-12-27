import { Controller, useFormContext, FormProvider } from "react-hook-form";
//import dayjs, { Dayjs } from "dayjs";
import {
  Breadcrumb,
  Button,
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
import { Sidebar } from "../Sidebar/Sidebar";
import { UserInfo } from "./components/UserInfo/UserInfo";
import { MedicalServices } from "./components/MedicalServices/MedicalServices";
import { EntryData } from "./components/EntryData/EntryData";
import { BasicHealthData } from "./components/BasicHealthData/BasicHealthData";
import { PhysicalExploration } from "./components/PhysicalExploration/PhysicalExploration";
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

export const MedicalTreatments = () => {
  return (
    <Card
      title={
        <Title level={4}>
          Tratamientos o medicamentos temporales o permanentes que requieren
          apoyo
        </Title>
      }
      bordered
    >
      <Form.Item>
        <Title level={5} className="checkbox-title">
          Tratamientos o medicamentos
        </Title>
        <Checkbox.Group
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          <Checkbox value="farmaco" defaultChecked>
            Régimen farmacoterapéutico
          </Checkbox>
          <Checkbox value="enfermeria" defaultChecked>
            Plan de cuidados de enfermería
          </Checkbox>
          <Checkbox value="fisioterapia" defaultChecked>
            Intervención fisioterapéutica
          </Checkbox>
        </Checkbox.Group>
      </Form.Item>

      <Divider />

      <div>
        <div className="table-header">
          <Title level={5}>Régimen farmacoterapéutico</Title>
          <Button type="primary" icon={<PlusOutlined />} className="add-button">
            Agregar
          </Button>
        </div>
        <Table
          columns={[
            {
              title: "Fecha de inicio",
              dataIndex: "startDate",
              key: "startDate",
            },
            {
              title: "Medicamento",
              dataIndex: "medicine",
              key: "medicine",
            },
            { title: "Dosis", dataIndex: "dose", key: "dose" },
            {
              title: "Vía de administración",
              dataIndex: "administration",
              key: "administration",
            },
            {
              title: "Frecuencia",
              dataIndex: "frequency",
              key: "frequency",
            },
            {
              title: "Duración",
              dataIndex: "duration",
              key: "duration",
            },
            {
              title: "Indicaciones",
              dataIndex: "instructions",
              key: "instructions",
            },
            {
              title: "Acciones",
              key: "actions",
              render: () => (
                <Space>
                  <Button type="link" style={{ color: "#1890ff" }}>
                    Desactivar
                  </Button>
                  <Button type="link" danger>
                    Eliminar
                  </Button>
                </Space>
              ),
            },
          ]}
          dataSource={[
            {
              key: "1",
              startDate: "10/09/2024",
              medicine: "Enalapril",
              dose: "5 mg",
              administration: "Oral",
              frequency: "Cada 12 horas",
              duration: "Indefinida",
              instructions:
                "Administrar con alimentos. Controlar presión arterial antes de cada dosis.",
            },
          ]}
          pagination={false}
        />
      </div>

      <Divider />

      <div>
        <div className="table-header">
          <Title level={5}>Plan de cuidados de enfermería</Title>
          <Button type="primary" icon={<PlusOutlined />} className="add-button">
            Agregar
          </Button>
        </div>
        <Table
          columns={[
            {
              title: "Diagnóstico",
              dataIndex: "diagnosis",
              key: "diagnosis",
            },
            {
              title: "Intervención",
              dataIndex: "intervention",
              key: "intervention",
            },
            {
              title: "Frecuencia",
              dataIndex: "frequency",
              key: "frequency",
            },
            {
              title: "Acciones",
              key: "actions",
              render: () => (
                <Space>
                  <Button type="link" style={{ color: "#1890ff" }}>
                    Finalizar
                  </Button>
                  <Button type="link" danger>
                    Eliminar
                  </Button>
                </Space>
              ),
            },
          ]}
          dataSource={[
            {
              key: "1",
              diagnosis: "Piel alterada relacionada con herida en la pierna.",
              intervention: "Limpiar herida, secar con gasas sin frotar.",
              frequency: "Diaria",
            },
          ]}
          pagination={false}
        />
      </div>
    </Card>
  );
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
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Card
                    className="condiciones-card"
                    title={
                      <div className="title-wrapper">
                        <Title level={4}>
                          Condiciones especiales permanentes preexistentes de
                          cuidado
                        </Title>
                      </div>
                    }
                    bordered
                  >
                    <div className="condiciones-head">
                      <Title level={5} className="checkbox-title">
                        Condición especial
                      </Title>
                      <Checkbox.Group
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "16px",
                        }}
                      >
                        <Checkbox value="discapacidad" defaultChecked>
                          Persona con discapacidad
                        </Checkbox>
                        <Checkbox value="apoyos" defaultChecked>
                          Limitaciones o apoyos
                        </Checkbox>
                        <Checkbox value="medicamentos" defaultChecked>
                          Alergias a medicamentos
                        </Checkbox>
                        <Checkbox value="cirugias" defaultChecked>
                          Cirugías
                        </Checkbox>
                        <Checkbox value="alergias">Otras alergias</Checkbox>
                        <Checkbox value="dieta">Dieta especial</Checkbox>
                      </Checkbox.Group>
                    </div>
                    <Divider />
                    <div className="condiciones-body">
                      <Card
                        className="terciaria-card"
                        bordered
                        title={
                          <div className="table-header">
                            <Title level={5}>
                              Tipos de discapacidad del paciente
                            </Title>
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
                        <Table
                          className="discapacidad-table"
                          columns={[
                            {
                              title: "Discapacidades",
                              dataIndex: "discapacidad",
                              key: "discapacidad",
                              align: "center",
                            },
                            {
                              title: "Observación",
                              dataIndex: "observacion",
                              key: "observacion",
                              align: "center",
                            },
                            {
                              title: "Acciones",
                              key: "acciones",
                              align: "center",
                              render: () => (
                                <Button type="link" danger>
                                  Eliminar
                                </Button>
                              ),
                            },
                          ]}
                          dataSource={[
                            {
                              key: "1",
                              discapacidad: "Física",
                              observacion: "N/A",
                            },
                          ]}
                          pagination={false}
                        />
                      </Card>
                      <Divider />
                      <Card
                        className="terciaria-card"
                        bordered
                        title={
                          <div className="table-header">
                            <Title level={5}>
                              Limitaciones permanentes que requieren apoyos o
                              cuidados
                            </Title>
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
                        <Table
                          className="limitaciones-table"
                          columns={[
                            {
                              title: "Limitaciones",
                              dataIndex: "limitacion",
                              key: "limitacion",
                              align: "center",
                            },
                            {
                              title: "Observación",
                              dataIndex: "observacion",
                              key: "observacion",
                              align: "center",
                            },
                            {
                              title: "Acciones",
                              key: "acciones",
                              align: "center",
                              render: () => (
                                <Button type="link" danger>
                                  Eliminar
                                </Button>
                              ),
                            },
                          ]}
                          dataSource={[
                            {
                              key: "1",
                              limitacion: "Incontinencia urinaria",
                              observacion: "Requiere uso de pañal",
                            },
                            {
                              key: "2",
                              limitacion: "Debilidad muscular",
                              observacion: "Requiere ayuda para comer",
                            },
                          ]}
                          pagination={false}
                        />
                      </Card>
                      <Divider />
                      <Card
                        className="terciaria-card"
                        bordered
                        title={
                          <div className="table-header">
                            <Title level={5}>Alergias a medicamentos</Title>
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
                        <Table
                          className="alergias-table"
                          columns={[
                            {
                              title: "Medicamentos a los que presenta alergia",
                              dataIndex: "medicamento",
                              key: "medicamento",
                              align: "center",
                            },
                            {
                              title: "Observación",
                              dataIndex: "observacion",
                              key: "observacion",
                              align: "center",
                            },
                            {
                              title: "Acciones",
                              key: "acciones",
                              align: "center",
                              render: () => (
                                <Button type="link" danger>
                                  Eliminar
                                </Button>
                              ),
                            },
                          ]}
                          dataSource={[
                            {
                              key: "1",
                              medicamento: "Penicilina",
                              observacion: "Reemplazar con azitromicina",
                            },
                          ]}
                          pagination={false}
                        />
                      </Card>
                      <Divider />
                      <Card
                        className="terciaria-card"
                        bordered
                        title={
                          <div className="table-header">
                            <Title level={5}>
                              Historial de cirugías, traumatismos o accidentes
                            </Title>
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
                        <Table
                          className="historial-table"
                          columns={[
                            {
                              title: "Fecha de ocurrencia",
                              dataIndex: "fecha",
                              key: "fecha",
                              align: "center",
                            },
                            {
                              title: "Observación",
                              dataIndex: "observacion",
                              key: "observacion",
                              align: "center",
                            },
                            {
                              title: "Acciones",
                              key: "acciones",
                              align: "center",
                              render: () => (
                                <Button type="link" danger>
                                  Eliminar
                                </Button>
                              ),
                            },
                          ]}
                          dataSource={[
                            {
                              key: "1",
                              fecha: "10/11/1998",
                              observacion: "Apendicectomía",
                            },
                          ]}
                          pagination={false}
                        />
                      </Card>
                    </div>
                  </Card>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Card
                    className="vacunacion-card"
                    bordered
                    title={
                      <div className="table-header">
                        <Title level={4}>Esquema de vacunación</Title>
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          className="add-button"
                        >
                          Agregar Vacuna
                        </Button>
                      </div>
                    }
                  >
                    <div className="vacunacion-body">
                      <Table
                        className="vacunacion-table"
                        columns={[
                          {
                            title: "Vacuna",
                            dataIndex: "vacuna",
                            key: "vacuna",
                            align: "center",
                          },
                          {
                            title: "Fecha administración",
                            dataIndex: "fechaAdministracion",
                            key: "fechaAdministracion",
                            align: "center",
                          },
                          {
                            title: "Próxima aplicación (Si aplica)",
                            dataIndex: "proximaAplicacion",
                            key: "proximaAplicacion",
                            align: "center",
                          },
                          {
                            title: "Efectos secundarios (Si reporta)",
                            dataIndex: "efectosSecundarios",
                            key: "efectosSecundarios",
                            align: "center",
                          },
                          {
                            title: "Acciones",
                            key: "acciones",
                            align: "center",
                            render: () => (
                              <Button type="link" danger>
                                Eliminar
                              </Button>
                            ),
                          },
                        ]}
                        dataSource={[
                          {
                            key: "1",
                            vacuna: "Influenza",
                            fechaAdministracion: "05/07/2024",
                            proximaAplicacion: "Anual",
                            efectosSecundarios: "Ninguno",
                          },
                          {
                            key: "2",
                            vacuna: "Hepatitis B",
                            fechaAdministracion: "NO REGISTRA",
                            proximaAplicacion: "No requiere",
                            efectosSecundarios: "Ninguno",
                          },
                        ]}
                        pagination={false}
                        style={{
                          marginTop: 16,
                        }}
                      />
                    </div>
                  </Card>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Card
                    className="habilidades-biofisicas-card"
                    bordered
                    title={<Title level={4}>Habilidades biofísicas</Title>}
                  >
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Tipo de alimentación"
                          name="tipoAlimentacion"
                          rules={[
                            {
                              required: true,
                              message: "Por favor seleccione una opción",
                            },
                          ]}
                        >
                          <Select placeholder="Seleccione">
                            <Option value="normal">Normal</Option>
                            <Option value="especial">Especial</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Tipo de sueño"
                          name="tipoSueño"
                          rules={[
                            {
                              required: true,
                              message: "Por favor seleccione una opción",
                            },
                          ]}
                        >
                          <Select placeholder="Seleccione">
                            <Option value="regular">Regular</Option>
                            <Option value="irregular">Irregular</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Continencia"
                          name="continencia"
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
                      <Col span={12}>
                        <Form.Item
                          label="Tipo de movilidad"
                          name="tipoMovilidad"
                          rules={[
                            {
                              required: true,
                              message: "Por favor seleccione una opción",
                            },
                          ]}
                        >
                          <Select placeholder="Seleccione">
                            <Option value="conAyuda">Con ayuda</Option>
                            <Option value="independiente">Independiente</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Cuidado personal"
                          name="cuidadoPersonal"
                          rules={[
                            {
                              required: true,
                              message: "Por favor seleccione una opción",
                            },
                          ]}
                        >
                          <Select placeholder="Seleccione">
                            <Option value="independiente">Independiente</Option>
                            <Option value="conAyudaParcial">
                              Con ayuda parcial
                            </Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Apariencia personal"
                          name="aparienciaPersonal"
                          rules={[
                            {
                              required: true,
                              message: "Por favor seleccione una opción",
                            },
                          ]}
                        >
                          <Select placeholder="Seleccione">
                            <Option value="buena">Buena</Option>
                            <Option value="desaliñada">Desaliñada</Option>
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
                    className="habitos-toxicologicos-card"
                    bordered
                    title={
                      <Title level={4}>
                        Hábitos o antecedentes toxicológicos
                      </Title>
                    }
                  >
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Tabaquismo"
                          name="tabaquismo"
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
                      <Col span={12}>
                        <Form.Item
                          label="Sustancias Psicoactivas"
                          name="sustanciasPsicoactivas"
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
                      <Col span={12}>
                        <Form.Item
                          label="Alcoholismo"
                          name="alcoholismo"
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
                      <Col span={12}>
                        <Form.Item
                          label="Cafeína"
                          name="cafeina"
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
                    className="habilidades-percepcion-social-card"
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
