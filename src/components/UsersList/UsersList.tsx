import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  List,
  Modal,
  Typography,
} from "antd";
import { Link } from "react-router-dom";
import { useDeleteUserMutation } from "../../hooks/useDeleteUserMutation/useDeleteUserMutation";
import { useGetUsers } from "../../hooks/useGetUsers/useGetUsers";
import type { User } from "../../types";

const { Title } = Typography;
const { confirm } = Modal;

export const UsersList = () => {
  const { data, isPending } = useGetUsers();
  const { mutate: deleteUser } = useDeleteUserMutation();

  const showDeleteConfirm = (user: User) => {
    confirm({
      title: "Confirmar acción",
      content: `¿Está seguro que desea eliminar al usuario ${user.nombres} ${user.apellidos}? Esto es una acción destructiva y no se puede deshacer`,
      okText: "Sí, eliminar",
      cancelText: "No eliminar",
      cancelButtonProps: {
        type: "primary",
        style: { backgroundColor: "#F32013" },
      },
      okButtonProps: { type: "link", style: { color: "#000" } },
      onOk: () => {
        deleteUser(user.id_usuario);
      },
    });
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
              key={item.id_usuario}
              actions={[
                <Link
                  key={`details/${item.id_usuario}`}
                  to={`/usuarios/${item.id_usuario}/detalles`}
                >
                  <Button type="link" className="main-button-link">
                    Detalles
                  </Button>
                </Link>,
                <Link
                  key={`edit/${item.id_usuario}`}
                  to={`/usuarios/${item.id_usuario}/editar`}
                >
                  <Button type="link" className="main-button-link">
                    Editar
                  </Button>
                </Link>,
                <Button
                  type="link"
                  onClick={() => showDeleteConfirm(item)}
                  danger
                  key="eiminar"
                >
                  Eliminar
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  item.url_imagen ? (
                    <Avatar alt="Avatar" size={40} src={item.url_imagen} />
                  ) : null
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
    </>
  );
};
