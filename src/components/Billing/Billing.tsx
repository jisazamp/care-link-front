import React, { useState } from "react";
import { Card, Button, Space, Typography, Row, Col, Divider } from "antd";
import { PlusOutlined, FileTextOutlined, DollarOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { BillingList } from "./BillingList";
import { BillingForm } from "./BillingForm";
import { BillingDetails } from "./BillingDetails";
import { BillingStats } from "./components/BillingStats";
import { BillingFilters } from "./components/BillingFilters";
import { BillingBreadcrumb } from "./components/BillingBreadcrumb";
import type { Bill } from "../../types";

const { Title } = Typography;

interface BillingProps {
  bills?: Bill[];
  loading?: boolean;
  onCreate?: (values: any) => void;
  onUpdate?: (id: number, values: any) => void;
  onDelete?: (bill: Bill) => void;
}

export const Billing: React.FC<BillingProps> = ({
  bills = [],
  loading = false,
  onCreate,
  onUpdate,
  onDelete,
}) => {
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);

  // Calcular estadísticas
  const stats = {
    total: bills.length,
    pagadas: bills.filter(b => b.estado_factura === 'PAGADA').length,
    pendientes: bills.filter(b => b.estado_factura === 'PENDIENTE').length,
    vencidas: bills.filter(b => b.estado_factura === 'VENCIDA').length,
    totalValor: bills.reduce((acc, b) => acc + (Number(b.total_factura) || 0), 0),
    valorPendiente: bills.reduce((acc, b) => {
      const totalFactura = Number(b.total_factura) || 0;
      const pagado = b.pagos?.reduce((sum, p) => sum + (Number(p.valor) || 0), 0) || 0;
      return acc + Math.max(0, totalFactura - pagado);
    }, 0),
  };

  const handleCreate = () => {
    setEditingBill(null);
    setIsFormVisible(true);
    setIsDetailsVisible(false);
  };

  const handleEdit = (bill: Bill) => {
    setEditingBill(bill);
    setIsFormVisible(true);
    setIsDetailsVisible(false);
  };

  const handleView = (bill: Bill) => {
    setSelectedBill(bill);
    setIsDetailsVisible(true);
    setIsFormVisible(false);
  };

  const handleDelete = (bill: Bill) => {
    onDelete?.(bill);
  };

  const handleFormSubmit = (values: any) => {
    if (editingBill) {
      onUpdate?.(editingBill.id_factura, values);
    } else {
      onCreate?.(values);
    }
    setIsFormVisible(false);
    setEditingBill(null);
  };

  const handleFormCancel = () => {
    setIsFormVisible(false);
    setEditingBill(null);
  };

  const handleDetailsClose = () => {
    setIsDetailsVisible(false);
    setSelectedBill(null);
  };

  return (
    <div style={{ padding: "24px" }}>
      {/* Breadcrumb */}
      <BillingBreadcrumb />
      
      <Divider />

      {/* Estadísticas */}
      <BillingStats stats={stats} />

      <Divider />

      {/* Filtros */}
      <BillingFilters 
        selectedDateRange={null}
        onDateRangeChange={() => {}}
        filters={{ estado: '', contrato: '' }}
        onFiltersChange={() => {}}
      />

      <Divider />

      {/* Contenido principal */}
      <Row gutter={24}>
        <Col span={isFormVisible || isDetailsVisible ? 12 : 24}>
          {/* Lista de facturas */}
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileTextOutlined style={{ color: '#1890ff' }} />
                <span>Facturas ({bills.length})</span>
              </div>
            }
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleCreate}
              >
                Nueva Factura
              </Button>
            }
          >
            <BillingList
              bills={bills}
              loading={loading}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Card>
        </Col>

        {/* Panel lateral para formulario o detalles */}
        {(isFormVisible || isDetailsVisible) && (
          <Col span={12}>
            {isFormVisible && (
              <Card
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <DollarOutlined style={{ color: '#52c41a' }} />
                    <span>
                      {editingBill ? 'Editar Factura' : 'Nueva Factura'}
                    </span>
                  </div>
                }
                extra={
                  <Button onClick={handleFormCancel}>
                    Cerrar
                  </Button>
                }
              >
                <BillingForm
                  initialValues={editingBill || undefined}
                  onSubmit={handleFormSubmit}
                  loading={loading}
                />
              </Card>
            )}

            {isDetailsVisible && selectedBill && (
              <Card
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    <span>Detalles de Factura</span>
                  </div>
                }
                extra={
                  <Space>
                    <Button 
                      type="primary"
                      onClick={() => handleEdit(selectedBill)}
                    >
                      Editar
                    </Button>
                    <Button onClick={handleDetailsClose}>
                      Cerrar
                    </Button>
                  </Space>
                }
              >
                <BillingDetails bill={selectedBill} />
              </Card>
            )}
          </Col>
        )}
      </Row>

      {/* Mensaje cuando no hay facturas */}
      {bills.length === 0 && !loading && (
        <Card style={{ textAlign: 'center', marginTop: 24 }}>
          <FileTextOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
          <Title level={4} type="secondary">
            No hay facturas registradas
          </Title>
          <Typography.Text type="secondary">
            Comience creando una nueva factura para gestionar los pagos de los contratos.
          </Typography.Text>
          <br />
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleCreate}
            style={{ marginTop: 16 }}
          >
            Crear Primera Factura
          </Button>
        </Card>
      )}
    </div>
  );
}; 