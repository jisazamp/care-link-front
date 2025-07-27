import React, { useState } from "react";
import {
  Modal,
  Table,
  Button,
  Space,
  Typography,
  Spin,
  Empty,
  message,
  Tag,
  Checkbox,
  Input,
  Select,
  DatePicker,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { UserAddOutlined, CalendarOutlined } from "@ant-design/icons";
import { useGetAvailableUsers } from "../../hooks/useGetAvailableUsers/useGetAvailableUsers";
import { useAssignUsersToActivity } from "../../hooks/useAssignUsersToActivity/useAssignUsersToActivity";
import dayjs from "dayjs";

const { Text, Title } = Typography;
const { Option } = Select;
const { Search } = Input;

interface AssignUsersModalProps {
  visible: boolean;
  activityId: number;
  onClose: () => void;
}

interface UserForActivity {
  id_usuario: number;
  nombres: string;
  apellidos: string;
  n_documento: string;
  telefono?: string;
  email?: string;
  fecha_nacimiento?: string;
  genero?: string;
  estado?: string;
  tiene_cronograma_fecha: boolean;
  estado_asistencia?: string;
}

export const AssignUsersModal: React.FC<AssignUsersModalProps> = ({
  visible,
  activityId,
  onClose,
}) => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [activityDate, setActivityDate] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [estadoParticipacion, setEstadoParticipacion] = useState<string>("PENDIENTE");
  const [observaciones, setObservaciones] = useState<string>("");

  const { data: availableUsersData, isLoading, error } = useGetAvailableUsers(activityDate);

  // DEBUG: Agregar logs para identificar el problema
  console.log("🔍 DEBUG AssignUsersModal:");
  console.log("activityDate:", activityDate);
  console.log("availableUsersData:", availableUsersData);
  console.log("availableUsersData.data:", (availableUsersData as any)?.data);
  console.log("availableUsersData.data.data:", (availableUsersData as any)?.data?.data);
  console.log("isLoading:", isLoading);
  console.log("error:", error);

  // Filtrar usuarios basado en el texto de búsqueda
  // Corregir la extracción de datos según la estructura de respuesta del backend
  const users: UserForActivity[] = Array.isArray((availableUsersData as any)?.data?.data) 
    ? (availableUsersData as any)?.data?.data 
    : [];
  
  console.log("users array:", users);
  console.log("users length:", users.length);

  const filteredUsers = users.filter((user: UserForActivity) =>
    `${user.nombres} ${user.apellidos} ${user.n_documento}`
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  console.log("filteredUsers:", filteredUsers);
  console.log("filteredUsers length:", filteredUsers.length);

  const assignUsersMutation = useAssignUsersToActivity(activityId);

  const handleAssignUsers = async () => {
    if (selectedUsers.length === 0) {
      message.warning("Selecciona al menos un usuario");
      return;
    }

    try {
      await assignUsersMutation.mutateAsync({
        usuarios_ids: selectedUsers,
        estado_participacion: estadoParticipacion,
        observaciones: observaciones || undefined,
      });
      message.success(`${selectedUsers.length} usuarios asignados exitosamente`);
      setSelectedUsers([]);
      onClose();
    } catch (error) {
      message.error("Error al asignar usuarios");
    }
  };

  const handleUserSelection = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
         if (checked) {
       setSelectedUsers(filteredUsers.map((user: UserForActivity) => user.id_usuario));
     } else {
      setSelectedUsers([]);
    }
  };

  const getCronogramaStatusColor = (tieneCronograma: boolean, estadoAsistencia?: string) => {
    if (!tieneCronograma) return "default";
    switch (estadoAsistencia) {
      case "CONFIRMADO":
        return "green";
      case "PENDIENTE":
        return "orange";
      case "CANCELADO":
        return "red";
      default:
        return "blue";
    }
  };

  const getCronogramaStatusText = (tieneCronograma: boolean, estadoAsistencia?: string) => {
    if (!tieneCronograma) return "Sin cronograma";
    switch (estadoAsistencia) {
      case "CONFIRMADO":
        return "Confirmado";
      case "PENDIENTE":
        return "Pendiente";
      case "CANCELADO":
        return "Cancelado";
      default:
        return "Programado";
    }
  };

  const columns: ColumnsType<UserForActivity> = [
    {
      title: "Seleccionar",
      key: "select",
      width: 80,
      render: (_, record: UserForActivity) => (
        <Checkbox
          checked={selectedUsers.includes(record.id_usuario)}
          onChange={(e) => handleUserSelection(record.id_usuario, e.target.checked)}
        />
      ),
    },
    {
      title: "Usuario",
      dataIndex: "nombres",
      key: "user",
      render: (nombres: string, record: UserForActivity) => (
        <div>
          <Text strong>{`${nombres} ${record.apellidos}`}</Text>
          <br />
          <Text type="secondary">{record.n_documento}</Text>
          {record.telefono && (
            <>
              <br />
              <Text type="secondary">{record.telefono}</Text>
            </>
          )}
        </div>
      ),
    },
    {
      title: "Cronograma",
      key: "schedule",
      render: (_, record: UserForActivity) => (
        <Tag
          color={getCronogramaStatusColor(record.tiene_cronograma_fecha, record.estado_asistencia)}
          icon={<CalendarOutlined />}
        >
          {getCronogramaStatusText(record.tiene_cronograma_fecha, record.estado_asistencia)}
        </Tag>
      ),
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "status",
      render: (estado: string) => (
        <Tag color={estado === "Activo" ? "green" : "red"}>{estado}</Tag>
      ),
    },
  ];

  return (
    <Modal
      title={
        <div>
          <Title level={4}>Asignar Usuarios a la Actividad</Title>
          <Text type="secondary">
            Selecciona los usuarios que participarán en esta actividad
          </Text>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancelar
        </Button>,
        <Button
          key="assign"
          type="primary"
          icon={<UserAddOutlined />}
          loading={assignUsersMutation.isPending}
          onClick={handleAssignUsers}
          disabled={selectedUsers.length === 0}
        >
          Asignar {selectedUsers.length} Usuario{selectedUsers.length !== 1 ? "s" : ""}
        </Button>,
      ]}
    >
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        {/* Configuración de la asignación */}
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <div>
            <Text strong>Fecha de la actividad:</Text>
            <br />
            <DatePicker
              value={activityDate ? dayjs(activityDate) : null}
              onChange={(date) => setActivityDate(date ? date.format("YYYY-MM-DD") : "")}
              placeholder="Seleccionar fecha"
              style={{ marginTop: 4 }}
            />
          </div>
          <div>
            <Text strong>Estado inicial:</Text>
            <br />
            <Select
              value={estadoParticipacion}
              onChange={setEstadoParticipacion}
              style={{ width: 150, marginTop: 4 }}
            >
              <Option value="PENDIENTE">Pendiente</Option>
              <Option value="CONFIRMADO">Confirmado</Option>
              <Option value="CANCELADO">Cancelado</Option>
            </Select>
          </div>
        </div>

        {/* Observaciones */}
        <div>
          <Text strong>Observaciones (opcional):</Text>
          <br />
          <Input.TextArea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Observaciones sobre la asignación..."
            rows={2}
            style={{ marginTop: 4 }}
          />
        </div>

        {/* Búsqueda */}
        <div>
          <Text strong>Buscar usuarios:</Text>
          <br />
          <Search
            placeholder="Buscar por nombre, apellido o documento..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ marginTop: 4 }}
          />
        </div>

        {/* Tabla de usuarios */}
        <div>
          <div style={{ marginBottom: 8 }}>
            <Checkbox
              checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
              indeterminate={selectedUsers.length > 0 && selectedUsers.length < filteredUsers.length}
              onChange={(e) => handleSelectAll(e.target.checked)}
            >
              <Text strong>
                Seleccionar todos ({selectedUsers.length} de {filteredUsers.length})
              </Text>
            </Checkbox>
          </div>

          {isLoading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <Spin size="large" />
              <div style={{ marginTop: "16px" }}>
                <Text>Cargando usuarios disponibles...</Text>
              </div>
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "40px", color: "red" }}>
              <Text type="danger">Error al cargar usuarios disponibles</Text>
              <br />
              <Text type="secondary">Error: {JSON.stringify(error)}</Text>
            </div>
          ) : !activityDate ? (
            <Empty
              description="Selecciona una fecha para ver los usuarios disponibles"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : filteredUsers.length === 0 ? (
            <Empty
              description="No hay usuarios disponibles para esta fecha"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <div style={{ marginTop: "16px" }}>
                <Text type="secondary">
                  Fecha seleccionada: {activityDate}
                </Text>
                <br />
                <Text type="secondary">
                  Usuarios encontrados: {users.length}
                </Text>
              </div>
            </Empty>
          ) : (
            <Table
              rowKey="id_usuario"
              dataSource={filteredUsers}
              columns={columns}
              pagination={{ pageSize: 10 }}
              size="small"
              scroll={{ y: 400 }}
            />
          )}
        </div>
      </Space>
    </Modal>
  );
}; 