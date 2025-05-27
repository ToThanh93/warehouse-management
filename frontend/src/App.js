import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Transactions from './pages/Transactions';
import UploadCSVForm from './components/UploadCSVForm';
import InventoryOverview from './components/InventoryStatus'; // nếu file tên là InventoryStatus.js
// ✅ Thêm import đúng cho danh sách kho
import WarehouseList from './components/WarehouseList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/warehouses" element={<WarehouseList />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/upload" element={<UploadCSVForm />} />
        <Route path="/inventory-overview" element={<InventoryOverview />} />
      </Routes>
    </Router>
  );
}

export default App;
