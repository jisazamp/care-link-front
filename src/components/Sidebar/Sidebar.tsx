import { CheckCircleOutlined, UserOutlined, CalendarOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import { getSelectedKey } from "../../utils/getSelectedKey";

const menuItems = [
  {
    key: "2",
    icon: <UserOutlined />,
    label: "Pacientes",
    children: [
      { key: "2.1", label: <Link to="usuarios">Listado de usuarios</Link> },
      {
        key: "2.2",
        label: <Link to="usuarios/crear">Registrar nuevo usuario</Link>,
      },
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
  {
    key: "4",
    icon: <CalendarOutlined />,
    label: "Cronograma de Asistencia",
    children: [
      {
        key: "4.1",
        label: <Link to="/cronograma">Ver Cronograma</Link>,
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
