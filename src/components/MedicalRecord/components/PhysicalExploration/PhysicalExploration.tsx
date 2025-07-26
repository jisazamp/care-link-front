import { Card, Col, Form, Input, Row, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";

const { Title } = Typography;

export const PhysicalExploration = () => {
  const { control } = useFormContext();
  return (
    <Card title={<Title level={4}>Exploración física inicial</Title>} bordered>
      <Row gutter={16}>
        <Col span={12}>
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
        <Col span={12}>
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
      </Row>
    </Card>
  );
};
