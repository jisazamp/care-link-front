import {
  UploadOutlined,
  DownloadOutlined,
  UploadOutlined as ImportOutlined,
} from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  Row,
  Select,
  Spin,
  Switch,
  Typography,
  Upload,
  message,
  Modal,
  Alert,
  Divider,
  Space,
} from "antd";
import request from "axios";
import dayjs, { type Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { z } from "zod";
import {
  CivilStatus,
  type Gender,
  type UserFamilyType,
  type UserStatus,
} from "../../enums";
import { useCreateUserMutation } from "../../hooks/useCreateUserMutation/useCreateUserMutation";
import { useEditUserMutation } from "../../hooks/useEditUserMutation/useEditUserMutation";
import { useGetUserById } from "../../hooks/useGetUserById/useGetUserById";
import { useImageFile } from "../../hooks/useImageFile/useImageFile";
import { useExportUserTemplate } from "../../hooks/useExportUserTemplate/useExportUserTemplate";
import { useImportUsers } from "../../hooks/useImportUsers/useImportUsers";
import type { User } from "../../types";

const { Option } = Select;
const { Text } = Typography;

const formSchema = z.object({
  userId: z.string(),
  userType: z
    .enum(["Recurrente", "Nuevo"], {
      errorMap: () => ({ message: "El tipo de usuario es requerido" }),
    })
    .optional(),
  documentNumber: z
    .string({ message: "El número de documento es requerido" })
    .nonempty("El número de documento es requerido"),
  firstName: z
    .string({ message: "El nombre es requerido" })
    .nonempty("El nombre es requerido"),
  lastName: z
    .string({ message: "Los apellidos son requeridos" })
    .nonempty("Los apellidos son requeridos"),
  gender: z.enum(["Masculino", "Femenino", "Neutro"], {
    errorMap: () => ({ message: "El género es requerido" }),
  }),
  dateOfBirth: z
    .custom<Dayjs>((val) => val instanceof dayjs, "Fecha inválida")
    .refine((date) => date.isBefore(dayjs()), {
      message: "La fecha debe ser anterior al día actual",
    }),
  maritalStatus: z.nativeEnum(CivilStatus, {
    errorMap: () => ({ message: "El estado civil es requerido" }),
  }),
  occupation: z.string().optional(),
  homeVisit: z.boolean().default(false),
  photo: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const NewUser: React.FC = () => {
  const params = useParams();
  const userId = params.id;
  const location = useLocation();

  // Estados para importación masiva
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importResults, setImportResults] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: "Masculino",
      userId: "0000",
      homeVisit: false,
    },
  });

  // Observar el valor del switch para determinar la redirección
  const homeVisitValue = watch("homeVisit");

  // Activar automáticamente el switch si viene desde visitas domiciliarias
  useEffect(() => {
    if (location.state?.activateHomeVisit && !userId) {
      setValue("homeVisit", true);
    }
  }, [location.state?.activateHomeVisit, setValue, userId]);

  const navigate = useNavigate();
  const { data, isError, isLoading, error } = useGetUserById(userId);
  const {
    mutate: createUser,
    isSuccess: isSuccessCreateUser,
    isPending: isPendingCreateUser,
    data: createUserResponse,
  } = useCreateUserMutation();
  const {
    mutate: editUser,
    isSuccess: isSuccessEditUser,
    isPending: isPendingEditUser,
  } = useEditUserMutation(userId);
  const {
    data: imageFile,
    isLoading: isLoadingFile,
    isError: isErrorFile,
  } = useImageFile(
    data?.data.data.url_imagen ?? "",
    "user-photo.jpg",
    "image/jpeg",
  );

  // Hooks para importación/exportación
  const { mutate: exportTemplate, isPending: isExportingTemplate } =
    useExportUserTemplate();

  const { mutate: importUsers, isPending: isImportingUsers } = useImportUsers();

  const onSubmit = (data: FormValues) => {
    const user: Partial<User> = {
      apellidos: data.lastName,
      direccion: null, // Enviar null en lugar de data.address
      email: null, // Enviar null en lugar de data.email
      escribe: false,
      estado: "ACTIVO" as UserStatus,
      estado_civil: data.maritalStatus as CivilStatus,
      fecha_nacimiento: data.dateOfBirth.format("YYYY-MM-DD"),
      fecha_registro: dayjs().toISOString(),
      genero: data.gender as Gender,
      ha_estado_en_otro_centro: false,
      lee: false,
      n_documento: data.documentNumber,
      nombres: data.firstName,
      nucleo_familiar: "Nuclear" as UserFamilyType,
      proteccion_exequial: false,
      telefono: null, // Enviar null en lugar de data.phone
      is_deleted: false,
      profesion: data.occupation ?? "",
      tipo_usuario: data.userType ?? "Nuevo",
      visitas_domiciliarias: data.homeVisit,
    };

    const photoFile = data.photo?.fileList?.[0]?.originFileObj;

    if (!userId) {
      createUser({ user, photoFile });
      return;
    }
    editUser({ user, id: userId, photoFile });
  };

  // Funciones para importación/exportación
  const handleExportTemplate = () => {
    exportTemplate();
    message.success("Descargando plantilla Excel...");
  };

  const handleImportModalOpen = () => {
    setImportModalVisible(true);
    setImportResults(null);
    setSelectedFile(null);
  };

  const handleImportModalClose = () => {
    setImportModalVisible(false);
    setImportResults(null);
    setSelectedFile(null);
  };

  const handleFileSelect = (file: File) => {
    if (!file.name.endsWith(".xlsx")) {
      message.error("Solo se permiten archivos Excel (.xlsx)");
      return false;
    }
    setSelectedFile(file);
    return false; // No subir automáticamente
  };

  const handleImportUsers = () => {
    if (!selectedFile) {
      message.error("Por favor seleccione un archivo Excel");
      return;
    }

    importUsers(selectedFile, {
      onSuccess: (response) => {
        setImportResults(response.data.data);
        message.success(response.data.message);
      },
      onError: (error: any) => {
        message.error(
          error.response?.data?.detail || "Error al importar usuarios",
        );
      },
    });
  };

  useEffect(() => {
    if (!data?.data.data) return;

    const userData = data.data.data;

    const resetValues: FormValues = {
      ...userData,
      dateOfBirth: dayjs(userData.fecha_nacimiento),
      documentNumber: `${userData.n_documento}`,
      firstName: `${userData.nombres}`,
      lastName: `${userData.apellidos}`,
      userId: `${userData.id_usuario}`,
      maritalStatus: userData.estado_civil as CivilStatus,
      gender: userData.genero as Gender,
      occupation: userData.profesion ?? "",
      userType: (userData.tipo_usuario as "Nuevo" | "Recurrente") ?? "Nuevo",
      homeVisit: userData.visitas_domiciliarias ?? false,
    };

    reset(resetValues);
  }, [data?.data.data, reset]);

  useEffect(() => {
    const userData = data?.data.data;
    if (!userData?.url_imagen || !imageFile || isLoadingFile || isErrorFile)
      return;

    const fileList = [
      {
        uid: "-1",
        name: imageFile.name,
        status: "done",
        url: userData.url_imagen,
        originFileObj: imageFile,
      },
    ];

    setValue("photo", { fileList });
  }, [data?.data.data, imageFile, isLoadingFile, isErrorFile, setValue]);

  useEffect(() => {
    if (isSuccessCreateUser || isSuccessEditUser) {
      // Redirigir según el valor del switch "Visita Domiciliaria"
      if (homeVisitValue) {
        // Si el switch está ON, redirigir a la visita existente o crear nueva
        if (isSuccessCreateUser) {
          // Para usuarios nuevos, verificar si ya se creó una visita automáticamente
          const responseData = createUserResponse?.data?.data as any;
          const userId = responseData?.user?.id_usuario;
          const homeVisitId = responseData?.home_visit?.id_visitadomiciliaria;

          if (userId) {
            if (homeVisitId) {
              // Si ya se creó una visita automáticamente, redirigir a editarla
              navigate(
                `/visitas-domiciliarias/usuarios/${userId}/editar-visita/${homeVisitId}`,
              );
            } else {
              // Si no se creó automáticamente, redirigir a crear nueva
              navigate(
                `/visitas-domiciliarias/usuarios/${userId}/nueva-visita`,
              );
            }
          } else {
            navigate("/visitas-domiciliarias/usuarios");
          }
        } else if (isSuccessEditUser && data?.data.data?.id_usuario) {
          // Para edición, usar el ID del usuario existente
          const userId = data.data.data.id_usuario;
          navigate(`/visitas-domiciliarias/usuarios/${userId}/nueva-visita`);
        } else {
          // Fallback: redirigir a la lista de usuarios con visitas domiciliarias
          navigate("/visitas-domiciliarias/usuarios");
        }
      } else {
        // Si el switch está OFF, redirigir al módulo de usuarios regular
        navigate("/usuarios");
      }
    }
  }, [
    isSuccessCreateUser,
    isSuccessEditUser,
    navigate,
    homeVisitValue,
    createUserResponse,
    data?.data.data?.id_usuario,
  ]);

  if (isLoading) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: "300px" }}>
        <Spin />
      </Flex>
    );
  }

  if (isError) {
    return (
      <Flex align="center">
        <Typography.Text style={{ fontSize: "30px" }}>
          {request.isAxiosError(error) &&
            (error.response?.data as { error: string[] }).error?.[0]}
        </Typography.Text>
      </Flex>
    );
  }

  return (
    <>
      <Breadcrumb
        key={Date.now().toString()}
        items={[
          { title: "Inicio" },
          { title: userId ? "Editar usuario" : "Nuevo usuario" },
        ]}
        style={{ margin: "16px 0" }}
      />

      {/* Botones de importación/exportación - Solo mostrar si no es edición */}
      {!userId && (
        <Card
          title="Importación Masiva de Usuarios"
          style={{ marginBottom: "16px" }}
          extra={
            <Space>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleExportTemplate}
                loading={isExportingTemplate}
                type="primary"
              >
                Descargar Plantilla
              </Button>
              <Button
                icon={<ImportOutlined />}
                onClick={handleImportModalOpen}
                type="default"
              >
                Importar Usuarios
              </Button>
            </Space>
          }
        >
          <Alert
            message="Importación Masiva"
            description="Esta funcionalidad permite crear múltiples usuarios para asistencia a la fundación desde un archivo Excel. Solo se crearán usuarios que NO estén relacionados con visitas domiciliarias."
            type="info"
            showIcon
            style={{ marginBottom: "16px" }}
          />
        </Card>
      )}

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title="Datos básicos" bordered={false}>
              <Row gutter={24}>
                <Col span={8}>
                  <Form.Item
                    label="Id. usuario"
                    validateStatus={errors.userId ? "error" : ""}
                    help={
                      errors.userId?.message && (
                        <Text type="danger">{errors.userId.message}</Text>
                      )
                    }
                  >
                    <Controller
                      name="userId"
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder="0001" disabled />
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Tipo de usuario"
                    validateStatus={errors.userType ? "error" : ""}
                    help={
                      errors.userType?.message && (
                        <Text type="danger">{errors.userType.message}</Text>
                      )
                    }
                  >
                    <Controller
                      name="userType"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder="Seleccione tipo de usuario"
                        >
                          <Option value="Recurrente">Recurrente</Option>
                          <Option value="Nuevo">Nuevo</Option>
                        </Select>
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="N° Documento"
                    validateStatus={errors.documentNumber ? "error" : ""}
                    help={
                      errors.documentNumber?.message && (
                        <Text type="danger">
                          {errors.documentNumber.message}
                        </Text>
                      )
                    }
                  >
                    <Controller
                      name="documentNumber"
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder="1223334444" />
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Nombres"
                    validateStatus={errors.firstName ? "error" : ""}
                    help={
                      errors.firstName?.message && (
                        <Text type="danger">{errors.firstName.message}</Text>
                      )
                    }
                  >
                    <Controller
                      name="firstName"
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder="Juan Pablo" />
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Apellidos"
                    validateStatus={errors.lastName ? "error" : ""}
                    help={
                      errors.lastName?.message && (
                        <Text type="danger">{errors.lastName.message}</Text>
                      )
                    }
                  >
                    <Controller
                      name="lastName"
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder="Vera" />
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Género"
                    validateStatus={errors.gender ? "error" : ""}
                    help={
                      errors.gender?.message && (
                        <Text type="danger">{errors.gender.message}</Text>
                      )
                    }
                  >
                    <Controller
                      name="gender"
                      control={control}
                      render={({ field }) => (
                        <Select {...field}>
                          <Option value="Masculino">Masculino</Option>
                          <Option value="Femenino">Femenino</Option>
                          <Option value="Neutro">Neutro</Option>
                        </Select>
                      )}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={8}>
                  <Form.Item
                    label="Fecha de nacimiento"
                    validateStatus={errors.dateOfBirth ? "error" : ""}
                    help={
                      errors.dateOfBirth?.message && (
                        <Text type="danger">{errors.dateOfBirth.message}</Text>
                      )
                    }
                  >
                    <Controller
                      name="dateOfBirth"
                      control={control}
                      render={({ field }) => (
                        <DatePicker {...field} style={{ width: "100%" }} />
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Estado civil"
                    validateStatus={errors.maritalStatus ? "error" : ""}
                    help={
                      errors.maritalStatus?.message && (
                        <Text type="danger">
                          {errors.maritalStatus.message}
                        </Text>
                      )
                    }
                  >
                    <Controller
                      name="maritalStatus"
                      control={control}
                      render={({ field }) => (
                        <Select {...field}>
                          <Option value="Casado">Casado</Option>
                          <Option value="Soltero">Soltero</Option>
                          <Option value="Divorciado">Divorciado</Option>
                          <Option value="Viudo">Viudo</Option>
                        </Select>
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Ocupación"
                    validateStatus={errors.occupation ? "error" : ""}
                    help={
                      errors.occupation?.message && (
                        <Text type="danger">{errors.occupation.message}</Text>
                      )
                    }
                  >
                    <Controller
                      name="occupation"
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder="Arquitecto" />
                      )}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={8}>
                  <Form.Item
                    label="Fotografía"
                    validateStatus={errors.photo ? "error" : ""}
                    help={
                      errors.photo?.message && (
                        <Text type="danger">{`${errors.photo.message}`}</Text>
                      )
                    }
                  >
                    <Controller
                      name="photo"
                      control={control}
                      render={({ field }) => (
                        <Upload
                          {...field}
                          beforeUpload={(file) => {
                            field.onChange({ fileList: [file] });
                            return false;
                          }}
                          maxCount={1}
                          accept="image/*"
                          listType="picture"
                          fileList={field.value?.fileList || []}
                        >
                          <Button
                            style={{
                              backgroundColor: "#fff",
                              color: "#000",
                            }}
                            icon={<UploadOutlined />}
                          >
                            Subir fotografía
                          </Button>
                        </Upload>
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    label="Visita Domiciliaria"
                    validateStatus={errors.homeVisit ? "error" : ""}
                    help={
                      errors.homeVisit?.message && (
                        <Text type="danger">{errors.homeVisit.message}</Text>
                      )
                    }
                  >
                    <Controller
                      name="homeVisit"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          {...field}
                          checked={field.value}
                          onChange={field.onChange}
                          checkedChildren="Sí"
                          unCheckedChildren="No"
                        />
                      )}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={24}>
            <Card bordered={false} style={{ marginTop: "16px" }}>
              <Row justify="end">
                <Button
                  variant="outlined"
                  onClick={() => reset()}
                  className="main-button-white"
                >
                  Restablecer
                </Button>
                <Button
                  type="default"
                  htmlType="submit"
                  loading={isPendingCreateUser || isPendingEditUser}
                  disabled={isPendingCreateUser || isPendingEditUser}
                >
                  Guardar y continuar
                </Button>
              </Row>
            </Card>
          </Col>
        </Row>
      </Form>

      {/* Modal de Importación Masiva */}
      <Modal
        title="Importar Usuarios desde Excel"
        open={importModalVisible}
        onCancel={handleImportModalClose}
        footer={[
          <Button key="cancel" onClick={handleImportModalClose}>
            Cancelar
          </Button>,
          <Button
            key="import"
            type="primary"
            onClick={handleImportUsers}
            loading={isImportingUsers}
            disabled={!selectedFile}
          >
            Importar Usuarios
          </Button>,
        ]}
        width={800}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Alert
            message="Instrucciones"
            description="Suba un archivo Excel (.xlsx) con los datos de los usuarios. El archivo debe contener las columnas: Tipo de usuario, N° Documento, Nombres, Apellidos, Género, Fecha de nacimiento, Estado civil, Ocupación."
            type="info"
            showIcon
          />

          <Upload
            accept=".xlsx"
            beforeUpload={handleFileSelect}
            showUploadList={false}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Seleccionar Archivo Excel</Button>
          </Upload>

          {importResults && (
            <div>
              <Divider>Resultados de la Importación</Divider>

              <Alert
                message={`Procesados: ${importResults.total_processed} | Exitosos: ${importResults.total_success} | Errores: ${importResults.total_errors}`}
                type={importResults.total_errors === 0 ? "success" : "warning"}
                showIcon
                style={{ marginBottom: "16px" }}
              />

              {importResults.success.length > 0 && (
                <div style={{ marginBottom: "16px" }}>
                  <h4>Usuarios Creados Exitosamente:</h4>
                  <ul>
                    {importResults.success.map((item: any, index: number) => (
                      <li key={index}>
                        Fila {item.row}: {item.nombre} (ID: {item.user_id})
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {importResults.errors.length > 0 && (
                <div>
                  <h4>Errores Encontrados:</h4>
                  <ul>
                    {importResults.errors.map((item: any, index: number) => (
                      <li key={index} style={{ color: "red" }}>
                        Fila {item.row}: {item.error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Space>
      </Modal>
    </>
  );
};
