import {
  ColumnHeightOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  FullscreenOutlined,
  ReloadOutlined,
  SearchOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Dropdown,
  Input,
  Layout,
  Menu,
  Modal,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import type React from "react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDeleteUserMutation } from "../../hooks/useDeleteUserMutation/useDeleteUserMutation";
import { useGetUsers } from "../../hooks/useGetUsers/useGetUsers";
import type { User } from "../../types";

const { Content } = Layout;
const { Title } = Typography;
const { confirm } = Modal;

export const UsersList: React.FC = () => {
  const { data, isPending, refetch } = useGetUsers();
  const { mutate: deleteUser } = useDeleteUserMutation();
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<User[] | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [sortKey, setSortKey] = useState<string>("nombre");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Filtro de usuarios por nombre, apellido o ambos
  const handleSearch = () => {
    if (!data?.data.data) return;
    const value = search.trim().toLowerCase();
    if (!value) {
      setFiltered(null);
      return;
    }
    setFiltered(
      data.data.data.filter((u) => {
        const nombre = u.nombres?.toLowerCase() ?? "";
        const apellido = u.apellidos?.toLowerCase() ?? "";
        const nombreCompleto = `${nombre} ${apellido}`.trim();
        return (
          nombre.includes(value) ||
          apellido.includes(value) ||
          nombreCompleto.includes(value)
        );
      }),
    );
    setPagination((p) => ({ ...p, current: 1 }));
  };

  const handleReset = () => {
    setSearch("");
    setFiltered(null);
    setPagination((p) => ({ ...p, current: 1 }));
    refetch();
  };

  // Lógica de ordenamiento
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // Ordenar y paginar los datos
  const users = useMemo(() => {
    let list = filtered ?? data?.data.data ?? [];
    // Ordenamiento
    list = [...list].sort((a, b) => {
      let aValue: any = "";
      let bValue: any = "";
      if (sortKey === "nombre") {
        aValue = `${a.nombres ?? ""} ${a.apellidos ?? ""}`.toLowerCase();
        bValue = `${b.nombres ?? ""} ${b.apellidos ?? ""}`.toLowerCase();
      } else if (sortKey === "estado") {
        aValue = a.estado ?? "";
        bValue = b.estado ?? "";
      } else if (sortKey === "fecha") {
        aValue = a.fecha_registro ?? "";
        bValue = b.fecha_registro ?? "";
      }
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    const start = (pagination.current - 1) * pagination.pageSize;
    return list.slice(start, start + pagination.pageSize);
  }, [filtered, data, pagination, sortKey, sortOrder]);

  // Confirmación de eliminación
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

  // Columnas de la tabla
  const columns = [
    {
      title: "",
      dataIndex: "avatar",
      key: "avatar",
      width: 70,
      render: (_: unknown, user: User) =>
        user.url_imagen ? (
          <Avatar src={user.url_imagen} size={40} />
        ) : (
          <Avatar style={{ backgroundColor: "#22075E" }} size={40}>
            {user.nombres?.[0] ?? "U"}
            {user.apellidos?.[0] ?? ""}
          </Avatar>
        ),
    },
    {
      title: "Nombre",
      dataIndex: "nombres",
      key: "nombres",
      width: 350,
      render: (_: unknown, user: User) => {
        // Calcular edad
        let edad = "";
        if (user.fecha_nacimiento) {
          const nacimiento = new Date(user.fecha_nacimiento);
          const hoy = new Date();
          let years = hoy.getFullYear() - nacimiento.getFullYear();
          const m = hoy.getMonth() - nacimiento.getMonth();
          if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
            years--;
          }
          edad = `${years} años`;
        }
        // Información secundaria
        const info = [
          user.n_documento,
          user.genero,
          user.fecha_nacimiento
            ? new Date(user.fecha_nacimiento).toLocaleDateString()
            : undefined,
          edad,
          user.estado_civil,
          user.direccion,
          user.telefono,
          user.email,
        ]
          .filter(Boolean)
          .join(" - ");
        return (
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontWeight: 500,
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user.nombres} {user.apellidos}
            </div>
            <div
              style={{
                color: "#888",
                fontSize: 13,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 320,
              }}
              title={info}
            >
              {info}
            </div>
          </div>
        );
      },
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      width: 100,
      render: (estado: string) => (
        <Tag color={estado === "ACTIVO" ? "green" : "default"}>
          {estado === "ACTIVO" ? "Activo" : "Inactivo"}
        </Tag>
      ),
    },
    {
      title: "Acciones",
      key: "acciones",
      width: 180,
      align: "center" as const,
      render: (_: unknown, user: User) => (
        <Space size="small">
          <Tooltip title="Detalles">
            <Link to={`/usuarios/${user.id_usuario}/detalles`}>
              <Button
                type="link"
                icon={<EyeOutlined />}
                style={{ color: "#22075E" }}
              >
                Detalles
              </Button>
            </Link>
          </Tooltip>
          <Tooltip title="Editar">
            <Link to={`/usuarios/${user.id_usuario}/editar`}>
              <Button
                type="link"
                icon={<EditOutlined />}
                style={{ color: "#22075E" }}
              >
                Editar
              </Button>
            </Link>
          </Tooltip>
          <Tooltip title="Eliminar">
            <Button
              type="link"
              icon={<DeleteOutlined />}
              style={{ color: "#22075E" }}
              danger
              onClick={() => showDeleteConfirm(user)}
            >
              Eliminar
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Opciones de ordenamiento para la toolbar de la tabla
  const sortMenu = (
    <Menu selectedKeys={[sortKey]}>
      <Menu.Item key="nombre" onClick={() => handleSort("nombre")}>
        Ordenar por nombre
      </Menu.Item>
      <Menu.Item key="estado" onClick={() => handleSort("estado")}>
        Ordenar por estado
      </Menu.Item>
      <Menu.Item key="fecha" onClick={() => handleSort("fecha")}>
        Ordenar por fecha de creación
      </Menu.Item>
    </Menu>
  );

  return (
    <Content className="content-wrapper" style={{ padding: "16px" }}>
      <Breadcrumb style={{ marginBottom: "16px" }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Usuarios</Breadcrumb.Item>
        <Breadcrumb.Item>Buscar usuarios</Breadcrumb.Item>
      </Breadcrumb>

      <Title level={3} className="page-title">
        Buscar usuarios
      </Title>

      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card className="detail-card">
          <Space
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Space>
              <Typography.Text strong>Buscar por</Typography.Text>
              <Input
                placeholder="Ingrese un valor"
                prefix={<SearchOutlined />}
                style={{ width: "300px" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onPressEnter={handleSearch}
                allowClear
              />
            </Space>
            <Space size="small">
              <Button type="default" onClick={handleReset}>
                Restablecer
              </Button>
              <Button type="primary" onClick={handleSearch}>
                Buscar
              </Button>
            </Space>
          </Space>
        </Card>

        <Card>
          <Table
            dataSource={users.map((u) => ({ ...u, key: u.id_usuario }))}
            columns={columns}
            loading={isPending}
            pagination={{
              total: (filtered ?? data?.data.data ?? []).length,
              current: pagination.current,
              pageSize: pagination.pageSize,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "30"],
              locale: { items_per_page: "/página" },
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} de ${total} usuarios`,
              onChange: (page, pageSize) =>
                setPagination({ current: page, pageSize }),
            }}
            title={() => (
              <Space
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography.Text strong>Lista de usuarios</Typography.Text>
                <Space>
                  <Dropdown overlay={sortMenu} trigger={["click"]}>
                    <Button>
                      Ordenar por{" "}
                      {sortKey === "nombre"
                        ? "nombre"
                        : sortKey === "estado"
                          ? "estado"
                          : "fecha de creación"}{" "}
                      <DownOutlined />
                    </Button>
                  </Dropdown>
                  <Button icon={<ReloadOutlined />} onClick={() => refetch()} />
                  <Button icon={<ColumnHeightOutlined />} />
                  <Button icon={<SettingOutlined />} />
                  <Button icon={<FullscreenOutlined />} />
                </Space>
              </Space>
            )}
          />
        </Card>
      </Space>
    </Content>
  );
};
