import { Card, Row, Typography, Col, Select, Form } from "antd";
import { FormValues } from "../../schema/schema";
import { useFormContext, Controller } from "react-hook-form";

const { Title } = Typography;
const { Option } = Select;

export const BiophysicalSkills = () => {
  const { control } = useFormContext<FormValues>();

  return (
    <Card variant="outlined" title={<Title level={4}>Habilidades biofísicas</Title>}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Tipo de alimentación" name="tipoAlimentacion">
            <Controller
              name="feeding"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Seleccione">
                  <Option value="normal">Normal</Option>
                  <Option value="especial">Especial</Option>
                </Select>
              )}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Tipo de sueño" name="tipoSueño">
            <Controller
              name="sleepType"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Seleccione">
                  <Option value="regular">Regular</Option>
                  <Option value="irregular">Irregular</Option>
                </Select>
              )}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Continencia" name="continencia">
            <Controller
              name="continence"
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
        <Col span={12}>
          <Form.Item label="Tipo de movilidad" name="tipoMovilidad">
            <Controller
              name="mobility"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Seleccione">
                  <Option value="conAyuda">Con ayuda</Option>
                  <Option value="independiente">Independiente</Option>
                </Select>
              )}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Cuidado personal" name="cuidadoPersonal">
            <Controller
              name="personalCare"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Seleccione">
                  <Option value="independiente">Independiente</Option>
                  <Option value="conAyudaParcial">Con ayuda parcial</Option>
                </Select>
              )}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Apariencia personal" name="aparienciaPersonal">
            <Controller
              name="personalAppearance"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Seleccione">
                  <Option value="buena">Buena</Option>
                  <Option value="desaliñada">Desaliñada</Option>
                </Select>
              )}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};
