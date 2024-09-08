import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/dashboard";
import Form from "./pages/Form/Form";
import Records from "./pages/Records/Table";
import Login from "./pages/Form/Login/Login";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />}/>
        <Route path="/create" element={<Form />}/>
        <Route path="/records" element={<Records />}/>
        <Route path="/login" element={<Login />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
