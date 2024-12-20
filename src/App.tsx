/* import AgregarAcudiente from "./components/agregarAcudiente";
import DetallesUsuario from "./components/DetallesUsuario"; // Componente DetallesUsuario
import HistoriaClinica from "./components/HistoriaClinica"; // Nuevo componente HistoriaClinica
import Home from "./components/Home";
import Login from "./components/Login";
import NuevoUsuario from "./components/NuevoUsuario";
import PrivateRoute from "./components/PrivateRoute"; */
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./components/Home/Home";

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
};
