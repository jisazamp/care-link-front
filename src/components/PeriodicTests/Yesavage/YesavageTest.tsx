import React, { useState } from "react";
import { Card, Steps, Typography, Space } from "antd";
import { YesavageQuestions } from "./YesavageQuestions";
import { YesavageConfirmation } from "./YesavageConfirmation";
import { YesavageResult } from "./YesavageResult";
import { YesavageInstructions } from "./YesavageInstructions";
import { questions as yesavageQuestions } from "./YesavageQuestions";

const { Title } = Typography;

interface Step {
  title: string;
}

const steps: Step[] = [
  { title: "Cuestionario" },
  { title: "Confirmación" },
  { title: "Resultado" },
];

const getScore = (answers: Record<string, string>) =>
  yesavageQuestions.reduce(
    (sum: number, q: { id: string; depressionAnswer: string }) => sum + (answers[q.id] === q.depressionAnswer ? 1 : 0),
    0
  );

export const YesavageTest: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ score: number } | null>(null);

  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  const handleAnswers = (values: Record<string, string>) => setAnswers(values);
  const handleResult = (res: { score: number }) => setResult(res);

  return (
    <Card style={{ margin: 24 }}>
      <Title level={3}>Escala de Yesavage</Title>
      <Steps current={current} style={{ marginBottom: 32 }}>
        {steps.map((item) => (
          <Steps.Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <Space direction="vertical" style={{ width: "100%" }}>
        {current === 0 && (
          <>
            <YesavageInstructions />
            <YesavageQuestions onNext={next} onChange={handleAnswers} answers={answers} />
          </>
        )}
        {current === 1 && (
          <YesavageConfirmation
            answers={answers}
            onPrev={prev}
            onNext={() => {
              const score = getScore(answers);
              handleResult({ score });
              next();
            }}
          />
        )}
        {current === 2 && <YesavageResult result={result} onPrev={prev} />}
      </Space>
    </Card>
  );
}; 