import { UploadOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Upload,
  Collapse,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Controller, FormProvider } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useParams, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useCreateUserMedicalRecord } from "../../hooks/useCreateUserMedicalRecord/useCreateUserMedicalRecord";
import { useEditRecordMutation } from "../../hooks/useEditRecordMutation/useEditRecordMutation";
import { useGetRecordMedicines } from "../../hooks/useGetRecordMedicines/useGetRecordMedicines";
import { useGetRecordCares } from "../../hooks/useGetUserCares/useGetUserCares";
import { useGetRecordInterventions } from "../../hooks/useGetUserInterventions/useGetUserInterventions";
import { useGetUserMedicalRecord } from "../../hooks/useGetUserMedicalRecord/useGetUserMedicalRecord";
import type {
  MedicalRecord as MedicalRecordType,
  UserCare,
  UserIntervention,
} from "../../types";
import type { UserMedicine } from "../../types";
import { BasicHealthData } from "./components/BasicHealthData/BasicHealthData";
import { BiophysicalSkills } from "./components/BiophysicalSkills/BiophysicalSkills";
import { EntryData } from "./components/EntryData/EntryData";
import { MedicalServices } from "./components/MedicalServices/MedicalServices";
import { MedicalTreatments } from "./components/MedicalTreatments/MedicalTreatments";
import { SocialPerception } from "./components/SocialPerception/SocialPerception";
import { SpecialConditions } from "./components/SpecialConditions/SpecialConditions";
import { Toxicology } from "./components/Toxicology/Toxicology";
import { UserInfo } from "./components/UserInfo/UserInfo";
import {
  type FormValues,
  type NursingCarePlan,
  type PharmacoRegimen,
  type PhysioRegimen,
  formSchema,
} from "./schema/schema";
import { PhysicalExploration } from "./components/PhysicalExploration/PhysicalExploration";
import { Vaccines } from "./components/Vaccines/Vaccines";
import { useGetUserById } from "../../hooks/useGetUserById/useGetUserById";

const { Title } = Typography;
const { Panel } = Collapse;

