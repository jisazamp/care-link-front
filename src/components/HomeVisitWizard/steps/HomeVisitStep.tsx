import React, { useEffect } from 'react';
import { Card, Row, Col, Form, DatePicker, TimePicker, Select, Input, Typography, Descriptions, Alert } from 'antd';
import { useFormContext } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useGetProfessionals } from '../../../hooks/useGetProfessionals/useGetProfessionals';
import dayjs from 'dayjs';
import { HomeVisitStepProps, VisitaEstado } from '../types';

const { TextArea } = Input;
const { Title } = Typography;

export const HomeVisitStep: React.FC<HomeVisitStepProps> = ({ 
  user, 
  isEditing, 
  existingVisit, 
  onValidChange 
}) => {
  const { watch, formState: { errors } } = useFormContext();
  const professionalsQuery = useGetProfessionals();

  // Observar cambios en los campos requeridos
  const fecha_visita = watch('fecha_visita');
  const hora_visita = watch('hora_visita');
  const profesional_asignado = watch('profesional_asignado');

  // Verificar si el paso es válido
  useEffect(() => {
    const isFechaValid = fecha_visita && fecha_visita.isValid();
    const isHoraValid = hora_visita && hora_visita.isValid();
    const isProfesionalValid = profesional_asignado && profesional_asignado > 0;
    
    const isStepValid = isFechaValid && isHoraValid && isProfesionalValid;
    onValidChange(!!isStepValid);
  }, [fecha_visita, hora_visita, profesional_asignado, onValidChange]);

  // Determinar el estado actual de la visita
  const getEstadoActual = (): VisitaEstado => {
    if (!isEditing || !existingVisit) return 'PENDIENTE';
    
    if (!existingVisit.fecha_visita || !existingVisit.hora_visita) {
      return 'PENDIENTE DE PROGRAMACIÓN';
    }
    
    return existingVisit.estado_visita || 'PENDIENTE';
  };

  // Determinar el color del estado
  const getEstadoColor = (estado: VisitaEstado) => {
    const colors = {
      'PENDIENTE': '#1890ff',
      'PENDIENTE DE PROGRAMACIÓN': '#faad14',
      'REALIZADA': '#52c41a',
      'CANCELADA': '#ff4d4f',
      'REPROGRAMADA': '#fa8c16',
    };
    return colors[estado] || '#1890ff';
  };

  return (
    <div>
      <Title level={4} style={{ marginBottom: '24px' }}>
        Datos de la Visita Domiciliaria
      </Title>

      {/* Alerta informativa para edición */}
      {isEditing && existingVisit && (
        <Alert
          message="Modo de Edición"
          description="Estás editando una visita existente. Los cambios se aplicarán inmediatamente."
          type="info"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      )}

      {/* Resumen del paciente */}
      <Card style={{ marginBottom: '24px' }}>
        <Descriptions title="Resumen de la Visita" bordered column={2}>
          <Descriptions.Item label="Paciente" span={2}>
            <strong>{`${user?.nombres} ${user?.apellidos}`}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Dirección">
            {user?.direccion}
          </Descriptions.Item>
          <Descriptions.Item label="Teléfono">
            {user?.telefono}
          </Descriptions.Item>
          <Descriptions.Item label="Valor por día">
            <strong>$25.000</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Estado actual">
            <span style={{ color: getEstadoColor(getEstadoActual()) }}>
              {getEstadoActual()}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Profesional asignado">
            {existingVisit?.profesional_asignado ? (
              <span style={{ color: '#52c41a' }}>
                {`${existingVisit.profesional_asignado.nombres} ${existingVisit.profesional_asignado.apellidos}`}
              </span>
            ) : (
              <span style={{ color: '#d9d9d9' }}>Sin asignar</span>
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Formulario de datos de la visita */}
      <Card title="Configuración de la Visita">
        <Row gutter={16}>
          <Col span={8}>
            <Controller
              name="fecha_visita"
              render={({ field }) => (
                <Form.Item
                  label="Fecha de Visita"
                  validateStatus={errors.fecha_visita ? "error" : ""}
                  help={errors.fecha_visita?.message?.toString()}
                  extra={
                    isEditing ? (
                      <Typography.Text type="secondary" style={{ fontSize: "12px" }}>
                        ! Cambiar la fecha cambiará automáticamente el estado a "REPROGRAMADA"
                      </Typography.Text>
                    ) : undefined
                  }
                >
                  <DatePicker
                    {...field}
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                    placeholder="Seleccione la fecha"
                    disabledDate={(current) => {
                      // Para nuevas visitas, no permitir fechas pasadas
                      if (!isEditing) {
                        return current && current < dayjs().startOf('day');
                      }
                      // Para edición, permitir fechas pasadas
                      return false;
                    }}
                  />
                </Form.Item>
              )}
            />
          </Col>
          
          <Col span={8}>
            <Controller
              name="hora_visita"
              render={({ field }) => (
                <Form.Item
                  label="Hora de Visita"
                  validateStatus={errors.hora_visita ? "error" : ""}
                  help={errors.hora_visita?.message?.toString()}
                >
                  <TimePicker
                    {...field}
                    style={{ width: "100%" }}
                    format="HH:mm"
                    placeholder="Seleccione la hora"
                    minuteStep={15}
                    showNow={false}
                  />
                </Form.Item>
              )}
            />
          </Col>
          
          <Col span={8}>
            <Controller
              name="profesional_asignado"
              render={({ field }) => (
                <Form.Item
                  label="Profesional Asignado"
                  validateStatus={errors.profesional_asignado ? "error" : ""}
                  help={errors.profesional_asignado?.message?.toString()}
                >
                  <Select
                    {...field}
                    placeholder="Selecciona un profesional"
                    loading={professionalsQuery.isLoading}
                    showSearch
                    filterOption={(input, option) =>
                      !!option?.label?.toLowerCase().includes(input.toLowerCase())
                    }
                    options={
                      professionalsQuery.data?.data.data.map((p) => ({
                        label: `${p.nombres} ${p.apellidos} - ${p.especialidad}`,
                        value: p.id_profesional,
                      })) ?? []
                    }
                  />
                </Form.Item>
              )}
            />
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={24}>
            <Controller
              name="observaciones"
              render={({ field }) => (
                <Form.Item
                  label="Observaciones"
                  validateStatus={errors.observaciones ? "error" : ""}
                  help={errors.observaciones?.message?.toString()}
                >
                  <TextArea
                    {...field}
                    rows={4}
                    placeholder="Ingrese observaciones adicionales sobre la visita"
                  />
                </Form.Item>
              )}
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};