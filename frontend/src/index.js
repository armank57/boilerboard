import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter, Route, Routes } from "react-router-dom";

import LogIn from './LogIn';
import ResetPassword from './ResetPassword';
import Discussions from './Discussions';
import CourseHome from './CourseHome';
import CreateQuiz from './CreateQuiz';
import StudyPage from './StudyPage';
import CreatePost from './CreatePost';


/*
  * The following examples are for routes:
  * <Route path="/login" element={<LogIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<NotFound />} />
  */
const root = ReactDOM.createRoot(document.getElementById('root'));
// note: route with exact path should be Landing page
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Routes>
        <Route 
          exact path="/" 
          element={<LogIn />} 
        />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/create-account" element={<h1>Create Account</h1>} />
        <Route path="/discussions" element={<Discussions />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/courses" element={<CourseHome />} />
        <Route path="/create-quiz" element={<CreateQuiz />} />
        <Route path="/study-page" element={<StudyPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
