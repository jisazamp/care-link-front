import { Button, Card, Checkbox, Form, Space, Table, Typography } from "antd";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { FormValues } from "../../schema/schema";
import { PharmoterapeuticModal } from "./components/PharmoterapeuticalModal/PharmoterapeuticalRegimen";
import { NursingCarePlanModal } from "./components/NursingCarePlanModal/NursingCarePlanModal";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { PhysioterapeuticModal } from "./components/PhysioterapeuticModal/PhysioterapeuticModal";

const { Title } = Typography;

export const MedicalTreatments = () => {
  const [showModal, setShowModal] = useState<
    "pharma" | "nursing" | "physioterapeutic" | null
  >(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingIndexNursing, setEditingIndexNursing] = useState<number | null>(
    null
  );
  const [editingIndexPhysioterapeutic, setEditingIndexPhysioterapeutic] =
    useState<number | null>(null);

  const { control, watch } = useFormContext<FormValues>();

  const { append, update, remove } = useFieldArray({
    control,
    name: "pharmacotherapeuticRegimen",
  });

  const {
    append: appendNursing,
    update: updateNursing,
    remove: removeNursing,
  } = useFieldArray({
    control,
    name: "nursingCarePlan",
  });

  const {
    append: appendPhysio,
    update: updatePhysio,
    remove: removePhysio,
  } = useFieldArray({
    control,
    name: "physioterapeuticRegimen",
  });

  const selectedValues = watch("medicalTreatments", []);
  const pharmaRegimen = watch("pharmacotherapeuticRegimen") ?? [];
  const nursingCare = watch("nursingCarePlan") ?? [];
  const physioRegimen = watch("physioterapeuticRegimen") ?? [];

  return (
    <>
      <Card
        title={<Title level={4}>Tratamientos o medicamentos</Title>}
        variant="outlined"
      >
        <Form.Item>
          <Controller
            name="medicalTreatments"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <Checkbox.Group
                {...field}
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
            variant="outlined"
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
            style={{ marginTop: 8 }}
          >
            <Table
              rowKey="id"
              columns={[
                { title: "Medicamento", dataIndex: "medicine" },
                {
                  title: "Fecha de inicio",
                  dataIndex: "startDate",
                  render: (_, record) => record.startDate?.format("YYYY-MM-DD"),
                },
                {
                  title: "Fecha de fin",
                  dataIndex: "endDate",
                  render: (_, record) => record.endDate?.format("YYYY-MM-DD"),
                },
                { title: "Frecuencia", dataIndex: "frequency" },
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
        {selectedValues.includes("nursingCarePlan") && (
          <Card
            variant="outlined"
            extra={
              <Button
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingIndexNursing(null);
                  setShowModal("nursing");
                }}
              >
                Agregar
              </Button>
            }
            title={<Title level={5}>Plan de cuidados de enfemería</Title>}
            style={{ marginTop: 16 }}
          >
            <Table
              rowKey="id"
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
                  render: (_, __, index) => (
                    <Space>
                      <Button
                        type="link"
                        onClick={() => {
                          setEditingIndexNursing(index);
                          setShowModal("nursing");
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        type="link"
                        danger
                        onClick={() => removeNursing(index)}
                      >
                        Eliminar
                      </Button>
                    </Space>
                  ),
                },
              ]}
              dataSource={nursingCare}
              pagination={false}
            />
          </Card>
        )}
        {selectedValues.includes("physiotherapeuticIntervention") && (
          <Card
            variant="outlined"
            extra={
              <Button
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingIndexPhysioterapeutic(null);
                  setShowModal("physioterapeutic");
                }}
              >
                Agregar
              </Button>
            }
            title={<Title level={5}>Intervención fisioterapéutica</Title>}
            style={{ marginTop: 16 }}
          >
            <Table
              rowKey="id"
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
                  render: (_, __, index) => (
                    <Space>
                      <Button
                        type="link"
                        onClick={() => {
                          setEditingIndexPhysioterapeutic(index);
                          setShowModal("physioterapeutic");
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        type="link"
                        danger
                        onClick={() => removePhysio(index)}
                      >
                        Eliminar
                      </Button>
                    </Space>
                  ),
                },
              ]}
              dataSource={physioRegimen}
              pagination={false}
            />
          </Card>
        )}
      </Card>
      <PharmoterapeuticModal
        open={showModal === "pharma"}
        editingIndex={editingIndex}
        initialData={editingIndex !== null ? pharmaRegimen[editingIndex] : null}
        append={append}
        update={update}
        onCancel={() => {
          setShowModal(null);
          setEditingIndex(null);
        }}
      />
      <NursingCarePlanModal
        open={showModal === "nursing"}
        editingIndex={editingIndexNursing}
        initialData={
          editingIndexNursing !== null ? nursingCare[editingIndexNursing] : null
        }
        append={appendNursing}
        update={updateNursing}
        onCancel={() => {
          setShowModal(null);
          setEditingIndexNursing(null);
        }}
      />
      <PhysioterapeuticModal
        open={showModal === "physioterapeutic"}
        editingIndex={editingIndexPhysioterapeutic}
        initialData={
          editingIndexPhysioterapeutic !== null
            ? physioRegimen[editingIndexPhysioterapeutic]
            : null
        }
        append={appendPhysio}
        update={updatePhysio}
        onCancel={() => {
          setShowModal(null);
          setEditingIndexPhysioterapeutic(null);
        }}
      />
    </>
  );
};
