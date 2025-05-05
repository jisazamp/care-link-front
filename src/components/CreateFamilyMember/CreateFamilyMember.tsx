import { zodResolver } from "@hookform/resolvers/zod";
import {
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Col,
  Flex,
  Form,
  Input,
  Row,
  Select,
  Spin,
  Typography,
} from "antd";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { Kinship } from "../../enums";
import { useCreateFamilyMember } from "../../hooks/useCreateFamilyMember/useCreateFamilyMember";
import { useEditFamilyMemberMutation } from "../../hooks/useEditFamilyMemberMutation/useEditFamilyMemberMutation";
import { useGetFamilyMemberById } from "../../hooks/useGetFamilyMemberById/useGetFamilyMemberById";
import type { CreateFamilyMemberRequest } from "../../types";

const formSchema = z.object({
  documentNumber: z
    .string({ message: "El número de documento es requerido" })
    .nonempty("El número de documento es requerido"),
  firstName: z
    .string({ message: "El nombre es requerido" })
    .nonempty("El nombre es requerido"),
  lastName: z
    .string({ message: "Los apellidos son requeridos" })
    .nonempty("Los apellidos son requeridos"),
  email: z
    .string()
    .email({ message: "Ingrese un correo electrónico válido" })
    .optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  isFamilyMember: z.boolean().optional(),
  isAlive: z.boolean().optional(),
  kinship: z.nativeEnum(Kinship, {
    errorMap: () => ({ message: "El parentezco es requerido" }),
  }),
});

type FormValues = z.infer<typeof formSchema>;

const { Text } = Typography;

export const CreateFamilyMember = () => {
  const params = useParams();
  const userId = params.id;
  const familyMemberId = params.familyMemberId;

  const { data: familyMember, isLoading: loadingFamilyMember } =
    useGetFamilyMemberById(familyMemberId);

  const { mutate: createFamilyMember, isSuccess: isSuccessCreateFamilyMember } =
    useCreateFamilyMember(userId);

  const { mutate: editFamilyMember, isSuccess: isSuccessEditFamilyMember } =
    useEditFamilyMemberMutation(userId);

  const navigate = useNavigate();

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormValues) => {
    const request: CreateFamilyMemberRequest = {
      userId,
      family_member: {
        acudiente: data.isFamilyMember ?? false,
        apellidos: data.lastName,
        direccion: data.address ?? "",
        email: data.email ?? "",
        is_deleted: false,
        n_documento: data.documentNumber,
        nombres: data.firstName,
        telefono: data.phone ?? "",
        vive: data.isAlive ?? false,
      },
      kinship: {
        parentezco: data.kinship,
      },
    };

    if (familyMemberId) {
      editFamilyMember({ id: familyMemberId, request: request.family_member });
      return;
    }

    createFamilyMember(request);
  };

  useEffect(() => {
    if (isSuccessCreateFamilyMember || isSuccessEditFamilyMember) {
      navigate(`/usuarios/${userId}/detalles`);
    }
  }, [
    isSuccessCreateFamilyMember,
    isSuccessEditFamilyMember,
    navigate,
    userId,
  ]);

  useEffect(() => {
    if (familyMember?.data.data) {
      reset({
        address: familyMember.data.data.direccion ?? "",
        documentNumber: familyMember.data.data.n_documento,
        email: familyMember.data.data.email ?? "",
        firstName: familyMember.data.data.nombres,
        isAlive: familyMember.data.data.vive ?? false,
        kinship: familyMember.data.data.parentesco as Kinship,
        lastName: familyMember.data.data.apellidos,
        phone: familyMember.data.data.telefono ?? "",
        isFamilyMember: familyMember.data.data.acudiente ?? false,
      });
    }
  }, [familyMember?.data.data, reset]);

  return (
    <>
      <Breadcrumb
        items={[
          { title: "Inicio" },
          { title: "Usuarios" },
          {
            title: familyMemberId
              ? "Editar acudiente o familiar"
              : "Agregar acudiente o familiar",
          },
        ]}
        style={{ margin: "16px 0" }}
      />
      {loadingFamilyMember ? (
        <Flex justify="center" align="center" style={{ minHeight: 500 }}>
          <Spin />
        </Flex>
      ) : (
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="Datos básicos del acudiente" bordered={false}>
                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item
                      label="Parentezco"
                      validateStatus={errors.kinship ? "error" : ""}
                      help={
                        errors.kinship?.message && (
                          <Text type="danger">{errors.kinship.message}</Text>
                        )
                      }
                    >
                      <Controller
                        name="kinship"
                        control={control}
                        render={({ field }) => (
                          <Select {...field}>
                            <Select.Option value="Padre">Padre</Select.Option>
                            <Select.Option value="Madre">Madre</Select.Option>
                            <Select.Option value="Hermano">
                              Hermano
                            </Select.Option>
                            <Select.Option value="Hermana">
                              Hermana
                            </Select.Option>
                            <Select.Option value="Tío">Tío</Select.Option>
                            <Select.Option value="Tía">Tía</Select.Option>
                            <Select.Option value="Primo">Primo</Select.Option>
                            <Select.Option value="Prima">Prima</Select.Option>
                            <Select.Option value="Amigo">Amigo</Select.Option>
                            <Select.Option value="Otro">Otro</Select.Option>
                          </Select>
                        )}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label="¿Convive con el usuario?"
                      validateStatus={errors.isAlive ? "error" : ""}
                      help={
                        errors.isAlive?.message && (
                          <Text type="danger">{errors.isAlive.message}</Text>
                        )
                      }
                    >
                      <Controller
                        name="isAlive"
                        control={control}
                        render={({ field }) => (
                          <Select {...field}>
                            <Select.Option value={true}>Sí</Select.Option>
                            <Select.Option value={false}>No</Select.Option>
                          </Select>
                        )}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label="N° documento"
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
                        render={({ field }) => <Input {...field} />}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
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
                        render={({ field }) => <Input {...field} />}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
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
                        render={({ field }) => <Input {...field} />}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
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
                        render={({ field }) => <Input {...field} />}
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
                        render={({ field }) => <Input {...field} />}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Correo electrónico"
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
                        render={({ field }) => <Input {...field} />}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
              <Card
                title="Otros datos de configuración para el sistema"
                bordered={false}
                style={{ marginTop: "16px" }}
              >
                <Row gutter={24}>
                  <Col>
                    <Controller
                      name="isFamilyMember"
                      control={control}
                      render={({ field }) => (
                        <Checkbox checked={!!field.value} {...field}>
                          Marcar como acudiente
                        </Checkbox>
                      )}
                    />
                  </Col>
                  <Col>
                    <Checkbox>Marcar para facturación</Checkbox>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={24}>
              <Card bordered={false} style={{ marginTop: "16px" }}>
                <Row justify="end">
                  <Button
                    variant="outlined"
                    className="main-button-white"
                    onClick={() => reset()}
                  >
                    Restablecer
                  </Button>
                  <Button type="default" htmlType="submit">
                    Guardar
                  </Button>
                </Row>
              </Card>
            </Col>
          </Row>
        </Form>
      )}
    </>
  );
};
