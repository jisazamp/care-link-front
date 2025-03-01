import { Card, Flex, Typography, Button, Table, Space } from "antd";
import { FormValues } from "../../schema/schema";
import { PlusOutlined } from "@ant-design/icons";
import { VaccinesModal } from "./components/VaccinesModal/VaccinesModal";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useState } from "react";

const { Title } = Typography;

export const Vaccines = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const { append, update, remove } = useFieldArray<FormValues>({
    name: "vaccines",
  });

  const { watch } = useFormContext<FormValues>();

  const vaccines = watch("vaccines");

  return (
    <>
      <Card
        variant="outlined"
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
                      onClick={() => {
                        setEditingIndex(index);
                        setShowModal(true);
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
        initialData={editingIndex !== null ? vaccines[editingIndex] : null}
        append={append}
        update={update}
        onCancel={() => {
          setShowModal(false);
          setEditingIndex(null);
        }}
      />
    </>
  );
};
