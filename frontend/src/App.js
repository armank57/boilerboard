import logo from './logo.svg';
import './App.css';
import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from './routes/ProtectedRoutes';
import Home from "./pages/Home";
import Registration from './pages/Registration';

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
            <Home />
        </ProtectedRoute>
      } />
      <Route path="/login/" element={<div>Login</div>} />
      <Route path="/register/" element={<Registration />} />
    </Routes>
  );
}

export default App;
