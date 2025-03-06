import {
  Button,
  Card,
  Checkbox,
  Form,
  Space,
  Table,
  Typography,
  Modal,
} from "antd";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { FormValues } from "../../schema/schema";
import { NursingCarePlanModal } from "./components/NursingCarePlanModal/NursingCarePlanModal";
import { PharmoterapeuticModal } from "./components/PharmoterapeuticalModal/PharmoterapeuticalRegimen";
import { PhysioterapeuticModal } from "./components/PhysioterapeuticModal/PhysioterapeuticModal";
import { PlusOutlined } from "@ant-design/icons";
import { useDeleteCareMutation } from "../../../../hooks/useDeleteCareMutation/useDeleteCareMutation";
import { useDeleteInterventionMutation } from "../../../../hooks/useDeleteInterventionMutation/useDeleteUserIntervention";
import { useDeleteMedicineMutation } from "../../../../hooks/useDeleteMedicineMutation/useDeleteMedicineMutation";
import { useEffect, useState } from "react";
import { useGetUserMedicalRecord } from "../../../../hooks/useGetUserMedicalRecord/useGetUserMedicalRecord";
import { useParams } from "react-router-dom";

const { Title } = Typography;

export const MedicalTreatments = () => {
  const params = useParams();
  const userId = params.id;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pharmaToDelete, setPharmaToDelete] = useState<number | null>(null);
  const [isDeleteNursingModalOpen, setIsDeleteNursingModalOpen] =
    useState(false);
  const [interventionToDelete, setInterventionToDelete] = useState<
    number | null
  >(null);
  const [isDeleteInterventionModalOpen, setIsDeleteInterventionModalOpen] =
    useState(false);
  const [nursingToDelete, setNursingToDelete] = useState<number | null>(null);
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

  const deletePharmaMutation = useDeleteMedicineMutation();
  const deleteCareMutation = useDeleteCareMutation();
  const deleteInterventionMutatino = useDeleteInterventionMutation();
  const recordQuery = useGetUserMedicalRecord(userId);

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
  useEffect(() => {
    if (deletePharmaMutation.isSuccess) {
      remove(pharmaRegimen.findIndex((p) => p.id === pharmaToDelete));
    }
  }, [deletePharmaMutation.isSuccess, pharmaRegimen, pharmaToDelete, remove]);

  useEffect(() => {
    if (deleteCareMutation.isSuccess) {
      removeNursing(nursingCare.findIndex((n) => n.id === nursingToDelete));
    }
  }, [
    deleteCareMutation.isSuccess,
    nursingCare,
    nursingToDelete,
    removeNursing,
  ]);

  useEffect(() => {
    if (deleteInterventionMutatino.isSuccess) {
      removePhysio(
        physioRegimen.findIndex((n) => n.id === interventionToDelete)
      );
    }
  }, [
    deleteInterventionMutatino.isSuccess,
    interventionToDelete,
    physioRegimen,
    removePhysio,
  ]);

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
                icon={<PlusOutlined />}
                className="main-button-white"
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
                        className="main-button-link"
                        onClick={() => {
                          setEditingIndex(index);
                          setShowModal("pharma");
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        type="link"
                        danger
                        onClick={() => {
                          setPharmaToDelete(Number(pharmaRegimen[index].id));
                          setIsDeleteModalOpen(true);
                        }}
                      >
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
            bordered
            extra={
              <Button
                icon={<PlusOutlined />}
                className="main-button-white"
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
                        className="main-button-link"
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
                        onClick={() => {
                          setNursingToDelete(Number(nursingCare[index].id));
                          setIsDeleteNursingModalOpen(true);
                        }}
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
            bordered
            extra={
              <Button
                icon={<PlusOutlined />}
                className="main-button-white"
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
                        className="main-button-link"
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
                        onClick={() => {
                          setInterventionToDelete(
                            Number(physioRegimen[index].id)
                          );
                          setIsDeleteInterventionModalOpen(true);
                        }}
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
      <Modal
        title="Confirmar eliminación"
        open={isDeleteModalOpen}
        onOk={() => {
          if (pharmaToDelete !== null) {
            if (!isNaN(pharmaToDelete)) {
              deletePharmaMutation.mutate({
                id: Number(recordQuery.data?.data.data?.id_historiaclinica),
                medicineId: Number(pharmaToDelete),
              });
            } else {
              remove(pharmaRegimen.findIndex((p) => p.id === pharmaToDelete));
            }
            setIsDeleteModalOpen(false);
            setPharmaToDelete(null);
          }
        }}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setPharmaToDelete(null);
        }}
        okText="Eliminar"
        cancelText="Cancelar"
        confirmLoading={deletePharmaMutation.isPending}
      >
        <Typography.Text>
          ¿Estás seguro que deseas eliminar este medicamento?
        </Typography.Text>
      </Modal>
      <Modal
        title="Confirmar eliminación"
        open={isDeleteNursingModalOpen}
        onOk={() => {
          if (nursingToDelete !== null) {
            if (!isNaN(nursingToDelete)) {
              deleteCareMutation.mutate({
                id: Number(recordQuery.data?.data.data?.id_historiaclinica),
                careId: Number(nursingToDelete),
              });
            } else {
              removeNursing(
                nursingCare.findIndex((n) => n.id === nursingToDelete)
              );
            }
            setIsDeleteNursingModalOpen(false);
            setNursingToDelete(null);
          }
        }}
        onCancel={() => {
          setIsDeleteNursingModalOpen(false);
          setNursingToDelete(null);
        }}
        okText="Eliminar"
        cancelText="Cancelar"
        confirmLoading={deleteCareMutation.isPending}
      >
        <Typography.Text>
          ¿Estás seguro que deseas eliminar este plan de cuidados?
        </Typography.Text>
      </Modal>
      <Modal
        title="Confirmar eliminación"
        open={isDeleteInterventionModalOpen}
        onOk={() => {
          if (interventionToDelete !== null) {
            if (!isNaN(interventionToDelete)) {
              deleteInterventionMutatino.mutate({
                id: Number(recordQuery.data?.data.data?.id_historiaclinica),
                interventionId: Number(interventionToDelete),
              });
            } else {
              removePhysio(
                physioRegimen.findIndex((n) => n.id === interventionToDelete)
              );
            }
            setIsDeleteInterventionModalOpen(false);
            setInterventionToDelete(null);
          }
        }}
        onCancel={() => {
          setIsDeleteInterventionModalOpen(false);
          setInterventionToDelete(null);
        }}
        okText="Eliminar"
        cancelText="Cancelar"
        confirmLoading={deleteInterventionMutatino.isPending}
      >
        <Typography.Text>
          ¿Estás seguro que deseas eliminar esta intervención?
        </Typography.Text>
      </Modal>
    </>
  );
};
