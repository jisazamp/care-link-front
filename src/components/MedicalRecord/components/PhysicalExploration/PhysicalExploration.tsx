import { useFormContext, Controller } from "react-hook-form";
import { Card, Row, Col, Form, Input, Typography } from "antd";

const { Title } = Typography;

export const PhysicalExploration = () => {
  const { control } = useFormContext();
  return (
    <Card title={<Title level={4}>Exploración física inicial</Title>} bordered>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item label="Estatura" name="estatura">
            <Controller
              control={control}
              name="height"
              render={({ field }) => (
                <Input
                  placeholder="Ingrese en cm"
                  suffix="cm"
                  type="number"
                  {...field}
                />
              )}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Peso" name="peso">
            <Controller
              name="weight"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Ingrese en kg"
                  suffix="kg"
                  type="number"
                  {...field}
                />
              )}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Presión Arterial" name="presionArterial">
            <Controller
              control={control}
              name="bloodPressure"
              render={({ field }) => (
                <Input
                  placeholder="Ingrese en mmHg"
                  suffix="mmHg"
                  type="number"
                  {...field}
                />
              )}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Frecuencia Cardíaca" name="frecuenciaCardiaca">
            <Controller
              name="bpm"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Ingrese en bpm"
                  suffix="bpm"
                  type="number"
                  {...field}
                />
              )}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Temperatura Corporal" name="temperaturaCorporal">
            <Controller
              name="temperature"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="Ingrese en °C"
                  suffix="°C"
                  type="number"
                  {...field}
                />
              )}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};
