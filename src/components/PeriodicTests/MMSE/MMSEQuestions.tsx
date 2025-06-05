import React from "react";
import { Form, Input, Select, Button } from "antd";
import { MMSEQuestionsProps } from "./types";

const { Option } = Select;

// Preguntas reales del MMSE
const questions = [
  { key: "dia_semana", label: "¿Qué día de la semana es hoy?", type: "input" },
  { key: "dia_mes", label: "¿Qué día del mes es hoy?", type: "input" },
  { key: "mes", label: "¿Qué mes es?", type: "input" },
  { key: "anio", label: "¿Qué año es?", type: "input" },
  { key: "estacion", label: "¿En qué estación del año estamos?", type: "input" },
  { key: "pais", label: "¿En qué país estamos?", type: "input" },
  { key: "departamento", label: "¿En qué departamento o estado estamos?", type: "input" },
  { key: "ciudad", label: "¿En qué ciudad estamos?", type: "input" },
  { key: "lugar", label: "¿En qué lugar (hospital, clínica, etc.) estamos?", type: "input" },
  { key: "piso", label: "¿En qué piso o planta estamos?", type: "input" },
  { key: "registro_palabras", label: "Repita estas tres palabras: manzana, mesa, moneda", type: "input" },
  { key: "atencion_calculo", label: "Reste 7 sucesivamente desde 100 (hasta cinco restas)", type: "input" },
  { key: "memoria_reciente", label: "¿Cuáles eran las tres palabras mencionadas anteriormente?", type: "input" },
  { key: "nombrar_objetos", label: "Nombre estos dos objetos (por ejemplo: reloj y lápiz)", type: "input" },
  { key: "repetir_frase", label: "Repita la frase: 'En un trigal había cinco perros'", type: "input" },
  { key: "orden_tres_pasos", label: "Siga esta orden de tres pasos: tome este papel con la mano derecha, dóblelo por la mitad y colóquelo en el suelo", type: "input" },
  { key: "leer_frase", label: "Lea y obedezca la frase escrita: 'Cierre los ojos'", type: "input" },
  { key: "escribir_frase", label: "Escriba una frase completa y coherente", type: "input" },
  { key: "copiar_dibujo", label: "Copie este dibujo (dos pentágonos superpuestos)", type: "input" },
];

export const MMSEQuestions: React.FC<MMSEQuestionsProps> = ({ onNext, onChange, answers }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: Record<string, string>) => {
    onChange(values);
    onNext();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={answers}
      onFinish={handleFinish}
      onValuesChange={(_, values) => onChange(values)}
    >
      {questions.map((q) => (
        <Form.Item
          key={q.key}
          name={q.key}
          label={q.label}
          rules={[{ required: true, message: "Campo requerido" }]}
        >
          <Input />
        </Form.Item>
      ))}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Siguiente
        </Button>
      </Form.Item>
    </Form>
  );
}; 