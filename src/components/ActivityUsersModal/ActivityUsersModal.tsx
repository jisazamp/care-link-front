import React, { useState } from "react";
import {
  Modal,
  Table,
  Button,
  Tag,
  Space,
  Typography,
  Spin,
  Empty,
  message,
  Select,
  Input,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { UserAddOutlined, EditOutlined } from "@ant-design/icons";
import { useGetActivityUsers } from "../../hooks/useGetActivityUsers/useGetActivityUsers";
import { useUpdateUserActivityStatus } from "../../hooks/useUpdateUserActivityStatus/useUpdateUserActivityStatus";
import { AssignUsersModal } from "../AssignUsersModal/AssignUsersModal";

const { Text, Title } = Typography;
const { Option } = Select;

interface ActivityUsersModalProps {
  visible: boolean;
  activityId: number;
  onClose: () => void;
}

interface ActivityUser {
  id: number;
  id_usuario: number;
  id_actividad: number;
  fecha_asignacion: string;
  estado_participacion: string;
  observaciones?: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  nombres?: string;
  apellidos?: string;
  n_documento?: string;
}

export const ActivityUsersModal: React.FC<ActivityUsersModalProps> = ({
  visible,
  activityId,
  onClose,
}) => {
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<ActivityUser | null>(null);
  const [editingStatus, setEditingStatus] = useState<string>("");
  const [editingObservations, setEditingObservations] = useState<string>("");

  const {
    data: activityData,
    isLoading,
    error,
  } = useGetActivityUsers(activityId);
  const updateUserStatusMutation = useUpdateUserActivityStatus();

  const handleUpdateUserStatus = async () => {
    if (!editingUser) return;

    try {
      await updateUserStatusMutation.mutateAsync({
        activityUserId: editingUser.id,
        data: {
          estado_participacion: editingStatus,
          observaciones: editingObservations || undefined,
        },
      });
      message.success("Estado del usuario actualizado exitosamente");
      setEditingUser(null);
    } catch (error) {
      message.error("Error al actualizar el estado del usuario");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMADO":
        return "green";
      case "PENDIENTE":
        return "orange";
      case "CANCELADO":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "CONFIRMADO":
        return "Confirmado";
      case "PENDIENTE":
        return "Pendiente";
      case "CANCELADO":
        return "Cancelado";
      default:
        return status;
    }
  };

  const columns: ColumnsType<ActivityUser> = [
    {
      title: "Usuario",
      dataIndex: "nombres",
      key: "user",
      render: (nombres: string, record: ActivityUser) => (
        <div>
          <Text strong>{`${nombres} ${record.apellidos || ""}`}</Text>
          <br />
          <Text type="secondary">{record.n_documento}</Text>
        </div>
      ),
    },
    {
      title: "Estado",
      dataIndex: "estado_participacion",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: "Observaciones",
      dataIndex: "observaciones",
      key: "observations",
      render: (observaciones: string) => (
        <Text>{observaciones || "Sin observaciones"}</Text>
      ),
    },
    {
      title: "Fecha Asignación",
      dataIndex: "fecha_asignacion",
      key: "assignment_date",
      render: (fecha: string) => (
        <Text>{new Date(fecha).toLocaleDateString("es-ES")}</Text>
      ),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, record: ActivityUser) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingUser(record);
              setEditingStatus(record.estado_participacion);
              setEditingObservations(record.observaciones || "");
            }}
          >
            Editar
          </Button>
        </Space>
      ),
    },
  ];

  const activity = activityData?.data;

  return (
    <>
      <Modal
        title={
          <div>
            <Title level={4}>Usuarios de la Actividad</Title>
            {activity && (
              <Text type="secondary">
                {activity.data.nombre} - {activity.data.total_usuarios}{" "}
                participantes
              </Text>
            )}
          </div>
        }
        open={visible}
        onCancel={onClose}
        width={1000}
        footer={[
          <Button key="close" onClick={onClose}>
            Cerrar
          </Button>,
          <Button
            key="add"
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => setAssignModalVisible(true)}
          >
            Agregar Usuarios
          </Button>,
        ]}
      >
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Spin size="large" />
            <div style={{ marginTop: "16px" }}>
              <Text>Cargando usuarios...</Text>
            </div>
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "40px", color: "red" }}>
            <Text type="danger">Error al cargar los usuarios</Text>
          </div>
        ) : (activity?.data.usuarios_asignados || []).length === 0 ? (
          <Empty
            description="No hay usuarios asignados a esta actividad"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => setAssignModalVisible(true)}
            >
              Agregar Usuarios
            </Button>
          </Empty>
        ) : (
          <Table
            rowKey="id"
            dataSource={activity?.data.usuarios_asignados || []}
            columns={columns}
            pagination={{ pageSize: 10 }}
            size="small"
          />
        )}
      </Modal>

      {/* Modal para editar usuario */}
      <Modal
        title="Editar Participación del Usuario"
        open={!!editingUser}
        onCancel={() => setEditingUser(null)}
        onOk={handleUpdateUserStatus}
        confirmLoading={updateUserStatusMutation.isPending}
      >
        {editingUser && (
          <Space direction="vertical" style={{ width: "100%" }}>
            <div>
              <Text strong>Usuario:</Text>
              <br />
              <Text>{`${editingUser.nombres} ${editingUser.apellidos}`}</Text>
            </div>
            <div>
              <Text strong>Estado:</Text>
              <Select
                value={editingStatus}
                onChange={setEditingStatus}
                style={{ width: "100%", marginTop: 8 }}
              >
                <Option value="PENDIENTE">Pendiente</Option>
                <Option value="CONFIRMADO">Confirmado</Option>
                <Option value="CANCELADO">Cancelado</Option>
              </Select>
            </div>
            <div>
              <Text strong>Observaciones:</Text>
              <Input.TextArea
                value={editingObservations}
                onChange={(e) => setEditingObservations(e.target.value)}
                rows={3}
                style={{ marginTop: 8 }}
              />
            </div>
          </Space>
        )}
      </Modal>

      {/* Modal para asignar usuarios */}
      <AssignUsersModal
        visible={assignModalVisible}
        activityId={activityId}
        onClose={() => setAssignModalVisible(false)}
      />
    </>
  );
};
