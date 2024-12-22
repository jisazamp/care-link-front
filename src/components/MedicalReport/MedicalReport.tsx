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
  Row,
  Col,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Header } from '../Header/Header';
import { Sidebar } from '../Sidebar/Sidebar';

const { Content, Sider } = Layout;
const { Title } = Typography;

const reportData = [
  {
    key: '1',
    profesional: 'Andrea Salazar',
    tipoReporte: 'Enfermería',
    fecha: '2024-11-08',
    motivo: 'Consulta general',
    acciones: [
      <a key="view" href="#">Ver</a>,
      <a key="edit" href="#" style={{ marginLeft: 8 }}>Editar</a>,
    ],
  },
];

const reportColumns = [
  {
    title: <Checkbox />,
    dataIndex: 'checkbox',
    render: () => <Checkbox />,
    width: '5%',
  },
  {
    title: 'Profesional',
    dataIndex: 'profesional',
    key: 'profesional',
  },
  {
    title: 'Tipo de Reporte',
    dataIndex: 'tipoReporte',
    key: 'tipoReporte',
  },
  {
    title: 'Fecha',
    dataIndex: 'fecha',
    key: 'fecha',
  },
  {
    title: 'Motivo',
    dataIndex: 'motivo',
    key: 'motivo',
  },
  {
    title: 'Acciones',
    dataIndex: 'acciones',
    key: 'acciones',
  },
];

export const MedicalReport: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Layout>
        <Sider collapsible style={{ backgroundColor: '#FFF' }}>
          <Sidebar />
        </Sider>
        <Content className="content-wrapper" style={{ padding: '16px' }}>
          <Breadcrumb className="breadcrumb" style={{ marginBottom: '16px' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Usuarios</Breadcrumb.Item>
            <Breadcrumb.Item>Nuevo reporte clínico</Breadcrumb.Item>
          </Breadcrumb>

          <Title level={3} className="page-title">Nuevo Reporte Clínico</Title>

          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card
              title="Datos básicos del reporte"
              className="detail-card"
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Typography.Text strong>Profesional:</Typography.Text>
                  <div>Andrea Salazar</div>
                  <Divider />
                  <Typography.Text strong>Paciente:</Typography.Text>
                  <div>Juan Antonio Lopez Orrego</div>
                </Col>
                <Col span={12}>
                  <Typography.Text strong>Tipo de Reporte:</Typography.Text>
                  <div>Enfermería</div>
                  <Divider />
                  <Typography.Text strong>Fecha de registro:</Typography.Text>
                  <div>2024-11-08</div>
                </Col>
              </Row>
            </Card>

            <Card
              title="Exploración física"
              className="detail-card"
            >
              <Row gutter={24}>
                <Col span={4}>Peso: <input type="text" /></Col>
                <Col span={4}>Presión Arterial: <input type="text" /></Col>
                <Col span={4}>Frecuencia Cardiaca: <input type="text" /></Col>
                <Col span={4}>Temperatura Corporal: <input type="text" /></Col>
                <Col span={4}>Pulsoximetría: <input type="text" /></Col>
              </Row>
            </Card>

            <Card
              title="Reportes clínicos previos"
              extra={<Button type="primary" icon={<PlusOutlined />}>Agregar</Button>}
              className="detail-card"
            >
              <Table columns={reportColumns} dataSource={reportData} pagination={false} />
            </Card>
          </Space>
        </Content>
      </Layout>
    </Layout>
  );
};
