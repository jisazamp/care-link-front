import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import { Home } from "./components/Home/Home";

export const App = () => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            headerBg: "#22075E",
            triggerBg: "#fff",
            triggerColor: "#000",
          },
        },
      }}
    >
      <Router>
        <Routes>
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};
