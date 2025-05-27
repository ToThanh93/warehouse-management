import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

const AddForecastForm = ({ onForecastAdded }) => {
  const [formData, setFormData] = useState({
    date: '',
    product: '',
    predicted_quantity: ''
  });

  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://127.0.0.1:8000/api/forecasts/", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(res => {
        if (!res.ok) throw new Error("Lỗi khi gửi dữ liệu");
        return res.json();
      })
      .then(data => {
        setSuccess("Đã thêm dự báo thành công!");
        setError(null);
        setFormData({ date: '', product: '', predicted_quantity: '' });
        if (onForecastAdded) onForecastAdded(); // reload dữ liệu nếu cần
      })
      .catch(err => {
        setError(err.message);
        setSuccess(null);
      });
  };

  return (
    <div className="mt-4">
      <h5>➕ add new forecast</h5>
      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-2">
          <Form.Label>Day</Form.Label>
          <Form.Control type="date" name="date" value={formData.date} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Products</Form.Label>
          <Form.Control type="text" name="product" value={formData.product} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Forecast quantity</Form.Label>
          <Form.Control type="number" name="predicted_quantity" value={formData.predicted_quantity} onChange={handleChange} required />
        </Form.Group>
        <Button type="submit" variant="primary">Send</Button>
      </Form>
    </div>
  );
};

export default AddForecastForm;
