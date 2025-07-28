import { zodResolver } from "@hookform/resolvers/zod";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Typography,
  message,
} from "antd";
import type { AxiosError } from "axios";
import { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateAuthorizedUser } from "../../hooks/useCreateAuthorizedUser";
import { useListAuthorizedUserById } from "../../hooks/useListAuthorizedUserByid";
import { ProfessionalDataForm } from "../ProfessionalDataForm";
import { editUserSchema, type UserDTO, userSchema } from "./index.schema";
import { RolesEnum } from "./index.schema";
import { mapUserDTOToEntity } from "./index.utils";

const { Text } = Typography;
const { Option } = Select;

export default function NewUserForm() {
  const params = useParams();
  const userId = params.id ? Number(params.id) : 0;
  const isEditing = !!userId;
  const schema = isEditing ? editUserSchema : userSchema;

  const methods = useForm<UserDTO>({
    resolver: zodResolver(schema),
  });
  const {
    control,
    handleSubmit,
    reset,
    resetField,
    watch,
    formState: { errors, isSubmitting },
  } = methods;

  const navigate = useNavigate();
  const role = watch("role");

  const { createAuthorizedUserFn, isPendingCreateAuthorizedUser } =
    useCreateAuthorizedUser();

  const { authorizedUserData, isPendingAuthorizedUser } =
    useListAuthorizedUserById(userId);

  const onCreateError = (error: Error) => {
    const resultingError: AxiosError<{ message: string }> =
      error as AxiosError<{ message: string }>;
    message.error(resultingError.response?.data.message);
  };

  const onCreateSuccess = () => {
    navigate("/profesionales");
  };

  const onSubmit = async (data: UserDTO) => {
    const user = mapUserDTOToEntity(data);
    createAuthorizedUserFn(user, {
      onSuccess: onCreateSuccess,
      onError: onCreateError,
    });
  };

  const handleReset = () => {
    if (isEditing && authorizedUserData?.data.data) {
      const { email, first_name, last_name, role } =
        authorizedUserData.data.data;
      reset({
        email,
        firstName: first_name,
        lastName: last_name,
        role: role as RolesEnum,
      });
    } else {
      reset();
    }
  };

  useEffect(() => {
    if (userId && authorizedUserData?.data.data) {
      const { email, first_name, last_name, role } =
        authorizedUserData.data.data;
      reset({
        email,
        firstName: first_name,
        lastName: last_name,
        role: role as RolesEnum,
      });
    }
  }, [authorizedUserData, userId, reset]);

  return (
    <>
      <Breadcrumb
        key={Date.now().toString()}
        items={[{ title: "Inicio" }, { title: "Nuevo usuario" }]}
        style={{ margin: "16px 0" }}
      />

      <FormProvider {...methods}>
        <Form
          disabled={isPendingCreateAuthorizedUser}
          layout="vertical"
          onFinish={handleSubmit(onSubmit)}
        >
          <Card
            loading={isPendingAuthorizedUser}
            title="Crear nuevo usuario"
            variant="borderless"
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  label="Correo electrónico"
                  validateStatus={errors.email ? "error" : ""}
                  help={
                    errors.email && (
                      <Text type="danger">{errors.email.message}</Text>
                    )
                  }
                >
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="usuario@correo.com"
                        disabled={isEditing}
                      />
                    )}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Nombre"
                  validateStatus={errors.firstName ? "error" : ""}
                  help={
                    errors.firstName && (
                      <Text type="danger">{errors.firstName.message}</Text>
                    )
                  }
                >
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Juan" />
                    )}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Apellido"
                  validateStatus={errors.lastName ? "error" : ""}
                  help={
                    errors.lastName && (
                      <Text type="danger">{errors.lastName.message}</Text>
                    )
                  }
                >
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                      <Input {...field} placeholder="Pérez" />
                    )}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Contraseña"
                  validateStatus={errors.password ? "error" : ""}
                  help={
                    errors.password && (
                      <Text type="danger">{errors.password.message}</Text>
                    )
                  }
                >
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <Input.Password {...field} placeholder="••••••••" />
                    )}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Confirmar contraseña"
                  validateStatus={errors.confirmPassword ? "error" : ""}
                  help={
                    errors.confirmPassword && (
                      <Text type="danger">
                        {errors.confirmPassword.message}
                      </Text>
                    )
                  }
                >
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <Input.Password
                        {...field}
                        placeholder="Repite la contraseña"
                      />
                    )}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Rol"
                  validateStatus={errors.role ? "error" : ""}
                  help={
                    errors.role && (
                      <Text type="danger">{errors.role.message}</Text>
                    )
                  }
                >
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder="Seleccione un rol"
                        onChange={(value) => {
                          field.onChange(value);
                          if (value !== RolesEnum.Profesional) {
                            resetField("professional_user");
                          }
                        }}
                      >
                        {Object.entries(RolesEnum).map(([key, value]) => (
                          <Option key={value} value={value}>
                            {key}
                          </Option>
                        ))}
                      </Select>
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row justify="end" gutter={16}>
              <Col>
                <Button
                  disabled={isPendingCreateAuthorizedUser}
                  onClick={handleReset}
                >
                  Restablecer
                </Button>
              </Col>
              <Col>
                <Button
                  disabled={isPendingCreateAuthorizedUser}
                  htmlType="submit"
                  loading={isSubmitting || isPendingCreateAuthorizedUser}
                  type="primary"
                >
                  Crear usuario
                </Button>
              </Col>
            </Row>
          </Card>

          {role === RolesEnum.Profesional && (
            <Row gutter={24}>
              <Col span={24}>
                <ProfessionalDataForm />
              </Col>
            </Row>
          )}
        </Form>
      </FormProvider>
    </>
  );
}
