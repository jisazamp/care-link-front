import { Card, Col, Form, Row, Select, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import type { FormValues } from "../../schema/schema";

const { Title } = Typography;
const { Option } = Select;

export const Toxicology = () => {
  const { control } = useFormContext<FormValues>();

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
                  <Option value="no">No consume</Option>
                  <Option value="exfumador">Exfumador/a</Option>
                  <Option value="activo">Consumo activo</Option>
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
              name="psycoactive"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Seleccione">
                  <Option value="sinAntecedentes">Sin antecedentes</Option>
                  <Option value="experimental">
                    Antecedentes de uso experimental
                  </Option>
                  <Option value="esporadico">
                    Uso esporádico experimental
                  </Option>
                  <Option value="problematico">
                    Uso problemático/dependencia diagnosticada
                  </Option>
                  <Option value="tratamiento">
                    Bajo tratamiento por consumo de SPA
                  </Option>
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
                  <Option value="no">No consume</Option>
                  <Option value="social">Consumo ocasional social</Option>
                  <Option value="regular">
                    Consumo regular sin dependencia
                  </Option>
                  <Option value="problematico">
                    Consumo problemático o dependencia (diagnosticada o
                    sospechada)
                  </Option>
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
                  <Option value="no">No consume</Option>
                  <Option value="ocasional">Consumo ocasional</Option>
                  <Option value="moderado">
                    Consumo habitual moderado (1-2 porciones/día)
                  </Option>
                  <Option value="elevado">
                    Consumo elevado (más de 3 porciones/día)
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
