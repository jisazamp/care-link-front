import "./index.css";
import es from "antd/es/date-picker/locale/es_ES";
import esES from "antd/es/locale/es_ES";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ConfigProvider } from "antd";
import { Home } from "./components/Home/Home";
import { Login } from "./components/Login/Login";
import { MedicalRecord } from "./components/MedicalRecord/MedicalRecord";
import { NewUser } from "./components/NewUser/NewUser";
import { UserDetails } from "./components/UserDetails/UserDetails";
import { PrivateRoute } from "./components/PrivateRoute/PrivateRoute";
import { MainLayout } from "./components/MainLayout/MainLayout";
import { UsersList } from "./components/UsersList/UsersList";
import { CreateFamilyMember } from "./components/CreateFamilyMember/CreateFamilyMember";

export const colors = {
  primary: {
    main: "#9957C2",
    secondary: "#22075E",
    link: "#7F34B4",
  },
};

const spanishLocale: typeof es = {
  ...es,
  lang: {
    ...es.lang,
    fieldDateFormat: "DD-MM-YYYY",
  },
};

const locale: typeof esES = {
  ...esES,
  DatePicker: {
    ...esES.DatePicker!,
    lang: spanishLocale.lang,
  },
};

export const App = () => {
  return (
    <ConfigProvider
      locale={locale}
      theme={{
        token: {
          borderRadius: 2,
        },
        components: {
          Layout: {
            headerBg: colors.primary.secondary,
            triggerBg: "#fff",
            triggerColor: "#000",
          },
          Tabs: {
            inkBarColor: colors.primary.main,
            itemActiveColor: colors.primary.main,
            itemSelectedColor: colors.primary.main,
            itemHoverColor: colors.primary.main,
          },
          Input: {
            activeBorderColor: colors.primary.main,
            hoverBorderColor: colors.primary.main,
          },
          Button: {
            defaultActiveBg: colors.primary.main,
            defaultActiveColor: "#fff",
            defaultBg: colors.primary.main,
            defaultColor: "#fff",
            defaultHoverBg: colors.primary.main,
            defaultHoverBorderColor: colors.primary.main,
            defaultHoverColor: "#FFF",
          },
          Select: {
            hoverBorderColor: colors.primary.main,
            activeBorderColor: colors.primary.main,
            optionSelectedBg: "#9957C255",
          },
          DatePicker: {
            ...esES.DatePicker,
            hoverBorderColor: colors.primary.main,
            activeBorderColor: colors.primary.main,
          },
          Checkbox: {
            colorPrimary: colors.primary.main,
            colorPrimaryHover: colors.primary.main,
          },
        },
      }}
    >
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<MainLayout />}>
            <Route
              path="/inicio"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/usuarios"
              element={
                <PrivateRoute>
                  <UsersList />
                </PrivateRoute>
              }
            />
            <Route
              path="/usuarios/crear"
              element={
                <PrivateRoute>
                  <NewUser />
                </PrivateRoute>
              }
            />
            <Route
              path="/usuarios/:id/editar"
              element={
                <PrivateRoute>
                  <NewUser />
                </PrivateRoute>
              }
            />
            <Route
              path="/usuarios/:id/detalles"
              element={
                <PrivateRoute>
                  <UserDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/usuarios/:id/familiar"
              element={
                <PrivateRoute>
                  <CreateFamilyMember />
                </PrivateRoute>
              }
            />
            <Route
              path="/usuarios/:id/familiar/:familyMemberId"
              element={
                <PrivateRoute>
                  <CreateFamilyMember />
                </PrivateRoute>
              }
            />
            <Route
              path="/usuarios/:id/historia"
              element={
                <PrivateRoute>
                  <MedicalRecord />
                </PrivateRoute>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/inicio" replace />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};
