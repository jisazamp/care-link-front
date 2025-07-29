import React, { useState, useMemo, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Row, 
  Col, 
  Button, 
  Table, 
  Tag, 
  Space, 
  Select, 
  message, 
  Badge,
  Tooltip,
  TimePicker,
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

  // Estado para forzar re-render de alertas
  const [alertaUpdate, setAlertaUpdate] = useState(0);

  // Actualizar alertas cada minuto
  useEffect(() => {
    const interval = setInterval(() => {
      setAlertaUpdate(prev => prev + 1);
    }, 60000); // 1 minuto

    return () => clearInterval(interval);
  }, []);

  // Funciones de utilidad para alertas
  const getTiempoRestante = (horaRecogida: string | null | undefined): number | null => {
    if (!horaRecogida) return null;
    
    try {
      const ahora = dayjs();
      const [horas, minutos, segundos] = horaRecogida.split(':').map(Number);
      const horaHoy = ahora.hour(horas).minute(minutos).second(segundos);
      
      // Si la hora ya pasó hoy, no mostrar alerta
      if (horaHoy.isBefore(ahora)) return null;
      
      const diferencia = horaHoy.diff(ahora, 'minute');
      return diferencia;
    } catch (error) {
      console.error('Error calculando tiempo restante:', error);
      return null;
    }
  };

  const getAlertaColor = (tiempoRestante: number | null): string => {
    if (tiempoRestante === null) return 'transparent';
    
    if (tiempoRestante <= 30) return '#ff7a45'; // Naranja claro - 30 min o menos
    if (tiempoRestante <= 60) return '#faad14'; // Amarillo claro - 1 hora o menos
    if (tiempoRestante <= 120) return '#1890ff'; // Azul claro - 2 horas o menos
    return 'transparent'; // Sin alerta
  };

  const getAlertaTexto = (tiempoRestante: number | null): string => {
    if (tiempoRestante === null) return '';
    
    if (tiempoRestante <= 30) return '¡URGENTE! Menos de 30 min';
    if (tiempoRestante <= 60) return '¡ATENCIÓN! Menos de 1 hora';
    if (tiempoRestante <= 120) return 'Próximo: Menos de 2 horas';
    return '';
  };

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

  // Estadísticas de alertas
  const alertasStats = useMemo(() => {
    if (!rutaData?.data?.data?.rutas) return null;
    
    const rutas = rutaData.data.data.rutas;
    let urgentes = 0;
    let atencion = 0;
    let proximos = 0;
    
    rutas.forEach(ruta => {
      const tiempoRestante = getTiempoRestante(ruta.hora_recogida);
      if (tiempoRestante !== null) {
        if (tiempoRestante <= 30) urgentes++;
        else if (tiempoRestante <= 60) atencion++;
        else if (tiempoRestante <= 120) proximos++;
      }
    });
    
    return { urgentes, atencion, proximos };
  }, [rutaData, alertaUpdate]);

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
      title: 'Alerta',
      key: 'alerta',
      width: 120,
      render: (record: RutaTransporte) => {
        const tiempoRestante = getTiempoRestante(record.hora_recogida);
        const alertaTexto = getAlertaTexto(tiempoRestante);
        
        if (!alertaTexto) return null;
        
        return (
          <Tag color={tiempoRestante && tiempoRestante <= 30 ? 'red' : tiempoRestante && tiempoRestante <= 60 ? 'orange' : 'blue'}>
            {alertaTexto}
          </Tag>
        );
      },
    },
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
  console.log("ALERTAS STATS:", alertasStats);
  console.log("ALERTA UPDATE:", alertaUpdate);

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
            {/* Alertas */}
            {alertasStats && (
              <Space>
                {alertasStats.urgentes > 0 && (
                  <Badge count={alertasStats.urgentes} style={{ backgroundColor: '#ff4d4f' }}>
                    <Tag color="red">Urgentes</Tag>
                  </Badge>
                )}
                {alertasStats.atencion > 0 && (
                  <Badge count={alertasStats.atencion} style={{ backgroundColor: '#faad14' }}>
                    <Tag color="orange">Atención</Tag>
                  </Badge>
                )}
                {alertasStats.proximos > 0 && (
                  <Badge count={alertasStats.proximos} style={{ backgroundColor: '#1890ff' }}>
                    <Tag color="blue">Próximos</Tag>
                  </Badge>
                )}
              </Space>
            )}
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

      {/* Información del sistema de alertas */}
      <Card 
        title="Sistema de Alertas" 
        size="small" 
        style={{ marginBottom: '24px' }}
      >
        <Row gutter={16}>
          <Col span={6}>
            <Space>
              <div style={{ width: '16px', height: '16px', backgroundColor: '#1890ff', borderRadius: '50%' }} />
              <Text>Próximo (≤ 2 horas)</Text>
            </Space>
          </Col>
          <Col span={6}>
            <Space>
              <div style={{ width: '16px', height: '16px', backgroundColor: '#faad14', borderRadius: '50%' }} />
              <Text>Atención (≤ 1 hora)</Text>
            </Space>
          </Col>
          <Col span={6}>
            <Space>
              <div style={{ width: '16px', height: '16px', backgroundColor: '#ff7a45', borderRadius: '50%' }} />
              <Text>Urgente (≤ 30 min)</Text>
            </Space>
          </Col>
          <Col span={6}>
            <Text type="secondary">
              Las alertas se actualizan automáticamente cada minuto
            </Text>
          </Col>
        </Row>
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
          rowClassName={(record) => {
            const tiempoRestante = getTiempoRestante(record.hora_recogida);
            const alertaColor = getAlertaColor(tiempoRestante);
            
            if (alertaColor === 'transparent') return '';
            
            return 'alerta-fila';
          }}
          onRow={(record) => {
            const tiempoRestante = getTiempoRestante(record.hora_recogida);
            const alertaColor = getAlertaColor(tiempoRestante);
            
            return {
              style: {
                backgroundColor: alertaColor === 'transparent' ? 'transparent' : `${alertaColor}15`,
                borderLeft: alertaColor !== 'transparent' ? `4px solid ${alertaColor}` : 'none',
                transition: 'all 0.3s ease'
              }
            };
          }}
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