import React from "react";
import { Card, Avatar, Table, Button, Typography } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export const ContractDetails: React.FC = () => {
  // Datos simulados del contrato y paciente
  const patientData = {
    nombre: "Juan Antonio Lopez Orrego",
    documento: "44567890",
    genero: "Masculino",
    fechaNacimiento: "1956/11/08",
    edad: 68,
    estadoCivil: "Casado",
    ocupacion: "Pensionado",
    direccion: "CLL 45 - 60-20 INT 101",
    telefono: "315 6789 6789",
    email: "juanantonio@gmail.com",
  };

  const contractData = {
    contratoId: "2024001",
    realizadoPor: "SARA MANUELA GONZALEZ",
    tipoContrato: "Recurrente",
    fechaInicio: "2024-11-08",
    fechaFin: "2024-12-08",
    facturado: "Sí",
    vigente: "Sí",
  };

  const servicesData = [
    {
      key: "1",
      inicia: "10/11/2024",
      finaliza: "10/12/2024",
      servicio: "Tiquetera 15",
      cantidad: 15,
      descripcion: "Ingreso a sede en pasa día",
    },
    {
      key: "2",
      inicia: "10/11/2024",
      finaliza: "10/12/2024",
      servicio: "Transporte",
      cantidad: 15,
      descripcion: "Transporte ambos trayectos",
    },
  ];

  const billingData = [
    {
      key: "1",
      fechaEmision: "10/11/2024",
      facturaId: "2024001",
      contrato: "15222",
      total: "$150.000",
    },
    {
      key: "2",
      fechaEmision: "10/11/2024",
      facturaId: "2024002",
      contrato: "15222",
      total: "$150.000",
    },
  ];

  return (
    <div className="contract-details-container">
      {/* Tarjeta 1: Información del Paciente */}
      <Card className="full-width-card patient-info-card">
        <div className="patient-info-container">
          <Avatar
            src="https://via.placeholder.com/80"
            size={80}
            className="patient-avatar"
          />

          <div className="patient-details">
            <Title level={4} className="patient-name">
              {patientData.nombre}
            </Title>
            <Typography.Text className="patient-data">
              <strong>{patientData.documento}</strong> - {patientData.genero} -{" "}
              {patientData.fechaNacimiento} - {patientData.edad} años
            </Typography.Text>
            <Typography.Text className="patient-data">
              {patientData.estadoCivil} - {patientData.ocupacion}
            </Typography.Text>
          </div>

          <div className="patient-contact">
            <Typography.Text strong>{patientData.direccion}</Typography.Text>
            <Typography.Text>
              {patientData.telefono} - {patientData.email}
            </Typography.Text>
          </div>
        </div>
      </Card>

      {/* Tarjeta 2: Detalles del contrato */}
      <Card className="full-width-card contract-card">
        {/* 🔹 HEAD de la Tarjeta */}
        <div className="contract-header">
          <div className="title-wrapper">
            <Title level={5} className="contract-title">
              Contrato {contractData.contratoId} - Realizado por:{" "}
              {contractData.realizadoPor}
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

        {/* 🔹 BODY de la Tarjeta */}
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
              <div className="status-edit">
                <Text>
                  <strong>Vigente:</strong> {contractData.vigente}
                </Text>
                <Button type="link" className="edit-link">
                  Editar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tarjeta 3: Servicios */}
      <Card className="full-width-card services-card">
        {/* 🔹 HEAD de la Tarjeta */}
        <div className="services-header">
          <Title level={5} className="services-title">
            Servicios
          </Title>
          <Button type="default" className="add-button">
            <PlusCircleOutlined /> Agregar
          </Button>
        </div>

        {/* 🔹 CUERPO de la Tarjeta */}
        <div className="services-body">
          {/* Subtítulo de la tabla */}
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
                title: "Acciones",
                render: () => (
                  <>
                    <Button type="link" className="delete-link">
                      Eliminar
                    </Button>
                  </>
                ),
              },
            ]}
            dataSource={servicesData}
            pagination={false}
          />
        </div>
      </Card>

      {/* Tarjeta 4: Facturación */}
      <Card className="full-width-card billing-card">
        {/* HEAD de la Tarjeta */}
        <div className="billing-header">
          <Title level={5} className="billing-title">
            Facturas Generadas
          </Title>
          <Button
            className="main-button billing-add-button"
            icon={<PlusCircleOutlined />}
          >
            Nueva Factura
          </Button>
        </div>

        {/* BODY de la Tarjeta */}
        <Table
          columns={[
            { title: "Fecha de emisión", dataIndex: "fechaEmision" },
            { title: "N° Factura", dataIndex: "facturaId" },
            { title: "Contrato", dataIndex: "contrato" },
            { title: "Total", dataIndex: "total" },
            {
              title: "Acciones",
              render: () => (
                <>
                  <Button type="link" className="main-button-link">
                    Editar
                  </Button>
                  <Button type="link">Eliminar</Button>
                </>
              ),
            },
          ]}
          dataSource={billingData}
          pagination={false}
        />
      </Card>
    </div>
  );
};
