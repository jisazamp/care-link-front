import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ConfigProvider } from "antd";
import { Home } from "./components/Home/Home";
import { Login } from "./components/Login/Login";
import { NewUser } from "./components/NewUser/NewUser";
import { MedicalRecord } from "./components/MedicalRecord/MedicalRecord";
import { UserDetails } from "./components/UserDetails/UserDetails";

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
          Tabs: {
            inkBarColor: "#9957C2",
            itemActiveColor: "#9957C2",
            itemSelectedColor: "#9957C2",
            itemHoverColor: "#9957C2",
          },
          Input: {
            activeBorderColor: "#9957C2",
            hoverBorderColor: "#9957C2",
          },
          Button: {
            defaultActiveBg: "#9957C2",
            defaultActiveColor: "#fff",
            defaultBg: "#9957C2",
            defaultColor: "#fff",
            defaultHoverBg: "#9957C2",
            defaultHoverBorderColor: "#9957C2",
            defaultHoverColor: "#FFF",
          },
        },
      }}
    >
      <Router>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/new-user" element={<NewUser />} />
          <Route path="/MedicalRecord" element={<MedicalRecord />} />
          <Route path="/UserDetails" element={<UserDetails />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};
