

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login"
import HomeAlumno from "./pages/homeAlumno";
import HomeDocente from "./pages/homeDocente";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/alumno" element={<HomeAlumno />} />
        <Route path="/docente" element={<HomeDocente />} />
      </Routes>
    </Router>
  );
}

export default App;
