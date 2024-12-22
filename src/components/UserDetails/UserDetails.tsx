import React from 'react';
import {
  Layout,
  Card,
  Typography,
  Breadcrumb,
  Space,
  Button,
  Divider,
  Table,
  Checkbox,
  Avatar,
  Row,
  Col,
  Tag,
  Descriptions,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Header } from '../Header/Header';
import { Sidebar } from '../Sidebar/Sidebar';
import patientImage from '../assets/Patients/patient1.jpg';

const { Content, Sider } = Layout;
const { Title } = Typography;

const clinicalReportsData = [
  {
    key: '1',
    professional: 'Sara Manuela Gomez',
    reportType: 'Enfermería',
    date: '10/20/2024',
    actions: [
      <a key="view" href="#">Ver</a>,
      <a key="edit" href="#" style={{ marginLeft: 8 }}>Editar</a>,
    ],
  },
  {
    key: '2',
    professional: 'Juan Pablo Ruiz',
    reportType: 'Ortopedia',
    date: '10/24/2024',
    actions: [
      <a key="view" href="#">Ver</a>,
      <a key="edit" href="#" style={{ marginLeft: 8 }}>Editar</a>,
    ],
  },
];

const columns = [
  {
    title: <Checkbox />,
    dataIndex: 'checkbox',
    render: () => <Checkbox />,
    width: '5%',
  },
  {
    title: 'Profesional',
    dataIndex: 'professional',
    key: 'professional',
  },
  {
    title: 'Tipo Reporte',
    dataIndex: 'reportType',
    key: 'reportType',
  },
  {
    title: 'Fecha',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Acciones',
    dataIndex: 'actions',
    key: 'actions',
  },
];

const acudientesData = [
  {
    key: '1',
    nombres: 'Maria Patricia',
    apellidos: 'Lopez Gomez',
    parentesco: 'Hija',
    telefono: '304567890',
    direccion: 'CLL 45 - 60-20 INT 101',
    email: 'maria@gmail.com',
    acciones: [
      <a key="edit" href="#">Editar</a>,
      <a key="delete" href="#" style={{ marginLeft: 8 }}>Eliminar</a>,
    ],
  },
];

const acudientesColumns = [
  {
    title: <Checkbox />,
    dataIndex: 'checkbox',
    render: () => <Checkbox />,
    width: '5%',
  },
  {
    title: 'Nombres',
    dataIndex: 'nombres',
    key: 'nombres',
  },
  {
    title: 'Apellidos',
    dataIndex: 'apellidos',
    key: 'apellidos',
  },
  {
    title: 'Parentesco',
    dataIndex: 'parentesco',
    key: 'parentesco',
  },
  {
    title: 'Teléfono',
    dataIndex: 'telefono',
    key: 'telefono',
  },
  {
    title: 'Dirección',
    dataIndex: 'direccion',
    key: 'direccion',
  },
  {
    title: 'E-Mail',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Acciones',
    dataIndex: 'acciones',
    key: 'acciones',
  },
];

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
              <Row gutter={24}>
                <Col span={12}>
                  <Descriptions title="Datos Esenciales" column={1}>
                    <Descriptions.Item label="Empresa de Salud Domiciliaria">
                      604 607 8990
                    </Descriptions.Item>
                    <Descriptions.Item label="Tipo de Sangre">O+</Descriptions.Item>
                    <Descriptions.Item label="Estatura">165 cm</Descriptions.Item>
                    <Descriptions.Item label="Motivo de Ingreso">
                      Usuario de centro de día
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
                <Col span={12}>
                  <Descriptions title="Discapacidades, Apoyos y Limitaciones" column={1}>
                    <Descriptions.Item label="Discapacidad">
                      <Tag color="purple">Visual</Tag>
                      <Tag color="purple">Auditiva</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Limitaciones">
                      Ayuda para ir al baño
                    </Descriptions.Item>
                    <Descriptions.Item label="Dieta Especial">Sí</Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
              <Divider />
              <Row gutter={24}>
                <Col span={12}>
                  <Descriptions title="Preexistencias y Alergias" column={1}>
                    <Descriptions.Item label="Cirugías">
                      Sí <a href="#">Ver</a>
                    </Descriptions.Item>
                    <Descriptions.Item label="Alergias a medicamentos">
                      Sí <a href="#">Ver</a>
                    </Descriptions.Item>
                    <Descriptions.Item label="Otras Alergias">
                      Sí <a href="#">Ver</a>
                    </Descriptions.Item>
                    <Descriptions.Item label="Condiciones Especiales">
                      <a href="#">Ver</a>
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
                <Col span={12}>
                  <Descriptions title="Hábitos y otros datos" column={1}>
                    <Descriptions.Item label="Cafeína">Sí</Descriptions.Item>
                    <Descriptions.Item label="Tabaquismo">No</Descriptions.Item>
                    <Descriptions.Item label="Alcoholismo">No</Descriptions.Item>
                    <Descriptions.Item label="Sustancias Psicoactivas">No</Descriptions.Item>
                    <Descriptions.Item label="Maltratado">No</Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
            </Card>

            {/* Card: Reportes Clínicos */}
            <Card
              title="Reportes Clínicos"
              extra={
                <Button type="primary" icon={<PlusOutlined />}>
                  Agregar
                </Button>
              }
              className="detail-card"
            >
              <Table
                columns={columns}
                dataSource={clinicalReportsData}
                pagination={false}
              />
            </Card>

            {/* Card: Acudientes */}
            <Card
              title="Acudientes"
              extra={
                <Button type="primary" icon={<PlusOutlined />}>
                  Agregar
                </Button>
              }
              className="detail-card"
            >
              <Table
                columns={acudientesColumns}
                dataSource={acudientesData}
                pagination={false}
              />
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
              <Typography.Text>Historial de contratos asociados al usuario.</Typography.Text>
            </Card>
          </Space>

          <Divider />
        </Content>
      </Layout>
    </Layout>
  );
};
