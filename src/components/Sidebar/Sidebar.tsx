import {
  HomeOutlined,
  UserOutlined,
  CarOutlined,
  HddOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { Link } from "react-router-dom";

const menuItems = [
  {
    key: "1",
    icon: <HomeOutlined />,
    label: <Link to="home">Tablero de inicio</Link>,
  },
  {
    key: "2",
    icon: <UserOutlined />,
    label: "Usuarios",
    children: [
      { key: "2.1", label: <Link to="usuarios/crear">Nuevo Usuario</Link> },
      { key: "2.2", label: <Link to ="home"> Nuevo reporte Clinico</Link>},
      { key: "2.3", label: <Link to="usuarios">Listado de usuarios</Link> },
      
    ],
  },
  {
    key: "3",
    icon: <CarOutlined />,
    label: "Visitas domiciliarias",
  },

  {
    key: "4",
    icon: <HddOutlined />,
    label: "Administración",
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
