import {
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Flex,
  Layout,
  Row,
  Table,
  Typography,
} from "antd";
import { Sidebar } from "../Sidebar/Sidebar";
import { Header } from "../Header/Header";

const { Content, Sider } = Layout;
const { Title } = Typography;

const columnsUserFlow = [
  { title: "Usuario", dataIndex: "user", key: "user" },
  {
    title: "Contratos",
    dataIndex: "contracts",
    key: "contracts",
  },
  {
    title: "Visitas del mes",
    dataIndex: "visits",
    key: "visits",
  },
];

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

const userFlowData = [
  {
    key: "1",
    user: "Francisco Javier Benavides",
    contracts: "Ver",
    visits: 5,
  },
  {
    key: "2",
    user: "Nombre usuario",
    contracts: "Ver",
    visits: 10,
  },
  {
    key: "3",
    user: "Nombre usuario",
    contracts: "Ver",
    visits: 20,
  },
];

const activitiesData = [
  { key: "1", activity: "Ping Pong", date: "Dentro de 7 días" },
  { key: "2", activity: "Yoga", date: "Dentro de 7 días" },
  { key: "3", activity: "Arte", date: "Dentro de 7 días" },
];

const columnsAttendance = [
  {
    title: "",
    dataIndex: "checkbox",
    key: "checkbox",
    render: () => <Checkbox />,
  },
  { title: "Usuario", dataIndex: "user", key: "user" },
  {
    title: "Tipo de servicio",
    dataIndex: "serviceType",
    key: "serviceType",
  },
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
        ></span>
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

export const Home = () => {
  return (
    <Layout>
      <Header />
      <Layout>
        <Sider collapsible style={{ backgroundColor: "#FFF" }}>
          <Sidebar />
        </Sider>
        <Content style={{ padding: "0 16px 30px 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Inicio</Breadcrumb.Item>
            <Breadcrumb.Item>Tablero de Inicio</Breadcrumb.Item>
          </Breadcrumb>
          <Flex vertical gap="middle">
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
            <Flex gap="middle">
              <Card
                title={<Title level={5}>Flujo de usuarios</Title>}
                style={{
                  flex: 1,
                }}
              >
                <Row gutter={[16, 16]}>
                  {/* <Col span={12}>
                    <img
                      src={Grafica1}
                      alt="Gráfico Usuarios del Mes"
                      style={{
                        width: "100%",
                        height: "auto",
                      }}
                    />
                  </Col>
                  */}
                  {/* <Col span={12}>
                    <img
                      src={Grafica2}
                      alt="Gráfico Tasa de Asistencia"
                      style={{
                        width: "100%",
                        height: "auto",
                      }}
                    />
                  </Col>
                  */}
                </Row>
                <Table
                  dataSource={userFlowData}
                  columns={columnsUserFlow}
                  pagination={{
                    pageSize: 5,
                  }}
                />
              </Card>
              <Card
                title={<Title level={5}>Actividades programadas</Title>}
                style={{
                  flex: 1,
                }}
              >
                <Table
                  dataSource={activitiesData}
                  columns={columnsActivities}
                  pagination={{
                    pageSize: 5,
                  }}
                />
              </Card>
            </Flex>
          </Flex>
        </Content>
      </Layout>
    </Layout>
  );
};
