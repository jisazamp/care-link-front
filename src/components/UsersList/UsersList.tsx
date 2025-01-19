import {
  Avatar,
  Breadcrumb,
  Card,
  Typography,
  List,
  Modal,
  Button,
} from "antd";
import type { User } from "../../types";
import { Link } from "react-router-dom";
import { useDeleteUserMutation } from "../../hooks/useDeleteUserMutation/useDeleteUserMutation";
import { useGetUsers } from "../../hooks/useGetUsers/useGetUsers";
import { useState } from "react";

const { Title } = Typography;

export const UsersList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const { data, isPending } = useGetUsers();
  const { mutateAsync: deleteUser, isPending: isDeletingUser } =
    useDeleteUserMutation();

  const showModal = (user: User) => {
    setIsModalOpen(true);
    setUserToDelete(user);
  };

  const handleOk = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete.id_usuario);
      setUserToDelete(null);
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setUserToDelete(null);
  };

  return (
    <>
      <Breadcrumb
        items={[
          { title: "Home" },
          { title: "Usuarios" },
          { title: "Lista usuarios" },
        ]}
        style={{ margin: "16px 0" }}
      />
      <Card title={<Title level={5}>Lista de usuarios</Title>}>
        <List
          dataSource={data?.data.data}
          itemLayout="horizontal"
          loading={isPending}
          pagination={{ position: "bottom", align: "end" }}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Link to={`/usuarios/${item.id_usuario}/editar`}>Editar</Link>,
                <Button type="link" onClick={() => showModal(item)}>
                  Eliminar
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    alt="Avatar"
                    size={40}
                    src="https://via.placeholder.com/72"
                  />
                }
                title={`${item.nombres} ${item.apellidos}`}
                description={item.email}
              />
              <Typography style={{ color: "rgba(0, 0, 0, 0.45)" }}>
                {item.estado === "ACTIVO" ? "Activo" : "Inactivo"}
              </Typography>
            </List.Item>
          )}
        />
      </Card>
      <Modal
        cancelText="No eliminar"
        okText="Sí, eliminar"
        open={isModalOpen}
        title="Confirmar acción"
        confirmLoading={isDeletingUser}
        okButtonProps={{
          type: "default",
          style: { backgroundColor: "#F32013" },
        }}
        cancelButtonProps={{
          type: "text",
        }}
        onCancel={handleCancel}
        onClose={handleCancel}
        onOk={handleOk}
      >
        <Typography.Paragraph
          style={{ marginBottom: "30px" }}
        >{`¿Está seguro que desea eliminar al usuario ${userToDelete?.nombres} ${userToDelete?.apellidos}? Esto es una acción destructiva y no se puede deshacer`}</Typography.Paragraph>
      </Modal>
    </>
  );
};
