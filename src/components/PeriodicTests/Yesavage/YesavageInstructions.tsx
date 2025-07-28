import { Alert, Typography } from "antd";
import type React from "react";

const { Paragraph } = Typography;

export const YesavageInstructions: React.FC = () => (
  <Alert
    message="Instrucciones"
    description={
      <>
        <Paragraph>
          Responda cada pregunta según la situación actual del paciente. La
          Escala de Yesavage evalúa síntomas depresivos en adultos mayores y su
          resultado es orientativo, no diagnóstico definitivo.
        </Paragraph>
        <Paragraph>
          El puntaje máximo es 15. 0-5: Normal, 6-10: Depresión leve, 11-15:
          Depresión severa.
        </Paragraph>
      </>
    }
    type="info"
    showIcon
    style={{ marginBottom: 24 }}
  />
);
