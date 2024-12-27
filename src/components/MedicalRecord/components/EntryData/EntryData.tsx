import { useFormContext, Controller } from "react-hook-form";
import { Card, Row, Col, Typography, Form, DatePicker, Input } from "antd";

const { Title } = Typography;

export const EntryData = () => {
  const { control } = useFormContext();

  return (
    <Card title={<Title level={4}>Datos básicos de ingreso</Title>} bordered>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Fecha de registro" name="fechaRegistro">
            <Controller
              name="entryDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  style={{
                    width: "100%",
                  }}
                />
              )}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Motivo de ingreso" name="motivoIngreso">
            <Controller
              name="entryReason"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Motivo" />}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};
