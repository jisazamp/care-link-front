import React, { useState } from "react";
import { Card, Descriptions, Button, Table, Checkbox, Avatar, Typography } from "antd";
import patientImage from "../../../assets/Patients/patient1.jpg"; // Asegúrate de que el archivo existe

const { Title } = Typography;

interface ReportData {
  paciente: string;
  edad: number;
  genero: string;
  documento: string;
  direccion: string;
  telefono: string;
  email: string;
  tipoSangre: string;
  estadoCivil: string;
  eps: string;
  numeroAfiliacion: string;
  condiciones: string;
  fechaIngreso: string;
  tipoReporte: string;
  motivoConsulta: string;
  exploracionFisica: string;
  diagnostico: string;
  observaciones: string;
  remision: string;
  tratamiento: string;
  reportesPrevios: {
    profesional: string;
    tipoReporte: string;
    fecha: string;
    registro: boolean;
  }[];
}

// 📌 Datos Simulados para evitar que la pantalla muestre "Cargando datos..."
const dummyData: ReportData = {
  paciente: "Juan Antonio López Orrego",
  edad: 68,
  genero: "Masculino",
  documento: "44567890",
  direccion: "CLL 45 - 60-20 INT 101",
  telefono: "315 6789 6789",
  email: "juanantonio@gmail.com",
  tipoSangre: "O+",
  estadoCivil: "Casado",
  eps: "Sura",
  numeroAfiliacion: "123456789",
  condiciones: "Hipertensión",
  fechaIngreso: "2023-01-15",
  tipoReporte: "Enfermería",
  motivoConsulta: "Se cayó en la mañana mientras se bañaba",
  exploracionFisica: "Presión arterial: 110 mmHg, Pulso: 80 lpm",
  diagnostico: "Herida en rodilla izquierda",
  observaciones: "Ninguna",
  remision: "Ortopedia",
  tratamiento: "Aplicar antiséptico y cubrir con apósito estéril",
  reportesPrevios: [
    {
      profesional: "Dra. Manuela González",
      tipoReporte: "Fisioterapia",
      fecha: "2024-01-10",
      registro: true,
    },
    {
      profesional: "Dr. Pablo Ruiz",
      tipoReporte: "Ortopedia",
      fecha: "2024-01-12",
      registro: false,
    },
  ],
};

export const ViewReport: React.FC = () => {
  // Estado con los datos simulados
  const [reportData] = useState<ReportData>(dummyData);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: "100vh", padding: "20px" }}>
      
      {/* Tarjeta 1: Información básica del paciente */}
      <Card title="Datos del Paciente" style={{ width: "100%", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Avatar src={patientImage} size={100} />
          <div style={{ flex: 1 }}>
            <Title level={4}>{reportData.paciente}</Title>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Documento">{reportData.documento}</Descriptions.Item>
              <Descriptions.Item label="Edad">{reportData.edad} años</Descriptions.Item>
              <Descriptions.Item label="Género">{reportData.genero}</Descriptions.Item>
              <Descriptions.Item label="Dirección">{reportData.direccion}</Descriptions.Item>
              <Descriptions.Item label="Teléfono">{reportData.telefono}</Descriptions.Item>
              <Descriptions.Item label="Email">{reportData.email}</Descriptions.Item>
              <Descriptions.Item label="Tipo de Sangre">{reportData.tipoSangre}</Descriptions.Item>
              <Descriptions.Item label="Estado Civil">{reportData.estadoCivil}</Descriptions.Item>
              <Descriptions.Item label="EPS">{reportData.eps}</Descriptions.Item>
              <Descriptions.Item label="N° Afiliación">{reportData.numeroAfiliacion}</Descriptions.Item>
              <Descriptions.Item label="Condiciones Médicas">{reportData.condiciones}</Descriptions.Item>
              <Descriptions.Item label="Fecha de Ingreso">{reportData.fechaIngreso}</Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </Card>

      {/* Tarjeta 2: Detalles del Reporte */}
      <Card title="Detalles del Reporte Clínico" style={{ width: "100%", marginBottom: 20 }}>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Tipo de Reporte">{reportData.tipoReporte}</Descriptions.Item>
          <Descriptions.Item label="Motivo de Consulta">{reportData.motivoConsulta}</Descriptions.Item>
          <Descriptions.Item label="Exploración Física">{reportData.exploracionFisica}</Descriptions.Item>
          <Descriptions.Item label="Diagnóstico">{reportData.diagnostico}</Descriptions.Item>
          <Descriptions.Item label="Observaciones">{reportData.observaciones}</Descriptions.Item>
          <Descriptions.Item label="Remisión">{reportData.remision}</Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Tarjeta 3: Tratamiento y Recomendaciones */}
      <Card title="Tratamiento y Recomendaciones" style={{ width: "100%", marginBottom: 20 }}>
        <p>{reportData.tratamiento}</p>
      </Card>

      {/* Tarjeta 4: Tabla de Reportes Clínicos */}
      <Card title="Reportes de Evolución Clínica" style={{ width: "100%" }}>
        <Table
          columns={[
            { title: <Checkbox />, dataIndex: "checkbox", render: () => <Checkbox /> },
            { title: "Profesional", dataIndex: "profesional" },
            { title: "Tipo Reporte", dataIndex: "tipoReporte" },
            { title: "Fecha", dataIndex: "fecha" },
            { title: "Registro de Tratamientos", dataIndex: "registro", render: (text) => (text ? "Sí | Ver" : "No") },
            {
              title: "Acciones",
              render: () => (
                <>
                  <Button type="link">Editar</Button>
                  <Button type="link" danger>
                    Eliminar
                  </Button>
                </>
              ),
            },
          ]}
          dataSource={reportData.reportesPrevios}
          pagination={false}
          locale={{ emptyText: "No hay reportes clínicos registrados" }}
        />
      </Card>
    </div>
  );
};
