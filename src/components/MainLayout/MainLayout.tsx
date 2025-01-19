import { Header } from "../Header/Header";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../Sidebar/Sidebar";

export const MainLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Layout>
        <Layout.Sider collapsible style={{ backgroundColor: "#FFF" }}>
          <Sidebar />
        </Layout.Sider>
        <Layout.Content style={{ padding: "16px" }}>
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
};
