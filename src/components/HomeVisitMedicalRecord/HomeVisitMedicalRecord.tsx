import { UploadOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Col,
  Flex,
  Form,
  Input,
  Row,
  Spin,
  Typography,
  Upload,
  Collapse,
  message,
  DatePicker,
  Select,
  Space,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Controller, FormProvider } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useCreateSimplifiedMedicalRecord } from "../../hooks/useCreateUserMedicalRecord/useCreateUserMedicalRecord";
import { useEditSimplifiedRecordMutation } from "../../hooks/useEditRecordMutation/useEditRecordMutation";
import { useGetUserMedicalRecord } from "../../hooks/useGetUserMedicalRecord/useGetUserMedicalRecord";
import { useGetProfessionals } from "../../hooks/useGetProfessionals/useGetProfessionals";
import { useGetUserById } from "../../hooks/useGetUserById/useGetUserById";
import type { MedicalRecord as MedicalRecordType } from "../../types";
import { z } from "zod";

const { Title } = Typography;
const { Panel } = Collapse;
const { TextArea } = Input;

// Schema específico para visitas domiciliarias basado en el mockup
const homeVisitFormSchema = z.object({
  // Datos básicos de ingreso
  fecha_visita: z.any(),
  motivo_consulta: z.string().min(1, "El motivo de consulta es requerido"),
  profesional: z.number().min(1, "El profesional es requerido"),

  // Habilidades biofísicas
  tipo_alimentacion: z.string().min(1, "El tipo de alimentación es requerido"),
  tipo_sueno: z.string().min(1, "El tipo de sueño es requerido"),
  continencia: z.string().min(1, "La continencia es requerida"),
  tipo_movilidad: z.string().min(1, "El tipo de movilidad es requerido"),
  cuidado_personal: z.string().min(1, "El cuidado personal es requerido"),
  apariencia_personal: z.string().min(1, "La apariencia personal es requerida"),

  // Hábitos toxicológicos
  tabaquismo: z.string().min(1, "El tabaquismo es requerido"),
  sustancias_psicoactivas: z
    .string()
    .min(1, "Las sustancias psicoactivas son requeridas"),
  alcoholismo: z.string().min(1, "El alcoholismo es requerido"),
  cafeina: z.string().min(1, "La cafeína es requerida"),

  // Habilidades de percepción social
  comunicacion_verbal: z.string().min(1, "La comunicación verbal es requerida"),
  comunicacion_no_verbal: z
    .string()
    .min(1, "La comunicación no verbal es requerida"),
  estado_animo: z.string().min(1, "El estado de ánimo es requerido"),
  ha_sufrido_maltrato: z.string().min(1, "El maltrato es requerido"),

  // Diagnóstico
  observaciones: z.string().optional(),

  // Archivos adjuntos
  documentos: z.any().optional(),
});

type HomeVisitFormValues = z.infer<typeof homeVisitFormSchema>;

