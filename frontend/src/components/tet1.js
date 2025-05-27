import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button, Form, Row, Col } from 'react-bootstrap';

function ForecastChart() {
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedModel, setSelectedModel] = useState('ARIMA');

  useEffect(() => {
    // Load product list
    axios.get('http://localhost:8000/api/products/')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Failed to load products:', err));
  }, []);

  useEffect(() => {
    fetchForecast();
  }, [selectedProduct, selectedModel]);

  const fetchForecast = () => {
    axios.get(`http://localhost:8000/api/forecast/?product_id=${selectedProduct}&model=${selectedModel}`)
      .then(res => setData(res.data))
      .catch(err => console.error('Error loading forecast:', err));
  };

  const handleExport = () => {
    const csvRows = [
      ['Date', 'Predicted Quantity'],
      ...data.map(row => [row.date, row.predicted_quantity])
    ];
    const csvContent = csvRows.map(e => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'forecast_data.csv');
    link.click();
  };

  const filteredData = data.filter(row => {
    const date = new Date(row.date);
    const afterStart = startDate ? date >= new Date(startDate) : true;
    const beforeEnd = endDate ? date <= new Date(endDate) : true;
    return afterStart && beforeEnd;
  });

  const selectedProductName = products.find(p => p.id === selectedProduct)?.name || 'N/A';

  return (
    <div className="mt-5 p-4 border rounded bg-white shadow-sm">
      <div className="text-center mb-3">
        <h4 className="mb-2">
          📈 Forecast Demand
        </h4>
        <p className="text-muted">
          Forecasting future demand for <strong>{selectedProductName}</strong> using <strong>{selectedModel}</strong> model.
        </p>
      </div>

      <Row className="mb-3">
        <Col md={2}>
          <Form.Select value={selectedProduct} onChange={e => setSelectedProduct(Number(e.target.value))}>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Control
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </Col>
        <Col md={2}>
          <Form.Control
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </Col>
        <Col md={2}>
          <Form.Select value={selectedModel} onChange={e => setSelectedModel(e.target.value)}>
            <option value="ARIMA">ARIMA</option>
            <option value="LSTM">LSTM</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Button variant="success" onClick={handleExport}>📥 Export CSV</Button>
        </Col>
      </Row>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="predicted_quantity" stroke="#007bff" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>

      <h6 className="mt-4 text-center mb-2">📋 Detail data</h6>
      <div className="table-responsive">
        <table className="table table-bordered text-center">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Day</th>
              <th>Product</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{item.date}</td>
                <td>{selectedProductName}</td>
                <td>{item.predicted_quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ForecastChart;
