import React, { useState, useMemo } from 'react';
import { 
  Card, 
  Typography, 
  Row, 
  Col, 
  Statistic, 
  Button, 
  DatePicker, 
  Table, 
  Tag, 
  Space, 
  Modal, 
  Form, 
  Input, 
  TimePicker, 
  Select, 
  message, 
  notification,
  Badge,
  Tooltip,
  Divider
} from 'antd';
import { 
  CarOutlined, 
  ClockCircleOutlined, 
  EnvironmentOutlined, 
  UserOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import dayjs, { type Dayjs } from 'dayjs';
import { useGetRutaTransporte } from '../../hooks/useGetRutaTransporte/useGetRutaTransporte';
import { useCreateTransporte } from '../../hooks/useCreateTransporte/useCreateTransporte';
import { useUpdateTransporte } from '../../hooks/useUpdateTransporte/useUpdateTransporte';
import { useDeleteTransporte } from '../../hooks/useDeleteTransporte/useDeleteTransporte';
import type { 
  RutaTransporte, 
  RutaDiaria, 
  CreateTransporteRequest, 
  UpdateTransporteRequest,
  EstadoTransporte 
} from '../../types';
import { TransporteModal } from './components/TransporteModal';
import { TransporteStats } from './components/TransporteStats';
import { TransporteFilters } from './components/TransporteFilters';

const { Title, Text } = Typography;
const { Option } = Select;

export const Transporte: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [selectedProfesional, setSelectedProfesional] = useState<number>(1); // Por defecto
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTransporte, setEditingTransporte] = useState<RutaTransporte | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  // Hooks
  const { data: rutaData, isLoading, refetch } = useGetRutaTransporte(
    selectedDate.format('YYYY-MM-DD'), 
    selectedProfesional
  );
  const { mutate: createTransporte, isPending: createLoading } = useCreateTransporte();
  const { mutate: updateTransporte, isPending: updateLoading } = useUpdateTransporte();
  const { mutate: deleteTransporte, isPending: deleteLoading } = useDeleteTransporte();

  // Estadísticas calculadas
  const stats = useMemo(() => {
    if (!rutaData?.data) return null;
    const data = rutaData.data;
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

  const handleEditTransporte = (transporte: RutaTransporte) => {
    setModalMode('edit');
    setEditingTransporte(transporte);
    setIsModalVisible(true);
  };

  const handleDeleteTransporte = (id: number) => {
    Modal.confirm({
      title: '¿Estás seguro de eliminar este transporte?',
      content: 'Esta acción no se puede deshacer.',
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: () => {
        deleteTransporte(id, {
          onSuccess: () => {
            message.success('Transporte eliminado exitosamente');
            refetch();
          },
          onError: () => {
            message.error('Error al eliminar el transporte');
          }
        });
      }
    });
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
      title: 'Dirección Entrega',
      dataIndex: 'direccion_entrega',
      key: 'direccion_entrega',
      render: (direccion: string) => (
        <Space>
          <EnvironmentOutlined />
          <Text>{direccion || 'No especificada'}</Text>
        </Space>
      ),
    },
    {
      title: 'Horarios',
      key: 'horarios',
      render: (record: RutaTransporte) => (
        <Space direction="vertical" size="small">
          <Space>
            <ClockCircleOutlined />
            <Text>Recogida: {record.hora_recogida || 'No especificada'}</Text>
          </Space>
          <Space>
            <ClockCircleOutlined />
            <Text>Entrega: {record.hora_entrega || 'No especificada'}</Text>
          </Space>
        </Space>
      ),
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
          <Tooltip title="Editar transporte">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditTransporte(record)}
              disabled={record.estado === 'REALIZADO'}
            />
          </Tooltip>
          <Tooltip title="Eliminar transporte">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteTransporte(record.id_transporte)}
              loading={deleteLoading}
            />
          </Tooltip>
          {record.estado === 'PENDIENTE' && (
            <>
              <Tooltip title="Marcar como realizado">
                <Button
                  type="text"
                  icon={<CheckCircleOutlined />}
                  onClick={() => {
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
                />
              </Tooltip>
              <Tooltip title="Cancelar transporte">
                <Button
                  type="text"
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={() => {
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
            </>
          )}
        </Space>
      ),
    },
  ];

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
              Nuevo Transporte
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Filtros */}
      <Card style={{ marginBottom: '24px' }}>
        <TransporteFilters
          selectedDate={selectedDate}
          selectedProfesional={selectedProfesional}
          onDateChange={handleDateChange}
          onProfesionalChange={setSelectedProfesional}
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
            {rutaData?.data && (
              <Badge 
                count={rutaData.data.total_pacientes} 
                style={{ backgroundColor: '#52c41a' }}
              />
            )}
          </Space>
        }
        loading={isLoading}
      >
        <Table
          columns={columns}
          dataSource={rutaData?.data?.rutas || []}
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