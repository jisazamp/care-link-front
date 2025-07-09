import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Modal, Space, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useDeleteVaccineMutation } from "../../../../hooks/useDeleteVaccineMutation/useDeleteVaccineMutation";
import { useGetUserMedicalRecord } from "../../../../hooks/useGetUserMedicalRecord/useGetUserMedicalRecord";
import type { FormValues } from "../../schema/schema";
import { VaccinesModal } from "./components/VaccinesModal/VaccinesModal";

const { Title } = Typography;

export const Vaccines = () => {
  const params = useParams();
  const userId = params.id;

  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [vaccineToDelete, setVaccineToDelete] = useState<number | null>(null);

  const { append, update, remove } = useFieldArray<FormValues>({
    name: "vaccines",
  });

  const {
    mutate: deleteVaccine,
    isPending,
    isSuccess,
  } = useDeleteVaccineMutation();

  const { data: record } = useGetUserMedicalRecord(userId);

  const { watch } = useFormContext<FormValues>();

  const vaccines = watch("vaccines");

  useEffect(() => {
    if (isSuccess) {
      const index = vaccines.findIndex((v) => v.id === vaccineToDelete);
      if (index !== -1) {
        remove(index);
      }
    }
  }, [isSuccess, remove, vaccineToDelete, vaccines]);

  return (
    <>
      <Card
        bordered
        extra={
          <Button
            icon={<PlusOutlined />}
            className="main-button-white"
            onClick={() => {
              setEditingIndex(null);
              setShowModal(true);
            }}
          >
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
            rowKey="id"
            columns={[
              {
                title: "Vacuna",
                dataIndex: "name",
                align: "center",
              },
              {
                title: "Fecha administración",
                dataIndex: "date",
                align: "center",
                render: (_, record) => record.date?.format("YYYY-MM-DD"),
              },
              {
                title: "Próxima aplicación (Si aplica)",
                dataIndex: "nextDate",
                align: "center",
                render: (_, record) => record.nextDate?.format("YYYY-MM-DD"),
              },
              {
                title: "Efectos secundarios (Si reporta)",
                dataIndex: "secondaryEffects",
                align: "center",
              },
              {
                title: "Acciones",
                key: "acciones",
                align: "center",
                render: (_, __, index) => (
                  <Space>
                    <Button
                      type="link"
                      className="main-button-link"
                      onClick={() => {
                        setEditingIndex(index);
                        setShowModal(true);
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      type="link"
                      danger
                      onClick={() => {
                        const vaccine = vaccines[index];
                        if (vaccine && vaccine.id) {
                          setVaccineToDelete(Number(vaccine.id));
                          setIsDeleteModalOpen(true);
                        }
                      }}
                    >
                      Eliminar
                    </Button>
                  </Space>
                ),
              },
            ]}
            dataSource={vaccines}
            pagination={false}
            style={{
              marginTop: 16,
            }}
          />
        </Flex>
      </Card>
      <VaccinesModal
        open={showModal}
        editingIndex={editingIndex}
        initialData={editingIndex !== null && vaccines[editingIndex] ? vaccines[editingIndex] : null}
        append={append}
        update={update}
        onCancel={() => {
          setShowModal(false);
          setEditingIndex(null);
        }}
      />
      <Modal
        title="Confirmar eliminación"
        open={isDeleteModalOpen}
        onOk={() => {
          if (vaccineToDelete !== null) {
            if (!Number.isNaN(vaccineToDelete)) {
              deleteVaccine({
                id: Number(record?.data.data?.id_historiaclinica),
                vaccineId: Number(vaccineToDelete),
              });
            } else {
              const index = vaccines.findIndex((v) => v.id === vaccineToDelete);
              if (index !== -1) {
                remove(index);
              }
            }
            setIsDeleteModalOpen(false);
            setVaccineToDelete(null);
          }
        }}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setVaccineToDelete(null);
        }}
        okText="Eliminar"
        cancelText="Cancelar"
        confirmLoading={isPending}
      >
        <Typography.Text>
          ¿Estás seguro que deseas eliminar esta vacuna?
        </Typography.Text>
      </Modal>
    </>
  );
};
