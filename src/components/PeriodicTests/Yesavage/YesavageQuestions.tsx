import React from "react";
import { Form, Radio, Button, Space } from "antd";

interface YesavageQuestion {
  id: string;
  text: string;
  options: string[];
  depressionAnswer: string;
}

interface YesavageQuestionsProps {
  onNext: () => void;
  onChange: (values: Record<string, string>) => void;
  answers: Record<string, string>;
}

export const questions: YesavageQuestion[] = [
  {
    id: "q1",
    text: "¿Está básicamente satisfecho con su vida?",
    options: ["Sí", "No"],
    depressionAnswer: "No",
  },
  {
    id: "q2",
    text: "¿Ha renunciado a muchas de sus actividades e intereses?",
    options: ["Sí", "No"],
    depressionAnswer: "Sí",
  },
  {
    id: "q3",
    text: "¿Siente que su vida está vacía?",
    options: ["Sí", "No"],
    depressionAnswer: "Sí",
  },
  {
    id: "q4",
    text: "¿Se encuentra a menudo aburrido?",
    options: ["Sí", "No"],
    depressionAnswer: "Sí",
  },
  {
    id: "q5",
    text: "¿Tiene esperanza en el futuro?",
    options: ["Sí", "No"],
    depressionAnswer: "No",
  },
  {
    id: "q6",
    text: "¿Está preocupado porque piensa que algo malo le va a pasar?",
    options: ["Sí", "No"],
    depressionAnswer: "Sí",
  },
  {
    id: "q7",
    text: "¿Se siente feliz la mayor parte del tiempo?",
    options: ["Sí", "No"],
    depressionAnswer: "No",
  },
  {
    id: "q8",
    text: "¿Se siente a menudo desamparado?",
    options: ["Sí", "No"],
    depressionAnswer: "Sí",
  },
  {
    id: "q9",
    text: "¿Prefiere quedarse en casa que salir a hacer cosas nuevas?",
    options: ["Sí", "No"],
    depressionAnswer: "Sí",
  },
  {
    id: "q10",
    text: "¿Siente que tiene más problemas de memoria que la mayoría de las personas?",
    options: ["Sí", "No"],
    depressionAnswer: "Sí",
  },
  {
    id: "q11",
    text: "¿Piensa que es maravilloso estar vivo?",
    options: ["Sí", "No"],
    depressionAnswer: "No",
  },
  {
    id: "q12",
    text: "¿Se siente inútil en su situación actual?",
    options: ["Sí", "No"],
    depressionAnswer: "Sí",
  },
  {
    id: "q13",
    text: "¿Se siente lleno de energía?",
    options: ["Sí", "No"],
    depressionAnswer: "No",
  },
  {
    id: "q14",
    text: "¿Se encuentra sin esperanza ante su situación actual?",
    options: ["Sí", "No"],
    depressionAnswer: "Sí",
  },
  {
    id: "q15",
    text: "¿Cree que las otras personas están en general mejor que usted?",
    options: ["Sí", "No"],
    depressionAnswer: "Sí",
  },
];

export const YesavageQuestions: React.FC<YesavageQuestionsProps> = ({
  onNext,
  onChange,
  answers,
}) => {
  const [form] = Form.useForm();

  const handleFinish = (values: Record<string, string>) => {
    onChange(values);
    onNext();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={answers}
    >
      {questions.map((question) => (
        <Form.Item
          key={question.id}
          name={question.id}
          label={question.text}
          rules={[{ required: true, message: "Por favor seleccione una respuesta" }]}
        >
          <Radio.Group>
            <Space direction="vertical">
              {question.options.map((option) => (
                <Radio key={option} value={option}>
                  {option}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
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