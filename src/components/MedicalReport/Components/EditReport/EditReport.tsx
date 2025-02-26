import React from "react";
import { Card, Form, Input, Button, Select, DatePicker, Row, Col, Typography, Avatar } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";

const { Text } = Typography;

export const EditReport: React.FC = () => {
  const { reportId, userId } = useParams();
  const navigate = useNavigate();

  // Datos del usuario para mostrar en la tarjeta
  const user = {
    nombre: "Juan Antonio Lopez Orrego",
    documento: "44567890",
    genero: "Masculino",
    fechaNacimiento: "1956/11/08",
    edad: 68,
    estadoCivil: "Casado - Pensionado",
    direccion: "CLL 45 - 60-20 INT 101",
    telefono: "315 6789 6789",
    email: "juanantonio@gmail.com",
    foto: "", // Puedes agregar una URL de imagen si hay una disponible
  };

  const handleFinish = (values: unknown) => {
    console.log("Reporte actualizado:", values);
    navigate(`/usuarios/${userId}/detalles`);
  };

  return (
    <div style={{ padding: "24px", maxWidth: "100%", minHeight: "100vh", margin: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
      
      {/* Tarjeta de Información del Paciente */}
      <Card style={{ width: "100%", marginBottom: 16 }}>
        <Row align="middle" gutter={16}>
          <Col>
            {user.foto ? (
              <Avatar size={80} src={user.foto} />
            ) : (
              <Avatar size={80} icon={<UserOutlined />} />
            )}
          </Col>
          <Col flex="auto">
            <Typography.Title level={4}>{user.nombre}</Typography.Title>
            <Text strong>{user.documento}</Text> - {user.genero} - {user.fechaNacimiento} - <Text strong>{user.edad} años</Text>
            <br />
            {user.estadoCivil}
            <br />
            <Text>{user.direccion}</Text>
            <br />
            {user.telefono} - {user.email}
          </Col>
        </Row>
      </Card>

      {/* Segunda Tarjeta: Información del Reporte */}
      <Card style={{ marginBottom: 16, width: "100%" }}>
        <Text strong>Asociado a:</Text> Reporte clínico - {reportId} - <Text strong>Realizado por:</Text> SARA MANUELA GONZALEZ
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={24}>
            <Card style={{ backgroundColor: "#f5f5f5", borderRadius: 8 }}>
              <Row gutter={16}>
                <Col span={24}>
                  <Text strong>Motivo de consulta:</Text>
                  <p>Usuario se cayó en la mañana mientras se bañaba</p>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Text strong>Diagnóstico:</Text>
                  <p>Integridad de la piel alterada relacionada con herida en la rodilla izquierda debido a traumatismo leve</p>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Text strong>Remisión:</Text>
                  <p>Ortopedia</p>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Tercera Tarjeta: Datos del Reporte de Evolución */}
      <Card title="Datos del Reporte de Evolución" style={{ marginBottom: 16, width: "100%" }}>
        <Form layout="vertical" onFinish={handleFinish}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Profesional" name="professional">
                <Select disabled defaultValue="Andrea Salazar" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Tipo de reporte" name="reportType">
                <Select mode="multiple" placeholder="Seleccione el tipo de reporte" defaultValue={["Enfermería"]}>
                  <Select.Option value="enfermeria">Enfermería</Select.Option>
                  <Select.Option value="psicologia">Psicología</Select.Option>
                  <Select.Option value="nutricion">Nutrición</Select.Option>
                  <Select.Option value="fisioterapia">Fisioterapia</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Fecha de registro" name="date">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Observación" name="observation">
                <Input.TextArea rows={4} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Cuarta Tarjeta: Botones */}
      <Card style={{ width: "100%", textAlign: "right" }}>
        <Button style={{ marginRight: 8 }}>Restablecer</Button>
        <Button type="primary" htmlType="submit" onClick={handleFinish}>
          Guardar
        </Button>
      </Card>
    </div>
  );
};
