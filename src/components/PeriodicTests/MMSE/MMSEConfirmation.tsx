import React from "react";
import { Table, Button, Space, Typography } from "antd";
import { MMSEQuestion, MMSEConfirmationProps } from "./types";

const { Title } = Typography;

const questions: MMSEQuestion[] = [
  { key: "q1", label: "¿Está básicamente satisfecho con su vida?", type: "select", options: ["Sí", "No"] },
  { key: "q2", label: "¿Ha abandonado muchas de sus actividades e intereses?", type: "select", options: ["Sí", "No"] },
  { key: "q3", label: "¿Siente que su vida está vacía?", type: "select", options: ["Sí", "No"] },
  { key: "q4", label: "¿Se siente lleno de energía?", type: "select", options: ["Sí", "No"] },
  { key: "q5", label: "¿Siente que le falta motivación?", type: "select", options: ["Sí", "No"] },
];

export const MMSEConfirmation: React.FC<MMSEConfirmationProps> = ({ answers, onPrev, onNext }) => {
  const data = questions.map((q) => ({
    key: q.key,
    pregunta: q.label,
    respuesta: answers[q.key] || "-",
  }));

  return (
    <>
      <Title level={4}>Confirmación de respuestas</Title>
      <Table
        dataSource={data}
        columns={[
          { title: "Pregunta", dataIndex: "pregunta", key: "pregunta" },
          { title: "Respuesta", dataIndex: "respuesta", key: "respuesta" },
        ]}
        pagination={false}
        rowKey="key"
        style={{ marginBottom: 24 }}
      />
      <Space>
        <Button onClick={onPrev}>Editar</Button>
        <Button type="primary" onClick={onNext}>
          Confirmar y calcular resultado
        </Button>
      </Space>
    </>
  );
}; 