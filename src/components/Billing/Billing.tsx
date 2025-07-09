import React, { useState, useEffect } from "react";
import { Card, Button, Typography, Divider, message, Spin } from "antd";
import { PlusOutlined, FileTextOutlined, DollarOutlined } from "@ant-design/icons";
import { BillingList } from "./BillingList";
import { BillingForm } from "./BillingForm";
//import { BillingDetails } from "./BillingDetails";
import { BillingStats } from "./components/BillingStats";
import { ContractFilters, InvoiceFilters } from "./components/BillingFilters";
import { BillingBreadcrumb } from "./components/BillingBreadcrumb";
import { useGetFacturas } from "../../hooks/useGetFacturas";
import { useCreateFactura } from "../../hooks/useCreateFactura";
import { useUpdateFactura } from "../../hooks/useUpdateFactura";
import { useDeleteFactura } from "../../hooks/useDeleteFactura";
import { useGetUserContracts } from "../../hooks/useGetUserContracts/useGetUserContracts";
import { useGetFacturacionCompleta } from "../../hooks/useGetFacturacionCompleta";
import { Table } from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import type { Bill } from "../../types";

const { Title } = Typography;

export const Billing: React.FC = () => {
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [sideCardVisible, setSideCardVisible] = useState(false);
  const [ ] = useState<[any, any] | null>(null);
  const [filters, ] = useState({ estado: '', contrato: '' });
  
  // Estados para filtros individuales
  const [contractFilters, setContractFilters] = useState({
    documento: '',
    estado: '',
    contrato: '',
    tipoContrato: '',
    fechaEmision: null,
    facturaAsociada: '',
    fechaVencimiento: null,
    nombreUsuario: ''
  });
  
  const [invoiceFilters, setInvoiceFilters] = useState({
    factura: '',
    estado: '',
    fechaEmision: null,
    fechaVencimiento: null
  });

  // Hooks para obtener datos
  const { data: facturas, isLoading: isLoadingFacturas, error: errorFacturas } = useGetFacturas();
  const { data: contratos, isLoading: isLoadingContratos } = useGetUserContracts(undefined);
  const { data: facturacionCompleta, isLoading: isLoadingFacturacionCompleta } = useGetFacturacionCompleta();
  const navigate = useNavigate();
  
  // Hooks para operaciones CRUD
  const createFactura = useCreateFactura();
  const updateFactura = useUpdateFactura();
  const deleteFactura = useDeleteFactura();

  // Logs para debugging
  useEffect(() => {
    console.log("🔍 Billing Component - Debug Info:");
    console.log("📊 Facturas:", facturas);
    console.log("📋 Contratos:", contratos);
    console.log("⏳ Loading Facturas:", isLoadingFacturas);
    console.log("⏳ Loading Contratos:", isLoadingContratos);
    console.log("❌ Error Facturas:", errorFacturas);
  }, [facturas, contratos, isLoadingFacturas, isLoadingContratos, errorFacturas]);

  // Filtrar facturas según los filtros aplicados
  const filteredBills = React.useMemo(() => {
    let filtered = facturas || [];
    
    // Filtros de facturas (invoiceFilters)
    if (invoiceFilters.factura) {
      filtered = filtered.filter((bill: Bill) => 
        bill.numero_factura?.toLowerCase().includes(invoiceFilters.factura.toLowerCase())
      );
    }
    
    if (invoiceFilters.estado) {
      filtered = filtered.filter((bill: Bill) => bill.estado_factura === invoiceFilters.estado);
    }
    
    if (invoiceFilters.fechaEmision) {
      filtered = filtered.filter((bill: Bill) => {
        const billDate = dayjs(bill.fecha_emision);
        return billDate.isSame(invoiceFilters.fechaEmision, 'day');
      });
    }
    
    if (invoiceFilters.fechaVencimiento) {
      filtered = filtered.filter((bill: Bill) => {
        const billDate = dayjs(bill.fecha_vencimiento);
        return billDate.isSame(invoiceFilters.fechaVencimiento, 'day');
      });
    }
    
    // Filtros legacy (filters)
    if (filters.estado) {
      filtered = filtered.filter((bill: Bill) => bill.estado_factura === filters.estado);
    }
    
    if (filters.contrato) {
      filtered = filtered.filter((bill: Bill) => bill.id_contrato?.toString() === filters.contrato);
    }
    
    return filtered;
  }, [facturas, invoiceFilters, filters]);

  // Calcular estadísticas
  const stats = {
    total: filteredBills.length,
    pagadas: filteredBills.filter((b: Bill) => b.estado_factura === 'PAGADA').length,
    pendientes: filteredBills.filter((b: Bill) => b.estado_factura === 'PENDIENTE').length,
    vencidas: filteredBills.filter((b: Bill) => b.estado_factura === 'VENCIDA').length,
    totalValor: filteredBills.reduce((acc: number, b: Bill) => acc + (Number(b.total_factura) || 0), 0),
    valorPendiente: filteredBills.reduce((acc: number, b: Bill) => {
      const totalFactura = Number(b.total_factura) || 0;
      const pagado = b.pagos?.reduce((sum: number, p: any) => sum + (Number(p.valor) || 0), 0) || 0;
      return acc + Math.max(0, totalFactura - pagado);
    }, 0),
  };

  // Handler para crear nueva factura
  const handleCreate = () => {
    setEditingBill(null); // Modo creación
    setSideCardVisible(true);
  };

  // Handler para editar factura
  const handleEdit = (bill: Bill) => {
    setEditingBill(bill);
    setSideCardVisible(true);
  };

  // Handler para ver factura (puede ser igual a editar, o mostrar solo detalles si lo deseas)
  const handleView = (bill: Bill) => {
    setEditingBill(bill);
    setSideCardVisible(true);
  };

  const handleDelete = (bill: Bill) => {
    deleteFactura.mutate(bill.id_factura, {
      onSuccess: () => {
        message.success("Factura eliminada exitosamente");
      },
      onError: (error) => {
        message.error("Error al eliminar la factura");
        console.error("Error deleting bill:", error);
      }
    });
  };

  const handleFormSubmit = (values: any) => {
    if (editingBill) {
      updateFactura.mutate({ id: editingBill.id_factura, data: values }, {
        onSuccess: () => {
          message.success("Factura actualizada exitosamente");
          setSideCardVisible(false);
          setEditingBill(null);
        },
        onError: (error) => {
          message.error("Error al actualizar la factura");
          console.error("Error updating bill:", error);
        }
      });
    } else {
      createFactura.mutate(values, {
        onSuccess: () => {
          message.success("Factura creada exitosamente");
          setSideCardVisible(false);
        },
        onError: (error) => {
          message.error("Error al crear la factura");
          console.error("Error creating bill:", error);
        }
      });
    }
  };

  const handleFormCancel = () => {
    setSideCardVisible(false);
    setEditingBill(null);
  };

  const handleDetailsClose = () => {
    setSideCardVisible(false);
    setEditingBill(null);
  };

  // Funciones de filtrado (pueden ser implementadas según necesidad)
  const handleContractFiltersChange = (newFilters: any) => {
    setContractFilters(newFilters);
    // Aquí puedes implementar la lógica de filtrado para contratos
  };

  const handleInvoiceFiltersChange = (newFilters: any) => {
    setInvoiceFilters(newFilters);
  };

  // Lógica de filtrado para la tabla de facturación completa (contratos)
  const filteredFacturacionCompleta = facturacionCompleta?.filter((item: any) => {
    // Filtro por documento
    if (contractFilters.documento && !item.n_documento?.toLowerCase().includes(contractFilters.documento.toLowerCase())) {
      return false;
    }
    // Filtro por estado
    if (contractFilters.estado && item.estado_contrato !== contractFilters.estado) {
      return false;
    }
    // Filtro por contrato
    if (contractFilters.contrato && !item.id_contrato?.toString().includes(contractFilters.contrato)) {
      return false;
    }
    // Filtro por tipo contrato
    if (contractFilters.tipoContrato && !item.tipo_contrato?.toLowerCase().includes(contractFilters.tipoContrato.toLowerCase())) {
      return false;
    }
    // Filtro por fecha emisión
    if (contractFilters.fechaEmision && item.fecha_emision) {
      const itemDate = dayjs(item.fecha_emision);
      if (!itemDate.isSame(contractFilters.fechaEmision, 'day')) {
        return false;
      }
    }
    // Filtro por factura asociada
    if (contractFilters.facturaAsociada && !item.numero_factura?.toLowerCase().includes(contractFilters.facturaAsociada.toLowerCase())) {
      return false;
    }
    // Filtro por fecha vencimiento
    if (contractFilters.fechaVencimiento && item.fecha_vencimiento) {
      const itemDate = dayjs(item.fecha_vencimiento);
      if (!itemDate.isSame(contractFilters.fechaVencimiento, 'day')) {
        return false;
      }
    }
    // Filtro por nombre usuario
    if (contractFilters.nombreUsuario && !`${item.nombres} ${item.apellidos}`.toLowerCase().includes(contractFilters.nombreUsuario.toLowerCase())) {
      return false;
    }
    return true;
  }) || [];



  // Nueva tabla de facturación completa
  const columnsFacturacion = [
    { title: "Usuario", dataIndex: "nombres", key: "nombres", render: (_: any, row: any) => `${row.nombres} ${row.apellidos}` },
    { title: "Documento", dataIndex: "n_documento", key: "n_documento" },
    { title: "Contrato", dataIndex: "id_contrato", key: "id_contrato" },
    { title: "Tipo Contrato", dataIndex: "tipo_contrato", key: "tipo_contrato" },
    { title: "Factura", dataIndex: "numero_factura", key: "numero_factura" },
    { title: "Fecha Emisión", dataIndex: "fecha_emision", key: "fecha_emision" },
    { title: "Fecha Vencimiento", dataIndex: "fecha_vencimiento", key: "fecha_vencimiento" },
    {
      title: "Ver Contrato",
      key: "ver_contrato",
      render: (_: any, row: any) => (
        row.id_usuario && row.id_contrato ? (
          <Button type="link" onClick={() => navigate(`/usuarios/${row.id_usuario}/contrato/${row.id_contrato}`)}>
            Ir a Contrato
          </Button>
        ) : null
      ),
    },
  ];

  // Mostrar loading mientras se cargan los datos
  if (isLoadingFacturas || isLoadingContratos) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Typography.Text>Cargando datos de facturación...</Typography.Text>
        </div>
      </div>
    );
  }

  // Mostrar error si hay problemas
  if (errorFacturas) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <Typography.Title level={4} type="danger">
          Error al cargar las facturas
        </Typography.Title>
        <Typography.Text type="secondary">
          {errorFacturas.message || "Ha ocurrido un error inesperado"}
        </Typography.Text>
        <br />
        <Button 
          type="primary" 
          onClick={() => window.location.reload()}
          style={{ marginTop: 16 }}
        >
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Breadcrumb */}
      <BillingBreadcrumb />
      <Divider />
      {/* Estadísticas */}
      <BillingStats stats={stats} />
      <Divider />
      {/* Filtros de Contratos encima de la tabla de facturación completa */}
      <Card title="Filtros de Contratos" style={{ marginBottom: 16 }}>
        <ContractFilters 
          filters={contractFilters}
          onFiltersChange={handleContractFiltersChange}
        />
      </Card>
      {/* Tabla de facturación completa */}
      <Card title="Facturación Completa (Usuarios, Contratos, Facturas, Pagos)">
        <Table
          columns={columnsFacturacion}
          dataSource={filteredFacturacionCompleta}
          loading={isLoadingFacturacionCompleta}
          rowKey={row => `${row.id_pago || ''}-${row.id_factura || ''}-${row.id_contrato || ''}-${row.id_usuario || ''}`}
          pagination={{ pageSize: 10 }}
        />
      </Card>
      <Divider />
      <div style={{ display: 'flex', gap: 24 }}>
        {/* Card de facturas */}
        <div style={{ flex: sideCardVisible ? 0.6 : 1, transition: 'flex 0.3s' }}>
          {/* Filtros de Facturas encima de la lista de facturas */}
          <Card title="Filtros de Facturas" style={{ marginBottom: 16 }}>
            <InvoiceFilters 
              filters={invoiceFilters}
              onFiltersChange={handleInvoiceFiltersChange}
            />
          </Card>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileTextOutlined style={{ color: '#1890ff' }} />
                <span>Facturas ({filteredBills.length})</span>
              </div>
            }
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleCreate}
                loading={createFactura.isPending}
              >
                Nueva Factura
              </Button>
            }
          >
            <BillingList
              bills={filteredBills}
              loading={isLoadingFacturas}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            {/* Mensaje cuando no hay facturas */}
            {filteredBills.length === 0 && !isLoadingFacturas && (
              <div style={{ textAlign: 'center', marginTop: 24 }}>
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
              </div>
            )}
          </Card>
        </div>
        {/* Card lateral para crear/editar */}
        {sideCardVisible && (
          <div style={{ flex: 0.4, minWidth: 380, maxWidth: 520 }}>
            <Card
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <DollarOutlined style={{ color: '#52c41a' }} />
                  <span>{editingBill ? 'Editar Factura' : 'Nueva Factura'}</span>
                </div>
              }
              extra={
                <Button onClick={handleDetailsClose}>
                  Cerrar
                </Button>
              }
            >
              <BillingForm
                initialValues={editingBill || undefined}
                onSubmit={handleFormSubmit}
                loading={createFactura.isPending || updateFactura.isPending}
              />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}; 