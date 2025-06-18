import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';

function AddTransactionForm({ onSuccess }) {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    product: '',
    quantity: '',
    transaction_type: 'IN',
    date: ''  // 👈 Thêm trường date
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/api/products/')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Failed to fetch products:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "product" ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const payload = {
        product_id: formData.product,  // 👈 sửa thành product_id
        quantity: parseInt(formData.quantity),
        transaction_type: formData.transaction_type,
        date: formData.date || new Date().toISOString().slice(0, 10), // 👈 ISO date nếu không chọn
      };

      const res = await fetch('http://localhost:8000/api/transactions/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.error || 'Upload failed');
      }

      setMessage('✅ Transaction added successfully');
      setFormData({ product: '', quantity: '', transaction_type: 'IN', date: '' });
      onSuccess?.();
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <h5>Add New Transaction</h5>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2">
          <Form.Label>Product</Form.Label>
          <Form.Select
            name="product"
            value={formData.product}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Product --</option>
            {products.map(prod => (
              <option key={prod.id} value={prod.id}>{prod.name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Transaction Type</Form.Label>
          <Form.Select
            name="transaction_type"
            value={formData.transaction_type}
            onChange={handleChange}
          >
            <option value="IN">Import</option>
            <option value="OUT">Export</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button type="submit" disabled={loading}>
          {loading ? <Spinner size="sm" animation="border" /> : 'Add Transaction'}
        </Button>
      </Form>

      {message && <Alert variant="info" className="mt-2">{message}</Alert>}
    </div>
  );
}

export default AddTransactionForm;
