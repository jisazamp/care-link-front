import React from 'react';
import {
  Layout,
  Card,
  Typography,
  Breadcrumb,
  Space,
  Button,
  Table,
  Checkbox,
  Row,
  Col,
  Form,
  Input,
  Select,
  DatePicker,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Header } from '../Header/Header';
import { Sidebar } from '../Sidebar/Sidebar';

const { Content, Sider } = Layout;
const { Title } = Typography;
const { Option } = Select;

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
              <Form layout="vertical">
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item label="Profesional" name="profesional">
                      <Select placeholder="Seleccione un profesional">
                        <Option value="andrea-salazar">Andrea Salazar</Option>
                        <Option value="juan-perez">Juan Pérez</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Tipo de Reporte" name="tipoReporte">
                      <Select placeholder="Seleccione el tipo de reporte">
                        <Option value="enfermeria">Enfermería</Option>
                        <Option value="medico">Médico</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item label="Paciente" name="paciente">
                      <Input defaultValue="Juan Antonio Lopez Orrego" disabled />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Fecha de registro" name="fechaRegistro">
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item label="Motivo de Consulta" name="motivoConsulta">
                      <Input placeholder="Ingrese el motivo de consulta" />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>

            <Card
              title="Exploración física"
              className="detail-card"
            >
              <Row gutter={24}>
                <Col span={4}>Peso: <Input /></Col>
                <Col span={4}>Presión Arterial: <Input /></Col>
                <Col span={4}>Frecuencia Cardiaca: <Input /></Col>
                <Col span={4}>Temperatura Corporal: <Input /></Col>
                <Col span={4}>Pulsoximetría: <Input /></Col>
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
