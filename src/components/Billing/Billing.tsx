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
  message, 
  Badge,
  Tooltip,
  DatePicker,
} from 'antd';
import { 
  DollarOutlined, 
  FileTextOutlined, 
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import dayjs, { type Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useGetFacturas } from '../../hooks/useGetFacturas';
import { useCreateFactura } from '../../hooks/useCreateFactura';
import { useUpdateFactura } from '../../hooks/useUpdateFactura';
import { useDeleteFactura } from '../../hooks/useDeleteFactura';
import type { Bill } from '../../types';
import { BillingForm } from './BillingForm';
import { BillingBreadcrumb } from './components/BillingBreadcrumb';
import { BillingStats } from './components/BillingStats';
import { BillingFilters } from './components/BillingFilters';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Extender dayjs con el plugin isBetween
dayjs.extend(isBetween);

export const Billing: React.FC = () => {
  const [selectedDateRange, setSelectedDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingFactura, setEditingFactura] = useState<Bill | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [filters, setFilters] = useState({
    estado: '',
    contrato: '',
  });

  // Hooks
  const { data: facturasData, isLoading, refetch } = useGetFacturas();
  const { mutate: createFactura, isPending: createLoading } = useCreateFactura();
  const { mutate: updateFactura, isPending: updateLoading } = useUpdateFactura();
  const { mutate: deleteFactura, isPending: deleteLoading } = useDeleteFactura();

  // Filtrar facturas según los filtros aplicados
  const filteredFacturas = useMemo(() => {
    if (!facturasData?.data?.data) return [];
    
    let filtered = facturasData.data.data;
    
    // Filtrar por rango de fechas
    if (selectedDateRange) {
      const [startDate, endDate] = selectedDateRange;
      filtered = filtered.filter((factura: Bill) => {
        const fechaEmision = dayjs(factura.fecha_emision);
        return fechaEmision.isBetween(startDate, endDate, 'day', '[]');
      });
    }
    
    // Filtrar por estado
    if (filters.estado) {
      filtered = filtered.filter((factura: Bill) => 
        factura.estado_factura === filters.estado
      );
    }
    
    // Filtrar por contrato
    if (filters.contrato) {
      filtered = filtered.filter((factura: Bill) => 
        factura.id_contrato.toString().includes(filters.contrato)
      );
    }
    
    return filtered;
  }, [facturasData, selectedDateRange, filters]);

  // Estadísticas calculadas
  const stats = useMemo(() => {
    const facturas = filteredFacturas;
    return {
      total: facturas.length,
      pendientes: facturas.filter(f => f.estado_factura === 'PENDIENTE').length,
      pagadas: facturas.filter(f => f.estado_factura === 'PAGADA').length,
      vencidas: facturas.filter(f => f.estado_factura === 'VENCIDA').length,
      totalValor: facturas.reduce((sum, f) => sum + (f.total_factura || 0), 0),
      valorPendiente: facturas
        .filter(f => f.estado_factura === 'PENDIENTE')
        .reduce((sum, f) => sum + (f.total_factura || 0), 0),
    };
  }, [filteredFacturas]);

  // Funciones de manejo
  const handleCreateFactura = () => {
    setModalMode('create');
    setEditingFactura(null);
    setIsModalVisible(true);
  };

  const handleEditFactura = (factura: Bill) => {
    setModalMode('edit');
    // Procesar las fechas para que sean compatibles con el formulario
    const processedFactura = {
      ...factura,
      fecha_emision: factura.fecha_emision || '',
      fecha_vencimiento: factura.fecha_vencimiento || '',
    };
    setEditingFactura(processedFactura);
    setIsModalVisible(true);
  };

  const handleDeleteFactura = (id: number) => {
    Modal.confirm({
      title: '¿Estás seguro de eliminar esta factura?',
      content: 'Esta acción no se puede deshacer.',
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: () => {
        deleteFactura(id, {
          onSuccess: () => {
            message.success('Factura eliminada exitosamente');
            refetch();
          },
          onError: () => {
            message.error('Error al eliminar la factura');
          }
        });
      }
    });
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingFactura(null);
    setModalMode('create');
  };

  const handleModalSubmit = (values: any) => {
    if (modalMode === 'create') {
      createFactura(values, {
        onSuccess: () => {
          message.success('Factura creada exitosamente');
          handleModalClose();
          refetch();
        },
        onError: () => {
          message.error('Error al crear la factura');
        }
      });
    } else {
      if (editingFactura) {
        updateFactura({
          id: editingFactura.id_factura,
          data: values
        }, {
          onSuccess: () => {
            message.success('Factura actualizada exitosamente');
            handleModalClose();
            refetch();
          },
          onError: () => {
            message.error('Error al actualizar la factura');
          }
        });
      }
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'processing';
      case 'PAGADA':
        return 'success';
      case 'VENCIDA':
        return 'error';
      case 'CANCELADA':
        return 'default';
      default:
        return 'default';
    }
  };

  const getEstadoText = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'Pendiente';
      case 'PAGADA':
        return 'Pagada';
      case 'VENCIDA':
        return 'Vencida';
      case 'CANCELADA':
        return 'Cancelada';
      default:
        return estado;
    }
  };

  // Columnas de la tabla
  const columns = [
    {
      title: 'N° Factura',
      dataIndex: 'id_factura',
      key: 'id_factura',
      render: (id: number) => (
        <Text strong>#{id}</Text>
      ),
    },
    {
      title: 'Contrato',
      dataIndex: 'id_contrato',
      key: 'id_contrato',
      render: (contratoId: number) => (
        <Text>Contrato #{contratoId}</Text>
      ),
    },
    {
      title: 'Fecha Emisión',
      dataIndex: 'fecha_emision',
      key: 'fecha_emision',
      render: (fecha: string) => (
        <Space>
          <CalendarOutlined />
          <Text>{fecha ? dayjs(fecha).format('DD/MM/YYYY') : '-'}</Text>
        </Space>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total_factura',
      key: 'total_factura',
      render: (valor: number) => (
        <Text strong style={{ color: '#52c41a' }}>
          ${valor ? valor.toLocaleString() : '0'}
        </Text>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'estado_factura',
      key: 'estado_factura',
      render: (estado: string) => (
        <Tag color={getEstadoColor(estado)}>
          {getEstadoText(estado)}
        </Tag>
      ),
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (record: Bill) => (
        <Space>
          <Tooltip title="Editar factura">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditFactura(record)}
            />
          </Tooltip>
          <Tooltip title="Eliminar factura">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteFactura(record.id_factura)}
              loading={deleteLoading}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="billing-container">
      {/* Breadcrumb */}
      <BillingBreadcrumb />

      {/* Header */}
      <div className="billing-header">
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ color: 'white', margin: 0 }}>
              <DollarOutlined style={{ marginRight: '8px' }} />
              Gestión de Facturación
            </Title>
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Administra todas las facturas del sistema
            </Text>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => refetch()}
                loading={isLoading}
                style={{ color: 'white', borderColor: 'white' }}
                ghost
              >
                Actualizar
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreateFactura}
                style={{ backgroundColor: 'white', color: '#9957C2', borderColor: 'white' }}
              >
                Nueva Factura
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Filtros */}
      <Card className="billing-filters-card">
        <BillingFilters
          selectedDateRange={selectedDateRange}
          onDateRangeChange={setSelectedDateRange}
          filters={filters}
          onFiltersChange={setFilters}
        />
      </Card>

      {/* Estadísticas */}
      <Card className="billing-stats-card">
        <BillingStats stats={stats} />
      </Card>

      {/* Tabla de facturas */}
      <Card
        className="billing-table-card"
        title={
          <Space>
            <FileTextOutlined />
            <span>Facturas del Sistema</span>
            {facturasData?.data?.data && (
              <Badge 
                count={filteredFacturas.length} 
                style={{ backgroundColor: '#52c41a' }}
              />
            )}
          </Space>
        }
        loading={isLoading}
      >
        <Table
          columns={columns}
          dataSource={filteredFacturas}
          rowKey="id_factura"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} de ${total} facturas`,
          }}
          locale={{
            emptyText: (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <DollarOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
                <Text type="secondary">No hay facturas para mostrar</Text>
              </div>
            )
          }}
        />
      </Card>

      {/* Modal para crear/editar factura */}
      <Modal
        title={modalMode === 'create' ? 'Nueva Factura' : 'Editar Factura'}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={600}
        className="billing-modal"
      >
        <BillingForm
          initialValues={editingFactura || undefined}
          onSubmit={handleModalSubmit}
          loading={createLoading || updateLoading}
        />
      </Modal>
    </div>
  );
}; 