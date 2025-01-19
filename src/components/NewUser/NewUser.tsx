import { z } from "zod";
import dayjs, { Dayjs } from "dayjs";
import { useForm, Controller } from "react-hook-form";
import {
  Breadcrumb,
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
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";

const { Option } = Select;
const { Text } = Typography;

const formSchema = z.object({
  userId: z.string(),
  userType: z.enum(["Recurrente", "Nuevo"], {
    errorMap: () => ({ message: "El tipo de usuario es requerido" }),
  }),
  documentNumber: z
    .string({ message: "El número de documento es requerido" })
    .nonempty("El número de documento es requerido"),
  firstName: z
    .string({ message: "El nombre es requerido" })
    .nonempty("El nombre es requerido"),
  lastName: z
    .string({ message: "Los apellidos son requeridos" })
    .nonempty("Los apellidos son requeridos"),
  gender: z.enum(["Hombre", "Mujer", "Otro"], {
    errorMap: () => ({ message: "El género es requerido" }),
  }),
  dateOfBirth: z
    .custom<Dayjs>((val) => val instanceof dayjs, "Fecha inválida")
    .refine((date) => date.isBefore(dayjs()), {
      message: "La fecha debe ser anterior al día actual",
    }),
  maritalStatus: z.enum(["Casado", "Soltero", "Divorciado", "Viudo"], {
    errorMap: () => ({ message: "El estado civil es requerido" }),
  }),
  occupation: z.string().optional(),
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
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: "Hombre",
      userId: "0001",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Datos:", data);
    reset();
  };

  return (
    <>
      <Breadcrumb
        items={[{ title: "Inicio" }, { title: "Nuevo usuario" }]}
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
                          <Option value="Hombre">Hombre</Option>
                          <Option value="Mujer">Mujer</Option>
                          <Option value="Otro">Otro</Option>
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
                            field.onChange(file);
                            return false;
                          }}
                          maxCount={1}
                          accept="image/*"
                          listType="picture"
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
            <Card bordered={false} style={{ marginTop: "16px" }}>
              <Row justify="end">
                <Button
                  variant="outlined"
                  onClick={() => reset()}
                  style={{
                    backgroundColor: "#fff",
                    color: "#000",
                    marginRight: "8px",
                  }}
                >
                  Restablecer
                </Button>
                <Button type="default" htmlType="submit">
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
