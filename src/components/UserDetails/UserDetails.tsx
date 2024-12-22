import React from 'react';
import {
  Layout,
  Card,
  Typography,
  Breadcrumb,
  Space,
  Button,
  Divider,
  Descriptions,
  Avatar,
  Row,
  Col,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Header } from '../Header/Header';
import { Sidebar } from '../Sidebar/Sidebar';
import patientImage from '../assets/Patients/patient1.jpg';

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

export const UserDetails: React.FC = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Layout>
        <Sider collapsible style={{ backgroundColor: "#FFF" }}>
          <Sidebar />
        </Sider>
        <Content className="content-wrapper" style={{ padding: "16px" }}>
          <Breadcrumb className="breadcrumb" style={{ marginBottom: "16px" }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Usuarios</Breadcrumb.Item>
            <Breadcrumb.Item>Vista Detalle</Breadcrumb.Item>
          </Breadcrumb>

          <Title level={3} className="page-title">Juan Antonio Lopez Orrego</Title>

          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Card: Datos básicos y de localización */}
            <Card
              title="Datos básicos y de localización"
              extra={
                <Space>
                  <Button icon={<EditOutlined />} type="primary">
                    Editar
                  </Button>
                  <Button icon={<DeleteOutlined />} danger>
                    Eliminar
                  </Button>
                </Space>
              }
              className="detail-card"
            >
              <Row gutter={24} align="middle">
                <Col flex="120px">
                  <Avatar
                    src={patientImage}
                    size={120}
                    alt="Avatar del paciente"
                    style={{ border: "1px solid #ddd" }}
                  />
                </Col>
                <Col flex="auto">
                  <Descriptions column={2} labelStyle={{ fontWeight: "bold" }}>
                    <Descriptions.Item label="Nombre Completo">
                      Juan Antonio Lopez Orrego
                    </Descriptions.Item>
                    <Descriptions.Item label="Documento">
                      44567890
                    </Descriptions.Item>
                    <Descriptions.Item label="Género">Masculino</Descriptions.Item>
                    <Descriptions.Item label="Fecha de Nacimiento">
                      1956/11/08
                    </Descriptions.Item>
                    <Descriptions.Item label="Edad">68 años</Descriptions.Item>
                    <Descriptions.Item label="Estado Civil">Casado</Descriptions.Item>
                    <Descriptions.Item label="Teléfono">315 6789 6789</Descriptions.Item>
                    <Descriptions.Item label="Email">
                      juanantonio@gmail.com
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
            </Card>

            {/* Card: Historia Clínica */}
            <Card
              title="Historia Clínica"
              extra={
                <Space>
                  <Button icon={<EditOutlined />} type="primary">
                    Editar
                  </Button>
                  <Button icon={<DeleteOutlined />} danger>
                    Eliminar
                  </Button>
                </Space>
              }
              className="detail-card"
            >
              <Descriptions column={1}>
                <Descriptions.Item label="Empresa de Salud Domiciliaria">
                  604 607 8990
                </Descriptions.Item>
                <Descriptions.Item label="Tipo de Sangre">O+</Descriptions.Item>
                <Descriptions.Item label="Estatura">165 cm</Descriptions.Item>
                <Descriptions.Item label="Motivo de Ingreso">
                  Usuario de centro de día
                </Descriptions.Item>
                <Descriptions.Item label="Discapacidades">
                  Visual, Auditiva
                </Descriptions.Item>
                <Descriptions.Item label="Limitaciones">
                  Ayuda para ir al baño
                </Descriptions.Item>
                <Descriptions.Item label="Dieta Especial">Sí</Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Card: Reportes Clínicos */}
            <Card
              title="Reportes Clínicos"
              extra={
                <Space>
                  <Button icon={<EditOutlined />} type="primary">
                    Editar
                  </Button>
                  <Button icon={<DeleteOutlined />} danger>
                    Eliminar
                  </Button>
                </Space>
              }
              className="detail-card"
            >
              <Text>Historial completo de reportes médicos.</Text>
            </Card>

            {/* Card: Acudientes */}
            <Card
              title="Acudientes"
              extra={
                <Space>
                  <Button icon={<EditOutlined />} type="primary">
                    Editar
                  </Button>
                  <Button icon={<DeleteOutlined />} danger>
                    Eliminar
                  </Button>
                </Space>
              }
              className="detail-card"
            >
              <Text>Información sobre acudientes asignados.</Text>
            </Card>

            {/* Card: Contratos */}
            <Card
              title="Contratos"
              extra={
                <Space>
                  <Button icon={<EditOutlined />} type="primary">
                    Editar
                  </Button>
                  <Button icon={<DeleteOutlined />} danger>
                    Eliminar
                  </Button>
                </Space>
              }
              className="detail-card"
            >
              <Text>Historial de contratos asociados al usuario.</Text>
            </Card>
          </Space>

          <Divider />
        </Content>
      </Layout>
    </Layout>
  );
};
