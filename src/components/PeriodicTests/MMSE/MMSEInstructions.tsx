import { Alert, Typography } from "antd";
import type React from "react";

const { Paragraph } = Typography;

export const MMSEInstructions: React.FC = () => (
  <Alert
    message="Instrucciones"
    description={
      <>
        <Paragraph>
          Responda cada pregunta según la situación actual del paciente. El test
          MMSE evalúa diferentes áreas cognitivas y su resultado es orientativo,
          no diagnóstico definitivo.
        </Paragraph>
        <Paragraph>
          El puntaje máximo es 30. Menos de 24 puntos suele indicar algún tipo
          de deterioro cognitivo, aunque el punto de corte puede variar según
          edad y escolaridad.
        </Paragraph>
      </>
    }
    type="info"
    showIcon
    style={{ marginBottom: 24 }}
  />
);
