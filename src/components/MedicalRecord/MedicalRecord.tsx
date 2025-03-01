import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Flex,
  Form,
  Input,
  Layout,
  Row,
  Spin,
  Typography,
} from "antd";
import dayjs from "dayjs";
import type {
  MedicalRecord as MedicalRecordType,
  UserCare,
  UserIntervention,
  UserVaccine,
} from "../../types";
import type { UserMedicine } from "../../types";
import { BasicHealthData } from "./components/BasicHealthData/BasicHealthData";
import { BiophysicalSkills } from "./components/BiophysicalSkills/BiophysicalSkills";
import { Controller, FormProvider } from "react-hook-form";
import { EntryData } from "./components/EntryData/EntryData";
import {
  FormValues,
  NursingCarePlan,
  PharmacoRegimen,
  PhysioRegimen,
  Vaccine,
  formSchema,
} from "./schema/schema";
import { MedicalServices } from "./components/MedicalServices/MedicalServices";
import { MedicalTreatments } from "./components/MedicalTreatments/MedicalTreatments";
import { PhysicalExploration } from "./components/PhysicalExploration/PhysicalExploration";
import { PlusOutlined } from "@ant-design/icons";
import { SocialPerception } from "./components/SocialPerception/SocialPerception";
import { SpecialConditions } from "./components/SpecialConditions/SpecialConditions";
import { Toxicology } from "./components/Toxicology/Toxicology";
import { UserInfo } from "./components/UserInfo/UserInfo";
import { Vaccines } from "./components/Vaccines/Vaccines";
import { useCreateUserMedicalRecord } from "../../hooks/useCreateUserMedicalRecord/useCreateUserMedicalRecord";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useGetRecordCares } from "../../hooks/useGetUserCares/useGetUserCares";
import { useGetRecordMedicines } from "../../hooks/useGetRecordMedicines/useGetRecordMedicines";
import { useGetUserMedicalRecord } from "../../hooks/useGetUserMedicalRecord/useGetUserMedicalRecord";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetRecordInterventions } from "../../hooks/useGetUserInterventions/useGetUserInterventions";
import { useGetRecordVaccines } from "../../hooks/useGetUserVaccines/useGetUserVaccines";

const { Title, Text } = Typography;