export const HomeVisitMedicalRecord: React.FC = () => {
  const params = useParams();
  const userId = params.id;
  const location = useLocation();
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState<string | string[]>("");
  const [fileList, setFileList] = useState<any[]>([]);

  const methods = useForm<HomeVisitFormValues>({
    resolver: zodResolver(homeVisitFormSchema),
    shouldFocusError: false,
    mode: "onSubmit",
    defaultValues: {
      fecha_visita: dayjs(),
      motivo_consulta: "",
      profesional: 0,
      tipo_alimentacion: "",
      tipo_sueno: "",
      continencia: "",
      tipo_movilidad: "",
      cuidado_personal: "",
      apariencia_personal: "",
      tabaquismo: "",
      sustancias_psicoactivas: "",
      alcoholismo: "",
      cafeina: "",
      comunicacion_verbal: "",
      comunicacion_no_verbal: "",
      estado_animo: "",
      ha_sufrido_maltrato: "",
      observaciones: "",
    },
  });

  const {
    getValues,
    formState: { errors },
    reset,
  } = methods;

  const { mutate: createUserMedicalRecord, isPending: isLoadingCreation } =
    useCreateSimplifiedMedicalRecord(userId);

  const { data: userMedicalRecord, isLoading: loadingUserMedicalRecord } =
    useGetUserMedicalRecord(userId);

  const { mutate: editRecord, isPending: loadingEditing } =
    useEditSimplifiedRecordMutation({
      id: userId,
      recordId: userMedicalRecord?.data.data?.id_historiaclinica,
    });

  const professionalsQuery = useGetProfessionals();
  const { data: user, isLoading: loadingUser } = useGetUserById(userId);

  // Populate form with existing medical record data
  useEffect(() => {
    if (userMedicalRecord?.data.data) {
      const data = userMedicalRecord.data.data;
      reset({
        fecha_visita: data.fecha_ingreso ? dayjs(data.fecha_ingreso) : dayjs(),
        motivo_consulta: data.motivo_ingreso || "",
        profesional: data.id_profesional || 0,
        tipo_alimentacion: data.tipo_alimentacion || "",
        tipo_sueno: data.tipo_de_sueno || "",
        continencia: data.continencia || "",
        tipo_movilidad: data.tipo_de_movilidad || "",
        cuidado_personal: data.cuidado_personal || "",
        apariencia_personal: data.apariencia_personal || "",
        tabaquismo: data.tabaquismo || "",
        sustancias_psicoactivas: data.sustanciaspsico || "",
        alcoholismo: data.alcoholismo || "",
        cafeina: data.cafeina || "",
        comunicacion_verbal: data.comunicacion_verbal || "",
        comunicacion_no_verbal: data.comunicacion_no_verbal || "",
        estado_animo: data.estado_de_animo || "",
        ha_sufrido_maltrato: data.maltratado || "",
        observaciones: data.observaciones_iniciales || "",
      });
    }
  }, [userMedicalRecord?.data.data, reset]);

  // Mapeo de hash a key del Collapse
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash) {
      setActivePanel(hash);
    }
  }, [location.hash]);

  const onSubmit = (data: HomeVisitFormValues) => {
    if (!userId) return;

    // Crear un registro médico simplificado basado en el mockup
    const medicalRecord: MedicalRecordType = {
      id_historiaclinica: userMedicalRecord?.data.data?.id_historiaclinica || 0,
      id_usuario: parseInt(userId),
      id_profesional: data.profesional || null,
      Tiene_OtrasAlergias: false,
      Tienedieta_especial: false,
      alcoholismo: data.alcoholismo,
      alergico_medicamento: false,
      altura: 170, // Default height in cm
      apariencia_personal: data.apariencia_personal,
      cafeina: data.cafeina,
      cirugias: "No",
      comunicacion_no_verbal: data.comunicacion_no_verbal,
      comunicacion_verbal: data.comunicacion_verbal,
      continencia: data.continencia,
      cuidado_personal: data.cuidado_personal,
      dieta_especial: "No",
      discapacidades: "No",
      emer_medica: "No especificado",
      eps: "No especificado",
      estado_de_animo: data.estado_animo,
      fecha_ingreso: data.fecha_visita
        ? data.fecha_visita.format("YYYY-MM-DD")
        : dayjs().format("YYYY-MM-DD"),
      frecuencia_cardiaca: 80, // Default heart rate
      historial_cirugias: "No",
      limitaciones: "No",
      maltratado: data.ha_sufrido_maltrato,
      maltrato: "No",
      medicamentos_alergia: "No",
      motivo_ingreso: data.motivo_consulta,
      observ_dietaEspecial: "No",
      observ_otrasalergias: "No",
      observaciones_iniciales: data.observaciones || "Sin observaciones",
      otras_alergias: "No",
      peso: 70, // Default weight in kg
      presion_arterial: 120, // Default blood pressure
      sustanciaspsico: data.sustancias_psicoactivas,
      tabaquismo: data.tabaquismo,
      telefono_emermedica: "No especificado",
      temperatura_corporal: 37,
      tipo_alimentacion: data.tipo_alimentacion,
      tipo_de_movilidad: data.tipo_movilidad,
      tipo_de_sueno: data.tipo_sueno,
      tipo_sangre: "O+", // Default blood type since it's required
      diagnosticos: data.observaciones || "Sin diagnóstico",
      porte_clinico: data.observaciones || "Sin porte clínico",
    };

    if (!userMedicalRecord?.data.data?.id_historiaclinica) {
      console.log(
        "🆕 Creando nueva historia clínica de visita domiciliaria...",
      );
      createUserMedicalRecord(medicalRecord, {
        onSuccess: () => {
          console.log(
            " Historia clínica de visita domiciliaria creada exitosamente",
          );
          message.success(
            "Historia clínica de visita domiciliaria creada exitosamente",
          );
          navigate(`/visitas-domiciliarias/usuarios/${userId}/detalles`);
        },
        onError: (error) => {
          console.error(" Error al crear la historia clínica:", error);
          message.error("Error al crear la historia clínica");
        },
      });
    } else {
      console.log(" Actualizando historia clínica de visita domiciliaria...");
      editRecord(
        {
          id: parseInt(userId),
          recordId: userMedicalRecord.data.data.id_historiaclinica,
          record: medicalRecord,
        },
        {
          onSuccess: () => {
            console.log(
              " Historia clínica de visita domiciliaria actualizada exitosamente",
            );
            message.success(
              "Historia clínica de visita domiciliaria actualizada exitosamente",
            );
            navigate(`/visitas-domiciliarias/usuarios/${userId}/detalles`);
          },
          onError: (error) => {
            console.error(" Error al actualizar la historia clínica:", error);
            message.error("Error al actualizar la historia clínica");
          },
        },
      );
    }
  };

  const handleSaveClick = () => {
    const formData = getValues();
    onSubmit(formData);
  };

  const handlePanelChange = (key: string | string[]) => {
    setActivePanel(key);
  };

  const handleFileChange = (info: any) => {
    setFileList(info.fileList);
  };

  if (loadingUserMedicalRecord) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: 500 }}>
        <Spin size="large" />
      </Flex>
    );
  }

  return (
    <>
      <Breadcrumb
        className="breadcrumb"
        style={{ marginBottom: "16px" }}
        items={[
          { title: "Inicio" },
          { title: "Historia clínica - Visitas Domiciliarias" },
        ]}
      />
      <Title level={3} className="page-title">
        Historia Clínica - Visitas Domiciliarias
      </Title>
      <FormProvider {...methods}>
        <Form layout="vertical" onFinish={handleSaveClick}>
          {/* Card de Datos del Usuario */}
          <Card
            variant="borderless"
            loading={loadingUser}
            style={{ marginBottom: 16 }}
          >
            <Row align="middle" gutter={16}>
              {user?.data.data.url_imagen && (
                <Col span={4}>
                  <Avatar
                    alt="Avatar"
                    size={72}
                    src={user.data.data.url_imagen}
                  />
                </Col>
              )}
              <Col span={20}>
                <Title
                  level={5}
                  style={{
                    textTransform: "uppercase",
                    fontWeight: 400,
                  }}
                >
                  {`${user?.data.data.nombres} ${user?.data.data.apellidos}`}
                </Title>
                <Flex style={{ gap: 28 }}>
                  <Flex vertical gap={10}>
                    <Flex gap={4}>
                      <Typography.Text style={{ fontWeight: "bold" }}>
                        {`${user?.data.data.n_documento}`}
                      </Typography.Text>
                      <Typography.Text>-</Typography.Text>
                      <Typography.Text>
                        {user?.data.data.genero}
                      </Typography.Text>
                      <Typography.Text>-</Typography.Text>
                      <Typography.Text>
                        {dayjs(user?.data.data.fecha_nacimiento).format(
                          "DD-MM-YYYY",
                        )}
                      </Typography.Text>
                      <Typography.Text>-</Typography.Text>
                      <Typography.Text style={{ fontWeight: "bold" }}>
                        {dayjs().diff(
                          dayjs(user?.data.data.fecha_nacimiento),
                          "years",
                        )}{" "}
                        años
                      </Typography.Text>
                    </Flex>
                    <Typography.Text>
                      {user?.data.data.estado_civil}
                    </Typography.Text>
                  </Flex>
                  <Col lg={10}>
                    <Flex vertical gap={10}>
                      <Typography.Text>
                        {user?.data.data.direccion}
                      </Typography.Text>
                      <Flex gap={4}>
                        <Typography.Text>
                          {user?.data.data.telefono}
                        </Typography.Text>
                        <Typography.Text>-</Typography.Text>
                        <Typography.Text>
                          {user?.data.data.email}
                        </Typography.Text>
                      </Flex>
                    </Flex>
                  </Col>
                </Flex>
              </Col>
            </Row>
          </Card>

          <Card>
            <Collapse
              activeKey={activePanel}
              onChange={handlePanelChange}
              style={{ background: "transparent", width: "100%" }}
            >
              <Panel header="Datos básicos de ingreso" key="entry-data">
                <Row gutter={16}>
                  <Col span={8}>
                    <Controller
                      name="fecha_visita"
                      control={methods.control}
                      render={({ field }) => (
                        <Form.Item
                          label="Fecha de visita"
                          validateStatus={errors.fecha_visita ? "error" : ""}
                          help={errors.fecha_visita?.message?.toString()}
                        >
                          <DatePicker
                            {...field}
                            style={{ width: "100%" }}
                            format="YYYY-MM-DD"
                          />
                        </Form.Item>
                      )}
                    />
                  </Col>
                  <Col span={8}>
                    <Controller
                      name="motivo_consulta"
                      control={methods.control}
                      render={({ field }) => (
                        <Form.Item
                          label="Motivo de consulta"
                          validateStatus={errors.motivo_consulta ? "error" : ""}
                          help={errors.motivo_consulta?.message?.toString()}
                        >
                          <Input
                            {...field}
                            placeholder="Ingrese el motivo de consulta"
                          />
                        </Form.Item>
                      )}
                    />
                  </Col>
                  <Col span={8}>
                    <Controller
                      name="profesional"
                      control={methods.control}
                      render={({ field }) => (
                        <Form.Item
                          label="Profesional"
                          validateStatus={errors.profesional ? "error" : ""}
                          help={errors.profesional?.message?.toString()}
                        >
                          <Select
                            {...field}
                            placeholder="Seleccione un profesional"
                            loading={professionalsQuery.isLoading}
                            showSearch
                            filterOption={(input, option) =>
                              !!option?.label.toLowerCase().includes(input)
                            }
                            options={
                              professionalsQuery.data?.data.data.map((p) => ({
                                label: `${p.nombres} ${p.apellidos}`,
                                value: p.id_profesional,
                              })) ?? []
                            }
                          />
                        </Form.Item>
                      )}
                    />
                  </Col>
                </Row>
              </Panel>

              <Panel header="Habilidades biofísicas" key="biophysical-skills">
                <Row gutter={16}>
                  <Col span={8}>
                    <Controller
                      name="tipo_alimentacion"
                      control={methods.control}
                      render={({ field }) => (
                        <Form.Item
                          label="Tipo de alimentación"
                          validateStatus={
                            errors.tipo_alimentacion ? "error" : ""
                          }
                          help={errors.tipo_alimentacion?.message?.toString()}
                        >
                          <Select
                            {...field}
                            placeholder="Seleccione el tipo de alimentación"
                          >
                            <Select.Option value="Normal">Normal</Select.Option>
                            <Select.Option value="Especial">
                              Especial
                            </Select.Option>
                            <Select.Option value="Asistida">
                              Asistida
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      )}
                    />
                  </Col>
                  <Col span={8}>
                    <Controller
                      name="tipo_sueno"
                      control={methods.control}
                      render={({ field }) => (
                        <Form.Item
                          label="Tipo de sueño"
                          validateStatus={errors.tipo_sueno ? "error" : ""}
                          help={errors.tipo_sueno?.message?.toString()}
                        >
                          <Select
                            {...field}
                            placeholder="Seleccione el tipo de sueño"
                          >
                            <Select.Option value="Regular">
                              Regular
                            </Select.Option>
                            <Select.Option value="Irregular">
                              Irregular
                            </Select.Option>
                            <Select.Option value="Fragmentado">
                              Fragmentado
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      )}
                    />
                  </Col>
                  <Col span={8}>
                    <Controller
                      name="continencia"
                      control={methods.control}
                      render={({ field }) => (
                        <Form.Item
                          label="Continencia"
                          validateStatus={errors.continencia ? "error" : ""}
                          help={errors.continencia?.message?.toString()}
                        >
                          <Select
                            {...field}
                            placeholder="Seleccione la continencia"
                          >
                            <Select.Option value="Sí">Sí</Select.Option>
                            <Select.Option value="No">No</Select.Option>
                            <Select.Option value="Parcial">
                              Parcial
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      )}
                    />
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={8}>
                    <Controller
                      name="tipo_movilidad"
                      control={methods.control}
                      render={({ field }) => (
                        <Form.Item
                          label="Tipo de movilidad"
                          validateStatus={errors.tipo_movilidad ? "error" : ""}
                          help={errors.tipo_movilidad?.message?.toString()}
                        >
                          <Select
                            {...field}
                            placeholder="Seleccione el tipo de movilidad"
                          >
                            <Select.Option value="Con ayuda">
                              Con ayuda
                            </Select.Option>
                            <Select.Option value="Sin ayuda">
                              Sin ayuda
                            </Select.Option>
                            <Select.Option value="Limitada">
                              Limitada
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      )}
                    />
                  </Col>
                  <Col span={8}>
                    <Controller
                      name="cuidado_personal"
                      control={methods.control}
                      render={({ field }) => (
                        <Form.Item
                          label="Cuidado personal"
                          validateStatus={
                            errors.cuidado_personal ? "error" : ""
                          }
                          help={errors.cuidado_personal?.message?.toString()}
                        >
                          <Select
                            {...field}
                            placeholder="Seleccione el cuidado personal"
                          >
                            <Select.Option value="Con ayuda parcial">
                              Con ayuda parcial
                            </Select.Option>
                            <Select.Option value="Independiente">
                              Independiente
                            </Select.Option>
                            <Select.Option value="Dependiente">
                              Dependiente
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      )}
                    />
                  </Col>
                  <Col span={8}>
                    <Controller
                      name="apariencia_personal"
                      control={methods.control}
                      render={({ field }) => (
                        <Form.Item
                          label="Apariencia personal"
                          validateStatus={
                            errors.apariencia_personal ? "error" : ""
                          }
                          help={errors.apariencia_personal?.message?.toString()}
                        >
                          <Select
                            {...field}
                            placeholder="Seleccione la apariencia personal"
                          >
                            <Select.Option value="Buena">Buena</Select.Option>
                            <Select.Option value="Regular">
                              Regular
                            </Select.Option>
                            <Select.Option value="Descuidada">
                              Descuidada
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      )}
                    />
                  </Col>
                </Row>
              </Panel>

              <Panel
                header="Hábitos o antecedentes toxicológicos"
                key="toxicology"
              >
                <Row gutter={16}>
                  <Col span={6}>
                    <Controller
                      name="tabaquismo"
                      control={methods.control}
                      render={({ field }) => (
                        <Form.Item
                          label="Tabaquismo"
                          validateStatus={errors.tabaquismo ? "error" : ""}
                          help={errors.tabaquismo?.message?.toString()}
                        >
                          <Select {...field} placeholder="Seleccione">
                            <Select.Option value="Sí">Sí</Select.Option>
                            <Select.Option value="No">No</Select.Option>
                            <Select.Option value="Exfumador">
                              Exfumador
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      )}
                    />
                  </Col>
                  <Col span={6}>
                    <Controller
                      name="sustancias_psicoactivas"
                      control={methods.control}
                      render={({ field }) => (
                        <Form.Item
                          label="Sustancias Psicoactivas"
                          validateStatus={
                            errors.sustancias_psicoactivas ? "error" : ""
                          }
                          help={errors.sustancias_psicoactivas?.message?.toString()}
                        >
                          <Select {...field} placeholder="Seleccione">
                            <Select.Option value="Sí">Sí</Select.Option>
                            <Select.Option value="No">No</Select.Option>
                          </Select>
                        </Form.Item>
                      )}
                    />
                  </Col>
                  <Col span={6}>
                    <Controller
                      name="alcoholismo"
                      control={methods.control}
                      render={({ field }) => (
                        <Form.Item
                          label="Alcoholismo"
                          validateStatus={errors.alcoholismo ? "error" : ""}
                          help={errors.alcoholismo?.message?.toString()}
                        >
                          <Select {...field} placeholder="Seleccione">
                            <Select.Option value="Sí">Sí</Select.Option>
                            <Select.Option value="No">No</Select.Option>
                            <Select.Option value="Social">Social</Select.Option>
                          </Select>
                        </Form.Item>
                      )}
                    />
                  </Col>
                  <Col span={6}>
                    <Controller
                      name="cafeina"
                      control={methods.control}
                      render={({ field }) => (
                        <Form.Item
                          label="Cafeína"
                          validateStatus={errors.cafeina ? "error" : ""}
                          help={errors.cafeina?.message?.toString()}
                        >
                          <Select {...field} placeholder="Seleccione">
                            <Select.Option value="Sí">Sí</Select.Option>
                            <Select.Option value="No">No</Select.Option>
                            <Select.Option value="Moderado">
                              Moderado
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      )}
                    />
                  </Col>
                </Row>
              </Panel>

              <Panel
                header="Habilidades de percepción social"
                key="social-perception"
              >
                <Row gutter={16}>
                  <Col span={6}>
                    <Controller
                      name="comunicacion_verbal"
                      control={methods.control}
                      render={({ field }) => (
                        <Form.Item
                          label="Comunicación verbal"
                          validateStatus={
                            errors.comunicacion_verbal ? "error" : ""
                          }
                          help={errors.comunicacion_verbal?.message?.toString()}
                        >
                          <Select {...field} placeholder="Seleccione">
                            <Select.Option value="Activa">Activa</Select.Option>
                            <Select.Option value="Limitada">
                              Limitada
                            </Select.Option>
                            <Select.Option value="Ausente">
                              Ausente
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      )}
                    />
                  </Col>
                  <Col span={6}>
                    <Controller
                      name="comunicacion_no_verbal"
                      control={methods.control}
                      render={({ field }) => (
                        <Form.Item
                          label="Comunicación no verbal"
                          validateStatus={
                            errors.comunicacion_no_verbal ? "error" : ""
                          }
                          help={errors.comunicacion_no_verbal?.message?.toString()}
                        >
                          <Select {...field} placeholder="Seleccione">
                            <Select.Option value="Activa">Activa</Select.Option>
                            <Select.Option value="Limitada">
                              Limitada
                            </Select.Option>
                            <Select.Option value="Ausente">
                              Ausente
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      )}
                    />
                  </Col>
                  <Col span={6}>
                    <Controller
                      name="estado_animo"
                      control={methods.control}
                      render={({ field }) => (
                        <Form.Item
                          label="Estado de ánimo"
                          validateStatus={errors.estado_animo ? "error" : ""}
                          help={errors.estado_animo?.message?.toString()}
                        >
                          <Select {...field} placeholder="Seleccione">
                            <Select.Option value="Alegre">Alegre</Select.Option>
                            <Select.Option value="Triste">Triste</Select.Option>
                            <Select.Option value="Neutro">Neutro</Select.Option>
                            <Select.Option value="Irritable">
                              Irritable
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      )}
                    />
                  </Col>
                  <Col span={6}>
                    <Controller
                      name="ha_sufrido_maltrato"
                      control={methods.control}
                      render={({ field }) => (
                        <Form.Item
                          label="Ha sufrido maltrato"
                          validateStatus={
                            errors.ha_sufrido_maltrato ? "error" : ""
                          }
                          help={errors.ha_sufrido_maltrato?.message?.toString()}
                        >
                          <Select {...field} placeholder="Seleccione">
                            <Select.Option value="Sí">Sí</Select.Option>
                            <Select.Option value="No">No</Select.Option>
                            <Select.Option value="No sabe">
                              No sabe
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      )}
                    />
                  </Col>
                </Row>
              </Panel>

              <Panel header="Diagnóstico" key="diagnosis">
                <Controller
                  name="observaciones"
                  control={methods.control}
                  render={({ field }) => (
                    <Form.Item
                      label="Observaciones"
                      validateStatus={errors.observaciones ? "error" : ""}
                      help={errors.observaciones?.message?.toString()}
                    >
                      <TextArea
                        {...field}
                        rows={4}
                        placeholder="Aquí se agregan las observaciones del diagnóstico inicial"
                      />
                    </Form.Item>
                  )}
                />
              </Panel>

              <Panel header="Adjuntar documentos" key="documents">
                <Form.Item label="Documentos">
                  <Upload
                    listType="text"
                    fileList={fileList}
                    onChange={handleFileChange}
                    beforeUpload={() => false}
                  >
                    <Button icon={<UploadOutlined />}>Agregar</Button>
                  </Upload>
                </Form.Item>
              </Panel>
            </Collapse>
            <Flex justify="end" style={{ marginTop: 24 }}>
              <Space>
                <Button
                  onClick={() =>
                    navigate(
                      `/visitas-domiciliarias/usuarios/${userId}/detalles`,
                    )
                  }
                >
                  Cancelar
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoadingCreation || loadingEditing}
                  size="large"
                >
                  Guardar y continuar
                </Button>
              </Space>
            </Flex>
          </Card>
        </Form>
      </FormProvider>
    </>
  );
};
