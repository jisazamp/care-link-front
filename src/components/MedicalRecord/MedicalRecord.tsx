import { Controller, FormProvider } from "react-hook-form";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Input,
  Layout,
  Row,
  Form,
  Typography,
} from "antd";
import { BasicHealthData } from "./components/BasicHealthData/BasicHealthData";
import { BiophysicalSkills } from "./components/BiophysicalSkills/BiophysicalSkills";
import { EntryData } from "./components/EntryData/EntryData";
import { MedicalServices } from "./components/MedicalServices/MedicalServices";
import { MedicalTreatments } from "./components/MedicalTreatments/MedicalTreatments";
import { PhysicalExploration } from "./components/PhysicalExploration/PhysicalExploration";
import { PlusOutlined } from "@ant-design/icons";
import { SocialPerception } from "./components/SocialPerception/SocialPerception";
import { SpecialConditions } from "./components/SpecialConditions/SpecialConditions";
import { Toxicology } from "./components/Toxicology/Toxicology";
import { UserInfo } from "./components/UserInfo/UserInfo";
import { Vaccines } from "./components/Vaccines/Vaccines";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs, { Dayjs } from "dayjs";

const { Title, Text } = Typography;

export const pharmacotherapeuticRegimenSchema = z.object({
  id: z.union([z.number(), z.string()]).nullable().optional(),
  startDate: z.custom<Dayjs>((val) => val instanceof dayjs, "Fecha incorrecta"),
  medicine: z.string().min(1, "El medicamento es requerido"),
  dose: z.string().min(1, "La dosis es requerida"),
  administration: z.string().min(1, "La vía de administración es requerida"),
  frequency: z.string().min(1, "La frecuencia es requerida"),
  duration: z.string().min(1, "La duración es requerida"),
  instructions: z.string().min(1, "Las indicaciones son requeridas"),
});

export const surgeriesSchema = z.object({
  id: z.union([z.number(), z.string()]).nullable().optional(),
  date: z.custom<Dayjs>((val) => val instanceof dayjs, "Fecha incorrecta"),
  observation: z.string(),
});

export const nursingCarePlanSchema = z.object({
  id: z.union([z.number(), z.string()]).nullable().optional(),
  diagnosis: z.string().min(1, "El diagnóstico es requerido"),
  intervention: z.string().min(1, "La intervención es requerida"),
  frequency: z.string().min(1, "La frecuencia es requerida"),
});

export const physioterapeuticRegimenSchema = z.object({
  id: z.union([z.number(), z.string()]).nullable().optional(),
  diagnosis: z.string().min(1, "El diagnóstico es requerido"),
  intervention: z.string().min(1, "La intervención es requerida"),
  frequency: z.string().min(1, "La frecuencia es requerida"),
});

export const alergiesSchema = z.object({
  id: z.union([z.number(), z.string()]).nullable().optional(),
  medicine: z.string(),
  observation: z.string(),
});

export const dietSchema = z.object({
  id: z.union([z.number(), z.string()]).nullable().optional(),
  diet: z.string(),
  observation: z.string(),
});

export const disabilitySchema = z.object({
  id: z.union([z.number(), z.string()]).nullable().optional(),
  disability: z.string(),
  observation: z.string(),
});

export const limitationsSchema = z.object({
  id: z.union([z.number(), z.string()]).nullable().optional(),
  limitation: z.string(),
  observation: z.string(),
});

export const otherAlergies = z.object({
  id: z.union([z.number(), z.string()]).nullable().optional(),
  alergy: z.string(),
  observation: z.string(),
});

