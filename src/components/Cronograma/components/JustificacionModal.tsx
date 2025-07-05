import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Space, DatePicker } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { CronogramaAsistenciaPaciente } from '../../../types';

const { TextArea } = Input;

interface JustificacionModalProps {
  visible: boolean;
  paciente: CronogramaAsistenciaPaciente | null;
  onCancel: () => void;
  onConfirm: (estado: string, observaciones: string) => void;
  onReagendar: (observaciones: string, nuevaFecha: string) => void;
  loading?: boolean;
}

export const JustificacionModal: React.FC<JustificacionModalProps> = ({
  visible,
  paciente,
  onCancel,
  onConfirm,
  onReagendar,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [observaciones, setObservaciones] = useState('');
  const [nuevaFecha, setNuevaFecha] = useState<dayjs.Dayjs | null>(null);

  const handleObservacionesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setObservaciones(e.target.value);
    // Si el usuario empieza a escribir, mostrar el campo de fecha automáticamente
  };

  const handleReagendar = () => {
    if (!observaciones.trim()) {
      message.error('Debe ingresar una justificación');
      return;
    }
    if (!nuevaFecha) {
      message.error('Debe seleccionar una nueva fecha para reagendar');
      return;
    }
    onReagendar(observaciones, nuevaFecha.format('YYYY-MM-DD'));
  };

  const handleNoAsistio = () => {
    if (!observaciones.trim()) {
      message.error('Debe ingresar una justificación');
      return;
    }
    onConfirm('NO_ASISTIO', observaciones);
  };

  const handleCancel = () => {
    form.resetFields();
    setObservaciones('');
    setNuevaFecha(null);
    onCancel();
  };

  const canReagendar = observaciones.trim().length > 0 && nuevaFecha !== null;
  const showFecha = observaciones.trim().length > 0;
  const disabledDate = (current: dayjs.Dayjs) => {
    return current && current < dayjs().startOf('day');
  };

  return (
    <Modal
      title={
        <Space>
          <ExclamationCircleOutlined style={{ color: '#faad14' }} />
          <span>Justificación de Inasistencia</span>
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={500}
    >
      <div style={{ marginBottom: 16 }}>
        <p>
          <strong>Paciente:</strong> {paciente?.nombres} {paciente?.apellidos}
        </p>
        <p>
          <strong>Documento:</strong> {paciente?.n_documento}
        </p>
      </div>
      <Form form={form} layout="vertical">
        <Form.Item
          label="Observaciones / Justificación"
          name="observaciones"
          rules={[
            { required: true, message: 'Debe ingresar una justificación' },
            { min: 10, message: 'La justificación debe tener al menos 10 caracteres' }
          ]}
        >
          <TextArea
            rows={4}
            placeholder="Describa el motivo por el cual el paciente no asistió..."
            value={observaciones}
            onChange={handleObservacionesChange}
          />
        </Form.Item>
        {showFecha && (
          <Form.Item
            label="Nueva fecha"
            name="nueva_fecha"
            rules={[
              { required: true, message: 'Debe seleccionar una nueva fecha' },
            ]}
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder="Seleccione la nueva fecha"
              value={nuevaFecha}
              onChange={setNuevaFecha}
              disabledDate={disabledDate}
              format="DD/MM/YYYY"
            />
          </Form.Item>
        )}
        <div style={{ marginTop: 16 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button
              danger
              onClick={handleNoAsistio}
              style={{ width: '100%' }}
              loading={loading}
            >
              Marcar como "No Asistió"
            </Button>
            <Button
              type="primary"
              onClick={handleReagendar}
              disabled={!canReagendar}
              style={{ width: '100%' }}
              loading={loading}
            >
              Reagendar Cita
            </Button>
            <Button
              onClick={handleCancel}
              style={{ width: '100%' }}
            >
              Cancelar
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
}; 