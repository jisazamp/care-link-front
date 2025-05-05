import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Flex, Form, Input, Typography } from "antd";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useLoginMutation } from "../../hooks/useLoginMutation/useLoginMutation";
import { useAuthStore } from "../../store/auth";

const { Text } = Typography;

const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginValues = z.infer<typeof loginSchema>;

export const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: login, isPending } = useLoginMutation();
  const jwtToken = useAuthStore((state) => state.jwtToken);
  const navigate = useNavigate();

  const onSubmit = (data: LoginValues) => {
    login(data);
  };

  useEffect(() => {
    if (jwtToken) {
      navigate("/home");
    }
  }, [jwtToken, navigate]);

  return (
    <Flex
      vertical
      style={{
        minHeight: "100vh",
        justifyContent: "center",
        margin: "0 auto",
        maxWidth: 400,
      }}
    >
      <Form
        layout="vertical"
        style={{ marginTop: "1rem" }}
        onFinish={handleSubmit(onSubmit)}
      >
        <Form.Item
          label="Correo Electrónico"
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
              <Input
                {...field}
                className="input"
                prefix={<UserOutlined />}
                placeholder="Correo Electrónico"
              />
            )}
          />
        </Form.Item>
        <Form.Item
          label="Contraseña"
          validateStatus={errors.password ? "error" : ""}
          help={
            errors.password?.message && (
              <Text type="danger">{errors.password.message}</Text>
            )
          }
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                className="input"
                prefix={<LockOutlined />}
                placeholder="Contraseña"
              />
            )}
          />
        </Form.Item>
        <Form.Item>
          <Button
            className="main-button"
            disabled={isPending}
            htmlType="submit"
            loading={isPending}
            style={{ marginTop: "1rem" }}
          >
            Iniciar sesión
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};
