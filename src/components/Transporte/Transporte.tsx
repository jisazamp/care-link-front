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

  Grid,
  Modal,
  TimePicker,
} from 'antd';
import { 
  CarOutlined, 
  ClockCircleOutlined, 
  EnvironmentOutlined, 
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import dayjs, { type Dayjs } from 'dayjs';
import { useGetRutaTransporte } from '../../hooks/useGetRutaTransporte/useGetRutaTransporte';
import { useUpdateTransporte, useUpdateTransporteHorarios } from '../../hooks/useUpdateTransporte/useUpdateTransporte';
import type { 
  RutaTransporte, 
  EstadoTransporte 
} from '../../types';
import { TransporteStats } from './components/TransporteStats';
import { TransporteFilters } from './components/TransporteFilters';

const { Title, Text } = Typography;
const {} = Select;
const { useBreakpoint } = Grid;

export const Transporte: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  
  // Estado para modal de detalles
  const [detalleModalVisible, setDetalleModalVisible] = useState(false);
  const [transporteSeleccionado, setTransporteSeleccionado] = useState<RutaTransporte | null>(null);
  
  // Estados para edición inline de horarios
  const [editingHorarios, setEditingHorarios] = useState<{
    id_transporte: number;
    field: 'hora_recogida' | 'hora_entrega';
    value: string;
  } | null>(null);
  
  const screens = useBreakpoint();

  // Hooks
  const { data: rutaData, isLoading, refetch } = useGetRutaTransporte(
    selectedDate.format('YYYY-MM-DD')
  );
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
  const getTiempoRestante = (horaRecogida: string | null | undefined, estado?: EstadoTransporte): number | null => {
    if (!horaRecogida) return null;
    
    // Si el estado es REALIZADO, no mostrar alerta
    if (estado === 'REALIZADO') return null;
    
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

  // Estadísticas de alertas
  const alertasStats = useMemo(() => {
    if (!rutaData?.data?.data?.rutas) return null;
    
    const rutas = rutaData.data.data.rutas;
    let urgentes = 0;
    let atencion = 0;
    let proximos = 0;
    
    rutas.forEach(ruta => {
      const tiempoRestante = getTiempoRestante(ruta.hora_recogida, ruta.estado);
      if (tiempoRestante !== null) {
        if (tiempoRestante <= 30) urgentes++;
        else if (tiempoRestante <= 60) atencion++;
        else if (tiempoRestante <= 120) proximos++;
      }
    });
    
    return { urgentes, atencion, proximos };
  }, [rutaData, alertaUpdate]);

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





  // Funciones para modal de detalles
  const handleRowClick = (record: RutaTransporte) => {
    setTransporteSeleccionado(record);
    setDetalleModalVisible(true);
  };

  const handleMarcarRealizado = () => {
    if (!transporteSeleccionado) return;
    
    updateTransporte({
      id: transporteSeleccionado.id_transporte,
      data: { estado: 'REALIZADO' }
    }, {
      onSuccess: () => {
        message.success('Transporte marcado como realizado');
        handleCloseDetalleModal();
        refetch();
      }
    });
  };

  const handleCancelarTransporte = () => {
    if (!transporteSeleccionado) return;
    
    updateTransporte({
      id: transporteSeleccionado.id_transporte,
      data: { estado: 'CANCELADO' }
    }, {
      onSuccess: () => {
        message.success('Transporte cancelado');
        handleCloseDetalleModal();
        refetch();
      }
    });
  };

  const handleRevertirTransporte = () => {
    if (!transporteSeleccionado) return;
    
    updateTransporte({
      id: transporteSeleccionado.id_transporte,
      data: { estado: 'PENDIENTE' }
    }, {
      onSuccess: () => {
        message.success('Transporte revertido a pendiente');
        handleCloseDetalleModal();
        refetch();
      }
    });
  };

  // Funciones para edición inline de horarios
  const handleStartEditHorario = (record: RutaTransporte, field: 'hora_recogida' | 'hora_entrega') => {
    setEditingHorarios({
      id_transporte: record.id_transporte,
      field,
      value: record[field] || ''
    });
  };

  const handleSaveHorario = () => {
    if (!editingHorarios) return;

    const { id_transporte, field, value } = editingHorarios;
    
    updateHorarios({
      id: id_transporte,
      data: { [field]: value }
    }, {
      onSuccess: () => {
        message.success('Horario actualizado exitosamente');
        setEditingHorarios(null);
        refetch();
        // Actualizar el transporte seleccionado en el modal
        if (transporteSeleccionado && transporteSeleccionado.id_transporte === id_transporte) {
          setTransporteSeleccionado(prev => prev ? {
            ...prev,
            [field]: value
          } : null);
        }
      },
      onError: () => {
        message.error('Error al actualizar el horario');
      }
    });
  };

  const handleCancelEditHorario = () => {
    setEditingHorarios(null);
  };

  const handleCloseDetalleModal = () => {
    setDetalleModalVisible(false);
    setTransporteSeleccionado(null);
    setEditingHorarios(null); // Limpiar estado de edición al cerrar
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
      width: screens.xs ? 80 : 120,
      responsive: ['md' as const],
      render: (record: RutaTransporte) => {
        const tiempoRestante = getTiempoRestante(record.hora_recogida, record.estado);
        const alertaTexto = getAlertaTexto(tiempoRestante);
        
        if (!alertaTexto) return null;
        
        return (
          <Tag color={tiempoRestante && tiempoRestante <= 30 ? 'red' : tiempoRestante && tiempoRestante <= 60 ? 'orange' : 'blue'}>
            {screens.xs ? '!' : alertaTexto}
          </Tag>
        );
      },
    },
    {
      title: 'Paciente',
      key: 'paciente',
      responsive: ['sm' as const],
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
      responsive: ['md' as const],
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
      responsive: ['lg' as const],
      render: (telefono: string) => (
        <Space>
          <PhoneOutlined />
          <Text>{telefono || 'No especificado'}</Text>
        </Space>
      ),
    },
    {
      title: 'Hora Recogida',
      key: 'hora_recogida',
      responsive: ['md' as const],
      render: (record: RutaTransporte) => (
        <Space>
          <ClockCircleOutlined />
          <Text>{record.hora_recogida || 'No especificada'}</Text>
        </Space>
      ),
    },
    {
      title: 'Hora Entrega',
      key: 'hora_entrega',
      responsive: ['lg' as const],
      render: (record: RutaTransporte) => (
        <Space>
          <ClockCircleOutlined />
          <Text>{record.hora_entrega || 'No especificada'}</Text>
        </Space>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      responsive: ['sm' as const],
      render: (estado: EstadoTransporte) => (
        <Tag color={getEstadoColor(estado)}>
          {getEstadoText(estado)}
        </Tag>
      ),
    },
  ];

  console.log("RUTAS:", rutaData?.data?.data?.rutas);

  return (
    <div style={{ padding: screens.xs ? '12px' : '24px' }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={24} md={8} lg={6}>
          <Title level={screens.xs ? 3 : 2}>
            <CarOutlined style={{ marginRight: '8px' }} />
            {screens.xs ? 'Transporte' : 'Gestión de Transporte'}
          </Title>
          {!screens.xs && (
            <Text type="secondary">
              Administra las rutas de transporte para pacientes
            </Text>
          )}
        </Col>
        
        {/* Tags de alertas en el centro */}
        <Col xs={24} sm={24} md={8} lg={12} style={{ textAlign: 'center' }}>
          {alertasStats && (
            <Space size={screens.xs ? "small" : "middle"}>
              {alertasStats.urgentes > 0 && (
                <Badge count={alertasStats.urgentes} style={{ backgroundColor: '#ff4d4f' }}>
                  <Tag color="red" style={{ fontSize: screens.xs ? '12px' : '14px' }} className="transporte-alert-tag">
                    {screens.xs ? 'Urg' : 'Urgentes'}
                  </Tag>
                </Badge>
              )}
              {alertasStats.atencion > 0 && (
                <Badge count={alertasStats.atencion} style={{ backgroundColor: '#faad14' }}>
                  <Tag color="orange" style={{ fontSize: screens.xs ? '12px' : '14px' }} className="transporte-alert-tag">
                    {screens.xs ? 'Aten' : 'Atención'}
                  </Tag>
                </Badge>
              )}
              {alertasStats.proximos > 0 && (
                <Badge count={alertasStats.proximos} style={{ backgroundColor: '#1890ff' }}>
                  <Tag color="blue" style={{ fontSize: screens.xs ? '12px' : '14px' }} className="transporte-alert-tag">
                    {screens.xs ? 'Próx' : 'Próximos'}
                  </Tag>
                </Badge>
              )}
            </Space>
          )}
        </Col>
        
        {/* Botón de actualizar a la derecha */}
        <Col xs={24} sm={24} md={8} lg={6} style={{ textAlign: 'right' }}>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
            loading={isLoading}
            size={screens.xs ? "small" : "middle"}
          >
            {screens.xs ? '' : 'Actualizar'}
          </Button>
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
          scroll={{ x: screens.xs ? 800 : 1200 }}
          className="transporte-table-clickable"
          onRow={(record) => {
            const tiempoRestante = getTiempoRestante(record.hora_recogida, record.estado);
            const alertaColor = getAlertaColor(tiempoRestante);
            
            return {
              onClick: () => handleRowClick(record),
              style: { 
                cursor: 'pointer',
                backgroundColor: alertaColor === 'transparent' ? 'transparent' : `${alertaColor}15`,
                borderLeft: alertaColor !== 'transparent' ? `4px solid ${alertaColor}` : 'none',
                transition: 'all 0.3s ease'
              }
            };
          }}
          locale={{
            emptyText: (
              <div style={{ textAlign: 'center', padding: screens.xs ? '20px' : '40px' }}>
                <CarOutlined style={{ fontSize: screens.xs ? '32px' : '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                <Text type="secondary" style={{ fontSize: screens.xs ? '12px' : '14px' }}>
                  No hay rutas de transporte para esta fecha
                </Text>
              </div>
            )
          }}
        />
      </Card>



      {/* Modal de detalles */}
      <Modal
        title={
          <Space>
            <CarOutlined />
            <span>Detalles del Transporte</span>
          </Space>
        }
        open={detalleModalVisible}
        onCancel={handleCloseDetalleModal}
        footer={null}
        width={600}
        destroyOnClose
        className="transporte-detail-modal"
      >
        {transporteSeleccionado && (
          <div>
            {/* Información del paciente */}
            <Card 
              title="Información del Paciente" 
              size="small" 
              style={{ marginBottom: '16px' }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Text strong>Nombre:</Text>
                  <br />
                  <Text>{`${transporteSeleccionado.nombres} ${transporteSeleccionado.apellidos}`}</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Documento:</Text>
                  <br />
                  <Text>{transporteSeleccionado.n_documento}</Text>
                </Col>
              </Row>
            </Card>

            {/* Ubicaciones */}
            <Card 
              title="Ubicaciones" 
              size="small" 
              style={{ marginBottom: '16px' }}
            >
              <Row gutter={16}>
                <Col span={24}>
                  <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div>
                      <Text strong style={{ color: '#1890ff' }}>
                        <EnvironmentOutlined style={{ marginRight: '8px' }} />
                        Punto de Recogida:
                      </Text>
                      <br />
                      <Text>{transporteSeleccionado.direccion_recogida || 'No especificada'}</Text>
                    </div>
                    <div>
                      <Text strong style={{ color: '#52c41a' }}>
                        <PhoneOutlined style={{ marginRight: '8px' }} />
                        Teléfono de Contacto:
                      </Text>
                      <br />
                      <Text>{transporteSeleccionado.telefono_contacto || 'No especificado'}</Text>
                    </div>
                  </Space>
                </Col>
              </Row>
            </Card>

            {/* Horarios */}
            <Card 
              title="Horarios" 
              size="small" 
              style={{ marginBottom: '16px' }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Text strong style={{ color: '#1890ff' }}>
                    <ClockCircleOutlined style={{ marginRight: '8px' }} />
                    Hora de Recogida:
                  </Text>
                  <br />
                  {(() => {
                    const isEditing = editingHorarios?.id_transporte === transporteSeleccionado.id_transporte && editingHorarios?.field === 'hora_recogida';
                    
                    if (isEditing) {
                      return (
                        <Space style={{ marginTop: '8px' }}>
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
                      <Space style={{ marginTop: '8px' }}>
                        <Text>{transporteSeleccionado.hora_recogida || 'No especificada'}</Text>
                        <Button
                          type="text"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => handleStartEditHorario(transporteSeleccionado, 'hora_recogida')}
                        />
                      </Space>
                    );
                  })()}
                </Col>
                <Col span={12}>
                  <Text strong style={{ color: '#52c41a' }}>
                    <ClockCircleOutlined style={{ marginRight: '8px' }} />
                    Hora de Entrega:
                  </Text>
                  <br />
                  {(() => {
                    const isEditing = editingHorarios?.id_transporte === transporteSeleccionado.id_transporte && editingHorarios?.field === 'hora_entrega';
                    
                    if (isEditing) {
                      return (
                        <Space style={{ marginTop: '8px' }}>
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
                      <Space style={{ marginTop: '8px' }}>
                        <Text>{transporteSeleccionado.hora_entrega || 'No especificada'}</Text>
                        <Button
                          type="text"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => handleStartEditHorario(transporteSeleccionado, 'hora_entrega')}
                        />
                      </Space>
                    );
                  })()}
                </Col>
              </Row>
            </Card>

            {/* Estado actual */}
            <Card 
              title="Estado Actual" 
              size="small" 
              style={{ marginBottom: '16px' }}
            >
              <Space direction="vertical" size="small">
                <Tag color={getEstadoColor(transporteSeleccionado.estado)}>
                  {getEstadoText(transporteSeleccionado.estado)}
                </Tag>
                {(() => {
                  const tiempoRestante = getTiempoRestante(transporteSeleccionado.hora_recogida, transporteSeleccionado.estado);
                  const alertaTexto = getAlertaTexto(tiempoRestante);
                  if (alertaTexto) {
                    return (
                      <Tag color={tiempoRestante && tiempoRestante <= 30 ? 'red' : tiempoRestante && tiempoRestante <= 60 ? 'orange' : 'blue'}>
                        {alertaTexto}
                      </Tag>
                    );
                  }
                  return null;
                })()}
              </Space>
            </Card>

            {/* Acciones */}
            <Card 
              title="Acciones" 
              size="small"
              style={{ marginBottom: '16px' }}
            >
              <Space size="middle" wrap>
                {transporteSeleccionado.estado !== 'REALIZADO' && (
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={handleMarcarRealizado}
                    loading={updateLoading}
                    size="large"
                  >
                    Marcar como Realizado
                  </Button>
                )}
                
                {transporteSeleccionado.estado !== 'CANCELADO' && (
                  <Button
                    danger
                    icon={<CloseCircleOutlined />}
                    onClick={handleCancelarTransporte}
                    loading={updateLoading}
                    size="large"
                  >
                    Cancelar Transporte
                  </Button>
                )}
                
                {transporteSeleccionado.estado !== 'PENDIENTE' && (
                  <Button
                    type="default"
                    icon={<ReloadOutlined />}
                    onClick={handleRevertirTransporte}
                    loading={updateLoading}
                    size="large"
                  >
                    Revertir a Pendiente
                  </Button>
                )}
              </Space>
            </Card>

            {/* Información adicional */}
            {transporteSeleccionado.observaciones && (
              <Card 
                title="Observaciones" 
                size="small"
              >
                <Text>{transporteSeleccionado.observaciones}</Text>
              </Card>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}; 