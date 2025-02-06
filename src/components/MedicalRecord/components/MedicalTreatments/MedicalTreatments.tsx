import { Button, Card, Checkbox, Form, Space, Table, Typography } from "antd";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { FormValues } from "../../MedicalRecord";
import { PharmoterapeuticModal } from "./components/PharmoterapeuticalModal/PharmoterapeuticalRegimen";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Title } = Typography;

export const MedicalTreatments = () => {
  const [showModal, setShowModal] = useState<"pharma" | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const { control, watch } = useFormContext<FormValues>();

  const { append, update, remove } = useFieldArray({
    control,
    name: "pharmacotherapeuticRegimen",
  });

  const selectedValues = watch("medicalTreatments", []);
  const pharmaRegimen = watch("pharmacotherapeuticRegimen") || [];

  return (
    <>
      <Card
        title={<Title level={4}>Tratamientos o medicamentos</Title>}
        bordered
      >
        <Form.Item>
          <Controller
            name="medicalTreatments"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <Checkbox.Group
                {...field}
                style={{ display: "flex", gap: "16px", marginTop: 15 }}
              >
                <Checkbox value="pharmacotherapeuticRegimen">
                  Régimen farmacoterapéutico
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
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingIndex(null);
                  setShowModal("pharma");
                }}
              >
                Agregar
              </Button>
            }
            title={<Title level={5}>Régimen farmacoterapéutico</Title>}
          >
            <Table
              rowKey="id"
              columns={[
                {
                  title: "Fecha de inicio",
                  dataIndex: "startDate",
                  render: (_, record) => record.startDate?.format("YYYY-MM-DD"),
                },
                { title: "Medicamento", dataIndex: "medicine" },
                { title: "Dosis", dataIndex: "dose" },
                { title: "Vía de administración", dataIndex: "administration" },
                { title: "Frecuencia", dataIndex: "frequency" },
                { title: "Duración", dataIndex: "duration" },
                { title: "Indicaciones", dataIndex: "instructions" },
                {
                  title: "Acciones",
                  render: (_, __, index) => (
                    <Space>
                      <Button
                        type="link"
                        onClick={() => {
                          setEditingIndex(index);
                          setShowModal("pharma");
                        }}
                      >
                        Editar
                      </Button>
                      <Button type="link" danger onClick={() => remove(index)}>
                        Eliminar
                      </Button>
                    </Space>
                  ),
                },
              ]}
              dataSource={pharmaRegimen}
              pagination={false}
            />
          </Card>
        )}
      </Card>

      <PharmoterapeuticModal
        open={showModal}
        editingIndex={editingIndex}
        initialData={editingIndex !== null ? pharmaRegimen[editingIndex] : null}
        append={append}
        update={update}
        onCancel={() => {
          setShowModal(null);
          setEditingIndex(null);
        }}
      />
    </>
  );
};
