import {
  CheckCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  CarOutlined,
  DollarOutlined,
  HomeOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import { getSelectedKey } from "../../utils/getSelectedKey";
import { useGetUserInfo } from "../../hooks/useGetUserInfo/useGetUserInfo";
import { checkPermissions } from "../../utils/checkRoles";

export const Sidebar = () => {
  const location = useLocation();
  const { data } = useGetUserInfo();
  const userRole = data?.data.data.role;
  const selectedKey = getSelectedKey(location.pathname);

  if (!userRole) return;

  const menuItems = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: "Inicio",
      children: [
        {
          key: "1.1",
          path: "/home",
          label: <Link to="/home">Tablero de Inicio</Link>,
        },
      ],
    },
    {
      key: "2",
      icon: <UserOutlined />,
      label: "Pacientes",
      children: [
        {
          key: "2.1",
          path: "/usuarios",
          label: <Link to="usuarios">Listado de usuarios</Link>,
        },
        {
          key: "2.2",
          path: "/usuarios",
          label: <Link to="usuarios/crear">Registrar nuevo usuario</Link>,
        },
      ],
    },
    {
      key: "7",
      icon: <HomeOutlined />,
      label: "Visitas Domiciliarias",
      children: [
        {
          key: "7.1",
          path: "/visitas-domiciliarias",
          label: <Link to="visitas-domiciliarias">Consultar visitas</Link>,
        },
        {
          key: "7.2",
          path: "/visitas-domiciliarias/usuarios",
          label: (
            <Link to="visitas-domiciliarias/usuarios">
              Registrar nueva visita
            </Link>
          ),
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
          path: "/actividades",
          label: <Link to="/actividades">Listado de actividades</Link>,
        },
        {
          key: "3.2",
          path: "/actividades",
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
          path: "/cronograma",
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
          path: "/transporte",
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
          path: "/facturacion",
          label: <Link to="/facturacion">Facturas del Sistema</Link>,
        },
      ],
    },
    {
      key: "8",
      icon: <TeamOutlined />,
      label: "Administración",
      children: [
        {
          key: "8.1",
          path: "/admin",
          label: <Link to="/admin">Listado de Usuarios</Link>,
        },
        {
          key: "8.2",
          path: "/admin",
          label: <Link to="/admin/registrar">Registrar Usuario</Link>,
        },
      ],
    },
  ];

  const filteredMenuItems = menuItems
    .map((item) => {
      const filteredChildren = item.children.filter((child) =>
        checkPermissions(child.path, userRole),
      );
      return filteredChildren.length > 0
        ? { ...item, children: filteredChildren }
        : null;
    })
    .filter(Boolean);

  return (
    <Menu
      items={filteredMenuItems}
      mode="inline"
      selectedKeys={[selectedKey]}
      style={{ backgroundColor: "#FFFFFF", fontWeight: "500" }}
      theme="light"
    />
  );
};
