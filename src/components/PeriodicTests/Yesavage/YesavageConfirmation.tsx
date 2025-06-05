import React from "react";
import { Table, Button, Space } from "antd";
import type { ColumnsType } from "antd/es/table";

interface YesavageConfirmationProps {
  answers: Record<string, string>;
  onPrev: () => void;
  onNext: () => void;
}

interface DataType {
  key: string;
  question: string;
  answer: string;
}

const questions = [
  {
    id: "q1",
    text: "¿Está usted satisfecho con su vida?",
  },
  {
    id: "q2",
    text: "¿Ha abandonado muchas de sus actividades e intereses?",
  },
  {
    id: "q3",
    text: "¿Siente que su vida está vacía?",
  },
  {
    id: "q4",
    text: "¿Se aburre a menudo?",
  },
  {
    id: "q5",
    text: "¿Se siente con esperanza la mayor parte del tiempo?",
  },
  {
    id: "q6",
    text: "¿Está preocupado por algo malo que le pueda ocurrir?",
  },
  {
    id: "q7",
    text: "¿Se siente feliz la mayor parte del tiempo?",
  },
  {
    id: "q8",
    text: "¿Se siente a menudo desamparado?",
  },
  {
    id: "q9",
    text: "¿Prefiere quedarse en casa en lugar de salir y hacer cosas nuevas?",
  },
  {
    id: "q10",
    text: "¿Siente que tiene más problemas de memoria que la mayoría?",
  },
  {
    id: "q11",
    text: "¿Cree que es maravilloso estar vivo?",
  },
  {
    id: "q12",
    text: "¿Se siente inútil en la forma en que vive ahora?",
  },
  {
    id: "q13",
    text: "¿Se siente lleno de energía?",
  },
  {
    id: "q14",
    text: "¿Siente que su situación es desesperada?",
  },
  {
    id: "q15",
    text: "¿Cree que la mayoría de la gente está mejor que usted?",
  },
];

export const YesavageConfirmation: React.FC<YesavageConfirmationProps> = ({
  answers,
  onPrev,
  onNext,
}) => {
  const columns: ColumnsType<DataType> = [
    {
      title: "Pregunta",
      dataIndex: "question",
      key: "question",
    },
    {
      title: "Respuesta",
      dataIndex: "answer",
      key: "answer",
    },
  ];

  const data: DataType[] = questions.map((q) => ({
    key: q.id,
    question: q.text,
    answer: answers[q.id] || "No respondida",
  }));

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Table columns={columns} dataSource={data} pagination={false} />
      <Space>
        <Button onClick={onPrev}>Anterior</Button>
        <Button type="primary" onClick={onNext}>
          Calcular Resultado
        </Button>
      </Space>
    </Space>
  );
}; 