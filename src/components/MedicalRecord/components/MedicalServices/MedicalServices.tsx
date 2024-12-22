import { useFormContext, Controller } from "react-hook-form";
import { Card, Row, Col, Form, Select, Input, Typography } from "antd";

const { Option } = Select;
const { Title } = Typography;

export const MedicalServices = () => {
  const { control } = useFormContext();

  return (
    <Card
      title={<Title level={4}>Servicio externo para emergencias médicas</Title>}
      bordered
    >
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Cuenta con servicio externo para emergencias">
            <Controller
              name="hasExternalService"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Seleccione"
                  style={{
                    width: "100%",
                  }}
                >
                  <Option value={true}>Sí</Option>
                  <Option value={false}>No</Option>
                </Select>
              )}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="¿Cuál?" name="cualServicio">
            <Controller
              name="externalService"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Seleccione un servicio"
                  style={{
                    width: "100%",
                  }}
                >
                  <Option value="colsanitas">Colsanitas</Option>
                  <Option value="cruz-roja">Cruz Roja</Option>
                  <Option value="emi">EMI</Option>
                  <Option value="medilink">Medilink</Option>
                  <Option value="sura">SURA</Option>
                  <Option value="otra">Otro</Option>
                </Select>
              )}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Teléfono para servicio emergencia médica"
            name="telefonoEmergencias"
          >
            <Controller
              name="externalServicePhone"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Número de contacto" />
              )}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};
