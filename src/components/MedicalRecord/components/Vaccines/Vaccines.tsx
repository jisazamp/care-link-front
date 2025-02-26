import { Card, Flex, Typography, Button, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;

export const Vaccines = () => {
  return (
    <Card
      variant="outlined"
      extra={
        <Button icon={<PlusOutlined />} className="main-button-white">
          Agregar vacuna
        </Button>
      }
      title={
        <Title level={4} style={{ margin: 0 }}>
          Esquema de vacunación
        </Title>
      }
    >
      <Flex vertical>
        <Table
          columns={[
            {
              title: "Vacuna",
              dataIndex: "vacuna",
              key: "vacuna",
              align: "center",
            },
            {
              title: "Fecha administración",
              dataIndex: "fechaAdministracion",
              key: "fechaAdministracion",
              align: "center",
            },
            {
              title: "Próxima aplicación (Si aplica)",
              dataIndex: "proximaAplicacion",
              key: "proximaAplicacion",
              align: "center",
            },
            {
              title: "Efectos secundarios (Si reporta)",
              dataIndex: "efectosSecundarios",
              key: "efectosSecundarios",
              align: "center",
            },
            {
              title: "Acciones",
              key: "acciones",
              align: "center",
              render: () => (
                <Button type="link" danger>
                  Eliminar
                </Button>
              ),
            },
          ]}
          dataSource={[]}
          pagination={false}
          style={{
            marginTop: 16,
          }}
        />
      </Flex>
    </Card>
  );
};
