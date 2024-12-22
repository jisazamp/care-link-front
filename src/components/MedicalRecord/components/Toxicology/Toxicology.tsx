import { useFormContext, Controller } from "react-hook-form";
import { Card, Row, Col, Form, Select, Typography } from "antd";

const { Title } = Typography;
const { Option } = Select;

export const Toxicology = () => {
  const { control } = useFormContext();

  return (
    <Card
      bordered
      title={<Title level={4}>Hábitos o antecedentes toxicológicos</Title>}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Tabaquismo" name="tabaquismo">
            <Controller
              name="tabaquism"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Seleccione">
                  <Option value="si">Sí</Option>
                  <Option value="no">No</Option>
                </Select>
              )}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Sustancias psicoactivas"
            name="sustanciasPsicoactivas"
          >
            <Controller
              name="psychoactive"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Seleccione">
                  <Option value="si">Sí</Option>
                  <Option value="no">No</Option>
                </Select>
              )}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Alcoholismo" name="alcoholismo">
            <Controller
              name="alcholism"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Seleccione">
                  <Option value="si">Sí</Option>
                  <Option value="no">No</Option>
                </Select>
              )}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Cafeína" name="cafeina">
            <Controller
              name="caffeine"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Seleccione">
                  <Option value="si">Sí</Option>
                  <Option value="no">No</Option>
                </Select>
              )}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};