const formSchema = z.object({
  bloodPressure: z.number({ coerce: true }).nullable().default(null),
  bloodType: z.string().nullable().default(null),
  bpm: z.number({ coerce: true }).nullable().default(null),
  entryDate: z.custom<Dayjs>((val) => val instanceof dayjs, "Fecha incorrecta"),
  entryReason: z.string().default(""),
  eps: z.string().nullable().default(null),
  externalService: z.string().nullable().default(null),
  externalServicePhone: z.string().nullable().default(null),
  hasExternalService: z.boolean().default(false),
  height: z.number({ coerce: true }).nullable().default(null),
  medicalTreatments: z.array(z.string()).default([]),
  specialConditions: z.array(z.string()).default([]),
  pharmacotherapeuticRegimen: z
    .array(pharmacotherapeuticRegimenSchema)
    .default([]),
  nursingCarePlan: z.array(nursingCarePlanSchema).default([]),
  physioterapeuticRegimen: z.array(physioterapeuticRegimenSchema).default([]),
  diet: z.array(dietSchema).default([]),
  alergies: z.array(alergiesSchema).default([]),
  disabilities: z.array(disabilitySchema).default([]),
  limitations: z.array(limitationsSchema).default([]),
  otherAlergies: z.array(otherAlergies).default([]),
  surgeries: z.array(surgeriesSchema).default([]),
  temperature: z.number({ coerce: true }).nullable().default(null),
  weight: z.number({ coerce: true }).nullable().default(null),
  feeding: z.string(),
  sleepType: z.string(),
  continence: z.string(),
  mobility: z.string(),
  personalCare: z.string(),
  personalAppearance: z.string(),
  tabaquism: z.boolean(),
  psycoactive: z.boolean(),
  alcholism: z.boolean(),
  caffeine: z.boolean(),
  verbalCommunication: z.string(),
  nonVerbalCommunication: z.string(),
  mood: z.string(),
  abused: z.boolean(),
  initialDiagnosis: z.string(),
});

export type FormValues = z.infer<typeof formSchema>;

export const MedicalRecord: React.FC = () => {
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <Layout style={{ minHeight: "100vh" }}>
        <Form layout="vertical">
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
              <SocialPerception />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card
                bordered
                title={<Title level={4}>Diagnóstico inicial</Title>}
                style={{ marginBottom: 8 }}
              >
                <Form.Item
                  label="Observaciones"
                  name="observacionesDiagnostico"
                >
                  <Controller
                    control={methods.control}
                    name="initialDiagnosis"
                    render={({ field }) => (
                      <Input
                        {...field}
                        multiple
                        placeholder="Ingrese las observaciones del diagnóstico inicial"
                      />
                    )}
                  />
                </Form.Item>
              </Card>
            </Col>
          </Row>
          {/*<Row gutter={[16, 16]}>
            <Col span={24}>
              <Card
                bordered
                extra={
                  <Button icon={<PlusOutlined />} className="main-button-white">
                    Nuevo
                  </Button>
                }
                title={
                  <Title level={4} style={{ margin: 0 }}>
                    Pruebas y Test
                  </Title>
                }
                style={{ marginBottom: 8 }}
              >
                <Table
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
                  dataSource={[]}
                  pagination={false}
                />
              </Card>
            </Col>
          </Row>*/}
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card
                bordered
                extra={
                  <Button icon={<PlusOutlined />} className="main-button-white">
                    Agregar
                  </Button>
                }
                title={
                  <Title level={4} style={{ margin: 0 }}>
                    Adjuntar documentos
                  </Title>
                }
              >
                <div style={{ textAlign: "center", padding: "16px" }}>
                  <Text>No se han adjuntado documentos.</Text>
                </div>
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]} justify="end" style={{ marginTop: 20 }}>
            <Col>
              <Button className="main-button-white" style={{ marginRight: 8 }}>
                Restablecer
              </Button>
              <Button
                type="primary"
                style={{
                  backgroundColor: "#722ed1",
                  borderColor: "#722ed1",
                }}
                onClick={methods.handleSubmit(onSubmit)}
              >
                Guardar y continuar
              </Button>
            </Col>
          </Row>
        </Form>
      </Layout>
    </FormProvider>
  );
};
