import {
  Breadcrumb,
  Button,
  Card,
  Descriptions,
  List,
  Modal,
  Typography,
} from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDeleteActivity } from "../../hooks/useDeleteActivity/useDeleteActivity";
import { useGetActivities } from "../../hooks/useGetActivities/useGetActivities";
import type { Activity } from "../../types";

const { Title, Text } = Typography;
const { confirm } = Modal;

export const ActivitiesList = () => {
  const { data, isPending } = useGetActivities();
  const { mutate: deleteActivity } = useDeleteActivity();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null,
  );

  const showModal = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedActivity(null);
  };

  const showDeleteConfirm = (activity: Activity) => {
    confirm({
      title: "¿Está seguro de eliminar esta actividad?",
      content: `Esta acción eliminará la actividad "${activity.nombre}" de forma permanente.`,
      okText: "Sí, eliminar",
      cancelText: "Cancelar",
      cancelButtonProps: {
        type: "primary",
        style: { backgroundColor: "#F32013" },
      },
      okButtonProps: { type: "link", style: { color: "#000" } },
      onOk: () => {
        deleteActivity(activity.id);
      },
    });
  };

  return (
    <>
      <Breadcrumb
        items={[
          { title: "Home" },
          { title: "Actividades" },
          { title: "Lista de actividades" },
        ]}
        style={{ margin: "16px 0" }}
      />
      <Card title={<Title level={5}>Lista de actividades</Title>}>
        <List
          dataSource={data?.data.data}
          itemLayout="horizontal"
          loading={isPending}
          pagination={{ position: "bottom", align: "end" }}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  key={item.id}
                  type="link"
                  className="main-button-link"
                  onClick={() => showModal(item)}
                >
                  Detalles
                </Button>,
                <Link
                  key={`link/${item.id}`}
                  to={`/actividades/${item.id}/editar`}
                >
                  <Button type="link" className="main-button-link">
                    Editar
                  </Button>
                </Link>,
                <Button
                  key={item.id}
                  type="link"
                  danger
                  onClick={() => showDeleteConfirm(item)}
                >
                  Eliminar
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={<Text strong>{item.nombre}</Text>}
                description={item.descripcion}
              />
            </List.Item>
          )}
        />
      </Card>

      <Modal
        title="Detalles de la Actividad"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel}>
            Cerrar
          </Button>,
        ]}
      >
        {selectedActivity && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Nombre">
              <Text>{selectedActivity.nombre}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Descripción">
              <Text>{selectedActivity.descripcion}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Duración">
              <Text>
                {selectedActivity.duracion
                  ? `${selectedActivity.duracion} minutos`
                  : ""}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Fecha">
              <Text>{selectedActivity.fecha}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Comentarios">
              <Text>{selectedActivity.comentarios}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Profesional">
              <Text>
                {selectedActivity.profesional
                  ? `${selectedActivity.profesional.nombres} ${selectedActivity.profesional.apellidos}`
                  : "No asignado"}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Tipo de Actividad">
              <Text>
                {selectedActivity.tipo_actividad
                  ? selectedActivity.tipo_actividad.tipo
                  : "No especificado"}
              </Text>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </>
  );
};
