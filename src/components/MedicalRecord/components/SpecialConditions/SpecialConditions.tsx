import { useFormContext, Controller } from "react-hook-form";
import { Card, Flex, Typography, Checkbox, Divider, Button, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";

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
        <Title level={5} className="checkbox-title">
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
      <Flex vertical>
        {selectedValues.includes("disability") && (
          <>
            <Divider />
            <Card
              bordered
              title={
                <Flex vertical>
                  <Title level={5}>Tipos de discapacidad del paciente</Title>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    className="add-button"
                  >
                    Agregar
                  </Button>
                </Flex>
              }
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
                dataSource={[
                  {
                    key: "1",
                    discapacidad: "Física",
                    observacion: "N/A",
                  },
                ]}
                pagination={false}
              />
            </Card>
          </>
        )}
        {selectedValues.includes("limitations") && (
          <Card
            bordered
            title={
              <Flex vertical>
                <Divider />
                <Title level={5}>
                  Limitaciones permanentes que requieren apoyos o cuidados
                </Title>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  className="add-button"
                >
                  Agregar
                </Button>
              </Flex>
            }
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
              dataSource={[
                {
                  key: "1",
                  limitacion: "Incontinencia urinaria",
                  observacion: "Requiere uso de pañal",
                },
                {
                  key: "2",
                  limitacion: "Debilidad muscular",
                  observacion: "Requiere ayuda para comer",
                },
              ]}
              pagination={false}
            />
          </Card>
        )}
        {selectedValues.includes("alergies") && (
          <Card
            bordered
            title={
              <Flex vertical>
                <Divider />
                <Title level={5}>Alergias a medicamentos</Title>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  className="add-button"
                >
                  Agregar
                </Button>
              </Flex>
            }
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
              dataSource={[
                {
                  key: "1",
                  medicamento: "Penicilina",
                  observacion: "Reemplazar con azitromicina",
                },
              ]}
              pagination={false}
            />
          </Card>
        )}
        {selectedValues.includes("surgeries") && (
          <Card
            bordered
            title={
              <Flex vertical>
                <Divider />
                <Title level={5}>
                  Historial de cirugías, traumatismos o accidentes
                </Title>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  className="add-button"
                >
                  Agregar
                </Button>
              </Flex>
            }
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
              dataSource={[
                {
                  key: "1",
                  fecha: "10/11/1998",
                  observacion: "Apendicectomía",
                },
              ]}
              pagination={false}
            />
          </Card>
        )}
      </Flex>
    </Card>
  );
};
