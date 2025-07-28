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
import { Home } from "./components/Home/Home";
import { Login } from "./components/Login/Login";
import { MainLayout } from "./components/MainLayout/MainLayout";
import { MedicalRecord } from "./components/MedicalRecord/MedicalRecord";
import { EditMedicalReport } from "./components/MedicalReport/components/EditMedicalReport/EditMedicalReport";
import { NewReport } from "./components/MedicalReport/components/NewReport/NewReport";
import { HomeVisitNewReport } from "./components/MedicalReport/components/HomeVisitNewReport/HomeVisitNewReport";
import { HomeVisitNewVisit } from "./components/HomeVisitNewVisit/HomeVisitNewVisit";
import { HomeVisitsList } from "./components/HomeVisitsList/HomeVisitsList";
import { ViewReport } from "./components/MedicalReport/components/ViewReport/ViewReport";
import { NewUser } from "./components/NewUser/NewUser";
import { PrivateRoute } from "./components/PrivateRoute/PrivateRoute";
import { ShowMedicalReport } from "./components/ShowMedicalReport/ShowMedicalReport";
import { UserDetails } from "./components/UserDetails/UserDetails";
import { UserHomeVisitDetails } from "./components/UserHomeVisitDetails/UserHomeVisitDetails";
import { HomeVisitMedicalRecord } from "./components/HomeVisitMedicalRecord/HomeVisitMedicalRecord";
import { UserList } from "./components/UserList/UserList";
import { UsersList } from "./components/UsersList/UsersList";
import { UsersWithHomeVisitsList } from "./components/UsersWithHomeVisitsList/UsersWithHomeVisitsList";
import { NewEvolutionReport } from "./components/MedicalReport/components/NewEvolutionReport/NewEvolutionReport";
import { ViewEvolution } from "./components/MedicalReport/components/ViewEvolution/ViewEvolution";
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
                path="/home"
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
                path="/visitas-domiciliarias/usuarios"
                element={
                  <PrivateRoute>
                    <UsersWithHomeVisitsList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/visitas-domiciliarias/usuarios/:id/detalles"
                element={
                  <PrivateRoute>
                    <UserHomeVisitDetails />
                  </PrivateRoute>
                }
              />
              <Route
                path="/visitas-domiciliarias/usuarios/:id/historia"
                element={
                  <PrivateRoute>
                    <HomeVisitMedicalRecord />
                  </PrivateRoute>
                }
              />
              <Route
                path="/visitas-domiciliarias/usuarios/:id/nuevo-reporte"
                element={
                  <PrivateRoute>
                    <HomeVisitNewReport />
                  </PrivateRoute>
                }
              />
              <Route
                path="/visitas-domiciliarias/usuarios/:id/nueva-visita"
                element={
                  <PrivateRoute>
                    <HomeVisitNewVisit />
                  </PrivateRoute>
                }
              />
              <Route
                path="/visitas-domiciliarias/usuarios/:id/editar-visita/:visitaId"
                element={
                  <PrivateRoute>
                    <HomeVisitNewVisit />
                  </PrivateRoute>
                }
              />
              <Route
                path="/visitas-domiciliarias/usuarios/:id/editar"
                element={
                  <PrivateRoute>
                    <NewUser />
                  </PrivateRoute>
                }
              />
              <Route
                path="/visitas-domiciliarias/usuarios/:id/familiar"
                element={
                  <PrivateRoute>
                    <CreateFamilyMember />
                  </PrivateRoute>
                }
              />
              <Route
                path="/visitas-domiciliarias/usuarios/:id/familiar/:familyMemberId"
                element={
                  <PrivateRoute>
                    <CreateFamilyMember />
                  </PrivateRoute>
                }
              />
              <Route
                path="/visitas-domiciliarias/usuarios/:id/reportes/:reportId/detalles"
                element={
                  <PrivateRoute>
                    <ViewReport />
                  </PrivateRoute>
                }
              />
              <Route
                path="/visitas-domiciliarias/usuarios/:id/reportes/:reportId"
                element={
                  <PrivateRoute>
                    <EditMedicalReport />
                  </PrivateRoute>
                }
              />
              <Route
                path="/visitas-domiciliarias/usuarios/:id/reportes/:reportId/detalles/nuevo-reporte-evolucion"
                element={
                  <PrivateRoute>
                    <NewEvolutionReport />
                  </PrivateRoute>
                }
              />
              <Route
                path="/visitas-domiciliarias/usuarios/:id/reportes/:reportId/detalles/nuevo-reporte-evolucion/:evolutionId"
                element={
                  <PrivateRoute>
                    <NewEvolutionReport />
                  </PrivateRoute>
                }
              />
              <Route
                path="/visitas-domiciliarias/usuarios/:id/reportes/:reportId/detalles/ver-evolucion/:evolutionId"
                element={
                  <PrivateRoute>
                    <ViewEvolution />
                  </PrivateRoute>
                }
              />
              <Route
                path="/visitas-domiciliarias"
                element={
                  <PrivateRoute>
                    <HomeVisitsList />
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
                    <EditMedicalReport />
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
                path="/usuarios/:id/reportes/:reportId/detalles/nuevo-reporte-evolucion/:evolutionId"
                element={
                  <PrivateRoute>
                    <NewEvolutionReport />
                  </PrivateRoute>
                }
              />
              <Route
                path="/usuarios/:id/reportes/:reportId/detalles/ver-evolucion/:evolutionId"
                element={
                  <PrivateRoute>
                    <ViewEvolution />
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
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </Router>
      </AntApp>
    </ConfigProvider>
  );
};
