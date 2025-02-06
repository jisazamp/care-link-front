import { useFormContext, Controller } from "react-hook-form";
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Flex,
  Form,
  Space,
  Table,
  Typography,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Title } = Typography;

export const MedicalTreatments = () => {
  const { control, setValue, watch } = useFormContext();
  const selectedValues = watch("medicalTreatments", []);

  const handleCheckboxGroupChange = (values: any) => {
    setValue("medicalTreatments", values);
  };

  return (
    <Card
      title={
        <Title level={4}>
          Tratamientos o medicamentos temporales o permanentes que requieren
          apoyo
        </Title>
      }
      bordered
    >
      <Form.Item>
        <Title level={5} style={{ margin: 0 }}>
          Tratamientos o medicamentos
        </Title>
        <Controller
          name="medicalTreatments"
          control={control}
          defaultValue={[]}
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
                marginTop: 15,
              }}
            >
              <Checkbox value="pharmacotherapeuticRegimen">
                Régimen farmacoterapéutico
              </Checkbox>
              <Checkbox value="nursingCarePlan">
                Plan de cuidados de enfermería
              </Checkbox>
              <Checkbox value="physiotherapeuticIntervention">
                Intervención fisioterapéutica
              </Checkbox>
            </Checkbox.Group>
          )}
        />
      </Form.Item>
      {selectedValues.includes("pharmacotherapeuticRegimen") && (
        <Card
          bordered
          extra={
            <Button
              className="main-button-white"
              icon={<PlusOutlined />}
              style={{ marginBottom: 8 }}
            >
              Agregar
            </Button>
          }
          title={
            <Title level={5} style={{ margin: 0 }}>
              Régimen farmacoterapéutico
            </Title>
          }
        >
          <Table
            columns={[
              {
                title: "Fecha de inicio",
                dataIndex: "startDate",
                key: "startDate",
              },
              {
                title: "Medicamento",
                dataIndex: "medicine",
                key: "medicine",
              },
              {
                title: "Dosis",
                dataIndex: "dose",
                key: "dose",
              },
              {
                title: "Vía de administración",
                dataIndex: "administration",
                key: "administration",
              },
              {
                title: "Frecuencia",
                dataIndex: "frequency",
                key: "frequency",
              },
              {
                title: "Duración",
                dataIndex: "duration",
                key: "duration",
              },
              {
                title: "Indicaciones",
                dataIndex: "instructions",
                key: "instructions",
              },
              {
                title: "Acciones",
                key: "actions",
                render: () => (
                  <Space>
                    <Button
                      type="link"
                      style={{
                        color: "#1890ff",
                      }}
                    >
                      Desactivar
                    </Button>
                    <Button type="link" danger>
                      Eliminar
                    </Button>
                  </Space>
                ),
              },
            ]}
            dataSource={[]}
            pagination={false}
          />
        </Card>
      )}
      {selectedValues.includes("nursingCarePlan") && (
        <Card
          bordered
          title={
            <Title level={5} style={{ margin: 0 }}>
              Plan de cuidados de enfermería
            </Title>
          }
          extra={
            <Button className="main-button-white" icon={<PlusOutlined />}>
              Agregar
            </Button>
          }
          style={{ marginTop: 10 }}
        >
          <Table
            columns={[
              {
                title: "Diagnóstico",
                dataIndex: "diagnosis",
                key: "diagnosis",
              },
              {
                title: "Intervención",
                dataIndex: "intervention",
                key: "intervention",
              },
              {
                title: "Frecuencia",
                dataIndex: "frequency",
                key: "frequency",
              },
              {
                title: "Acciones",
                key: "actions",
                render: () => (
                  <Space>
                    <Button
                      type="link"
                      style={{
                        color: "#1890ff",
                      }}
                    >
                      Finalizar
                    </Button>
                    <Button type="link" danger>
                      Eliminar
                    </Button>
                  </Space>
                ),
              },
            ]}
            dataSource={[]}
            pagination={false}
          />
        </Card>
      )}
      {selectedValues.includes("physiotherapeuticIntervention") && (
        <Card
          bordered
          extra={
            <Button className="main-button-white" icon={<PlusOutlined />}>
              Agregar
            </Button>
          }
          title={
            <Title level={5} style={{ margin: 0 }}>
              Intervención fisioterapéutica
            </Title>
          }
          style={{ marginTop: 10 }}
        >
          <Table
            columns={[
              {
                title: "Diagnóstico",
                dataIndex: "diagnosis",
                key: "diagnosis",
              },
              {
                title: "Intervención",
                dataIndex: "intervention",
                key: "intervention",
              },
              {
                title: "Frecuencia",
                dataIndex: "frequency",
                key: "frequency",
              },
              {
                title: "Acciones",
                key: "actions",
                render: () => (
                  <Space>
                    <Button
                      type="link"
                      style={{
                        color: "#1890ff",
                      }}
                    >
                      Finalizar
                    </Button>
                    <Button type="link" danger>
                      Eliminar
                    </Button>
                  </Space>
                ),
              },
            ]}
            dataSource={[]}
            pagination={false}
          />
        </Card>
      )}
    </Card>
  );
};
