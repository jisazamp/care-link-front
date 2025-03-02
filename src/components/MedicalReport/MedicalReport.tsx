import { Breadcrumb } from "antd";
import { EditReport } from "./components/EditReport/EditReport";
import { NewReport } from "./components/NewReport/NewReport";
import { Routes, Route, useLocation, useParams } from "react-router-dom";
import { ViewReport } from "./components/ViewReport/ViewReport";

export const MedicalReport: React.FC = () => {
  const location = useLocation();
  const { id } = useParams(); // Obtener ID del usuario desde la URL

  // Definir los breadcrumbs según la ruta actual
  const breadcrumbItems = [
    { path: "/", label: "Home" },
    { path: "/usuarios", label: "Usuarios" },
  ];

  if (id) {
    breadcrumbItems.push({
      path: `/usuarios/${id}/detalles`,
      label: `Nombre_Usuario`,
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
      {/* Breadcrumbs */}
      <Breadcrumb style={{ marginBottom: "16px" }}>
        {breadcrumbItems.map((item, index) => (
          <Breadcrumb.Item key={index}>{item.label}</Breadcrumb.Item>
        ))}
      </Breadcrumb>

      {/* Rutas */}
      <Routes>
        <Route path="newReport" element={<NewReport />} />
        <Route path="viewReport" element={<ViewReport />} />
        <Route path="editReport" element={<EditReport />} />
      </Routes>
    </div>
  );
};
