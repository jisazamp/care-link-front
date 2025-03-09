import { z } from "zod";
import dayjs, { Dayjs } from "dayjs";
import { useForm, Controller } from "react-hook-form";
import {
  Breadcrumb,
  Spin,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Typography,
  Upload,
  Flex,
} from "antd";
import request from "axios";
import { CivilStatus, Gender, UserFamilyType, UserStatus } from "../../enums";
import { UploadOutlined } from "@ant-design/icons";
import { User } from "../../types";
import { useCreateUserMutation } from "../../hooks/useCreateUserMutation/useCreateUserMutation";
import { useEditUserMutation } from "../../hooks/useEditUserMutation/useEditUserMutation";
import { useEffect } from "react";
import { useGetUserById } from "../../hooks/useGetUserById/useGetUserById";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useImageFile } from "../../hooks/useImageFile/useImageFile";

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
  email: z
    .string({ message: "El correo electrónico es requerido" })
    .email({ message: "Ingrese un correo electrónico válido" }),
  occupation: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  photo: z
    .any()
    .optional()
    .refine(
      (value) =>
        value === undefined ||
        value.fileList?.length === 0 ||
        (value.file instanceof File && value.file.size <= 5 * 1024 * 1024),
      {
        message: "La foto debe ser un archivo válido y pesar menos de 5MB",
      }
    ),
});

type FormValues = z.infer<typeof formSchema>;

export const NewUser: React.FC = () => {
  const params = useParams();
  const userId = params.id;

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: "Masculino",
      userId: "0000",
    },
  });

  const navigate = useNavigate();
  const { data, isError, isLoading, error } = useGetUserById(userId);
  const {
    mutate: createUser,
    isSuccess: isSuccessCreateUser,
    isPending: isPendingCreateUser,
  } = useCreateUserMutation();
  const { mutate: editUser, isSuccess: isSuccessEditUser, isPending: isPendingEditUser } =
    useEditUserMutation(userId);
  const { data: imageFile, isLoading: isLoadingFile, isError: isErrorFile } = useImageFile(
    data?.data.data.url_imagen ?? "",
    "user-photo.jpg",
    "image/jpeg"
  );

  const onSubmit = (data: FormValues) => {
    const user: Partial<User> = {
      apellidos: data.lastName,
      direccion: data.address,
      email: data.email,
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
      telefono: data.phone,
      is_deleted: false,
    };

    const photoFile = data.photo?.fileList?.[0]?.originFileObj;

    if (!userId) {
      createUser({ user, photoFile });
      return;
    }
    editUser({ user, id: userId, photoFile });
  };

  useEffect(() => {
    if (data?.data.data) {
      const userData = data.data.data;

      const setImage = async () => {
        const resetValues = {
          ...userData,
          dateOfBirth: dayjs(userData.fecha_nacimiento),
          documentNumber: userData.n_documento + "",
          firstName: userData.nombres + "",
          lastName: userData.apellidos + "",
          userId: userData.id_usuario + "",
          maritalStatus: userData.estado_civil as CivilStatus,
          gender: userData.genero as Gender,
          email: userData.email ?? "",
          phone: userData.telefono ?? "",
          address: userData.direccion ?? "",
        };

        if (userData.url_imagen) {


          if (isLoadingFile) {
            return;
          }

          if (isErrorFile) {
            console.error("Error fetching user photo");
            reset(resetValues);
            return;
          }

          if (imageFile) {
            const fileList = [
              {
                uid: "-1",
                name: imageFile.name,
                status: "done",
                url: userData.url_imagen,
                originFileObj: imageFile,
              },
            ];

            reset({
              ...resetValues,
              photo: { fileList },
            });
          }
        } else {
          reset(resetValues);
        }
      };

      setImage();
    }
  }, [data?.data.data, reset]);

  useEffect(() => {
    if (isSuccessCreateUser || isSuccessEditUser) {
      navigate("/usuarios");
    }
  }, [isSuccessCreateUser, isSuccessEditUser, navigate]);

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
        items={[
          { title: "Inicio" },
          { title: userId ? "Editar usuario" : "Nuevo usuario" },
        ]}
        style={{ margin: "16px 0" }}
      />
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title="Información básica" bordered={false}>
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
                        <Text type="danger">{errors.photo.message + ""}</Text>
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
                          fileList={field.value?.fileList || []} // Use the fileList from the form
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
              </Row>
            </Card>
          </Col>
          <Col span={24}>
            <Card
              title="Datos de localización"
              bordered={false}
              style={{ marginTop: "16px" }}
            >
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item
                    label="Dirección"
                    validateStatus={errors.address ? "error" : ""}
                    help={
                      errors.address?.message && (
                        <Text type="danger">{errors.address.message}</Text>
                      )
                    }
                  >
                    <Controller
                      name="address"
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder="Dirección" />
                      )}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label="Teléfono"
                    validateStatus={errors.phone ? "error" : ""}
                    help={
                      errors.phone?.message && (
                        <Text type="danger">{errors.phone.message}</Text>
                      )
                    }
                  >
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder="Teléfono" />
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Email"
                    validateStatus={errors.email ? "error" : ""}
                    help={
                      errors.email?.message && (
                        <Text type="danger">{errors.email.message}</Text>
                      )
                    }
                  >
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder="Correo electrónico" />
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
    </>
  );
};
