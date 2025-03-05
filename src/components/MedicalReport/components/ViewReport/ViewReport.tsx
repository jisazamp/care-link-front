import {
  Card,
  Descriptions,
  Button,
  Table,
  Checkbox,
  Avatar,
  Typography,
  Flex,
} from "antd";
import dayjs from "dayjs";
import patientImage from "../../../assets/Patients/patient1.jpg";
import { useGetUserById } from "../../../../hooks/useGetUserById/useGetUserById";
import { useGetUserMedicalRecord } from "../../../../hooks/useGetUserMedicalRecord/useGetUserMedicalRecord";
import { useParams } from "react-router-dom";
import { useGetMedicalReport } from "../../../../hooks/useGetMedicalReport/useGetMedicalReport";
import { useGetClinicalEvolutions } from "../../../../hooks/useGetClinicalEvolutions/useGetClinicalEvolutions";

const { Title } = Typography;

export const ViewReport: React.FC = () => {
  const { id, reportId } = useParams();

  const userQuery = useGetUserById(id);
  const recordQuery = useGetUserMedicalRecord(id);
  const reportQuery = useGetMedicalReport(reportId);
  const evolutionsQuery = useGetClinicalEvolutions(reportId);
  const user = userQuery.data?.data.data;
  const record = recordQuery.data?.data.data;
  const report = reportQuery.data?.data.data;
  const evolutions = evolutionsQuery.data?.data.data;
  console.log(evolutions);

  return (
    <Flex
      vertical
      style={{
        flex: 1,
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Card
        title="Datos del Paciente"
        style={{ width: "100%", marginBottom: 20 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Avatar src={patientImage} size={100} />
          <div style={{ flex: 1 }}>
            <Title level={4}>
              {user?.nombres} {user?.apellidos}
            </Title>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Documento">
                {user?.n_documento}
              </Descriptions.Item>
              <Descriptions.Item label="Edad">
                {dayjs().diff(dayjs(user?.fecha_nacimiento), "years")} años
              </Descriptions.Item>
              <Descriptions.Item label="Género">
                {user?.genero}
              </Descriptions.Item>
              <Descriptions.Item label="Dirección">
                {user?.direccion}
              </Descriptions.Item>
              <Descriptions.Item label="Teléfono">
                {user?.telefono}
              </Descriptions.Item>
              <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
              <Descriptions.Item label="Tipo de Sangre">
                {record?.tipo_sangre}
              </Descriptions.Item>
              <Descriptions.Item label="Estado Civil">
                {user?.estado_civil}
              </Descriptions.Item>
              <Descriptions.Item label="EPS">{record?.eps}</Descriptions.Item>
              <Descriptions.Item label="N° Afiliación">
                {record?.telefono_emermedica}
              </Descriptions.Item>
              <Descriptions.Item label="Fecha de Ingreso">
                {dayjs(user?.fecha_registro).format("DD-MM-YYYY")}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>
      </Card>
      <Card
        title="Detalles del Reporte Clínico"
        style={{ width: "100%", marginBottom: 20 }}
      >
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Tipo de Reporte">
            {report?.tipo_reporte}
          </Descriptions.Item>
          <Descriptions.Item label="Motivo de Consulta">
            {report?.motivo_consulta}
          </Descriptions.Item>
          <Descriptions.Item label="Diagnóstico">
            {report?.diagnostico}
          </Descriptions.Item>
          <Descriptions.Item label="Observaciones">
            {report?.observaciones}
          </Descriptions.Item>
          <Descriptions.Item label="Remisión">
            {report?.remision}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="Reportes de Evolución Clínica" style={{ width: "100%" }}>
        <Table
          rowKey="id_TipoReporte"
          columns={[
            {
              title: "Profesional",
              dataIndex: "profesional",
              render: (_, record) =>
                `${record.profesional.nombres} ${record.profesional.apellidos}`,
            },
            { title: "Tipo Reporte", dataIndex: "tipo_report" },
            {
              title: "Fecha",
              dataIndex: "fecha_evolucion",
              render: (_, record) =>
                dayjs(record.fecha_evolucion).format("DD-MM-YYYY"),
            },
          ]}
          dataSource={evolutions}
          pagination={false}
          locale={{ emptyText: "No hay reportes clínicos registrados" }}
        />
      </Card>
    </Flex>
  );
};
