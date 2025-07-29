import React, { useState } from 'react';
import { Card, Steps, Button, Row, Col, Typography, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dayjs from 'dayjs';

// Componentes de los pasos
import { HomeVisitStep } from './steps/HomeVisitStep';
import { BillingStep } from './steps/BillingStep';

// Hooks
import { useGetUserById } from '../../hooks/useGetUserById/useGetUserById';
import { useCreateHomeVisit, CreateHomeVisitData } from '../../hooks/useCreateHomeVisit/useCreateHomeVisit';
import { useCreateHomeVisitBill } from '../../hooks/useCreateHomeVisitBill/useCreateHomeVisitBill';

const { Title } = Typography;

// Schema para el wizard completo
const wizardSchema = z.object({
  // Paso 1: Datos de la visita
  fecha_visita: z.any(),
  hora_visita: z.any(),
  profesional_asignado: z.number().min(1, "El profesional es requerido"),
  observaciones: z.string().optional(),

  // Paso 2: Datos de facturación
  impuestos: z.number().default(0),
  descuentos: z.number().default(0),
  fecha_vencimiento: z.any().optional(),
  observaciones_factura: z.string().optional(),
  numero_factura: z.string().optional(),

  // Pagos
  payments: z.array(z.any()).default([]),
});

type WizardFormValues = z.infer<typeof wizardSchema>;

export const HomeVisitWizard: React.FC = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isStep1Valid, setIsStep1Valid] = useState(false);
  const [isStep2Valid, setIsStep2Valid] = useState(false);

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

  const { data: user, isLoading: loadingUser } = useGetUserById(userId);
  const { mutate: createHomeVisit, isPending: creatingVisit } = useCreateHomeVisit();
  const { mutate: createBill, isPending: creatingBill } = useCreateHomeVisitBill();

  const steps = [
    {
      title: 'Crear Nueva Visita Domiciliaria',
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
      
      // Crear la visita domiciliaria
      const visitaData: CreateHomeVisitData = {
        id_usuario: parseInt(userId!),
        fecha_visita: formData.fecha_visita ? formData.fecha_visita.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
        hora_visita: formData.hora_visita ? formData.hora_visita.format('HH:mm:ss') : '08:00:00',
        direccion_visita: user?.data.data.direccion || '',
        telefono_visita: user?.data.data.telefono || '',
        valor_dia: 25000, // Valor por defecto
        observaciones: formData.observaciones || '',
        id_profesional_asignado: formData.profesional_asignado || undefined,
      };

      // Crear la visita primero
      await new Promise<void>((_, reject) => {
        createHomeVisit(visitaData, {
          onSuccess: async (response) => {
            const newHomeVisitId = response.data.data.id_visitadomiciliaria;
            
            // Crear la factura con los datos del wizard
            const billData = {
              user_id: parseInt(userId!),
              bill_data: {
                id_visita_domiciliaria: newHomeVisitId,
                fecha_emision: dayjs().format('YYYY-MM-DD'),
                fecha_vencimiento: formData.fecha_vencimiento ? formData.fecha_vencimiento.format('YYYY-MM-DD') : '',
                subtotal: 25000, // Valor por día
                impuestos: formData.impuestos || 0,
                descuentos: formData.descuentos || 0,
                total_factura: 25000 + (formData.impuestos || 0) - (formData.descuentos || 0),
                observaciones: formData.observaciones_factura || '',
              },
            };

            // Crear la factura
            createBill(billData, {
              onSuccess: () => {
                message.success('Visita domiciliaria y factura creadas exitosamente');
                navigate(`/visitas-domiciliarias/usuarios/${userId}/detalles`);
              },
              onError: (error: any) => {
                message.error('Error al crear la factura: ' + error.message);
                reject(error);
              },
            });
          },
          onError: (error: any) => {
            message.error('Error al crear la visita: ' + error.message);
            reject(error);
          },
        });
      });

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

  if (loadingUser) {
    return <div>Cargando...</div>;
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
              user={user?.data.data}
              onValidChange={handleStep1Complete}
            />
          )}

          {currentStep === 1 && (
            <BillingStep
              onValidChange={handleStep2Complete}
            />
          )}
        </FormProvider>

        <Row gutter={16} style={{ marginTop: '24px' }}>
          <Col>
            {currentStep > 0 && (
              <Button onClick={handleBack}>
                Anterior
              </Button>
            )}
          </Col>
          <Col>
            {currentStep < steps.length - 1 && (
              <Button
                type="primary"
                onClick={handleNext}
                disabled={!canProceedToNext()}
              >
                Siguiente
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button
                type="primary"
                onClick={handleFinalize}
                disabled={!canFinalize()}
                loading={creatingVisit || creatingBill}
              >
                Finalizar
              </Button>
            )}
          </Col>
        </Row>
      </Card>
    </div>
  );
};