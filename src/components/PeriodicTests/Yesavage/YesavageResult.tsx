import { Button, Card, Space, Typography } from "antd";
import type React from "react";

const { Title, Paragraph } = Typography;

interface YesavageResultProps {
  result: { score: number } | null;
  onPrev: () => void;
}

const getInterpretation = (score: number): string => {
  if (score <= 5) return "Normal";
  if (score <= 10) return "Depresión leve";
  return "Depresión severa";
};

export const YesavageResult: React.FC<YesavageResultProps> = ({
  result,
  onPrev,
}) => {
  if (!result) return null;

  const interpretation = getInterpretation(result.score);

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Card>
        <Title level={4}>Resultado del Test</Title>
        <Paragraph>
          Puntuación total: <strong>{result.score}</strong>
        </Paragraph>
        <Paragraph>
          Interpretación: <strong>{interpretation}</strong>
        </Paragraph>
      </Card>
      <Button onClick={onPrev}>Volver</Button>
    </Space>
  );
};
