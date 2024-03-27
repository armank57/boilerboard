
import './App.css';
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from './routes/ProtectedRoutes';
import Home from "./pages/Home";
import Registration from './pages/Registration';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import ResetPasswordConfirm from './pages/ResetPasswordConfirm';
import ResetPasswordSentDialouge from './pages/ResetPasswordSentDialouge';
import Discussions from './pages/Discussions';
import CourseHome from './pages/CourseHome';
import Course from './pages/Course';
import NewModule from './components/NewModule';
import CreatePost from './pages/CreatePost';
import ViewPost from './pages/ViewPost';
import { Create } from '@mui/icons-material';
import CreateQuiz from './pages/CreateQuiz';
import StudyPage from './pages/StudyPage';
import ResponsiveAppBar from './ResponsiveAppBar';
import ViewProfile from './pages/ViewProfile';
import VoiceChatApp from './pages/VoiceChatApp';

function App() {
  // TODO reset password path configure for user
  return (
    <div>
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <ResponsiveAppBar />
          <ViewProfile />
        </ProtectedRoute>
      } />
      <Route path="/discussions/" element={
        <ProtectedRoute>
          <ResponsiveAppBar />
          <Discussions />
        </ProtectedRoute>
      }/>
      <Route path="/courses/" element={
        <ProtectedRoute>
            <ResponsiveAppBar />
            <CourseHome />
        </ProtectedRoute>
      } />
      <Route path="/courses/:courseID" element={
        <ProtectedRoute>
            <ResponsiveAppBar />
            <Course />
        </ProtectedRoute>
      } />
      <Route path="/courses/:courseID/:sectionID/new-module" element={
        <ProtectedRoute>
            <ResponsiveAppBar />
            <NewModule />
        </ProtectedRoute>
      } />
      <Route path="/create-post/" element={
        <ProtectedRoute>
            <ResponsiveAppBar />
            <CreatePost />
        </ProtectedRoute>
      } />
      <Route path="/post/:id" element={
        <ProtectedRoute>
            <ResponsiveAppBar />
            <ViewPost />
        </ProtectedRoute>
      } />
      <Route path="/create-quiz/" element={
        <ProtectedRoute>
            <ResponsiveAppBar />
            <CreateQuiz />
        </ProtectedRoute>
      } />
      <Route path="/study-page/" element={
        <ProtectedRoute>
            <ResponsiveAppBar />
            <StudyPage />
        </ProtectedRoute>
      } />
      <Route path="/voice_chat/" element={
        <ProtectedRoute>
            <ResponsiveAppBar />
            <VoiceChatApp />
        </ProtectedRoute>
      } />
      <Route path="/login/" element={<Login />} />
      <Route path="/register/" element={<Registration />} />
      <Route path="/reset-password/" element={<ResetPassword />} />
      <Route path="/reset-password-confirm/" element={<ResetPasswordConfirm />} />
      <Route path="/reset-password-dialogue/" element={<ResetPasswordSentDialouge />} />
    </Routes>
    </div>
  );
}

export default App;
