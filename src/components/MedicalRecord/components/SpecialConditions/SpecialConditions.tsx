import { Card, Flex, Typography, Checkbox, Button, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useFormContext, Controller } from "react-hook-form";

const { Title } = Typography;

export const SpecialConditions = () => {
  const { control, setValue, watch } = useFormContext();
  const selectedValues = watch("specialConditions", []);

  const handleCheckboxGroupChange = (values: any) => {
    setValue("specialConditions", values);
  };

  return (
    <Card
      title={
        <Flex vertical>
          <Title level={4}>
            Condiciones especiales permanentes preexistentes de cuidado
          </Title>
        </Flex>
      }
      bordered
    >
      <Flex vertical>
        <Title
          level={5}
          className="checkbox-title"
          style={{ marginTop: 0, marginBottom: 15 }}
        >
          Condición especial
        </Title>
        <Controller
          name="specialConditions"
          control={control}
          render={({ field }) => (
            <Checkbox.Group
              {...field}
              value={field.value}
              onChange={(values) => {
                field.onChange(values);
                handleCheckboxGroupChange(values);
              }}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <Checkbox value="alergies">Alergias a medicamentos</Checkbox>
              <Checkbox value="diet">Dieta especial</Checkbox>
              <Checkbox value="disability">Persona con discapacidad</Checkbox>
              <Checkbox value="limitations">Limitaciones o apoyos</Checkbox>
              <Checkbox value="otherAlergies">Otras alergias</Checkbox>
              <Checkbox value="surgeries">Cirugías</Checkbox>
            </Checkbox.Group>
          )}
        />
      </Flex>
      <Flex vertical style={{ marginTop: 8 }}>
        {selectedValues.includes("alergies") && (
          <Card
            extra={
              <Button
                icon={<PlusOutlined />}
                className="main-button-white"
                style={{ alignSelf: "flex-end" }}
              >
                Agregar
              </Button>
            }
            title={
              <Title level={5} style={{ margin: 0 }}>
                Alergias a medicamentos
              </Title>
            }
            style={{ marginBottom: 8 }}
          >
            <Table
              className="alergias-table"
              columns={[
                {
                  title: "Medicamentos a los que presenta alergia",
                  dataIndex: "medicamento",
                  key: "medicamento",
                  align: "center",
                },
                {
                  title: "Observación",
                  dataIndex: "observacion",
                  key: "observacion",
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
            />
          </Card>
        )}
        {selectedValues.includes("diet") && (
          <Card
            extra={
              <Button
                icon={<PlusOutlined />}
                className="main-button-white"
                style={{ alignSelf: "flex-end", marginBottom: 8 }}
              >
                Agregar
              </Button>
            }
            title={
              <Title level={5} style={{ margin: 0 }}>
                Dieta
              </Title>
            }
            style={{ marginBottom: 8 }}
          >
            <Table
              columns={[
                {
                  title: "Medicamentos a los que presenta alergia",
                  dataIndex: "medicamento",
                  key: "medicamento",
                  align: "center",
                },
                {
                  title: "Observación",
                  dataIndex: "observacion",
                  key: "observacion",
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
            />
          </Card>
        )}
        {selectedValues.includes("disability") && (
          <>
            <Card
              extra={
                <Button icon={<PlusOutlined />} className="main-button-white">
                  Agregar
                </Button>
              }
              title={
                <Title level={5} style={{ margin: 0 }}>
                  Tipos de discapacidad del paciente
                </Title>
              }
              style={{ marginBottom: 8 }}
            >
              <Table
                className="discapacidad-table"
                columns={[
                  {
                    title: "Discapacidades",
                    dataIndex: "discapacidad",
                    key: "discapacidad",
                    align: "center",
                  },
                  {
                    title: "Observación",
                    dataIndex: "observacion",
                    key: "observacion",
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
              />
            </Card>
          </>
        )}
        {selectedValues.includes("limitations") && (
          <Card
            extra={
              <Button icon={<PlusOutlined />} className="main-button-white">
                Agregar
              </Button>
            }
            title={
              <Title level={5} style={{ margin: 0 }}>
                Limitaciones permanentes que requieren apoyos o cuidados
              </Title>
            }
            style={{ marginBottom: 8 }}
          >
            <Table
              className="limitaciones-table"
              columns={[
                {
                  title: "Limitaciones",
                  dataIndex: "limitacion",
                  key: "limitacion",
                  align: "center",
                },
                {
                  title: "Observación",
                  dataIndex: "observacion",
                  key: "observacion",
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
            />
          </Card>
        )}
        {selectedValues.includes("otherAlergies") && (
          <Card
            extra={
              <Button icon={<PlusOutlined />} className="main-button-white">
                Agregar
              </Button>
            }
            title={
              <Title level={5} style={{ margin: 0 }}>
                Otras alergias
              </Title>
            }
            style={{ marginBottom: 8 }}
          >
            <Table
              columns={[
                {
                  title: "Fecha de ocurrencia",
                  dataIndex: "fecha",
                  key: "fecha",
                  align: "center",
                },
                {
                  title: "Observación",
                  dataIndex: "observacion",
                  key: "observacion",
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
            />
          </Card>
        )}
        {selectedValues.includes("surgeries") && (
          <Card
            extra={
              <Button icon={<PlusOutlined />} className="main-button-white">
                Agregar
              </Button>
            }
            title={
              <Title level={5} style={{ margin: 0 }}>
                Historial de cirugías, traumatismos o accidentes
              </Title>
            }
            style={{ marginBottom: 8 }}
          >
            <Table
              className="historial-table"
              columns={[
                {
                  title: "Fecha de ocurrencia",
                  dataIndex: "fecha",
                  key: "fecha",
                  align: "center",
                },
                {
                  title: "Observación",
                  dataIndex: "observacion",
                  key: "observacion",
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
            />
          </Card>
        )}
      </Flex>
    </Card>
  );
};
