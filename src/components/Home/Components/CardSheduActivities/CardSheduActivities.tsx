import { Button, Card, Table, Typography } from "antd";

const { Title } = Typography;

const columnsActivities = [
  { title: "Actividad", dataIndex: "activity", key: "activity" },
  { title: "Fecha", dataIndex: "date", key: "date" },
  {
    title: "Acciones",
    key: "actions",
    render: () => (
      <span>
        <Button type="link">Editar</Button> | <Button type="link">Ver</Button>
      </span>
    ),
  },
];

const activitiesData = [
  { key: "1", activity: "Ping Pong", date: "Dentro de 7 días" },
  { key: "2", activity: "Yoga", date: "Dentro de 7 días" },
  { key: "3", activity: "Arte", date: "Dentro de 7 días" },
];

export const CardSheduActivities = () => (
  <Card
    title={<Title level={5}>Actividades programadas</Title>}
    style={{ flex: 1 }}
  >
    <Table
      dataSource={activitiesData}
      columns={columnsActivities}
      pagination={{ pageSize: 5 }}
    />
  </Card>
);
