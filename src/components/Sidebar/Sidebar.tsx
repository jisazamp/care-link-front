import { CheckCircleOutlined, UserOutlined, CalendarOutlined, CarOutlined, DollarOutlined, HomeOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import { getSelectedKey } from "../../utils/getSelectedKey";

const menuItems = [
  {
    key: "1",
    icon: <HomeOutlined />,
    label: "Inicio",
    children: [
      { key: "1.1", label: <Link to="/home">Tablero de Inicio</Link> },
    ],
  },
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
    key: "7",
    icon: <HomeOutlined />,
    label: "Visitas Domiciliarias",
    children: [
      { key: "7.1", label: <Link to="visitas-domiciliarias">Consultar visitas</Link> },
      { key: "7.2", label: <Link to="visitas-domiciliarias/usuarios">Registrar nueva visita</Link> },
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
  {
    key: "5",
    icon: <CarOutlined />,
    label: "Gestión de Transporte",
    children: [
      {
        key: "5.1",
        label: <Link to="/transporte">Rutas de Transporte</Link>,
      },
    ],
  },
  {
    key: "6",
    icon: <DollarOutlined />,
    label: "Gestión de Facturación",
    children: [
      {
        key: "6.1",
        label: <Link to="/facturacion">Facturas del Sistema</Link>,
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
