import {
  ColumnHeightOutlined,
  DownOutlined,
  FullscreenOutlined,
  ReloadOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
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
      fixed: "left" as const,
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
      title: "",
      dataIndex: "nombres",
      key: "nombres",
      ellipsis: true,
      render: (_: unknown, user: User) => {
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
          .join(" | ");
        return (
          <div style={{ minWidth: 0, width: "100%" }}>
            <div
              style={{
                fontWeight: 500,
                textTransform: "none",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "100%",
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
                width: "100%",
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
      title: "",
      dataIndex: "estado",
      key: "estado",
      width: 100,
      align: "center" as const,
      render: (estado: string) => (
        <span style={{ color: "#888", fontSize: 14 }}>{estado === "ACTIVO" ? "Activo" : "Inactivo"}</span>
      ),
    },
    {
      title: "",
      key: "acciones",
      width: 180,
      fixed: "right" as const,
      align: "center" as const,
      render: (_: unknown, user: User) => {
        const menu = (
          <Menu>
            <Menu.Item key="details">
              <Link to={`/usuarios/${user.id_usuario}/detalles`} style={{ color: '#7f34b4' }}>
                Ver detalles
              </Link>
            </Menu.Item>
          </Menu>
        );
        return (
          <Space size="small">
            <Tooltip title="Editar">
              <Link to={`/usuarios/${user.id_usuario}/editar`}>
                <Button
                  type="link"
                  icon={null}
                  style={{ color: "#7f34b4" }}
                >
                  Editar
                </Button>
              </Link>
            </Tooltip>
            <Tooltip title="Eliminar">
              <Button
                type="link"
                icon={null}
                style={{ color: "#7f34b4" }}
                danger
                onClick={() => showDeleteConfirm(user)}
              >
                Eliminar
              </Button>
            </Tooltip>
            <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
              <Button type="text" style={{ color: '#7f34b4', fontSize: 20, padding: '0 8px' }}>...</Button>
            </Dropdown>
          </Space>
        );
      },
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
    <Content className="content-wrapper" style={{ padding: "16px", width: "100%" }}>
      <Breadcrumb style={{ marginBottom: "16px" }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Usuarios</Breadcrumb.Item>
        <Breadcrumb.Item>Buscar usuarios</Breadcrumb.Item>
      </Breadcrumb>

      <Title level={3} className="page-title">
        Buscar usuarios
      </Title>

      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card className="usuarios-search-card" style={{ width: "100%" }}>
          <div className="usuarios-search-body" style={{ width: "100%" }}>
            <div className="usuarios-search-left" style={{ flex: 1, minWidth: 0 }}>
              <span className="usuarios-search-label">Buscar por</span>
              <QuestionCircleOutlined style={{ fontSize: 16, color: "rgba(0,0,0,0.65)", marginLeft: 4, marginRight: 4, verticalAlign: "middle" }} />
              <span className="usuarios-search-colon">:</span>
              <Input
                className="usuarios-search-input"
                placeholder="Ingrese un valor"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onPressEnter={handleSearch}
                allowClear
                bordered={false}
                style={{ 
                  boxShadow: "none", 
                  height: 32, 
                  fontSize: 14, 
                  verticalAlign: "middle",
                  width: "100%",
                  flex: 1,
                  minWidth: 200
                }}
              />
            </div>
            <div className="usuarios-search-actions" style={{ flexShrink: 0 }}>
              <Button className="usuarios-btn-secondary" style={{ height: 32, fontWeight: 400 }} onClick={handleReset}>
                Restablecer
              </Button>
              <Button className="usuarios-btn-primary" style={{ height: 32, fontWeight: 400, display: "flex", alignItems: "center" }} onClick={handleSearch} icon={<SearchOutlined style={{ fontSize: 16, marginRight: 4 }} />}>
                Buscar
              </Button>
              <Button type="text" style={{ color: '#7f34b4', height: 32, fontWeight: 400, fontSize: 14, padding: '0 8px' }}>
                Más Opciones <DownOutlined />
              </Button>
            </div>
          </div>
        </Card>

        <Card style={{ width: "100%" }}>
          <Table
            className="usuarios-table"
            dataSource={users.map((u) => ({ ...u, key: u.id_usuario }))}
            columns={columns}
            loading={isPending}
            showHeader={false}
            style={{ width: "100%" }}
            scroll={{ x: "max-content" }}
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
                    <Button type="text" style={{ color: '#595959', fontWeight: 400, fontSize: 14 }}>
                      Ordenar por {sortKey === "nombre"
                        ? "nombre"
                        : sortKey === "estado"
                        ? "estado"
                        : "fecha de creación"} <DownOutlined style={{ color: '#595959' }} />
                    </Button>
                  </Dropdown>
                  <Button type="text" icon={<ReloadOutlined style={{ color: '#595959', fontSize: 18 }} />} onClick={() => refetch()} />
                  <Button type="text" icon={<ColumnHeightOutlined style={{ color: '#595959', fontSize: 18 }} />} />
                  <Button type="text" icon={<SettingOutlined style={{ color: '#595959', fontSize: 18 }} />} />
                  <Button type="text" icon={<FullscreenOutlined style={{ color: '#595959', fontSize: 18 }} />} />
                </Space>
              </Space>
            )}
          />
        </Card>
      </Space>
    </Content>
  );
};
