import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/dashboard";
import Form from "./pages/Form/Form";
import Records from "./pages/Records/Table";
import Login from "./pages/Form/Login/Login";
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import { Provider } from 'react-redux';
import Viewrecord from "./pages/Viewrecord/Viewrecord";


function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />}/>
            <Route path="/create" element={<Form />}/>
            <Route path="/records" element={<Records />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/viewrecord" element={<Viewrecord/>} />
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
