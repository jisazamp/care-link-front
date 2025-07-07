import { HomeOutlined, DollarOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";

export const BillingBreadcrumb: React.FC = () => {
  return (
    <Breadcrumb
      style={{ marginBottom: 16 }}
      items={[
        { title: <HomeOutlined />, href: "/inicio" },
        { title: <DollarOutlined />, href: "/facturacion" },
        { title: "Gestión de Facturación" },
      ]}
    />
  );
}; 