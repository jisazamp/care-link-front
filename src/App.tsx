import "./index.css";
import { App as AntApp, ConfigProvider } from "antd";
import es from "antd/es/date-picker/locale/es_ES";
import esES from "antd/es/locale/es_ES";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ActivitiesList } from "./components/ActivitiesList/ActivitiesList";
import { ContractDetails } from "./components/Contracts/components/ContractDetails/ContractDetails";
import { FormContracts } from "./components/Contracts/components/FormContracts";
import { CreateActivityForm } from "./components/CreateActivity/CreateActivity";
import { CreateFamilyMember } from "./components/CreateFamilyMember/CreateFamilyMember";
//import { Home } from "./components/Home/Home";
import { Login } from "./components/Login/Login";
import { MainLayout } from "./components/MainLayout/MainLayout";
import { MedicalRecord } from "./components/MedicalRecord/MedicalRecord";
import { EditReport } from "./components/MedicalReport/components/EditReport/EditReport";
import { NewReport } from "./components/MedicalReport/components/NewReport/NewReport";
import { ViewReport } from "./components/MedicalReport/components/ViewReport/ViewReport";
import { NewUser } from "./components/NewUser/NewUser";
import { PrivateRoute } from "./components/PrivateRoute/PrivateRoute";
import { ShowMedicalReport } from "./components/ShowMedicalReport/ShowMedicalReport";
import { UserDetails } from "./components/UserDetails/UserDetails";
import { UserList } from "./components/UserList/UserList";
import { UsersList } from "./components/UsersList/UsersList";
import { NewEvolutionReport } from "./components/MedicalReport/components/NewEvolutionReport/NewEvolutionReport";
import { MMSETest } from "./components/PeriodicTests/MMSE";
import { YesavageTest } from "./components/PeriodicTests/Yesavage";
import { Cronograma } from "./components/Cronograma/Cronograma";
import { Transporte } from "./components/Transporte";
import { Billing } from "./components/Billing";
import { colors } from "./theme";

const spanishLocale = {
  ...es,
  lang: {
    ...es.lang,
    fieldDateFormat: "DD-MM-YYYY",
  },
};

const locale = {
  ...esES,
  DatePicker: esES.DatePicker && {
    ...esES.DatePicker,
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
          colorPrimary: colors.primary.main,
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
            hoverBorderColor: colors.primary.main,
            activeBorderColor: colors.primary.main,
            cellActiveWithRangeBg: "#9957C255",
            cellHoverBg: "#9957C255",
            cellRangeBorderColor: colors.primary.main,
          },
          Checkbox: {
            colorPrimary: colors.primary.main,
            colorPrimaryHover: colors.primary.main,
          },
        },
      }}
    >
      <AntApp>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<MainLayout />}>
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
              <Route
                path="/usuarios/:id/nuevo-reporte"
                element={
                  <PrivateRoute>
                    <NewReport />
                  </PrivateRoute>
                }
              />
              <Route
                path="/usuarios/:id/reportes/:reportId"
                element={
                  <PrivateRoute>
                    <EditReport />
                  </PrivateRoute>
                }
              />
              <Route
                path="/usuarios/:id/reportes/:reportId/detalles"
                element={
                  <PrivateRoute>
                    <ViewReport />
                  </PrivateRoute>
                }
              />
              <Route
                path="/usuarios/:id/reportes/:reportId/detalles/nuevo-reporte-evolucion"
                element={
                  <PrivateRoute>
                    <NewEvolutionReport />
                  </PrivateRoute>
                }
              />
              <Route
                path="/ShowMedicalReport"
                element={
                  <PrivateRoute>
                    <ShowMedicalReport />
                  </PrivateRoute>
                }
              />
              <Route
                path="/UserList"
                element={
                  <PrivateRoute>
                    <UserList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/usuarios/:id/contrato"
                element={
                  <PrivateRoute>
                    <FormContracts />
                  </PrivateRoute>
                }
              />
              <Route
                path="/usuarios/:id/contrato/:contractId/editar"
                element={
                  <PrivateRoute>
                    <FormContracts />
                  </PrivateRoute>
                }
              />
              <Route
                path="/usuarios/:id/contrato/:contractId"
                element={
                  <PrivateRoute>
                    <ContractDetails />
                  </PrivateRoute>
                }
              />
              <Route
                path="/actividades"
                element={
                  <PrivateRoute>
                    <ActivitiesList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/actividades/crear"
                element={
                  <PrivateRoute>
                    <CreateActivityForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/actividades/:id/editar"
                element={
                  <PrivateRoute>
                    <CreateActivityForm />
                  </PrivateRoute>
                }
              />
              <Route
                path="/pruebas/mmse"
                element={
                  <PrivateRoute>
                    <MMSETest />
                  </PrivateRoute>
                }
              />
              <Route
                path="/pruebas/yesavage"
                element={
                  <PrivateRoute>
                    <YesavageTest />
                  </PrivateRoute>
                }
              />
              <Route
                path="/cronograma"
                element={
                  <PrivateRoute>
                    <Cronograma />
                  </PrivateRoute>
                }
              />
              <Route
                path="/transporte"
                element={
                  <PrivateRoute>
                    <Transporte />
                  </PrivateRoute>
                }
              />
              <Route
                path="/facturacion"
                element={
                  <PrivateRoute>
                    <Billing />
                  </PrivateRoute>
                }
              />
            </Route>
            <Route path="*" element={<Navigate to="/usuarios" replace />} />
          </Routes>
        </Router>
      </AntApp>
    </ConfigProvider>
  );
};
