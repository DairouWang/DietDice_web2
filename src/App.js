import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import amplifyConfig from './amplify_outputs.json';
import { Home, Dice, Recipes, NotFound, Login } from './pages';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// 配置 Amplify
Amplify.configure(amplifyConfig);

function App() {
  return (
    <AuthProvider>
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
            <Route path="login" element={<Login />} />
            <Route path="404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
