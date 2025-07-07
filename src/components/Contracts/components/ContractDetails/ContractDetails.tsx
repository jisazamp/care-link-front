import { PlusCircleOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Col, Flex, Row, Table, Typography } from "antd";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { useGetContractById } from "../../../../hooks/useGetContractById/useGetContractById";
import { useGetUserById } from "../../../../hooks/useGetUserById/useGetUserById";
import { useGetFacturas } from "../../../../hooks/useGetFacturas";
import { BillingList, BillingForm } from "../../../Billing";
import { Modal } from "antd";
import { useState } from "react";
import { useCreateFactura } from "../../../../hooks/useCreateFactura";
import { useUpdateFactura } from "../../../../hooks/useUpdateFactura";

const { Title, Text } = Typography;

export const ContractDetails: React.FC = () => {
  const { id, contractId } = useParams();

  const { data: user, isLoading: isLoadingUser } = useGetUserById(id);
  const { data: contract, isLoading: isLoadingContract } =
    useGetContractById(contractId);
  const { data: facturas, isLoading: isLoadingFacturas } = useGetFacturas(contractId ? Number(contractId) : undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFactura, setEditingFactura] = useState<any>(null);
  const createFactura = useCreateFactura();
  const updateFactura = useUpdateFactura();

  const contractData = {
    contratoId: contract?.data.id_contrato,
    tipoContrato: contract?.data.tipo_contrato,
    fechaInicio: contract?.data.fecha_inicio,
    fechaFin: contract?.data.fecha_fin,
    facturado: contract?.data.facturar_contrato ? "Sí" : "No",
  };

  const servicesData = contract?.data.servicios.map((s) => ({
    key: s.id_servicio,
    inicia: s.fecha,
    finaliza: dayjs(s.fecha).add(1, "month").format("YYYY-MM-DD"),
    servicio: s.id_servicio === 1 ? "Transporte" : "Cuidado",
    cantidad: s.fechas_servicio.length,
    descripcion: s.descripcion,
  }));

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
        <div className="contract-header">
          <div className="title-wrapper">
            <Title level={5} className="contract-title">
              Contrato #{contractData.contratoId}
            </Title>
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

        <div className="contract-body">
          <div className="contract-field">
            <Text className="field-title">Tipo de Contrato</Text>
            <Text className="field-value">{contractData.tipoContrato}</Text>
          </div>

          <div className="contract-row">
            <div className="contract-field">
              <Text className="field-title">Fecha de inicio</Text>
              <Text className="field-value">{contractData.fechaInicio}</Text>
            </div>

            <div className="contract-field">
              <Text className="field-title">Fecha de finalización</Text>
              <Text className="field-value">{contractData.fechaFin}</Text>
            </div>
          </div>

          <div className="contract-field">
            <Text className="field-title">Estado del contrato</Text>
            <div className="contract-status">
              <Text>
                <strong>Facturado:</strong> {contractData.facturado}
              </Text>
            </div>
          </div>
        </div>
      </Card>

      <Card className="full-width-card services-card">
        <div className="services-header">
          <Title level={5} className="services-title">
            Servicios
          </Title>
          {/*<Button type="default" className="add-button">
            <PlusCircleOutlined /> Agregar
          </Button>*/}
        </div>

        <div className="services-body">
          <Text className="table-subtitle">
            Servicios o productos incluidos
          </Text>
          <Table
            columns={[
              { title: "Inicia el", dataIndex: "inicia" },
              { title: "Finaliza el", dataIndex: "finaliza" },
              { title: "Servicio", dataIndex: "servicio" },
              { title: "Cantidad Disponible", dataIndex: "cantidad" },
              { title: "Descripción", dataIndex: "descripcion" },
              {
                /*
                title: "Acciones",
                render: () => (
                  <>
                    <Button type="link" className="delete-link">
                      Eliminar
                    </Button>
                  </>
                ),
              */
              },
            ]}
            dataSource={servicesData}
            pagination={false}
          />
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
          facturas={facturas?.data?.data || []}
          loading={isLoadingFacturas}
          onView={(id) => {
            setEditingFactura(facturas?.data?.data.find((f: any) => f.id_factura === id));
            setModalVisible(true);
          }}
          onDelete={() => {}}
        />
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
