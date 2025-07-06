import React, { useEffect } from 'react';
import { Modal, Form, Input, TimePicker, Select, message } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { 
  RutaTransporte, 
  CreateTransporteRequest, 
  UpdateTransporteRequest,
  EstadoTransporte 
} from '../../../types';

const { Option } = Select;
const { TextArea } = Input;

interface TransporteModalProps {
  visible: boolean;
  mode: 'create' | 'edit';
  transporte: RutaTransporte | null;
  onCancel: () => void;
  onSubmit: (values: CreateTransporteRequest | UpdateTransporteRequest) => void;
  loading: boolean;
}

export const TransporteModal: React.FC<TransporteModalProps> = ({
  visible,
  mode,
  transporte,
  onCancel,
  onSubmit,
  loading
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && transporte && mode === 'edit') {
      form.setFieldsValue({
        id_cronograma_paciente: transporte.id_cronograma_paciente,
        direccion_recogida: transporte.direccion_recogida,
        direccion_entrega: transporte.direccion_entrega,
        hora_recogida: transporte.hora_recogida ? dayjs(transporte.hora_recogida, 'HH:mm:ss') : null,
        hora_entrega: transporte.hora_entrega ? dayjs(transporte.hora_entrega, 'HH:mm:ss') : null,
        estado: transporte.estado,
        observaciones: transporte.observaciones
      });
    } else if (visible && mode === 'create') {
      form.resetFields();
    }
  }, [visible, transporte, mode, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Convertir horarios a string
      const formattedValues = {
        ...values,
        hora_recogida: values.hora_recogida ? values.hora_recogida.format('HH:mm:ss') : undefined,
        hora_entrega: values.hora_entrega ? values.hora_entrega.format('HH:mm:ss') : undefined,
      };

      onSubmit(formattedValues);
    } catch (error) {
      message.error('Por favor, completa todos los campos requeridos');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={mode === 'create' ? 'Nuevo Transporte' : 'Editar Transporte'}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={600}
      okText={mode === 'create' ? 'Crear' : 'Actualizar'}
      cancelText="Cancelar"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          estado: 'PENDIENTE'
        }}
      >
        {mode === 'create' && (
          <Form.Item
            name="id_cronograma_paciente"
            label="ID Cronograma Paciente"
            rules={[{ required: true, message: 'Por favor ingresa el ID del cronograma del paciente' }]}
          >
            <Input type="number" placeholder="Ingresa el ID del cronograma del paciente" />
          </Form.Item>
        )}

        <Form.Item
          name="direccion_recogida"
          label="Dirección de Recogida"
          rules={[{ required: true, message: 'Por favor ingresa la dirección de recogida' }]}
        >
          <TextArea 
            rows={2} 
            placeholder="Ingresa la dirección donde se recogerá al paciente"
          />
        </Form.Item>

        <Form.Item
          name="direccion_entrega"
          label="Dirección de Entrega"
          rules={[{ required: true, message: 'Por favor ingresa la dirección de entrega' }]}
        >
          <TextArea 
            rows={2} 
            placeholder="Ingresa la dirección donde se entregará al paciente"
          />
        </Form.Item>

        <Form.Item
          name="hora_recogida"
          label="Hora de Recogida"
          rules={[{ required: true, message: 'Por favor selecciona la hora de recogida' }]}
        >
          <TimePicker 
            format="HH:mm" 
            placeholder="Selecciona la hora de recogida"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item
          name="hora_entrega"
          label="Hora de Entrega"
          rules={[{ required: true, message: 'Por favor selecciona la hora de entrega' }]}
        >
          <TimePicker 
            format="HH:mm" 
            placeholder="Selecciona la hora de entrega"
            style={{ width: '100%' }}
          />
        </Form.Item>

        {mode === 'edit' && (
          <Form.Item
            name="estado"
            label="Estado"
            rules={[{ required: true, message: 'Por favor selecciona el estado' }]}
          >
            <Select placeholder="Selecciona el estado">
              <Option value="PENDIENTE">Pendiente</Option>
              <Option value="REALIZADO">Realizado</Option>
              <Option value="CANCELADO">Cancelado</Option>
            </Select>
          </Form.Item>
        )}

        <Form.Item
          name="observaciones"
          label="Observaciones"
        >
          <TextArea 
            rows={3} 
            placeholder="Ingresa observaciones adicionales (opcional)"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}; 