import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/dashboard";
import Form from "./pages/Form/Form";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />}/>
        <Route path="/create" element={<Form />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
