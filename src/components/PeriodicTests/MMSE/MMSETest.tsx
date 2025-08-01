import { Alert, Button, Card, Progress, Space, Steps, Typography } from "antd";
import type React from "react";
import { useState } from "react";
import { MMSEQuestions } from "./MMSEQuestions";
import { mmseCriteria } from "./mmseCriteria";

const { Title, Text } = Typography;
const { Step } = Steps;

export const MMSETest: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState<number | null>(null);
  const [interpretation, setInterpretation] = useState<string>("");

  const handleNext = () => {
    setCurrentStep(1);
  };

  const handleAnswersChange = (newAnswers: Record<string, string>) => {
    setAnswers(newAnswers);
  };

  const calculateScore = () => {
    let totalScore = 0;
    let maxScore = 0;

    mmseCriteria.forEach(
      (criterion: {
        key: string;
        points: number;
        correct: (answer: string) => boolean | number;
      }) => {
        const answer = answers[criterion.key];
        const result = criterion.correct(answer);

        if (typeof result === "number") {
          totalScore += result;
        } else if (result === true) {
          totalScore += criterion.points;
        }

        maxScore += criterion.points;
      },
    );

    setScore(totalScore);

    // Interpretación según el puntaje
    if (totalScore >= 24) {
      setInterpretation("Normal: No hay evidencia de deterioro cognitivo");
    } else if (totalScore >= 19) {
      setInterpretation("Deterioro cognitivo leve");
    } else if (totalScore >= 10) {
      setInterpretation("Deterioro cognitivo moderado");
    } else {
      setInterpretation("Deterioro cognitivo severo");
    }

    setCurrentStep(2);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <MMSEQuestions
            onNext={handleNext}
            onChange={handleAnswersChange}
            answers={answers}
          />
        );
      case 1:
        return (
          <Space direction="vertical" style={{ width: "100%" }}>
            <Title level={4}>Revisión de respuestas</Title>
            {Object.entries(answers).map(([key, value]) => (
              <Card key={key} size="small" style={{ marginBottom: 8 }}>
                <Text strong>{key}: </Text>
                <Text>{value}</Text>
              </Card>
            ))}
            <Button type="primary" onClick={calculateScore}>
              Calcular puntaje
            </Button>
          </Space>
        );
      case 2:
        return (
          <Space direction="vertical" style={{ width: "100%" }}>
            <Title level={4}>Resultados del test MMSE</Title>
            <Progress
              type="circle"
              percent={score ? (score / 30) * 100 : 0}
              format={() => `${score}/30`}
            />
            <Alert
              message="Interpretación"
              description={interpretation}
              type={score && score >= 24 ? "success" : "warning"}
              showIcon
            />
            <Button onClick={() => setCurrentStep(0)}>
              Realizar test nuevamente
            </Button>
          </Space>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <Title level={3} style={{ marginBottom: 16 }}>
        Mini-Mental State Examination (MMSE)
      </Title>
      <Steps current={currentStep} style={{ marginBottom: 24 }}>
        <Step title="Preguntas" description="Responda las preguntas" />
        <Step title="Revisión" description="Revise sus respuestas" />
        <Step title="Resultados" description="Ver resultados" />
      </Steps>
      <div style={{ marginTop: 24 }}>{renderStepContent()}</div>
    </Card>
  );
};
