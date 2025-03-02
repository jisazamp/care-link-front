import { Breadcrumb, Flex } from "antd";
import { CardAsistControl } from "../Contracts/components/CardAssistControl/CardAssistControl";
import { CardSheduActivities } from "./components/CardScheduActivities/CardScheduActivities";
import { CardUserFlow } from "./components/CardUserFlow/CardUserFlow";
import { GenericsCards } from "./components/GenericsCard/GenericsCard";

export const Home = () => {
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
        {/* 🔹 Nueva sección con las tarjetas de gráficas */}
        <GenericsCards />
      </Flex>
    </>
  );
};
