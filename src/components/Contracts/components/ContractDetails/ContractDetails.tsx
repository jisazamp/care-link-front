import { Avatar, Button, Card, Col, Flex, Row, Table, Typography, Spin, Alert, Space, Tooltip, Input, Select, Tag } from "antd";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { useGetContractById } from "../../../../hooks/useGetContractById/useGetContractById";
import { useGetUserById } from "../../../../hooks/useGetUserById/useGetUserById";
import { useGetFacturas } from "../../../../hooks/useGetFacturas";
import { BillingForm } from "../../../Billing";
import { Modal } from "antd";
import { useState, useEffect } from "react";
import { useCreateFactura } from "../../../../hooks/useCreateFactura";
import { useUpdateFactura } from "../../../../hooks/useUpdateFactura";
import type { Bill } from "../../../../types";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

// Componente BillingList personalizado para contratos (solo botón Ver)
interface ContractBillingListProps {
  bills: Bill[];
  loading?: boolean;
  onView?: (bill: Bill) => void;
}

const ContractBillingList: React.FC<ContractBillingListProps> = ({
  bills,
  loading,
  onView,
}) => {
  const [search, setSearch] = useState("");
  const [estado, setEstado] = useState<string | undefined>(undefined);

  const filteredBills = bills.filter((bill) => {
    const matchSearch = bill.numero_factura?.toLowerCase().includes(search.toLowerCase()) || String(bill.id_factura).includes(search);
    const matchEstado = estado ? bill.estado_factura === estado : true;
    return matchSearch && matchEstado;
  });

  const columns = [
    {
      title: "# Factura",
      dataIndex: "numero_factura",
      key: "numero_factura",
      render: (text: string) => text || "-",
    },
    {
      title: "Fecha Emisión",
      dataIndex: "fecha_emision",
      key: "fecha_emision",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Fecha Vencimiento",
      dataIndex: "fecha_vencimiento",
      key: "fecha_vencimiento",
      render: (date: string) => date ? dayjs(date).format("DD/MM/YYYY") : "-",
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      key: "subtotal",
      render: (v: number) => `$ ${v?.toLocaleString()}`,
    },
    {
      title: "Impuestos",
      dataIndex: "impuestos",
      key: "impuestos",
      render: (v: number) => `$ ${v?.toLocaleString()}`,
    },
    {
      title: "Descuentos",
      dataIndex: "descuentos",
      key: "descuentos",
      render: (v: number) => `$ ${v?.toLocaleString()}`,
    },
    {
      title: "Total",
      dataIndex: "total_factura",
      key: "total_factura",
      render: (v: number) => `$ ${v?.toLocaleString()}`,
    },
    {
      title: "Estado",
      dataIndex: "estado_factura",
      key: "estado_factura",
      render: (estado: string) => <Tag color={getEstadoColor(estado)} style={{ fontWeight: 'bold', fontSize: 14 }}>{estado}</Tag>,
    },
    {
      title: "Observaciones",
      dataIndex: "observaciones",
      key: "observaciones",
      render: (text: string) => text || "-",
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: Bill) => (
        <Space>
          <Tooltip title="Ver Detalles">
            <Button type="link" onClick={() => onView && onView(record)}>Ver</Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  function getEstadoColor(estado: string) {
    switch (estado) {
      case "PENDIENTE": return "orange";
      case "PAGADA": return "green";
      case "VENCIDA": return "red";
      case "CANCELADA": return "volcano";
      case "ANULADA": return "gray";
      default: return "blue";
    }
  }

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Buscar por número de factura o ID"
          allowClear
          onSearch={setSearch}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 220 }}
        />
        <Select
          placeholder="Filtrar por estado"
          allowClear
          style={{ width: 180 }}
          value={estado}
          onChange={setEstado}
        >
          <Option value="PENDIENTE">Pendiente</Option>
          <Option value="PAGADA">Pagada</Option>
          <Option value="VENCIDA">Vencida</Option>
          <Option value="CANCELADA">Cancelada</Option>
          <Option value="ANULADA">Anulada</Option>
        </Select>
      </Space>
      <Table
        columns={columns}
        dataSource={filteredBills}
        loading={loading}
        rowKey="id_factura"
        pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: [5, 10, 20, 50] }}
        locale={{ emptyText: "No hay facturas registradas" }}
      />
    </>
  );
};

