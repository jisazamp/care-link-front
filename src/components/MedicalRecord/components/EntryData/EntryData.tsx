import { Card, Row, Col, Typography, Form, DatePicker, Input } from "antd";
import { FormValues } from "../../MedicalRecord";
import { useFormContext, Controller } from "react-hook-form";

const { Title, Text } = Typography;

export const EntryData = () => {
  const { control, formState } = useFormContext<FormValues>();
  const { errors } = formState;
  return (
    <Card title={<Title level={4}>Datos básicos de ingreso</Title>} bordered>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Fecha de registro"
            name="fechaRegistro"
            validateStatus={errors.entryDate ? "error" : ""}
            help={
              errors.entryDate?.message && (
                <Text type="danger">{errors.entryDate.message}</Text>
              )
            }
          >
            <Controller
              name="entryDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  placeholder="DD-MM-YYYY"
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
