import { Breadcrumb, Flex } from "antd";
import { CardAsistControl } from "./Components/CardAsistControl/CardAsistControl";
import { CardSheduActivities } from "./Components/CardSheduActivities/CardSheduActivities";
import { CardUserFlow } from "./Components/CardUserFlow/CardUserFlow";
import { GenericsCards } from "./Components/GenericsCards/GenericsCards"; // 📌 Nuevo componente importado

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
