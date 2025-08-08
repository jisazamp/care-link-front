import React from 'react';
import { Spin, Typography, Button } from 'antd';
import { LoadingStateProps } from '../types';

const { Text } = Typography;

export const LoadingState: React.FC<LoadingStateProps> = ({
  isLoading,
  isEditing,
  hasError,
  onRetry,
  onCancel,
}) => {
  if (isLoading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>
          <Text>Cargando datos...</Text>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Typography.Title level={4} type="danger">
          Error al cargar los datos
        </Typography.Title>
        <Text type="secondary">
          No se pudieron cargar los datos necesarios.
        </Text>
        <div style={{ marginTop: '16px' }}>
          {onRetry && (
            <Button type="primary" onClick={onRetry} style={{ marginRight: '8px' }}>
              Reintentar
            </Button>
          )}
          <Button onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Typography.Title level={4}>
          Visita no encontrada
        </Typography.Title>
        <Text type="secondary">
          La visita domiciliaria especificada no existe.
        </Text>
        <div style={{ marginTop: '16px' }}>
          <Button type="primary" onClick={onCancel}>
            Volver a los detalles del usuario
          </Button>
        </div>
      </div>
    );
  }

  return null;
};
