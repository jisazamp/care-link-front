import { PlusCircleOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Col, Flex, Row, Table, Typography, Spin, Alert } from "antd";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { useGetContractById } from "../../../../hooks/useGetContractById/useGetContractById";
import { useGetUserById } from "../../../../hooks/useGetUserById/useGetUserById";
import { useGetFacturas } from "../../../../hooks/useGetFacturas";
import { BillingList, BillingForm } from "../../../Billing";
import { Modal } from "antd";
import { useState, useEffect } from "react";
import { useCreateFactura } from "../../../../hooks/useCreateFactura";
import { useUpdateFactura } from "../../../../hooks/useUpdateFactura";

const { Title, Text } = Typography;

export const ContractDetails: React.FC = () => {
  const { id, contractId } = useParams();

  const { data: user, isLoading: isLoadingUser, error: errorUser } = useGetUserById(id);
  const { data: contract, isLoading: isLoadingContract, error: errorContract } =
    useGetContractById(contractId);
  const { data: facturas, isLoading: isLoadingFacturas, error: errorFacturas } = useGetFacturas(contractId ? Number(contractId) : undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFactura, setEditingFactura] = useState<any>(null);
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
        <div className="contract-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="title-wrapper">
            <Title level={5} className="contract-title" style={{ marginBottom: 0 }}>
              Contrato <span style={{ color: '#722ED1', fontWeight: 700 }}>#{contractData.contratoId}</span>
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              Tipo: <b>{contractData.tipoContrato}</b> | Estado: <b>{contractData.facturado}</b>
            </Text>
          </div>
          <div className="contract-actions">
            <Button type="default" className="edit-button">
              Editar
            </Button>
            <Button type="text" danger className="delete-button">
              Eliminar
            </Button>
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
          <Title level={5} className="billing-title">
            Facturas Generadas
          </Title>
          <Button
            className="main-button billing-add-button"
            icon={<PlusCircleOutlined />}
            onClick={() => {
              setEditingFactura({ id_contrato: contractData.contratoId });
              setModalVisible(true);
            }}
          >
            Nueva Factura
          </Button>
        </div>
        <BillingList
          bills={facturas || []}
          loading={isLoadingFacturas}
          onView={(bill) => {
            setEditingFactura(bill);
            setModalVisible(true);
          }}
          onDelete={() => {}}
        />
        {(!facturas || facturas.length === 0) && !isLoadingFacturas && (
          <div style={{ textAlign: 'center', margin: '24px 0', color: '#888' }}>
            No hay facturas registradas para este contrato.
          </div>
        )}
        <Modal
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          title={editingFactura ? "Editar Factura" : "Nueva Factura"}
        >
          <BillingForm
            initialValues={editingFactura}
            onSubmit={(values) => {
              if (editingFactura) {
                updateFactura.mutate({ id: editingFactura.id_factura, data: values }, {
                  onSuccess: () => setModalVisible(false),
                });
              } else {
                createFactura.mutate(values, {
                  onSuccess: () => setModalVisible(false),
                });
              }
            }}
            loading={createFactura.isPending || updateFactura.isPending}
          />
        </Modal>
      </Card>
    </div>
  );
};
