import React from 'react';
import {
  Layout,
  Card,
  Typography,
  Row,
  Col,
  Divider,
  Button
} from 'antd';
import { Header } from '../Header/Header';
import { Sidebar } from '../Sidebar/Sidebar';
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import avatar from '../assets/Patients/patient1.jpg'

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

export const ContractDetail: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Header />
      <Layout>
        <Sider collapsible style={{ backgroundColor: '#FFF' }}>
          <Sidebar />
        </Sider>
        <Content style={{ padding: '24px' }}>
          <Card className="main-frame" style={{ border: 'none', backgroundColor: 'transparent' }}>
            <Card className="inner-frame" style={{ margin: '16px', padding: '32px', borderRadius: '8px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' }}>
              <Row gutter={[16, 16]}>

                {/* Primera tarjeta: Información del paciente */}
                <Col span={24}>
                  <Card
                    className="card-legacy"
                    style={{
                      marginBottom: '16px',
                      padding: '16px 24px',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <Row align="middle">
                      <Col flex="96px">
                        <img
                          src={avatar}
                          alt="Avatar del paciente"
                          style={{
                            width: '96px',
                            height: '96px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                          }}
                        />
                      </Col>
                      <Col flex="auto">
                        <Row>
                          <Col span={12}>
                            <div style={{ lineHeight: '1.5', color: '#212529' }}>
                              <Title level={5} style={{ margin: 0, fontWeight: 600 }}>JUAN ANTONIO LOPEZ ORREGO</Title>
                              <Text style={{ fontSize: '14px', color: '#495057' }}>44567890 - Masculino - 1956/11/08 - 68 años</Text><br />
                              <Text style={{ fontSize: '14px', color: '#495057' }}>Casado - Pensionado</Text>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div style={{ lineHeight: '1.5', color: '#212529' }}>
                              <Text style={{ fontSize: '14px', color: '#495057' }}>CLL 45 - 60-20 INT 101</Text><br />
                              <Text style={{ fontSize: '14px', color: '#495057' }}>315 6789 6789 - juanantonio@gmail.com</Text>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card>
                </Col>

                {/* Segunda tarjeta: Detalles del contrato */}
                <Col span={24}>
                  <Card
                    className="card-legacy"
                    style={{
                      marginBottom: '16px',
                      padding: '16px 24px',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Title level={5} style={{ fontWeight: 'bold', color: '#333333' }}>Contrato 2024001 - Realizado por: SARA MANUELA GONZALEZ</Title>
                      </Col>
                      <Col>
                        <Button type="text" icon={<EditOutlined />} />
                        <Button type="text" icon={<DeleteOutlined />} />
                      </Col>
                    </Row>
                    <Divider style={{ margin: '12px 0' }} />
                    <Row>
                      <Col span={12}>
                        <div style={{ paddingBottom: '8px' }}>
                          <Title level={5} style={{ fontWeight: 'bold', fontSize: '14px', color: '#495057' }}>Tipo de Contrato</Title>
                          <Text style={{ fontSize: '14px', color: '#333333' }}>Recurrente</Text>
                        </div>
                        <div style={{ paddingBottom: '8px' }}>
                          <Title level={5} style={{ fontWeight: 'bold', fontSize: '14px', color: '#495057' }}>Fecha de inicio</Title>
                          <Text style={{ fontSize: '14px', color: '#333333' }}>2024-11-08</Text>
                        </div>
                      </Col>
                      <Col span={12}>
                        <div style={{ paddingBottom: '8px' }}>
                          <Title level={5} style={{ fontWeight: 'bold', fontSize: '14px', color: '#495057' }}>Fecha de finalización</Title>
                          <Text style={{ fontSize: '14px', color: '#333333' }}>2024-11-08</Text>
                        </div>
                        <div style={{ paddingBottom: '8px' }}>
                          <Title level={5} style={{ fontWeight: 'bold', fontSize: '14px', color: '#495057' }}>Estado del contrato</Title>
                          <Text style={{ fontSize: '14px', color: '#333333' }}>Facturado: Sí</Text><br />
                          <Text style={{ fontSize: '14px', color: '#333333' }}>Vigente: Sí <a>Editar</a></Text>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Col>

                {/* Tercera tarjeta: Servicios */}
                <Col span={24}>
                  <Card
                    className="card-legacy"
                    style={{
                      marginBottom: '16px',
                      padding: '16px 24px',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <Title level={5} style={{ fontWeight: 'bold', color: '#333333' }}>Servicios o productos incluidos</Title>
                    <Divider style={{ margin: '12px 0' }} />
                    <Row>
                      <Col span={6}><Text>Inicia el</Text></Col>
                      <Col span={6}><Text>Finaliza el</Text></Col>
                      <Col span={6}><Text>Servicio</Text></Col>
                      <Col span={6}><Text>Acciones</Text></Col>
                    </Row>
                  </Card>
                </Col>

                {/* Cuarta tarjeta: Facturas */}
                <Col span={24}>
                  <Card
                    className="card-legacy"
                    style={{
                      marginBottom: '16px',
                      padding: '16px 24px',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <Title level={5} style={{ fontWeight: 'bold', color: '#333333' }}>Facturas generadas</Title>
                    <Divider style={{ margin: '12px 0' }} />
                    <Row>
                      <Col span={6}><Text>Fecha de emisión</Text></Col>
                      <Col span={6}><Text>N° Factura</Text></Col>
                      <Col span={6}><Text>Contrato</Text></Col>
                      <Col span={6}><Text>Total</Text></Col>
                    </Row>
                  </Card>
                </Col>

              </Row>
            </Card>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};
