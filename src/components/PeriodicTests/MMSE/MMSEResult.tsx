import React from "react";
import { Card, Typography, Button } from "antd";
import { MMSEResultProps } from "./types";

const { Title, Paragraph } = Typography;

const getInterpretation = (score: number): string => {
  if (score >= 24) return "Normal o sin deterioro significativo";
  if (score >= 18) return "Deterioro cognitivo leve";
  return "Deterioro cognitivo severo";
};

export const MMSEResult: React.FC<MMSEResultProps> = ({ result, onPrev }) => {
  if (!result) return null;
  
  return (
    <Card>
      <Title level={4}>Resultado del Test MMSE</Title>
      <Paragraph>
        <strong>Puntaje obtenido:</strong> {result.score} / 30
      </Paragraph>
      <Paragraph>
        <strong>Interpretación:</strong> {getInterpretation(result.score)}
      </Paragraph>
      <Button onClick={onPrev}>Volver</Button>
    </Card>
  );
}; 