import { Card, Col, Form, Row, Select, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import type { FormValues } from "../../schema/schema";

const { Title } = Typography;
const { Option } = Select;

export const BiophysicalSkills = () => {
  const { control } = useFormContext<FormValues>();

  return (
    <Card bordered title={<Title level={4}>Habilidades biofísicas</Title>}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Tipo de alimentación" name="tipoAlimentacion">
            <Controller
              name="feeding"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Seleccione">
                  <Option value="autonoma">
                    Alimentación autónoma sin dificultad
                  </Option>
                  <Option value="autonomaAdaptaciones">
                    Alimentación autónoma con adaptaciones
                  </Option>
                  <Option value="asistidaParcial">
                    Alimentación asistida parcialmente
                  </Option>
                  <Option value="asistida">
                    Alimentación totalmente asistida
                  </Option>
                  <Option value="alternativa">
                    Ingesta por vía alternativa (sonda nasogástrica,
                    gastrostomía)
                  </Option>
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
                  <Option value="conservado">
                    Patrón de sueño conservado (sin alteraciones)
                  </Option>
                  <Option value="fragmentado">
                    Sueño fragmentado/no reparador
                  </Option>
                  <Option value="dificultad">
                    Dificultad para conciliar o mantener el sueño
                  </Option>
                  <Option value="medicacion">
                    Uso de medicación para inducir el sueño
                  </Option>
                  <Option value="hipersomnia">
                    Hipersomnia o somnolencia diurna excesiva
                  </Option>
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
