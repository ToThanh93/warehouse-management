import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Transactions from './pages/Transactions';
import UploadCSVForm from './components/UploadCSVForm';
import InventoryOverview from './components/InventoryStatus';
import WarehouseList from './components/WarehouseList';
import LoginForm from './pages/LoginForm';
import PrivateRoute from './components/PrivateRoute'; 

function LoginPage() {
  const navigate = useNavigate();
  return <LoginForm onLogin={() => navigate('/')} />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <Products />
            </PrivateRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <PrivateRoute>
              <Transactions />
            </PrivateRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <PrivateRoute>
              <UploadCSVForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/warehouses"
          element={
            <PrivateRoute>
              <WarehouseList />
            </PrivateRoute>
          }
        />
        <Route
          path="/inventory-overview"
          element={
            <PrivateRoute>
              <InventoryOverview />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;