import React from 'react';
import { Row, Col, Button } from 'antd';
import { WizardNavigationProps } from '../types';

export const WizardNavigation: React.FC<WizardNavigationProps> = ({
  currentStep,
  totalSteps,
  canProceedToNext,
  canFinalize,
  isSubmitting,
  isEditing,
  onNext,
  onBack,
  onFinalize,
}) => {
  return (
    <Row gutter={16} style={{ marginTop: '24px' }}>
      <Col>
        {currentStep > 0 && (
          <Button onClick={onBack}>
            Anterior
          </Button>
        )}
      </Col>
      <Col>
        {currentStep < totalSteps - 1 && (
          <Button
            type="primary"
            onClick={onNext}
            disabled={!canProceedToNext}
          >
            Siguiente
          </Button>
        )}
        {currentStep === totalSteps - 1 && (
          <Button
            type="primary"
            onClick={onFinalize}
            disabled={!canFinalize}
            loading={isSubmitting}
          >
            {isEditing ? 'Actualizar' : 'Finalizar'}
          </Button>
        )}
      </Col>
    </Row>
  );
};
