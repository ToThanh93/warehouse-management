import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

const EditForecastForm = ({ data, onCancel, onUpdated }) => {
  const [formData, setFormData] = useState({
    date: data.date,
    product: data.product,
    predicted_quantity: data.predicted_quantity
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http://127.0.0.1:8000/api/forecasts/${data.id}/`, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => {
        if (!res.ok) throw new Error("Cập nhật thất bại");
        return res.json();
      })
      .then(() => {
        onUpdated(); // reload lại
        onCancel();  // đóng form
      })
      .catch(err => setError(err.message));
  };

  return (
    <div className="mt-4 border p-3 rounded bg-light">
      <h5>✏️ Chỉnh sửa dự báo</h5>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2">
          <Form.Label>Day</Form.Label>
          <Form.Control type="date" name="date" value={formData.date} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Products</Form.Label>
          <Form.Control type="text" name="product" value={formData.product} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>forecast quantity</Form.Label>
          <Form.Control type="number" name="predicted_quantity" value={formData.predicted_quantity} onChange={handleChange} />
        </Form.Group>
        <div className="d-flex gap-2">
          <Button type="submit" variant="success">Save</Button>
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        </div>
      </Form>
    </div>
  );
};

export default EditForecastForm;