export const MedicalRecord: React.FC = () => {
  const params = useParams();
  const userId = params.id;
  const location = useLocation();
  const [activePanel, setActivePanel] = useState<string | string[]>("");
  const [activeSubPanel, setActiveSubPanel] = useState<string | string[]>("");

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    shouldFocusError: false,
  });
  const { reset, getValues } = methods;

  const { mutate: createUserMedicalRecord, isPending: isLoadingCreation } =
    useCreateUserMedicalRecord(userId);

  const { data: user } = useGetUserById(userId);

  const { data: userMedicalRecord, isLoading: loadingUserMedicalRecord } =
    useGetUserMedicalRecord(userId);

  const { data: userMedicines, isLoading: loadingUserMedicines } =
    useGetRecordMedicines(userMedicalRecord?.data.data?.id_historiaclinica);

  const { data: userCares, isLoading: loadingUserCares } = useGetRecordCares(
    userMedicalRecord?.data.data?.id_historiaclinica,
  );

  const { data: userInterventions, isLoading: loadingUserInterventions } =
    useGetRecordInterventions(userMedicalRecord?.data.data?.id_historiaclinica);

  const { mutate: editRecord, isPending: loadingEditing } =
    useEditRecordMutation({
      id: userId,
      recordId: userMedicalRecord?.data.data?.id_historiaclinica,
    });

  // Mapeo de hash a key del Collapse
  const hashToPanelKey: Record<string, string> = {
    "#user-info": "user-info",
    "#medical-services": "medical-services",
    "#entry-data": "entry-data",
    "#basic-health-data": "basic-health-data",
    "#physical-exploration": "physical-exploration",
    "#medical-treatments": "medical-treatments",
    "#special-conditions": "special-conditions",
    "#vaccines": "vaccines",
    "#biophysical-skills": "biophysical-skills",
    "#toxicology": "toxicology",
    "#social-perception": "social-perception",
    "#dieta": "special-conditions",
    "#diet": "special-conditions",
    "#observaciones-dieta": "special-conditions",
    "#apoyos-tratamientos": "special-conditions",
    "#discapacidad": "special-conditions",
    "#limitaciones": "special-conditions",
    "#tratamientos": "special-conditions",
    "#surgeries": "special-conditions",
    "#otherAlergies": "special-conditions",
  };

  // Mapeo de hash a key del sub-panel del Collapse anidado
  const hashToSubPanelKey: Record<string, string> = {
    "#discapacidad": "disability",
    "#limitaciones": "limitations",
    "#dieta": "diet",
    "#tratamientos": "alergies", // Asumiendo que tratamientos se refiere a alergias a medicamentos
    "#surgeries": "surgeries",
    "#otherAlergies": "otherAlergies",
  };

  useEffect(() => {
    if (location.hash && hashToPanelKey[location.hash]) {
      setActivePanel(hashToPanelKey[location.hash]);

      // Si es un hash que corresponde a un sub-panel, también abrir ese sub-panel
      if (hashToSubPanelKey[location.hash]) {
        setActiveSubPanel(hashToSubPanelKey[location.hash]);
      }

      setTimeout(() => {
        const el = document.getElementById(location.hash.replace("#", ""));
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 200);
    }
  }, [location.hash]);

  const onSubmit = (data: FormValues) => {
    const record: MedicalRecordType = {
      Tiene_OtrasAlergias: !!data.otherAlergies.length,
      Tienedieta_especial: !!data.diet.length,
      alcoholismo: data.alcholism,
      alergico_medicamento: !!data.alergies.length,
      altura: data.height,
      apariencia_personal: `${data.personalAppearance}`,
      cafeina: data.caffeine,
      cirugias: data.surgeries
        .map((a) => `${a.observation}:${a.date.format("YYYY-MM-DD")}`)
        .join(","),
      diagnosticos: data.diagnostic.map((d) => d.diagnostic).join(","),
      comunicacion_no_verbal: data.nonVerbalCommunication,
      comunicacion_verbal: data.verbalCommunication,
      continencia: data.continence,
      cuidado_personal: `${data.personalCare}`,
      dieta_especial: data.diet.map((a) => a.diet).join(","),
      discapacidades: data.disabilities.map((a) => a.disability).join(","),
      emer_medica: `${data.externalService}`,
      eps: `${data.eps}`,
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
      observaciones_iniciales: `${data.initialDiagnosis}`,
      otras_alergias: data.otherAlergies.map((a) => a.alergy).join(","),
      peso: Number(data.weight),
      presion_arterial: Number(data.bloodPressure),
      sustanciaspsico: data.psycoactive,
      tabaquismo: data.tabaquism,
      telefono_emermedica: `${data.externalServicePhone}`,
      temperatura_corporal: Number(data.temperature),
      tipo_alimentacion: `${data.feeding}`,
      tipo_de_movilidad: `${data.mobility}`,
      tipo_de_sueno: `${data.sleepType}`,
      tipo_sangre: data.bloodType ?? "O+",
    };

    const medicines: UserMedicine[] = [];
    for (const p of data.pharmacotherapeuticRegimen) {
      const medicine: UserMedicine = {
        id: p.id ?? "",
        medicamento: p.medicine,
        periodicidad: p.frequency,
        observaciones: p.observations,
      };
      medicines.push(medicine);
    }

    const cares: UserCare[] = [];
    for (const n of data.nursingCarePlan) {
      const care: UserCare = {
        id: n.id ?? "",
        diagnostico: n.diagnosis,
        frecuencia: n.frequency,
        intervencion: n.intervention,
      };
      cares.push(care);
    }

    const interventions: UserIntervention[] = [];
    for (const n of data.physioterapeuticRegimen) {
      const intervention: UserIntervention = {
        id: n.id ?? "",
        diagnostico: n.diagnosis,
        frecuencia: n.frequency,
        intervencion: n.intervention,
      };
      interventions.push(intervention);
    }

    /* const vaccines: UserVaccine[] = [];
    for (const v of data.vaccines) {
      const vaccine: UserVaccine = {
        id: v.id ?? "",
        efectos_secundarios: v.secondaryEffects,
        fecha_administracion: v.date?.format("YYYY-MM-DD"),
        fecha_proxima: v.nextDate?.format("YYYY-MM-DD"),
        vacuna: v.name,
      };
      vaccines.push(vaccine);
    }*/

    if (!userMedicalRecord?.data.data?.id_historiaclinica) {
      createUserMedicalRecord({
        data: {
          record,
          medicines,
          cares,
          interventions,
        },
        files: data.attachedDocuments,
      });
      return;
    }

    editRecord({
      id: Number(userId),
      recordId: Number(userMedicalRecord?.data.data.id_historiaclinica),
      record: {
        record,
        medicines: medicines.filter((m) => typeof m.id === "string"),
        cares: cares.filter((m) => typeof m.id === "string"),
        interventions: interventions.filter((i) => typeof i.id === "string"),
      },
    });
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
      const diagnostics = data.diagnosticos
        ?.split(",")
        .filter((a) => !!a)
        .map((e) => ({ id: uuidv4(), diagnostics: e }));
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
      if (diagnostics?.length) specialConditions.push("diagnostic");

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
        eps: `${data.eps}`,
        externalService: `${data.emer_medica}`,
        externalServicePhone: `${data.telefono_emermedica}`,
        feeding: data.tipo_alimentacion,
        hasExternalService: !!data.emer_medica,
        height: data.altura,
        initialDiagnosis: `${data.observaciones_iniciales}`,
        limitations: limitations ?? [],
        mobility: data.tipo_de_movilidad,
        mood: data.estado_de_animo,
        nonVerbalCommunication: data.comunicacion_no_verbal,
        otherAlergies: otherAlergies ?? [],
        personalAppearance: data.apariencia_personal,
        personalCare: data.cuidado_personal,
        psycoactive: data.sustanciaspsico,
        sleepType: data.tipo_de_sueno,
        diagnostic:
          diagnostics?.map((d) => ({ id: d.id, diagnostic: d.diagnostics })) ??
          [],
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
        id: e.id,
        frequency: e.periodicidad,
        medicine: e.medicamento,
        observations: e.observaciones,
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
        id: e.id,
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
          id: e.id,
          frequency: e.frecuencia,
          diagnosis: e.diagnostico,
          intervention: e.intervencion,
        }),
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

  if (
    loadingUserMedicalRecord ||
    loadingUserCares ||
    loadingUserMedicines ||
    loadingUserInterventions
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
          <Collapse
            accordion
            style={{ width: "100%", background: "transparent" }}
            activeKey={activePanel}
            onChange={setActivePanel}
          >
            <Panel header="Datos del usuario" key="user-info">
              <UserInfo />
            </Panel>
            <Panel
              header="Servicio externo para emergencias médicas"
              key="medical-services"
            >
              <MedicalServices />
            </Panel>
            <Panel header="Datos básicos de ingreso" key="entry-data">
              <EntryData />
            </Panel>
            <Panel header="Datos básicos de salud" key="basic-health-data">
              <BasicHealthData />
            </Panel>
            <Panel
              header="Exploración física inicial"
              key="physical-exploration"
            >
              <PhysicalExploration />
            </Panel>
            <Panel
              header="Tratamientos o medicamentos"
              key="medical-treatments"
            >
              <MedicalTreatments />
            </Panel>
            <Panel header="Condiciones especiales" key="special-conditions">
              <SpecialConditions
                activeSubPanel={activeSubPanel}
                setActiveSubPanel={setActiveSubPanel}
              />
            </Panel>
            <Panel header="Esquema de vacunación" key="vaccines">
              <Vaccines />
            </Panel>
            <Panel header="Habilidades biofísicas" key="biophysical-skills">
              <BiophysicalSkills />
            </Panel>
            <Panel
              header="Hábitos o antecedentes toxicológicos"
              key="toxicology"
            >
              <Toxicology />
            </Panel>
            <Panel
              header="Habilidades de percepción social"
              key="social-perception"
            >
              <SocialPerception />
            </Panel>
          </Collapse>
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
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card
                bordered
                title={
                  <Title level={4} style={{ margin: 0 }}>
                    Adjuntar documentos
                  </Title>
                }
              >
                <Controller
                  control={methods.control}
                  name="attachedDocuments"
                  render={({ field }) => (
                    <Upload
                      {...field}
                      beforeUpload={() => false}
                      onChange={(info) => {
                        const files = info.fileList.map(
                          (item) => item.originFileObj || item,
                        );
                        field.onChange(files);
                      }}
                    >
                      <Button
                        icon={<UploadOutlined />}
                        className="main-button-white"
                      >
                        Agregar
                      </Button>
                    </Upload>
                  )}
                />
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]} justify="end" style={{ marginTop: 20 }}>
            <Col>
              {!userMedicalRecord?.data.data?.id_historiaclinica && (
                <Button
                  className="main-button-white"
                  style={{ marginRight: 8 }}
                >
                  Restablecer
                </Button>
              )}
              <Button
                type="primary"
                style={{
                  backgroundColor: "#722ed1",
                  borderColor: "#722ed1",
                }}
                loading={isLoadingCreation || loadingEditing}
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
