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
                  <Option value="total">Continencia total</Option>
                  <Option value="urinariaOcasional">
                    Incontinencia urinaria ocasional
                  </Option>
                  <Option value="urinariaPermanente">
                    Incontinencia urinaria permanente
                  </Option>
                  <Option value="fecal">Incontinencia fecal</Option>
                  <Option value="urinariaFecal">
                    Incontinencia urinaria y fecal
                  </Option>
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
                  <Option value="autonoma">
                    Deambulación autónoma sin ayudas
                  </Option>
                  <Option value="tecnica">
                    Deambulación con ayuda técnica (bastón, caminador)
                  </Option>
                  <Option value="humana">
                    Deambulación con asistencia humana
                  </Option>
                  <Option value="limitada">
                    Postrado/a con movilidad limitada
                  </Option>
                  <Option value="sillaRuedasAutonomia">
                    En silla de ruedas con autonomía
                  </Option>
                  <Option value="sillaRuedasDependencia">
                    En silla de ruedas con dependencia
                  </Option>
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
                  <Option value="independiente">
                    Independiente en AVD (actividades de la vida diaria)
                  </Option>
                  <Option value="supervisionOcasional">
                    Requiere supervisión ocasional
                  </Option>
                  <Option value="dependienteParcial">
                    Dependiente parcial (requiere ayuda para algunas AVD)
                  </Option>
                  <Option value="dependienteTotal">
                    Dependiente total en AVD
                  </Option>
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
                  <Option value="adecuados">
                    Apariencia e higiene personal adecuados
                  </Option>
                  <Option value="descuidada">
                    Apariencia descuidada ocasional
                  </Option>
                  <Option value="falta">
                    Evidencia falta de cuidado personal
                  </Option>
                  <Option value="asistencia">
                    Requiere asistencia para mantener la higiene y la
                    presentación
                  </Option>
                </Select>
              )}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};
