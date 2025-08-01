import { CalendarOutlined, HomeOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";

export const CronogramaBreadcrumb: React.FC = () => {
  return (
    <Breadcrumb
      style={{ marginBottom: 16 }}
      items={[
        { title: <HomeOutlined />, href: "/inicio" },
        { title: <CalendarOutlined />, href: "/cronograma" },
        { title: "Cronograma de Asistencia" },
      ]}
    />
  );
};
