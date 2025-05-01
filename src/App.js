import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home, Dice, Recipes, NotFound, Login, AuthCallback } from './pages';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dice" element={
            <ProtectedRoute>
              <Dice />
            </ProtectedRoute>
          } />
          <Route path="recipes" element={
            <ProtectedRoute>
              <Recipes />
            </ProtectedRoute>
          } />
          <Route path="login" element={<LoginPage />} />
          <Route path="auth/callback" element={<AuthCallbackPage />} />
          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
