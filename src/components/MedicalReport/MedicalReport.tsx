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
              <Form layout="vertical">
                <Row gutter={24}>
                  <Col span={4}>
                    <Form.Item label="Peso">
                      <Input placeholder="Ingrese el peso" />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="Presión Arterial">
                      <Input placeholder="Ingrese la presión arterial" />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="Frecuencia Cardiaca">
                      <Input placeholder="Ingrese la frecuencia cardiaca" />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="Temperatura Corporal">
                      <Input placeholder="Ingrese la temperatura corporal" />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item label="Pulsoximetría">
                      <Input placeholder="Ingrese la pulsoximetría" />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>

            <Card
              title="Datos de diagnóstico"
              className="detail-card"
            >
              <Form layout="vertical">
                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item label="Diagnóstico">
                      <Input.TextArea rows={3} placeholder="Ingrese el diagnóstico" />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="Observaciones internas">
                      <Input.TextArea rows={3} placeholder="Ingrese las observaciones internas" />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>

            <Card
              title="Tratamientos y recomendaciones"
              className="detail-card"
            >
              <Form layout="vertical">
                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item label="Tratamiento">
                      <Input placeholder="Ingrese el tratamiento" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Duración">
                      <Input placeholder="Ingrese la duración" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item label="Recomendaciones adicionales">
                      <Input.TextArea rows={3} placeholder="Ingrese recomendaciones adicionales" />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
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
