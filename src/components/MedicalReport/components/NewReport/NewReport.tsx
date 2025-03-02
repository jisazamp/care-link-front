import React from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Row,
  Col,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export const NewReport: React.FC = () => {
  const navigate = useNavigate();

  const handleFinish = (values: {
    professional: string;
    reportType: string;
    registrationDate: string;
    consultationReason: string;
    weight: string;
    bloodPressure: string;
    heartRate: string;
    bodyTemperature: string;
    oxygenSaturation: string;
    diagnosis: string;
    internalObservations: string;
    referral: string;
    treatmentObservation: string;
  }) => {
    console.log("Reporte creado:", values);
    navigate(-1);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "24px",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Card
        title="Nuevo Reporte Clínico"
        style={{
          width: "95%",
          margin: "auto",
          background: "#fff",
          padding: "24px",
        }}
      >
        <Form layout="vertical" onFinish={handleFinish}>
          {/* Datos Básicos del Reporte */}
          <Card
            title="Datos básicos del reporte"
            style={{ marginBottom: 16, width: "100%" }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Profesional"
                  name="professional"
                  rules={[{ required: true, message: "Campo requerido" }]}
                >
                  <Select placeholder="Seleccione un profesional">
                    <Select.Option value="profesional1">
                      Profesional 1
                    </Select.Option>
                    <Select.Option value="profesional2">
                      Profesional 2
                    </Select.Option>
                    <Select.Option value="profesional3">
                      Profesional 3
                    </Select.Option>
                    <Select.Option value="profesional4">
                      Profesional 4
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Tipo de Reporte"
                  name="reportType"
                  rules={[{ required: true, message: "Campo requerido" }]}
                >
                  <Select placeholder="Seleccione el tipo de reporte">
                    <Select.Option value="enfermeria">Enfermería</Select.Option>
                    <Select.Option value="psicologia">Psicología</Select.Option>
                    <Select.Option value="nutricion">Nutrición</Select.Option>
                    <Select.Option value="fisioterapia">
                      Fisioterapia
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Fecha de registro"
                  name="registrationDate"
                  rules={[{ required: true, message: "Campo requerido" }]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Motivo de consulta"
                  name="consultationReason"
                  rules={[{ required: true, message: "Campo requerido" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Exploración Física */}
          <Card
            title="Exploración Física"
            style={{ marginBottom: 16, width: "100%" }}
          >
            <Row gutter={16}>
              <Col span={4}>
                <Form.Item label="Peso (kg)" name="weight">
                  <Input type="number" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="Presión Arterial" name="bloodPressure">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="Frecuencia Cardíaca" name="heartRate">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  label="Temperatura Corporal (°C)"
                  name="bodyTemperature"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label="Pulsoximetría (%)" name="oxygenSaturation">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* Datos de Diagnóstico */}
          <Card
            title="Datos del diagnóstico"
            style={{ marginBottom: 16, width: "100%" }}
          >
            <Form.Item label="Diagnóstico" name="diagnosis">
              <Input />
            </Form.Item>
            <Form.Item
              label="Observaciones internas"
              name="internalObservations"
            >
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item label="Remisión" name="referral">
              <Select placeholder="Seleccione una opción">
                <Select.Option value="no_aplica">No Aplica</Select.Option>
                <Select.Option value="especialista">Especialista</Select.Option>
                <Select.Option value="hospitalizacion">
                  Hospitalización
                </Select.Option>
              </Select>
            </Form.Item>
          </Card>

          {/* Tratamientos y Recomendaciones */}
          <Card
            title="Tratamientos y recomendaciones"
            style={{ marginBottom: 16, width: "100%" }}
          >
            <Form.Item label="Observación" name="treatmentObservation">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Card>

          {/* Adjuntar Documentos */}
          <Card
            title="Adjuntar documentos"
            style={{ marginBottom: 16, width: "100%" }}
          >
            <Upload>
              <Button icon={<UploadOutlined />}>Agregar</Button>
            </Upload>
          </Card>

          {/* Botones */}
          <Card style={{ width: "100%", textAlign: "right" }}>
            <Button style={{ marginRight: 8 }}>Restablecer</Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: "#722ed1" }}
            >
              Guardar y continuar
            </Button>
          </Card>
        </Form>
      </Card>
    </div>
  );
};
