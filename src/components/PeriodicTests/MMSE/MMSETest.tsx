import React, { useState } from "react";
import { Card, Steps, Typography, Space, } from "antd";
import { MMSEQuestions } from "./MMSEQuestions";
import { MMSEConfirmation } from "./MMSEConfirmation";
import { MMSEResult } from "./MMSEResult";
import { MMSEInstructions } from "./MMSEInstructions";

const { Title } = Typography;

interface Step {
  title: string;
}

const steps: Step[] = [
  { title: "Cuestionario" },
  { title: "Confirmación" },
  { title: "Resultado" },
];

export const MMSETest: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ score: number } | null>(null);

  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  const handleAnswers = (values: Record<string, string>) => setAnswers(values);
  const handleResult = (res: { score: number }) => setResult(res);

  return (
    <Card style={{ margin: 24 }}>
      <Title level={3}>Mini-Mental State Examination (MMSE)</Title>
      <Steps current={current} style={{ marginBottom: 32 }}>
        {steps.map((item) => (
          <Steps.Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <Space direction="vertical" style={{ width: "100%" }}>
        {current === 0 && (
          <>
            <MMSEInstructions />
            <MMSEQuestions onNext={next} onChange={handleAnswers} answers={answers} />
          </>
        )}
        {current === 1 && (
          <MMSEConfirmation
            answers={answers}
            onPrev={prev}
            onNext={() => {
              // Simular cálculo de resultado
              const score = Object.values(answers).filter((v) => v === "Sí").length;
              handleResult({ score });
              next();
            }}
          />
        )}
        {current === 2 && <MMSEResult result={result} onPrev={prev} />}
      </Space>
    </Card>
  );
}; 