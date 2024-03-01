
import './App.css';
import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from './routes/ProtectedRoutes';
import Home from "./pages/Home";
import Registration from './pages/Registration';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import ResetPasswordConfirm from './pages/ResetPasswordConfirm';
import ResetPasswordSentDialouge from './pages/ResetPasswordSentDialouge';
import Discussions from './pages/Discussions';

function App() {
  // TODO reset password path configure for user
  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />
      <Route path="/discussions/" element={
        <ProtectedRoute>
          <Discussions />
        </ProtectedRoute>
      }/>
      <Route path="/login/" element={<Login />} />
      <Route path="/register/" element={<Registration />} />
      <Route path="/reset-password/" element={<ResetPassword />} />
      <Route path="/reset-password-confirm/" element={<ResetPasswordConfirm />} />
      <Route path="/reset-password-dialogue/" element={<ResetPasswordSentDialouge />} />
    </Routes>
  );
}

export default App;
