import { Button, Card, Table, Typography, Spin, Empty } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigate } from "react-router-dom";
import { useGetUpcomingActivities } from "../../../../hooks/useGetUpcomingActivities/useGetUpcomingActivities";
import type { Activity } from "../../../../types";

dayjs.extend(relativeTime);

const { Title, Text } = Typography;

export const CardSheduActivities = () => {
  const { data: activities, isLoading, error } = useGetUpcomingActivities();
  const navigate = useNavigate();

  const handleEditActivity = (activityId: number) => {
    navigate(`/actividades/${activityId}/editar`);
  };

  const handleViewActivity = (activityId: number) => {
    navigate(`/actividades/${activityId}/editar`);
  };

  const columnsActivities: ColumnsType<Activity> = [
    { 
      title: "Actividad", 
      dataIndex: "nombre", 
      key: "activity",
      render: (nombre: string) => (
        <Text strong>{nombre}</Text>
      )
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      key: "date",
      render: (fecha: string) => {
        if (!fecha) return <Text type="secondary">Sin fecha</Text>;
        const activityDate = dayjs(fecha);
        const now = dayjs();
        
        if (activityDate.isBefore(now, 'day')) {
          return <Text type="danger">{activityDate.format('DD/MM/YYYY')}</Text>;
        } else if (activityDate.isSame(now, 'day')) {
          return <Text type="warning">Hoy</Text>;
        } else {
          return <Text>{activityDate.format('DD/MM/YYYY')}</Text>;
        }
      },
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            type="link" 
            size="small"
            onClick={() => handleViewActivity(record.id)}
          >
            Ver
          </Button>
          <Button 
            type="link" 
            size="small"
            onClick={() => handleEditActivity(record.id)}
          >
            Editar
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Card
        title={<Title level={5}>Actividades programadas</Title>}
        style={{ flex: 1 }}
      >
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" />
          <div style={{ marginTop: "16px" }}>
            <Text>Cargando actividades...</Text>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        title={<Title level={5}>Actividades programadas</Title>}
        style={{ flex: 1 }}
      >
        <div style={{ textAlign: "center", padding: "40px", color: "red" }}>
          <Text type="danger">Error al cargar las actividades</Text>
        </div>
      </Card>
    );
  }

  const activitiesData = activities?.data.data || [];

  return (
    <Card
      title={<Title level={5}>Actividades programadas</Title>}
      style={{ flex: 1 }}
    >
      {activitiesData.length > 0 ? (
        <Table
          rowKey="id"
          dataSource={activitiesData}
          columns={columnsActivities}
          pagination={{ pageSize: 5 }}
          size="small"
        />
      ) : (
        <Empty
          description="No hay actividades programadas"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" onClick={() => navigate("/actividades/crear")}>
            Crear actividad
          </Button>
        </Empty>
      )}
    </Card>
  );
};
