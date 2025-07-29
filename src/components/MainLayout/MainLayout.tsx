import { Layout } from "antd";
import { type ReactNode, useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../Header/Header";
import { Sidebar } from "../Sidebar/Sidebar";

interface MainLayoutProps {
  children?: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Layout>
        <Layout.Sider
          collapsible
          collapsed={collapsed}
          style={{ backgroundColor: "#FFF" }}
          onCollapse={(collapsedState) => setCollapsed(collapsedState)}
        >
          <Sidebar />
        </Layout.Sider>
        <Layout.Content style={{ padding: "16px" }}>
          {children ?? <Outlet />}
        </Layout.Content>
      </Layout>
    </Layout>
  );
};
