import { useFormContext, Controller } from "react-hook-form";
import { Card, Typography, Row, Col, Form, Select } from "antd";
import { FormValues } from "../../schema/schema";

const { Title } = Typography;
const { Option } = Select;

export const SocialPerception = () => {
  const { control } = useFormContext<FormValues>();
  return (
    <Card
      bordered
      title={<Title level={4}>Habilidades de percepción social</Title>}
      style={{ marginBottom: 8 }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Comunicación verbal" name="comunicacionVerbal">
            <Controller
              name="verbalCommunication"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Seleccione">
                  <Option value="activa">Activa</Option>
                  <Option value="pasiva">Pasiva</Option>
                </Select>
              )}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Comunicación no verbal" name="comunicacionNoVerbal">
            <Controller
              name="nonVerbalCommunication"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Seleccione">
                  <Option value="activa">Activa</Option>
                  <Option value="pasiva">Pasiva</Option>
                </Select>
              )}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Estado de ánimo" name="estadoAnimo">
            <Controller
              name="mood"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Seleccione">
                  <Option value="alegre">Alegre</Option>
                  <Option value="triste">Triste</Option>
                  <Option value="ansioso">Ansioso</Option>
                </Select>
              )}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Ha sufrido maltrato" name="maltrato">
            <Controller
              name="abused"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Seleccione">
                  <Option value={true}>Sí</Option>
                  <Option value={false}>No</Option>
                </Select>
              )}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};