export const ContractDetails: React.FC = () => {
  const { id, contractId } = useParams();

  const { data: user, isLoading: isLoadingUser, error: errorUser } = useGetUserById(id);
  const { data: contract, isLoading: isLoadingContract, error: errorContract } =
    useGetContractById(contractId);
  const { data: facturas, isLoading: isLoadingFacturas, error: errorFacturas } = useGetFacturas(contractId ? Number(contractId) : undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFactura, setEditingFactura] = useState<any>(null);
  const [modalReadOnly, setModalReadOnly] = useState(false);
  const createFactura = useCreateFactura();
  const updateFactura = useUpdateFactura();

  // Logs para debugging
  useEffect(() => {
    console.log("🔍 ContractDetails Component - Debug Info:");
    console.log("👤 User ID:", id);
    console.log("📋 Contract ID:", contractId);
    console.log("👤 User Data:", user);
    console.log("📋 Contract Data:", contract);
    console.log("📊 Facturas:", facturas);
    console.log("⏳ Loading User:", isLoadingUser);
    console.log("⏳ Loading Contract:", isLoadingContract);
    console.log("⏳ Loading Facturas:", isLoadingFacturas);
    console.log("❌ Error User:", errorUser);
    console.log("❌ Error Contract:", errorContract);
    console.log("❌ Error Facturas:", errorFacturas);
  }, [id, contractId, user, contract, facturas, isLoadingUser, isLoadingContract, isLoadingFacturas, errorUser, errorContract, errorFacturas]);

  const contractData = {
    contratoId: contract?.data?.id_contrato,
    tipoContrato: contract?.data?.tipo_contrato,
    fechaInicio: contract?.data?.fecha_inicio,
    fechaFin: contract?.data?.fecha_fin,
    facturado: contract?.data?.facturar_contrato ? "Sí" : "No",
  };

  const servicesData = contract?.data?.servicios?.map((s: any) => ({
    key: s.id_servicio,
    inicia: s.fecha,
    finaliza: dayjs(s.fecha).add(1, "month").format("YYYY-MM-DD"),
    servicio: s.id_servicio === 1 ? "Transporte" : "Cuidado",
    cantidad: s.fechas_servicio?.length || 0,
    descripcion: s.descripcion,
  })) || [];

  // Handler para ver factura (solo lectura)
  const handleView = (bill: any) => {
    setEditingFactura(bill);
    setModalReadOnly(true);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setEditingFactura(null);
    setModalReadOnly(false);
  };

  // Mostrar loading mientras se cargan los datos
  if (isLoadingUser || isLoadingContract || isLoadingFacturas) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Typography.Text>Cargando detalles del contrato...</Typography.Text>
        </div>
      </div>
    );
  }

  // Mostrar errores si hay problemas
  if (errorUser || errorContract || errorFacturas) {
    return (
      <div style={{ padding: "24px" }}>
        <Alert
          message="Error al cargar los datos"
          description={
            <div>
              {errorUser && <div>Error al cargar usuario: {errorUser.message}</div>}
              {errorContract && <div>Error al cargar contrato: {errorContract.message}</div>}
              {errorFacturas && <div>Error al cargar facturas: {errorFacturas.message}</div>}
            </div>
          }
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          }
        />
      </div>
    );
  }

  // Verificar que tenemos los datos necesarios
  if (!user?.data?.data || !contract?.data) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <Typography.Title level={4} type="secondary">
          No se encontraron datos
        </Typography.Title>
        <Typography.Text type="secondary">
          El usuario o contrato especificado no existe.
        </Typography.Text>
      </div>
    );
  }

  return (
    <div className="contract-details-container">
      <Card
        title="Datos básicos y de localización"
        style={{ marginTop: 3 }}
        loading={isLoadingUser}
      >
        <Row gutter={24} align="middle">
          {user?.data.data.url_imagen && (
            <Col lg={4}>
              <Avatar
                src={user.data.data.url_imagen}
                size={120}
                alt="Avatar del paciente"
                style={{ border: "1px solid #ddd" }}
              />
            </Col>
          )}
          <Col lg={10}>
            <Flex vertical gap={10}>
              <Typography.Text style={{ textTransform: "uppercase" }}>
                {`${user?.data.data.nombres} ${user?.data.data.apellidos}`}
              </Typography.Text>
              <Flex gap={4}>
                <Typography.Text style={{ fontWeight: "bold" }}>
                  {`${user?.data.data.n_documento}`}
                </Typography.Text>
                <Typography.Text>-</Typography.Text>
                <Typography.Text>{user?.data.data.genero}</Typography.Text>
                <Typography.Text>-</Typography.Text>
                <Typography.Text>
                  {dayjs(user?.data.data.fecha_nacimiento).format("DD-MM-YYYY")}
                </Typography.Text>
                <Typography.Text>-</Typography.Text>
                <Typography.Text style={{ fontWeight: "bold" }}>
                  {dayjs().diff(
                    dayjs(user?.data.data.fecha_nacimiento),
                    "years",
                  )}{" "}
                  años
                </Typography.Text>
              </Flex>
              <Typography.Text>{user?.data.data.estado_civil}</Typography.Text>
            </Flex>
          </Col>
          <Col lg={10}>
            <Flex vertical gap={10}>
              <Typography.Text>{user?.data.data.direccion}</Typography.Text>
              <Flex gap={4}>
                <Typography.Text>{user?.data.data.telefono}</Typography.Text>
                <Typography.Text>-</Typography.Text>
                <Typography.Text>{user?.data.data.email}</Typography.Text>
              </Flex>
            </Flex>
          </Col>
        </Row>
      </Card>

      <Card
        className="full-width-card contract-card"
        loading={isLoadingContract}
      >
        <div className="contract-header" style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
          <div className="title-wrapper">
            <Title level={5} className="contract-title" style={{ marginBottom: 0 }}>
              Contrato <span style={{ color: '#722ED1', fontWeight: 700 }}>#{contractData.contratoId}</span>
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              Tipo: <b>{contractData.tipoContrato}</b> | Estado: <b>{contractData.facturado}</b>
            </Text>
          </div>
        </div>
        <div className="contract-body" style={{ marginTop: 16 }}>
          <div className="contract-row" style={{ display: 'flex', gap: 32 }}>
            <div className="contract-field">
              <Text className="field-title">Fecha de inicio</Text>
              <Text className="field-value">{contractData.fechaInicio}</Text>
            </div>
            <div className="contract-field">
              <Text className="field-title">Fecha de finalización</Text>
              <Text className="field-value">{contractData.fechaFin}</Text>
            </div>
          </div>
        </div>
      </Card>

      <Card className="full-width-card services-card">
        <div className="services-header">
          <Title level={5} className="services-title">
            Servicios
          </Title>
        </div>
        <div className="services-body">
          <Text className="table-subtitle">
            Servicios o productos incluidos
          </Text>
          {servicesData && servicesData.length > 0 ? (
            <Table
              columns={[
                { title: "Inicia el", dataIndex: "inicia" },
                { title: "Finaliza el", dataIndex: "finaliza" },
                { title: "Servicio", dataIndex: "servicio" },
                { title: "Cantidad Disponible", dataIndex: "cantidad" },
                { title: "Descripción", dataIndex: "descripcion" },
              ]}
              dataSource={servicesData}
              pagination={false}
              rowKey="key"
            />
          ) : (
            <div style={{ textAlign: 'center', margin: '24px 0', color: '#888' }}>
              No hay servicios registrados para este contrato.
            </div>
          )}
        </div>
      </Card>

      {/* Tarjeta 4: Facturación */}
      <Card className="full-width-card billing-card">
        <div className="billing-header">
          <Title level={5} className="billing-title" style={{ color: 'white' }}>
            Facturas Generadas
          </Title>
        </div>
        <ContractBillingList
          bills={facturas || []}
          loading={isLoadingFacturas}
          onView={handleView}
        />
        {(!facturas || facturas.length === 0) && !isLoadingFacturas && (
          <div style={{ textAlign: 'center', margin: '24px 0', color: '#888' }}>
            No hay facturas registradas para este contrato.
          </div>
        )}
        <Modal
          open={modalVisible}
          onCancel={handleModalClose}
          footer={null}
          width={900}
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>{editingFactura ? (modalReadOnly ? 'Ver Factura' : 'Editar Factura') : 'Nueva Factura'}</span>
            </div>
          }
          destroyOnClose
        >
          <BillingForm
            initialValues={editingFactura}
            onSubmit={(values) => {
              if (editingFactura) {
                updateFactura.mutate({ id: editingFactura.id_factura, data: values }, {
                  onSuccess: () => handleModalClose(),
                });
              } else {
                createFactura.mutate(values, {
                  onSuccess: () => handleModalClose(),
                });
              }
            }}
            loading={createFactura.isPending || updateFactura.isPending}
            readOnly={modalReadOnly}
          />
        </Modal>
      </Card>
    </div>
  );
};
