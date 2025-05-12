import { Breadcrumb } from "antd";
import { Route, Routes, useLocation, useParams } from "react-router-dom";
import { EditReport } from "./components/EditReport/EditReport";
import { NewReport } from "./components/NewReport/NewReport";
import { ViewReport } from "./components/ViewReport/ViewReport";
import { NewEvolutionReport } from "./components/NewEvolutionReport/NewEvolutionReport";

export const MedicalReport: React.FC = () => {
  const location = useLocation();
  const { id } = useParams();

  const breadcrumbItems = [
    { path: "/", label: "Home" },
    { path: "/usuarios", label: "Usuarios" },
  ];

  if (id) {
    breadcrumbItems.push({
      path: `/usuarios/${id}/detalles`,
      label: "Nombre_Usuario",
    });
  }

  if (location.pathname.includes("viewReport")) {
    breadcrumbItems.push({
      path: location.pathname,
      label: "Vista detalle Reporte clínico",
    });
  } else if (location.pathname.includes("newReport")) {
    breadcrumbItems.push({
      path: location.pathname,
      label: "Nuevo reporte de evolución clínica",
    });
  } else if (location.pathname.includes("EditReport")) {
    breadcrumbItems.push({
      path: location.pathname,
      label: "Nuevo reporte clínico",
    });
  }

  return (
    <div style={{ padding: "16px" }}>
      <Breadcrumb style={{ marginBottom: "16px" }}>
        {breadcrumbItems.map((item) => (
          <Breadcrumb.Item key={item.path}>{item.label}</Breadcrumb.Item>
        ))}
      </Breadcrumb>
      <Routes>
        <Route path="newReport" element={<NewReport />} />
        <Route path="viewReport" element={<ViewReport />} />
        <Route path="editReport" element={<EditReport />} />
        <Route path="nuevo-reporte-evolucion" element={<NewEvolutionReport />} />
      </Routes>
    </div>
  );
};
