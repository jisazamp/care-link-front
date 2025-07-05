export const getSelectedKey = (pathname: string): string => {
  if (pathname.startsWith("/inicio")) return "1";
  if (pathname.startsWith("/usuarios")) return "2.1";
  if (pathname === "/usuarios/crear") return "2.2";
  if (pathname.includes("nuevo-reporte")) return "2.3";
  if (pathname.startsWith("/actividades") && pathname !== "/actividades/crear")
    return "3.1";
  if (pathname === "/actividades/crear") return "3.2";
  if (pathname.startsWith("/cronograma")) return "4.1";
  return "";
};
