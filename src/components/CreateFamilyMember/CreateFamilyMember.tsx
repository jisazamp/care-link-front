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
  message,
  Alert,
  Modal,
  Upload,
  Space,
  Divider,
  Descriptions,
} from "antd";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { useCreateFamilyMember } from "../../hooks/useCreateFamilyMember/useCreateFamilyMember";
import { useEditFamilyMemberMutation } from "../../hooks/useEditFamilyMemberMutation/useEditFamilyMemberMutation";
import { useGetFamilyMemberById } from "../../hooks/useGetFamilyMemberById/useGetFamilyMemberById";
import { useGetUserFamilyMembers } from "../../hooks/useGetUserFamilyMembers/useGetUserFamilyMembers";
import { useExportFamilyMemberTemplate } from "../../hooks/useExportFamilyMemberTemplate/useExportFamilyMemberTemplate";
import { useImportFamilyMembers } from "../../hooks/useImportFamilyMembers/useImportFamilyMembers";
import { queryClient } from "../../main";
import type { CreateFamilyMemberRequest } from "../../types";
import { DownloadOutlined, UploadOutlined } from "@ant-design/icons";

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
  kinship: z.string(),
  customKinship: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const { Text, Title } = Typography;

export const CreateFamilyMember = () => {
  const params = useParams();
  const userId = params.id;
  const familyMemberId = params.familyMemberId;

  const { data: familyMember, isLoading: loadingFamilyMember } =
    useGetFamilyMemberById(familyMemberId);

  const { data: existingFamilyMembers } = useGetUserFamilyMembers(userId);

  const { mutate: createFamilyMember, isSuccess: isSuccessCreateFamilyMember, error: createError } =
    useCreateFamilyMember(userId);

  const { mutate: editFamilyMember, isSuccess: isSuccessEditFamilyMember, error: editError } =
    useEditFamilyMemberMutation(userId);

  // Hooks para importación/exportación
  const { mutate: exportTemplate, isPending: exportingTemplate } = useExportFamilyMemberTemplate();
  const { mutate: importFamilyMembers, isPending: importingFamilyMembers } = useImportFamilyMembers();

  // Estados para el modal de importación
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResults, setImportResults] = useState<any>(null);

  const navigate = useNavigate();

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const kinshipValue = watch("kinship");
  const isFamilyMemberValue = watch("isFamilyMember");

  // Check if user already has an acudiente
  const hasExistingAcudiente = existingFamilyMembers?.data?.data?.some(
    (member: any) => member.acudiente?.acudiente === true
  );

  // Handle error messages
  useEffect(() => {
    if (createError) {
      const axiosError = createError as any;
      const errorMessage = axiosError?.response?.data?.detail || "Error al crear el familiar";
      message.error(errorMessage);
    }
  }, [createError]);

  useEffect(() => {
    if (editError) {
      const axiosError = editError as any;
      const errorMessage = axiosError?.response?.data?.detail || "Error al editar el familiar";
      message.error(errorMessage);
    }
  }, [editError]);

  // Funciones para importación/exportación
  const handleExportTemplate = () => {
    exportTemplate(undefined, {
      onSuccess: (response: any) => {
        // Crear un enlace temporal para descargar el archivo
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "plantilla_familiares.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        message.success("Plantilla descargada exitosamente");
      },
      onError: () => {
        message.error("Error al descargar la plantilla");
      },
    });
  };

  const handleImportModalOpen = () => {
    setImportModalVisible(true);
    setSelectedFile(null);
    setImportResults(null);
  };

  const handleImportModalClose = () => {
    setImportModalVisible(false);
    setSelectedFile(null);
    setImportResults(null);
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    return false; // Prevenir upload automático
  };

  const handleImportFamilyMembers = () => {
    if (!selectedFile) {
      message.error("Por favor selecciona un archivo");
      return;
    }

    importFamilyMembers(selectedFile, {
      onSuccess: (response: any) => {
        setImportResults(response.data.data);
        message.success("Importación completada");
      },
      onError: (error: any) => {
        message.error("Error al importar familiares: " + (error.response?.data?.detail || error.message));
      },
    });
  };

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
        parentezco:
          data.kinship === "Otro" && data.customKinship
            ? data.customKinship
            : data.kinship,
      },
    };

    if (familyMemberId) {
      editFamilyMember({
        id: userId ?? 0,
        familiy_member_id: familyMemberId ?? 0,
        family_member: request.family_member,
        kinship: request.kinship,
      });
      return;
    }

    createFamilyMember(request);
  };

  useEffect(() => {
    if (isSuccessCreateFamilyMember || isSuccessEditFamilyMember) {
      // Invalidar manualmente las consultas para asegurar actualización
      queryClient.invalidateQueries({ queryKey: [`get-user-${userId}-family-members`] });
      // Invalidar también la query del usuario para actualizar los datos de localización
      queryClient.invalidateQueries({ queryKey: [`get-user-${userId}`] });
      
      // Detectar si viene de visitas domiciliarias basándose en la URL actual
      const currentPath = window.location.pathname;
      if (currentPath.includes('/visitas-domiciliarias/')) {
        navigate(`/visitas-domiciliarias/usuarios/${userId}/detalles`);
      } else {
        navigate(`/usuarios/${userId}/detalles`);
      }
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
        kinship: familyMember.data.data.parentesco,
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
          { 
            title: window.location.pathname.includes('/visitas-domiciliarias/') 
              ? "Visitas Domiciliarias" 
              : "Usuarios" 
          },
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
        <>
          {/* Botones de importación/exportación */}
          <Card 
            title="Importación Masiva de Familiares" 
            style={{ marginBottom: 16 }}
            extra={
              <Space>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleExportTemplate}
                  loading={exportingTemplate}
                >
                  Descargar Plantilla
                </Button>
                <Button
                  icon={<UploadOutlined />}
                  onClick={handleImportModalOpen}
                  type="primary"
                >
                  Importar Familiares
                </Button>
              </Space>
            }
          >
            <Alert
              message="Instrucciones"
              description="Descarga la plantilla Excel, complétala con los datos de los familiares y súbela para crear múltiples familiares de una vez. La plantilla incluye una columna adicional para el número de documento del paciente."
              type="info"
              showIcon
            />
          </Card>

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
                              <Select.Option value="Hijo">Hijo</Select.Option>
                              <Select.Option value="Hija">Hija</Select.Option>
                              <Select.Option value="Nieto">Nieto</Select.Option>
                              <Select.Option value="Nieta">Nieta</Select.Option>
                              <Select.Option value="Cuidador">
                                Cuidador
                              </Select.Option>
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
                      {kinshipValue === "Otro" && (
                        <Form.Item
                          label="Especifique el parentezco"
                          validateStatus={errors.customKinship ? "error" : ""}
                          help={
                            errors.customKinship?.message && (
                              <Text type="danger">
                                {errors.customKinship.message}
                              </Text>
                            )
                          }
                        >
                          <Controller
                            name="customKinship"
                            control={control}
                            render={({ field }) => <Input {...field} />}
                          />
                        </Form.Item>
                      )}
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
                    <Col span={24}>
                      <Controller
                        name="isFamilyMember"
                        control={control}
                        render={({ field }) => (
                          <Checkbox checked={!!field.value} {...field}>
                            Marcar como acudiente
                          </Checkbox>
                        )}
                      />
                      {hasExistingAcudiente && !familyMemberId && (
                        <Alert
                          message="Restricción de Acudiente"
                          description="El usuario ya tiene un acudiente registrado. Solo puede tener un acudiente por usuario. Si marca este familiar como acudiente, el acudiente anterior será desmarcado automáticamente. Los datos de localización solo se actualizarán en el usuario si marca esta opción."
                          type="warning"
                          showIcon
                          style={{ marginTop: "8px" }}
                        />
                      )}
                      {familyMemberId && hasExistingAcudiente && !isFamilyMemberValue && (
                        <Alert
                          message="Sin Acudiente"
                          description="Este usuario no tendrá ningún acudiente asignado si desmarca esta opción. Los datos de localización del usuario se limpiarán automáticamente."
                          type="info"
                          showIcon
                          style={{ marginTop: "8px" }}
                        />
                      )}
                      {!hasExistingAcudiente && !familyMemberId && (
                        <Alert
                          message="Información Importante"
                          description="Los datos de localización (teléfono, email, dirección) solo se actualizarán en el perfil del usuario si marca esta opción como acudiente. Si no marca esta opción, los datos solo se guardarán en el perfil del familiar."
                          type="info"
                          showIcon
                          style={{ marginTop: "8px" }}
                        />
                      )}
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

          {/* Modal de importación */}
          <Modal
            title="Importar Familiares"
            open={importModalVisible}
            onCancel={handleImportModalClose}
            footer={[
              <Button key="cancel" onClick={handleImportModalClose}>
                Cancelar
              </Button>,
              <Button
                key="import"
                type="primary"
                onClick={handleImportFamilyMembers}
                loading={importingFamilyMembers}
                disabled={!selectedFile}
              >
                Importar
              </Button>,
            ]}
            width={800}
          >
            <div>
              <Alert
                message="Instrucciones"
                description="Sube un archivo Excel (.xlsx) con los datos de los familiares. El archivo debe contener las columnas: N° Documento del Paciente, N° Documento del Familiar, Nombres del Familiar, Apellidos del Familiar, Teléfono del Familiar, Dirección del Familiar, Email del Familiar, Parentesco, Es Acudiente (Sí/No), Vive (Sí/No)."
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />

              <Upload
                accept=".xlsx"
                beforeUpload={handleFileSelect}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>
                  Seleccionar archivo Excel
                </Button>
              </Upload>

              {selectedFile && (
                <div style={{ marginTop: 16 }}>
                  <Text>Archivo seleccionado: {selectedFile.name}</Text>
                </div>
              )}

              {importResults && (
                <div style={{ marginTop: 16 }}>
                  <Divider />
                  <Title level={5}>Resultados de la Importación</Title>
                  <Descriptions bordered column={2}>
                    <Descriptions.Item label="Procesados">
                      {importResults.total_processed}
                    </Descriptions.Item>
                    <Descriptions.Item label="Exitosos">
                      <Text type="success">{importResults.total_success}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Errores">
                      <Text type="danger">{importResults.total_errors}</Text>
                    </Descriptions.Item>
                  </Descriptions>

                  {importResults.success && importResults.success.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                      <Title level={5}>Familiares Creados Exitosamente</Title>
                      <ul>
                        {importResults.success.map((item: any, index: number) => (
                          <li key={index}>
                            <Text>
                              Fila {item.row}: {item.familiar_nombre} - {item.parentesco} 
                              {item.es_acudiente ? " (Acudiente)" : ""}
                            </Text>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {importResults.errors && importResults.errors.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                      <Title level={5}>Errores Encontrados</Title>
                      <ul>
                        {importResults.errors.map((item: any, index: number) => (
                          <li key={index}>
                            <Text type="danger">
                              Fila {item.row}: {item.error}
                            </Text>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Modal>
        </>
      )}
    </>
  );
};
