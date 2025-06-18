import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

const AddProductForm = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    unit: '',
    min_qty: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    try {
      const res = await fetch('http://127.0.0.1:8000/api/products/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(JSON.stringify(data));
      }

      setSuccess('✅ Product added successfully!');
      setForm({ name: '', description: '', category: '', unit: '', min_qty: '' });
    } catch (err) {
      setError(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="mt-4">
      <h5>➕ Add New Product</h5>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control name="name" value={form.name} onChange={handleChange} required />
        </Form.Group>
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control name="description" value={form.description} onChange={handleChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Category</Form.Label>
          <Form.Control name="category" value={form.category} onChange={handleChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Unit</Form.Label>
          <Form.Control name="unit" value={form.unit} onChange={handleChange} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Min Quantity</Form.Label>
          <Form.Control name="min_qty" type="number" value={form.min_qty} onChange={handleChange} />
        </Form.Group>

        <Button type="submit" className="mt-3" variant="primary">
          Add Product
        </Button>
      </Form>

      {success && <Alert className="mt-3" variant="success">{success}</Alert>}
      {error && <Alert className="mt-3" variant="danger">{error}</Alert>}
    </div>
  );
};

export default AddProductForm;
