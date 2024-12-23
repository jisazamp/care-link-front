import React from 'react';
import {
  Layout,
  Card,
  Typography,
  Space,
  Avatar,
  Row,
  Col
} from 'antd';
import patientImage from '../assets/Patients/patient1.jpg';
import { Header } from '../Header/Header';
import { Sidebar } from '../Sidebar/Sidebar';

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

export const ShowMedicalReport: React.FC = () => {
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
                {/* Primera tarjeta con información del paciente */}
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
                        <Avatar
                          src={patientImage}
                          size={96}
                          alt="Avatar del paciente"
                          style={{
                            borderRadius: '50%',
                            border: '1px solid #ddd',
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

                {/* Segunda tarjeta: Tipo de reporte */}
                <Col span={24}>
                  <Card className="card-legacy" style={{ marginBottom: '16px' }}>
                    <Title level={5}>Tipo de reporte</Title>
                    <Text>Enfermería</Text>
                  </Card>
                </Col>

                {/* Tercera tarjeta: Exploración física */}
                <Col span={24}>
                  <Card className="card-legacy" style={{ marginBottom: '16px' }}>
                    <Title level={5}>Exploración física</Title>
                    <Space direction="vertical">
                      <Text>Peso: 65 kg</Text>
                      <Text>Presión arterial: 110 mm</Text>
                      <Text>Frecuencia cardíaca: 80 lpm</Text>
                      <Text>Temperatura corporal: 38° - Fiebre leve</Text>
                      <Text>Pulsioximetría: 95%</Text>
                    </Space>
                  </Card>
                </Col>

                {/* Cuarta tarjeta: Diagnóstico */}
                <Col span={24}>
                  <Card className="card-legacy" style={{ marginBottom: '16px' }}>
                    <Title level={5}>Diagnóstico</Title>
                    <Text>Integridad de la piel alterada relacionada con herida en la rodilla izquierda debido a traumatismo leve</Text>
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
