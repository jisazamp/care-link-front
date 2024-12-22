import React from "react";
import dayjs, { Dayjs } from "dayjs";
import {
  Layout,
  Breadcrumb,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Upload,
  Card,
  Row,
  Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Header } from "../Header/Header";
import { Sidebar } from "../Sidebar/Sidebar";

const { Content, Sider } = Layout;
const { Option } = Select;

type FormValues = {
  tipoUsuario: string;
  idUsuario: string;
  nDocumento: string;
  nombres: string;
  apellidos: string;
  genero: string;
  fechaNacimiento: Dayjs;
  estadoCivil: string;
  ocupacion: string;
  fotografia?: File;
  direccion: string;
  telefono: string;
  correoElectronico: string;
};

export const NewUser: React.FC = () => {
  const [form] = Form.useForm();

  const validateDate = (_: unknown, value: Dayjs) => {
    if (!value || value.isBefore(dayjs())) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("La fecha debe ser anterior a hoy."));
  };

  const onFinish = (values: FormValues) => {
    console.log("Formulario enviado con éxito: ", values);
    form.resetFields();
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Layout>
        <Sider collapsible style={{ backgroundColor: "#FFF" }}>
          <Sidebar />
        </Sider>
        <Content style={{ margin: "16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Inicio</Breadcrumb.Item>
            <Breadcrumb.Item>Nuevo Usuario</Breadcrumb.Item>
          </Breadcrumb>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="Datos Básicos" bordered={false}>
                <Form
                  id="newUserForm"
                  layout="vertical"
                  onFinish={onFinish}
                  form={form}
                  initialValues={{ genero: "Masculino" }}
                >
                  <Row gutter={24}>
                    <Col span={6}>
                      <Form.Item
                        name="idUsuario"
                        label="Id. Usuario"
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="0001" disabled />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="tipoUsuario"
                        label="Tipo de usuario"
                        rules={[{ required: true }]}
                      >
                        <Select placeholder="Selecciona el tipo de usuario">
                          <Option value="Recurrente">Recurrente</Option>
                          <Option value="Nuevo">Nuevo</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="nDocumento"
                        label="N° Documento"
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="Número de documento" />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="nombres"
                        label="Nombres"
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="Nombres" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={6}>
                      <Form.Item
                        name="apellidos"
                        label="Apellidos"
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="Apellidos" />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="genero"
                        label="Género"
                        rules={[{ required: true }]}
                      >
                        <Select>
                          <Option value="Masculino">Masculino</Option>
                          <Option value="Femenino">Femenino</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="fechaNacimiento"
                        label="Fecha de nacimiento"
                        rules={[
                          { required: true, message: "Este campo es obligatorio" },
                          { validator: validateDate },
                        ]}
                      >
                        <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="estadoCivil"
                        label="Estado civil"
                        rules={[{ required: true }]}
                      >
                        <Select>
                          <Option value="Casado">Casado</Option>
                          <Option value="Soltero">Soltero</Option>
                          <Option value="Divorciado">Divorciado</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={6}>
                      <Form.Item
                        name="ocupacion"
                        label="Ocupación"
                        rules={[{ required: true }]}
                      >
                        <Select>
                          <Option value="Pensionado">Pensionado</Option>
                          <Option value="Empleado">Empleado</Option>
                          <Option value="Independiente">Independiente</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="fotografia"
                        label="Fotografía"
                        valuePropName="file"
                      >
                        <Upload
                          beforeUpload={() => false}
                          accept="image/*"
                          listType="picture-card"
                        >
                          <Button icon={<UploadOutlined />}>Subir Imagen</Button>
                        </Upload>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Col>
            <Col span={24}>
              <Card title="Datos de Localización" bordered={false} style={{ marginTop: "16px" }}>
                <Form
                  id="locationForm"
                  layout="vertical"
                  form={form}
                  onFinish={onFinish}
                >
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item
                        name="direccion"
                        label="Dirección"
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="CLL 45 - 60-20 INT 101" />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="telefono"
                        label="Teléfono"
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="315 6789 6789" />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        name="correoElectronico"
                        label="Correo Electrónico"
                        rules={[{ required: true, type: "email" }]}
                      >
                        <Input placeholder="juanantonio@gmail.com" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Col>
            <Col span={24}>
              <Card bordered={false} style={{ marginTop: "16px" }}>
                <Row justify="end">
                  <Button
                    type="default"
                    onClick={() => form.resetFields()}
                    style={{ marginRight: "8px" }}
                  >
                    Restablecer
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Guardar y continuar
                  </Button>
                </Row>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};
