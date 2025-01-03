import {
  HomeOutlined,
  UserOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";

const menuItems = [
  { key: "1", icon: <HomeOutlined />, label: "Tablero de Inicio" },
  {
    key: "2",
    icon: <UserOutlined />,
    label: "Usuarios",
    children: [
      { key: "2.1", label: "Nuevo Usuario" },
      { key: "2.2", label: "Nuevo Reporte Clínico" },
      { key: "2.3", label: "Lista de Usuarios" },
    ],
  },
  {
    key: "3",
    icon: <CheckCircleOutlined />,
    label: "Gestión de Actividades",
  },
];

export const Sidebar = () => (
  <Menu
    theme="light"
    defaultSelectedKeys={["1"]}
    mode="inline"
    items={menuItems}
    style={{ backgroundColor: "#FFFFFF", fontWeight: "500" }}
  />
);
