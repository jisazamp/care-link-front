import { Layout, Card, Button, Form, Checkbox, Row, Col } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

export const BillingContract = ({ onNext, onBack }: { onNext?: () => void; onBack?: () => void }) => {
  return (
    <Layout style={{ padding: "24px", minHeight: "100vh" }}>
      {/* Frame Principal */}
      <Row justify="center">
        <Col span={18}>
          {/* Frame Secundario */}
          <Card bordered>
            <div className="card-body">
              {/* Wrapper */}
              <div className="wrapper">
                {/* Content */}
                <div className="content">
                  {/* Formulario */}
                  <Form layout="vertical">
                    {/* Card Legacy */}
                    <Card bordered>
                      {/* Head */}
                      <Row justify="space-between" align="middle">
                        <Col>
                          <h3 style={{ margin: 0 }}>Descargar factura</h3>
                        </Col>
                        <Col>
                          <Button type="primary" icon={<DownloadOutlined />}>
                            Descargar
                          </Button>
                        </Col>
                      </Row>

                      {/* Body */}
                      <div style={{ marginTop: 16 }}>
                        <Form.Item label="Pago"></Form.Item>

                        <Form.Item name="registerPayment" valuePropName="checked">
                          <Checkbox>Registrar pago</Checkbox>
                        </Form.Item>
                      </div>
                    </Card>
                  </Form>
                </div>
              </div>
            </div>
          </Card>

          {/* Botones de navegación */}
          <Row justify="end" style={{ marginTop: 24 }}>
            {onBack && (
              <Button onClick={onBack} style={{ marginRight: 8 }}>
                Atrás
              </Button>
            )}
            {onNext && (
              <Button type="primary" onClick={onNext}>
                Siguiente
              </Button>
            )}
          </Row>
        </Col>
      </Row>
    </Layout>
  );
};
