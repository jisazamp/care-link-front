import { Card, Flex, Typography, Button, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;

export const Vaccines = () => {
  return (
    <Card
      bordered
      title={
        <Flex vertical>
          <Title level={4}>Esquema de vacunación</Title>
          <Flex justify="flex-end" style={{ marginBottom: "8px" }}>
            <Button icon={<PlusOutlined />} type="primary">
              Agregar Vacuna
            </Button>
          </Flex>
        </Flex>
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
          dataSource={[
            {
              key: "1",
              vacuna: "Influenza",
              fechaAdministracion: "05/07/2024",
              proximaAplicacion: "Anual",
              efectosSecundarios: "Ninguno",
            },
            {
              key: "2",
              vacuna: "Hepatitis B",
              fechaAdministracion: "NO REGISTRA",
              proximaAplicacion: "No requiere",
              efectosSecundarios: "Ninguno",
            },
          ]}
          pagination={false}
          style={{
            marginTop: 16,
          }}
        />
      </Flex>
    </Card>
  );
};
