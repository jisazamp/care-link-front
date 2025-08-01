import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Alert, Button, Space } from "antd";
import type React from "react";

interface ContratoVencidoAlertProps {
  contratoId: number;
  pacienteNombre: string;
  onRenovarContrato: (contratoId: number) => void;
  onDismiss: () => void;
}

export const ContratoVencidoAlert: React.FC<ContratoVencidoAlertProps> = ({
  contratoId,
  pacienteNombre,
  onRenovarContrato,
  onDismiss,
}) => {
  return (
    <Alert
      message="Contrato Vencido"
      description={
        <div>
          <p>
            El contrato del paciente <strong>{pacienteNombre}</strong> ha
            vencido porque se han agotado todos los días de la tiquetera.
          </p>
          <p>
            Es necesario renovar el contrato para continuar con el servicio.
          </p>
        </div>
      }
      type="warning"
      showIcon
      icon={<ExclamationCircleOutlined />}
      action={
        <Space direction="vertical">
          <Button
            size="small"
            type="primary"
            onClick={() => onRenovarContrato(contratoId)}
          >
            Renovar Contrato
          </Button>
          <Button size="small" onClick={onDismiss}>
            Cerrar
          </Button>
        </Space>
      }
      closable
      onClose={onDismiss}
      style={{ marginBottom: 16 }}
    />
  );
};
