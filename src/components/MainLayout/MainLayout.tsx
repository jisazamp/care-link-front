import { Header } from "../Header/Header";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../Sidebar/Sidebar";
import { useState } from "react";

export const MainLayout = () => {
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
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
};
