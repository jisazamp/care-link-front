import { Card, Col, Form, Input, Row, Select, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";

const { Option } = Select;
const { Title } = Typography;

export const BasicHealthData = () => {
  const { control } = useFormContext();
  return (
    <Card title={<Title level={4}>Datos básicos de salud</Title>} bordered>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="EPS" name="eps">
            <Controller
              name="eps"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Ingrese la EPS" />
              )}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Tipo de Sangre" name="tipoSangre">
            <Controller
              name="bloodType"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Seleccione tipo de sangre"
                  style={{
                    width: "100%",
                  }}
                >
                  <Option value="A+">A+</Option>
                  <Option value="A-">A-</Option>
                  <Option value="AB+">AB+</Option>
                  <Option value="AB-">AB-</Option>
                  <Option value="B+">B+</Option>
                  <Option value="B-">B-</Option>
                  <Option value="O+">O+</Option>
                  <Option value="O-">O-</Option>
                </Select>
              )}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};
