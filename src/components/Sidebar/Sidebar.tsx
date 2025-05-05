import {
  CheckCircleOutlined,
  HomeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import { getSelectedKey } from "../../utils/getSelectedKey";

const menuItems = [
  {
    key: "1",
    icon: <HomeOutlined />,
    label: <Link to="inicio">Inicio</Link>,
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
      { key: "2.3", label: "Nuevo Reporte Clínico" },
    ],
  },
  {
    key: "3",
    icon: <CheckCircleOutlined />,
    label: "Gestión de Actividades",
    children: [
      {
        key: "3.1",
        label: <Link to="/actividades">Listado de actividades</Link>,
      },
      {
        key: "3.2",
        label: (
          <Link to="/actividades/crear">Registrar nuevas actividades</Link>
        ),
      },
    ],
  },
];

export const Sidebar = () => {
  const location = useLocation();
  const selectedKey = getSelectedKey(location.pathname);

  return (
    <Menu
      items={menuItems}
      mode="inline"
      selectedKeys={[selectedKey]}
      style={{ backgroundColor: "#FFFFFF", fontWeight: "500" }}
      theme="light"
    />
  );
};
