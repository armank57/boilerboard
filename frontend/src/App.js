
import './App.css';
import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from './routes/ProtectedRoutes';
import Home from "./pages/Home";
import Registration from './pages/Registration';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';


function App() {
  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />
      <Route path="/login/" element={<Login />} />
      <Route path="/register/" element={<Registration />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}

export default App;
