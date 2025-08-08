import React, { useState, useEffect } from 'react';
import { Card, Steps, Typography } from 'antd';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';

// Componentes de los pasos
import { HomeVisitStep } from './steps/HomeVisitStep';
import { BillingStep } from './steps/BillingStep';

// Componentes de utilidad
import { LoadingState } from './components/LoadingState';
import { WizardNavigation } from './components/WizardNavigation';

// Hook personalizado
import { useHomeVisitWizard } from '../../hooks/useHomeVisitWizard';

// Tipos
import { wizardSchema, WizardFormValues } from './types';

const { Title } = Typography;

export const HomeVisitWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isStep1Valid, setIsStep1Valid] = useState(false);
  const [isStep2Valid, setIsStep2Valid] = useState(false);

  // Hook personalizado para manejar la lógica del wizard
  const {
    isEditing,
    isLoading,
    isSubmitting,
    user,
    existingVisit,
    handleSubmit,
    handleCancel,
  } = useHomeVisitWizard();

  const methods = useForm<WizardFormValues>({
    resolver: zodResolver(wizardSchema),
    defaultValues: {
      fecha_visita: dayjs(),
      hora_visita: dayjs().hour(8).minute(0),
      profesional_asignado: 0,
      observaciones: '',
      impuestos: 0,
      descuentos: 0,
      fecha_vencimiento: dayjs().add(30, 'days'),
      observaciones_factura: '',
      numero_factura: '',
      payments: [],
    },
  });

  // Cargar datos existentes cuando se está editando
  useEffect(() => {
    console.log('=== DEBUG HomeVisitWizard useEffect ===');
    console.log('isEditing:', isEditing);
    console.log('existingVisit:', existingVisit);
    console.log('existingVisit?.data:', existingVisit?.data);
    
    if (isEditing && existingVisit?.data) {
      const visitData = existingVisit.data;
      console.log('Reseteando formulario con datos existentes...');
      console.log('visitData:', visitData);
      
      const resetData = {
        fecha_visita: visitData.fecha_visita ? dayjs(visitData.fecha_visita) : dayjs(),
        hora_visita: visitData.hora_visita ? dayjs(`2000-01-01 ${visitData.hora_visita}`) : dayjs().hour(8).minute(0),
        profesional_asignado: 0, // Por ahora lo dejamos en 0 ya que la relación está en tabla separada
        observaciones: visitData.observaciones || '',
        impuestos: 0,
        descuentos: 0,
        fecha_vencimiento: dayjs().add(30, 'days'),
        observaciones_factura: '',
        numero_factura: '',
        payments: [],
      };
      console.log('Datos para reset:', resetData);
      methods.reset(resetData);
    }
  }, [isEditing, existingVisit, methods]);

  const steps = [
    {
      title: isEditing ? 'Editar Visita Domiciliaria' : 'Crear Nueva Visita Domiciliaria',
      description: 'Datos de la visita',
    },
    {
      title: 'Facturación',
      description: 'Configurar factura',
    },
  ];

  const handleStep1Complete = (isValid: boolean) => {
    setIsStep1Valid(isValid);
  };

  const handleStep2Complete = (isValid: boolean) => {
    setIsStep2Valid(isValid);
  };

  const handleNext = () => {
    if (currentStep === 0) {
      setCurrentStep(1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinalize = async () => {
    try {
      const formData = methods.getValues();
      await handleSubmit(formData);
    } catch (error) {
      console.error('Error en el proceso:', error);
    }
  };

  const canProceedToNext = () => {
    if (currentStep === 0) {
      return isStep1Valid;
    }
    return true;
  };

  const canFinalize = () => {
    return currentStep === 1 && isStep1Valid && isStep2Valid;
  };

  // Verificar si hay errores o estados de carga
  const hasError = false; // Se puede implementar lógica de error específica
  const shouldShowLoadingState = isLoading || (isEditing && !existingVisit?.data) || hasError;

  // Debug logs para el estado de carga
  console.log('=== DEBUG LoadingState ===');
  console.log('isLoading:', isLoading);
  console.log('isEditing:', isEditing);
  console.log('existingVisit:', existingVisit);
  console.log('existingVisit?.data:', existingVisit?.data);
  console.log('shouldShowLoadingState:', shouldShowLoadingState);

  if (shouldShowLoadingState) {
    return (
      <LoadingState
        isLoading={isLoading}
        isEditing={isEditing}
        hasError={hasError}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2} style={{ marginBottom: '24px' }}>
        Wizard de Visita Domiciliaria
      </Title>

      <Card>
        <Steps current={currentStep} items={steps} style={{ marginBottom: '24px' }} />

        <FormProvider {...methods}>
          {currentStep === 0 && (
            <HomeVisitStep
              user={user}
              isEditing={isEditing}
              existingVisit={existingVisit}
              onValidChange={handleStep1Complete}
            />
          )}

          {currentStep === 1 && (
            <BillingStep
              isEditing={isEditing}
              onValidChange={handleStep2Complete}
            />
          )}
        </FormProvider>

        <WizardNavigation
          currentStep={currentStep}
          totalSteps={steps.length}
          canProceedToNext={canProceedToNext()}
          canFinalize={canFinalize()}
          isSubmitting={isSubmitting}
          isEditing={isEditing}
          onNext={handleNext}
          onBack={handleBack}
          onFinalize={handleFinalize}
        />
      </Card>
    </div>
  );
};