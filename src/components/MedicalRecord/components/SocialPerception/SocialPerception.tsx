import { Card, Col, Form, Row, Select, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import type { FormValues } from "../../schema/schema";

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
                  <Option value="fluida">Fluida y coherente</Option>
                  <Option value="limitada">Limitada pero comprensible</Option>
                  <Option value="escasa">Escasa o inexistente</Option>
                  <Option value="mediatizada">
                    Mediatizada (uso de ayudas técnicas, por ejemplo)
                  </Option>
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
                  <Option value="congruente">Congruente y expresiva</Option>
                  <Option value="limitada">Limitada en gestualidad</Option>
                  <Option value="incoherente">
                    Incoherente con el discurso verbal
                  </Option>
                  <Option value="ausente">Prácticamente ausente</Option>
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
                  <Option value="eutimico">Eutímico (ánimo estable)</Option>
                  <Option value="hipertimico">
                    Hipertímico (elevado o eufórico)
                  </Option>
                  <Option value="distimico">
                    Distímico (triste o melancólico)
                  </Option>
                  <Option value="ansioso">Ansioso</Option>
                  <Option value="irritable">Irritable</Option>
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
                  <Option value="no">
                    No se reporta antecedente de maltrato
                  </Option>
                  <Option value="fisico">Se reporta maltrato físico</Option>
                  <Option value="emocional">
                    Se reporta maltrato psicológico o emocional
                  </Option>
                  <Option value="negligencia">
                    Se reporta negligencia o abandono
                  </Option>
                  <Option value="economico">
                    Se reporta maltrato económico o patrimonial
                  </Option>
                  <Option value="noDisponible">
                    Información no disponible/No indagado
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
