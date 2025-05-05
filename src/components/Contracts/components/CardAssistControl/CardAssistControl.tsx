import { Button, Card, Checkbox, Table, Typography } from "antd";

const { Title } = Typography;

const columnsAttendance = [
  {
    title: <Checkbox />,
    dataIndex: "checkbox",
    key: "checkbox",
    render: () => <Checkbox />,
  },
  { title: "Usuario", dataIndex: "user", key: "user" },
  { title: "Tipo de servicio", dataIndex: "serviceType", key: "serviceType" },
  {
    title: "Estado",
    dataIndex: "status",
    key: "status",
    render: (text: string, record: { statusColor: string }) => (
      <div>
        <span
          style={{
            backgroundColor: record.statusColor,
            borderRadius: "50%",
            display: "inline-block",
            width: 10,
            height: 10,
            marginRight: 8,
          }}
        />
        {text}
      </div>
    ),
  },
  {
    title: "Acciones",
    key: "actions",
    render: () => (
      <span>
        <Button type="link">Ver</Button> |{" "}
        <Button type="link">Marcar asistencia</Button>
      </span>
    ),
  },
];

const attendanceData = [
  {
    key: "1",
    user: "Sara Manuela Gómez",
    serviceType: "Centro día",
    status: "Asistió",
    statusColor: "green",
  },
  {
    key: "2",
    user: "Juan Pablo Ruiz",
    serviceType: "Centro día",
    status: "Pendiente",
    statusColor: "gray",
  },
];

export const CardAsistControl = () => (
  <Card
    title={<Title level={5}>Control de asistencia del día</Title>}
    extra={<Button type="primary">Agregar</Button>}
  >
    <Table
      dataSource={attendanceData}
      columns={columnsAttendance}
      pagination={false}
    />
  </Card>
);
