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
        <Title level={5} className="checkbox-title">
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
                marginBottom: "16px",
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
        <Flex vertical gap={10}>
          <Divider />
          <Flex vertical>
            <Title level={5}>Régimen farmacoterapéutico</Title>
            <Flex
              style={{
                justifyContent: "flex-end",
              }}
            >
              <Button type="primary" icon={<PlusOutlined />}>
                Agregar
              </Button>
            </Flex>
          </Flex>
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
            dataSource={[
              {
                key: "1",
                startDate: "10/09/2024",
                medicine: "Enalapril",
                dose: "5 mg",
                administration: "Oral",
                frequency: "Cada 12 horas",
                duration: "Indefinida",
                instructions:
                  "Administrar con alimentos. Controlar presión arterial antes de cada dosis.",
              },
            ]}
            pagination={false}
          />
        </Flex>
      )}
      {selectedValues.includes("nursingCarePlan") && (
        <Flex vertical>
          <Flex vertical>
            <Title level={5}>Plan de cuidados de enfermería</Title>
            <Flex
              style={{
                justifyContent: "flex-end",
                marginBottom: 8,
              }}
            >
              <Button type="primary" icon={<PlusOutlined />}>
                Agregar
              </Button>
            </Flex>
          </Flex>
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
            dataSource={[
              {
                key: "1",
                diagnosis: "Piel alterada relacionada con herida en la pierna.",
                intervention: "Limpiar herida, secar con gasas sin frotar.",
                frequency: "Diaria",
              },
            ]}
            pagination={false}
          />
        </Flex>
      )}
    </Card>
  );
};
