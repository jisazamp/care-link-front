import {

  LogoutOutlined,

  UserOutlined,
} from "@ant-design/icons";
import { Avatar,  Button, Flex, Layout, Tooltip, Typography } from "antd";
import { useGetUserInfo } from "../../hooks/useGetUserInfo/useGetUserInfo";
import { queryClient } from "../../main";
import { useAuthStore } from "../../store/auth";

const { Header: AntHeader } = Layout;

export const Header = () => {
  const setJwtToken = useAuthStore((state) => state.setJwtToken);
  const { data } = useGetUserInfo();

  const onLogout = () => {
    setJwtToken(null);
    queryClient.invalidateQueries({
      queryKey: ["get-user-info"],
    });
  };

  return (
    <AntHeader
      style={{
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
        padding: "13px 16px",
      }}
    >
      <Typography.Title
        style={{
          color: "#fff",
          fontSize: "16px",
          margin: 0,
        }}
      >
        Sistema de Gestión
      </Typography.Title>
      <Flex gap="middle">
        {/*<Tooltip title="Buscar">
          <Button
            type="text"
            shape="circle"
            icon={<SearchOutlined style={{ color: "#fff" }} />}
          />
        </Tooltip>
        <Tooltip title="Ayuda">
          <Button
            type="text"
            shape="circle"
            icon={<QuestionCircleOutlined style={{ color: "#fff" }} />}
          />
        </Tooltip>
        <Tooltip title="Notificaciones">
          <Button
            type="text"
            shape="circle"
            icon={
              <Badge count={11}>
                <BellOutlined style={{ color: "#fff" }} />
              </Badge>
            }
          />
        </Tooltip>*/}
        <Flex gap="small" style={{ alignItems: "center" }}>
          <Avatar icon={<UserOutlined />} />
          <Typography.Paragraph style={{ color: "#fff", margin: 0 }}>
            {`${data?.data.data.first_name ?? ""} ${data?.data.data.last_name ?? ""}`}
          </Typography.Paragraph>
        </Flex>
        <Tooltip title="Cerrar sesión">
          <Button
            type="text"
            shape="circle"
            icon={<LogoutOutlined style={{ color: "#fff" }} />}
            onClick={onLogout}
          />
        </Tooltip>
      </Flex>
    </AntHeader>
  );
};
