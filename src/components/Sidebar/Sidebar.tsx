import {
  HomeOutlined,
  UserOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { Link } from "react-router-dom";

const menuItems = [
  {
    key: "1",
    icon: <HomeOutlined />,
    label: <Link to="home">Inicio</Link>,
  },
  {
    key: "2",
    icon: <UserOutlined />,
    label: "Pacientes",
    children: [
      { key: "2.1", label: <Link to="usuarios">Listado de usuarios</Link> },
      {
        key: "2.2",
        label: <Link to="usuarios/crear">Registrar nuevo usuarios</Link>,
      },
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