export const MedicalRecord: React.FC = () => {
  const params = useParams();
  const userId = params.id;

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  const { reset, getValues } = methods;

  const { mutate: createUserMedicalRecord, isPending: isLoadingCreation } =
    useCreateUserMedicalRecord(userId);

  const { data: userMedicalRecord, isLoading: loadingUserMedicalRecord } =
    useGetUserMedicalRecord(userId);

  const { data: userMedicines, isLoading: loadingUserMedicines } =
    useGetRecordMedicines(userMedicalRecord?.data.data?.id_historiaclinica);

  const { data: userCares, isLoading: loadingUserCares } = useGetRecordCares(
    userMedicalRecord?.data.data?.id_historiaclinica
  );

  const { data: userInterventions, isLoading: loadingUserInterventions } =
    useGetRecordInterventions(userMedicalRecord?.data.data?.id_historiaclinica);

  const { data: userVaccines, isLoading: loadingVaccines } =
    useGetRecordVaccines(userMedicalRecord?.data.data?.id_historiaclinica);

  const onSubmit = (data: FormValues) => {
    const record: MedicalRecordType = {
      Tiene_OtrasAlergias: !!data.otherAlergies.length,
      Tienedieta_especial: !!data.diet.length,
      alcoholismo: data.alcholism,
      alergico_medicamento: !!data.alergies.length,
      altura: data.height,
      apariencia_personal: data.personalAppearance + "",
      cafeina: data.caffeine,
      cirugias: data.surgeries
        .map((a) => `${a.observation}:${a.date.format("YYYY-MM-DD")}`)
        .join(","),
      comunicacion_no_verbal: data.nonVerbalCommunication,
      comunicacion_verbal: data.verbalCommunication,
      continencia: data.continence,
      cuidado_personal: data.personalCare + "",
      dieta_especial: data.diet.map((a) => a.diet).join(","),
      discapacidades: data.disabilities.map((a) => a.disability).join(","),
      emer_medica: data.externalService + "",
      eps: data.eps + "",
      estado_de_animo: data.mood,
      fecha_ingreso: data.entryDate.format("YYYY-MM-DD"),
      frecuencia_cardiaca: Number(data.bpm),
      historial_cirugias: "",
      id_usuario: Number(userId),
      limitaciones: data.limitations.map((a) => a.limitation).join(","),
      maltratado: data.abused,
      maltrato: data.abused,
      medicamentos_alergia: data.alergies.map((a) => a.medicine).join(","),
      motivo_ingreso: data.entryReason,
      observ_dietaEspecial: "",
      observ_otrasalergias: "",
      observaciones_iniciales: data.initialDiagnosis + "",
      otras_alergias: data.otherAlergies.map((a) => a.alergy).join(","),
      peso: Number(data.weight),
      presion_arterial: Number(data.bloodPressure),
      sustanciaspsico: data.psycoactive,
      tabaquismo: data.tabaquism,
      telefono_emermedica: data.externalServicePhone + "",
      temperatura_corporal: Number(data.temperature),
      tipo_alimentacion: data.feeding + "",
      tipo_de_movilidad: data.mobility + "",
      tipo_de_sueno: data.sleepType + "",
      tipo_sangre: data.bloodType ?? "O+",
    };

    const medicines: UserMedicine[] = [];
    data.pharmacotherapeuticRegimen.forEach((p) => {
      const medicine: UserMedicine = {
        Fecha_inicio: p.startDate.format("YYYY-MM-DD"),
        fecha_fin: p.endDate.format("YYYY-MM-DD"),
        medicamento: p.medicine,
        periodicidad: p.frequency,
      };
      medicines.push(medicine);
    });

    const cares: UserCare[] = [];
    data.nursingCarePlan.forEach((n) => {
      const care: UserCare = {
        diagnostico: n.diagnosis,
        frecuencia: n.frequency,
        intervencion: n.intervention,
      };
      cares.push(care);
    });

    const interventions: UserIntervention[] = [];
    data.physioterapeuticRegimen.forEach((n) => {
      const intervention: UserIntervention = {
        diagnostico: n.diagnosis,
        frecuencia: n.frequency,
        intervencion: n.intervention,
      };
      interventions.push(intervention);
    });

    const vaccines: UserVaccine[] = [];
    data.vaccines.forEach((v) => {
      const vaccine: UserVaccine = {
        efectos_secundarios: v.secondaryEffects,
        fecha_administracion: v.date?.format("YYYY-MM-DD"),
        fecha_proxima: v.nextDate?.format("YYYY-MM-DD"),
        vacuna: v.name,
      };
      vaccines.push(vaccine);
    });

    if (!userMedicalRecord?.data.data?.id_historiaclinica) {
      createUserMedicalRecord({
        record,
        medicines,
        cares,
        interventions,
        vaccines,
      });
    }
  };

  useEffect(() => {
    if (userMedicalRecord?.data.data) {
      const data = userMedicalRecord.data.data;
      const alergies = data.medicamentos_alergia
        ?.split(",")
        .filter((a) => !!a)
        .map((e) => ({ id: uuidv4(), medicine: e }));
      const diet = data.dieta_especial
        ?.split(",")
        .filter((a) => !!a)
        .map((e) => ({ id: uuidv4(), diet: e }));
      const disabilities = data.discapacidades
        ?.split(",")
        .filter((a) => !!a)
        .map((e) => ({ id: uuidv4(), disability: e }));
      const limitations = data.limitaciones
        ?.split(",")
        .filter((a) => !!a)
        .map((e) => ({ id: uuidv4(), limitation: e }));
      const otherAlergies = data.otras_alergias
        ?.split(",")
        .filter((a) => !!a)
        .map((e) => ({ id: uuidv4(), alergy: e }));
      const surgeries = data.cirugias
        ?.split(",")
        .filter((a) => !!a)
        .map((e) => {
          const info = e.split(":");
          return { id: uuidv4(), date: dayjs(info[1]), observation: info[0] };
        });

      const specialConditions: string[] = [];
      if (alergies?.length) specialConditions.push("alergies");
      if (diet?.length) specialConditions.push("diet");
      if (disabilities?.length) specialConditions.push("disability");
      if (limitations?.length) specialConditions.push("limitations");
      if (otherAlergies?.length) specialConditions.push("otherAlergies");
      if (surgeries?.length) specialConditions.push("surgeries");

      reset((values) => ({
        ...values,
        abused: data.maltratado,
        alcholism: data.alcoholismo,
        alergies: alergies ?? [],
        bloodPressure: data.presion_arterial,
        bloodType: data.tipo_sangre,
        bpm: data.frecuencia_cardiaca,
        caffeine: data.cafeina,
        continence: data.continencia,
        diet: diet ?? [],
        disabilities: disabilities ?? [],
        entryDate: dayjs(data.fecha_ingreso),
        entryReason: data.motivo_ingreso,
        eps: data.eps + "",
        externalService: data.emer_medica + "",
        externalServicePhone: data.telefono_emermedica + "",
        feeding: data.tipo_alimentacion,
        hasExternalService: !!data.emer_medica,
        height: data.altura,
        initialDiagnosis: data.observaciones_iniciales + "",
        limitations: limitations ?? [],
        mobility: data.tipo_de_movilidad,
        mood: data.estado_de_animo,
        nonVerbalCommunication: data.comunicacion_no_verbal,
        otherAlergies: otherAlergies ?? [],
        personalAppearance: data.apariencia_personal,
        personalCare: data.cuidado_personal,
        psycoactive: data.sustanciaspsico,
        sleepType: data.tipo_de_sueno,
        specialConditions,
        surgeries: surgeries ?? [],
        tabaquism: data.tabaquismo,
        temperature: data.temperatura_corporal,
        verbalCommunication: data.comunicacion_verbal,
        weight: data.peso,
      }));
    }
  }, [userMedicalRecord?.data.data, reset]);

  useEffect(() => {
    if (userMedicines?.data.data) {
      const medicines: PharmacoRegimen[] = userMedicines.data.data.map((e) => ({
        id: uuidv4(),
        endDate: dayjs(e.fecha_fin),
        frequency: e.periodicidad,
        medicine: e.medicamento,
        startDate: dayjs(e.Fecha_inicio),
      }));
      const medicalTreatments: string[] = getValues("medicalTreatments") ?? [];
      if (userMedicines.data.data.length)
        medicalTreatments.push("pharmacotherapeuticRegimen");
      reset((values) => ({
        ...values,
        medicalTreatments,
        pharmacotherapeuticRegimen: medicines,
      }));
    }
  }, [userMedicines?.data.data, reset, getValues]);

  useEffect(() => {
    if (userCares?.data.data) {
      const cares: NursingCarePlan[] = userCares.data.data.map((e) => ({
        id: uuidv4(),
        frequency: e.frecuencia,
        diagnosis: e.diagnostico,
        intervention: e.intervencion,
      }));
      const medicalTreatments: string[] = getValues("medicalTreatments") ?? [];
      if (userCares.data.data.length) medicalTreatments.push("nursingCarePlan");
      reset((values) => ({
        ...values,
        medicalTreatments,
        nursingCarePlan: cares,
      }));
    }
  }, [userCares?.data.data, reset, getValues]);

  useEffect(() => {
    if (userInterventions?.data.data) {
      const interventions: PhysioRegimen[] = userInterventions.data.data.map(
        (e) => ({
          id: uuidv4(),
          frequency: e.frecuencia,
          diagnosis: e.diagnostico,
          intervention: e.intervencion,
        })
      );
      const medicalTreatments: string[] = getValues("medicalTreatments") ?? [];
      if (userInterventions.data.data.length)
        medicalTreatments.push("physiotherapeuticIntervention");
      reset((values) => ({
        ...values,
        medicalTreatments,
        physioterapeuticRegimen: interventions,
      }));
    }
  }, [userInterventions?.data.data, reset, getValues]);

  useEffect(() => {
    if (userVaccines?.data.data) {
      const vaccines: Vaccine[] = userVaccines.data.data.map((e) => ({
        id: uuidv4(),
        date: e.fecha_administracion
          ? dayjs(e.fecha_administracion)
          : undefined,
        nextDate: e.fecha_proxima ? dayjs(e.fecha_proxima) : undefined,
        name: e.vacuna,
        secondaryEffects: e.efectos_secundarios,
      }));
      reset((values) => ({
        ...values,
        vaccines,
      }));
    }
  }, [userVaccines?.data.data, reset]);

  if (
    loadingUserMedicalRecord ||
    loadingUserCares ||
    loadingUserMedicines ||
    loadingUserInterventions ||
    loadingVaccines
  ) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: 300 }}>
        <Spin />
      </Flex>
    );
  }

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
                variant="outlined"
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
                variant="outlined"
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
                loading={isLoadingCreation}
                onClick={methods.handleSubmit(onSubmit)}
              >
                {userMedicalRecord?.data.data?.id_historiaclinica
                  ? "Editar"
                  : "Guardar y continuar"}
              </Button>
            </Col>
          </Row>
        </Form>
      </Layout>
    </FormProvider>
  );
};
