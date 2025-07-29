import React, { useState, useMemo } from 'react';
import { 
  Card, 
  Typography, 
  Row, 
  Col, 
  Button, 
  Table, 
  Tag, 
  Space, 
  Modal, 
  Select, 
  message, 
  Badge,
  Tooltip,
  TimePicker,
  Input,
} from 'antd';
import { 
  CarOutlined, 
  ClockCircleOutlined, 
  EnvironmentOutlined, 
  PlusOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import dayjs, { type Dayjs } from 'dayjs';
import { useGetRutaTransporte } from '../../hooks/useGetRutaTransporte/useGetRutaTransporte';
import { useCreateTransporte } from '../../hooks/useCreateTransporte/useCreateTransporte';
import { useUpdateTransporte, useUpdateTransporteHorarios } from '../../hooks/useUpdateTransporte/useUpdateTransporte';
import type { 
  RutaTransporte, 
  CreateTransporteRequest, 
  UpdateTransporteRequest,
  EstadoTransporte 
} from '../../types';
import { TransporteModal } from './components/TransporteModal';
import { TransporteStats } from './components/TransporteStats';
import { TransporteFilters } from './components/TransporteFilters';

const { Title, Text } = Typography;
const {} = Select;

export const Transporte: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTransporte, setEditingTransporte] = useState<RutaTransporte | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  
  // Estados para edición inline
  const [editingHorarios, setEditingHorarios] = useState<{
    id_transporte: number;
    field: 'hora_recogida' | 'hora_entrega';
    value: string;
  } | null>(null);

  // Hooks
  const { data: rutaData, isLoading, refetch } = useGetRutaTransporte(
    selectedDate.format('YYYY-MM-DD')
  );
  const { mutate: createTransporte, isPending: createLoading } = useCreateTransporte();
  const { mutate: updateTransporte, isPending: updateLoading } = useUpdateTransporte();
  const { mutate: updateHorarios, isPending: updateHorariosLoading } = useUpdateTransporteHorarios();

  // Estadísticas calculadas
  const stats = useMemo(() => {
    if (!rutaData?.data?.data) return null;
    const data = rutaData.data.data;
    return {
      total: data.total_pacientes,
      pendientes: data.total_pendientes,
      realizados: data.total_realizados,
      cancelados: data.total_cancelados,
      porcentaje: data.total_pacientes > 0 
        ? Math.round((data.total_realizados / data.total_pacientes) * 100) 
        : 0
    };
  }, [rutaData]);

  // Funciones de manejo
  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleCreateTransporte = () => {
    setModalMode('create');
    setEditingTransporte(null);
    setIsModalVisible(true);
  };

  const handleModalSubmit = (values: CreateTransporteRequest | UpdateTransporteRequest) => {
    if (modalMode === 'create') {
      createTransporte(values as CreateTransporteRequest, {
        onSuccess: () => {
          message.success('Transporte creado exitosamente');
          setIsModalVisible(false);
          refetch();
        },
        onError: () => {
          message.error('Error al crear el transporte');
        }
      });
    } else {
      if (editingTransporte) {
        updateTransporte({
          id: editingTransporte.id_transporte,
          data: values as UpdateTransporteRequest
        }, {
          onSuccess: () => {
            message.success('Transporte actualizado exitosamente');
            setIsModalVisible(false);
            refetch();
          },
          onError: () => {
            message.error('Error al actualizar el transporte');
          }
        });
      }
    }
  };

  // Funciones para edición inline
  const handleStartEditHorario = (record: RutaTransporte, field: 'hora_recogida' | 'hora_entrega') => {
    console.log('Iniciando edición de horario:', { record, field });
    setEditingHorarios({
      id_transporte: record.id_transporte,
      field,
      value: record[field] || ''
    });
  };

  const handleSaveHorario = () => {
    if (!editingHorarios) return;

    const { id_transporte, field, value } = editingHorarios;
    console.log('Guardando horario:', { id_transporte, field, value });
    
    updateHorarios({
      id: id_transporte,
      data: { [field]: value }
    }, {
      onSuccess: () => {
        message.success('Horario actualizado exitosamente');
        setEditingHorarios(null);
        refetch();
      },
      onError: () => {
        message.error('Error al actualizar el horario');
      }
    });
  };

  const handleCancelEditHorario = () => {
    console.log('Cancelando edición de horario');
    setEditingHorarios(null);
  };

  const getEstadoColor = (estado: EstadoTransporte) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'processing';
      case 'REALIZADO':
        return 'success';
      case 'CANCELADO':
        return 'error';
      default:
        return 'default';
    }
  };

  const getEstadoText = (estado: EstadoTransporte) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'Pendiente';
      case 'REALIZADO':
        return 'Realizado';
      case 'CANCELADO':
        return 'Cancelado';
      default:
        return estado;
    }
  };

  // Columnas de la tabla
  const columns = [
    {
      title: 'Paciente',
      key: 'paciente',
      render: (record: RutaTransporte) => (
        <Space direction="vertical" size="small">
          <Text strong>{`${record.nombres} ${record.apellidos}`}</Text>
          <Text type="secondary">{record.n_documento}</Text>
        </Space>
      ),
    },
    {
      title: 'Dirección Recogida',
      dataIndex: 'direccion_recogida',
      key: 'direccion_recogida',
      render: (direccion: string) => (
        <Space>
          <EnvironmentOutlined />
          <Text>{direccion || 'No especificada'}</Text>
        </Space>
      ),
    },
    {
      title: 'Teléfono de Contacto',
      dataIndex: 'telefono_contacto',
      key: 'telefono_contacto',
      render: (telefono: string) => (
        <Text>{telefono || 'No especificado'}</Text>
      ),
    },
    {
      title: 'Hora Recogida',
      key: 'hora_recogida',
      render: (record: RutaTransporte) => {
        const isEditing = editingHorarios?.id_transporte === record.id_transporte && editingHorarios?.field === 'hora_recogida';
        
        if (isEditing) {
          return (
            <Space>
              <TimePicker
                format="HH:mm:ss"
                value={editingHorarios.value ? dayjs(editingHorarios.value, 'HH:mm:ss') : null}
                onChange={(time) => {
                  setEditingHorarios(prev => prev ? {
                    ...prev,
                    value: time ? time.format('HH:mm:ss') : ''
                  } : null);
                }}
                style={{ width: 120 }}
              />
              <Button
                type="text"
                size="small"
                icon={<SaveOutlined />}
                onClick={handleSaveHorario}
                loading={updateHorariosLoading}
              />
              <Button
                type="text"
                size="small"
                icon={<CloseOutlined />}
                onClick={handleCancelEditHorario}
              />
            </Space>
          );
        }
        
        return (
          <Space>
            <ClockCircleOutlined />
            <Text>{record.hora_recogida || 'No especificada'}</Text>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                console.log('Click en editar hora recogida:', record);
                handleStartEditHorario(record, 'hora_recogida');
              }}
            />
          </Space>
        );
      },
    },
    {
      title: 'Hora Entrega',
      key: 'hora_entrega',
      render: (record: RutaTransporte) => {
        const isEditing = editingHorarios?.id_transporte === record.id_transporte && editingHorarios?.field === 'hora_entrega';
        
        if (isEditing) {
          return (
            <Space>
              <TimePicker
                format="HH:mm:ss"
                value={editingHorarios.value ? dayjs(editingHorarios.value, 'HH:mm:ss') : null}
                onChange={(time) => {
                  setEditingHorarios(prev => prev ? {
                    ...prev,
                    value: time ? time.format('HH:mm:ss') : ''
                  } : null);
                }}
                style={{ width: 120 }}
              />
              <Button
                type="text"
                size="small"
                icon={<SaveOutlined />}
                onClick={handleSaveHorario}
                loading={updateHorariosLoading}
              />
              <Button
                type="text"
                size="small"
                icon={<CloseOutlined />}
                onClick={handleCancelEditHorario}
              />
            </Space>
          );
        }
        
        return (
          <Space>
            <ClockCircleOutlined />
            <Text>{record.hora_entrega || 'No especificada'}</Text>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                console.log('Click en editar hora entrega:', record);
                handleStartEditHorario(record, 'hora_entrega');
              }}
            />
          </Space>
        );
      },
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (estado: EstadoTransporte) => (
        <Tag color={getEstadoColor(estado)}>
          {getEstadoText(estado)}
        </Tag>
      ),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (record: RutaTransporte) => (
        <Space>
          <Tooltip title="Marcar como realizado">
            <Button
              type="primary"
              size="large"
              icon={<CheckCircleOutlined />}
              onClick={() => {
                console.log('Click en marcar como realizado:', record);
                updateTransporte({
                  id: record.id_transporte,
                  data: { estado: 'REALIZADO' }
                }, {
                  onSuccess: () => {
                    message.success('Transporte marcado como realizado');
                    refetch();
                  }
                });
              }}
            >
              Realizado
            </Button>
          </Tooltip>
          <Tooltip title="Cancelar transporte">
            <Button
              type="text"
              danger
              size="middle"
              icon={<CloseCircleOutlined />}
              onClick={() => {
                console.log('Click en cancelar transporte:', record);
                updateTransporte({
                  id: record.id_transporte,
                  data: { estado: 'CANCELADO' }
                }, {
                  onSuccess: () => {
                    message.success('Transporte cancelado');
                    refetch();
                  }
                });
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  console.log("RUTAS:", rutaData?.data?.data?.rutas);
  console.log("EDITING HORARIOS:", editingHorarios);

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col>
          <Title level={2}>
            <CarOutlined style={{ marginRight: '8px' }} />
            Gestión de Transporte
          </Title>
          <Text type="secondary">
            Administra las rutas de transporte para pacientes
          </Text>
        </Col>
        <Col>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => refetch()}
              loading={isLoading}
            >
              Actualizar
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateTransporte}
            >
              Nuevo Servicio de Transporte
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Filtros */}
      <Card style={{ marginBottom: '24px' }}>
        <TransporteFilters
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />
      </Card>

      {/* Estadísticas */}
      {stats && (
        <Card style={{ marginBottom: '24px' }}>
          <TransporteStats stats={stats} />
        </Card>
      )}

      {/* Tabla de rutas */}
      <Card
        title={
          <Space>
            <CarOutlined />
            <span>Rutas de Transporte - {selectedDate.format('DD/MM/YYYY')}</span>
            {rutaData?.data?.data && (
              <Badge 
                count={rutaData.data.data.total_pacientes} 
                style={{ backgroundColor: '#52c41a' }}
              />
            )}
          </Space>
        }
        loading={isLoading}
      >
        <Table
          columns={columns}
          dataSource={rutaData?.data?.data?.rutas || []}
          rowKey="id_transporte"
          pagination={false}
          locale={{
            emptyText: (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <CarOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                <Text type="secondary">No hay rutas de transporte para esta fecha</Text>
              </div>
            )
          }}
        />
      </Card>

      {/* Modal para crear/editar transporte */}
      <TransporteModal
        visible={isModalVisible}
        mode={modalMode}
        transporte={editingTransporte}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleModalSubmit}
        loading={createLoading || updateLoading}
      />
    </div>
  );
}; 