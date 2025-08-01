import { Breadcrumb, Flex } from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetUserInfo } from "../../hooks/useGetUserInfo/useGetUserInfo";
import { CardAsistControl } from "../Contracts/components/CardAssistControl/CardAssistControl";
import { RolesEnum } from "../CreateAuthorizedUser/index.schema";
import { CardSheduActivities } from "./components/CardScheduActivities/CardScheduActivities";
import { CardUserFlow } from "./components/CardUserFlow/CardUserFlow";
import { GenericsCards } from "./components/GenericsCard/GenericsCard";

export const Home = () => {
  const { data } = useGetUserInfo();
  const userRole = data?.data.data.role;
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole === RolesEnum.Transporte) navigate("/transporte");
  }, [userRole, navigate]);

  return (
    <>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Inicio</Breadcrumb.Item>
        <Breadcrumb.Item>Tablero de Inicio</Breadcrumb.Item>
      </Breadcrumb>
      <Flex vertical gap="middle">
        <CardAsistControl />
        <Flex gap="middle">
          <CardUserFlow />
          <CardSheduActivities />
        </Flex>
        <GenericsCards />
      </Flex>
    </>
  );
};
