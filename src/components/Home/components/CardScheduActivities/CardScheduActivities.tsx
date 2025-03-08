import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Activity } from "../../../../types";
import { Button, Card, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { useGetUpcomingActivities } from "../../../../hooks/useGetUpcomingActivities/useGetUpcomingActivities";

dayjs.extend(relativeTime);

const { Title } = Typography;

export const CardSheduActivities = () => {
  const { data: activities } = useGetUpcomingActivities();

  const columnsActivities: ColumnsType<Activity> = [
    { title: "Actividad", dataIndex: "nombre", key: "activity" },
    {
      title: "Fecha",
      dataIndex: "fecha",
      key: "date",
      render: (_, record) =>
        dayjs(record.fecha).from(dayjs()),
    },
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

  return (
    <Card
      title={<Title level={5}>Actividades programadas</Title>}
      style={{ flex: 1 }}
    >
      <Table
        rowKey="id"
        dataSource={activities?.data.data}
        columns={columnsActivities}
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};
