import React, { useState, useEffect, useCallback } from 'react';
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { Spinner, Alert, Button, Form, Row, Col } from 'react-bootstrap';
import { saveAs } from 'file-saver';
import AddForecastForm from './AddForecastForm';
import EditForecastForm from './EditForecastForm';

const ForecastChart = () => {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedModel, setSelectedModel] = useState('ARIMA');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [editing, setEditing] = useState(null);

  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/inventory-alerts/')
      .then(res => res.json())
      .then(data => setAlerts(data))
      .catch(err => console.error("Error loading alerts:", err));
  }, []);

  // Load product list
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        if (data.length > 0) {
          setSelectedProduct(data[0].id);
        }
      })
      .catch(() => setError("Failed to load product list"));
  }, []);

  // Fetch forecast data
  const fetchForecastData = useCallback(() => {
    if (!selectedProduct) return;

    setLoading(true);
    setError(null);

    const url = `http://127.0.0.1:8000/api/v1/forecast/?product_id=${selectedProduct}&model=${selectedModel}`;
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch forecast data");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data.predictions)) {
          setForecast(data.predictions);
        } else if (Array.isArray(data)) {
          setForecast(data);
        } else {
          setForecast([]);
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || "Error loading forecast data");
        setLoading(false);
      });
  }, [selectedProduct, selectedModel]);

  // Trigger fetch when selection changes
  useEffect(() => {
    fetchForecastData();
  }, [fetchForecastData]);

  const filteredData = Array.isArray(forecast)
    ? forecast.filter(item => {
        const matchDate =
          (!startDate || item.date >= startDate) &&
          (!endDate || item.date <= endDate);
        return matchDate;
      })
    : [];

  const exportCSV = () => {
    const header = "date,product,predicted_quantity\n";
    const rows = filteredData.map(item =>
      `${item.date},${item.product},${item.predicted_quantity}`
    ).join("\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `forecast_product_${selectedProduct}.csv`);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this forecast?")) return;

    fetch(`http://127.0.0.1:8000/api/forecasts/${id}/`, {
      method: "DELETE"
    })
      .then(res => {
        if (!res.ok) throw new Error("Delete failed");
        setForecast(prev => prev.filter(item => item.id !== id));
      })
      .catch(err => alert("Delete error: " + err.message));
  };

  const handleEdit = (item) => {
    setEditing(item);
  };

  const handleUpdate = () => {
    fetchForecastData();
    setEditing(null);
  };

  return (
    <div className="mt-5 p-4 border rounded bg-white shadow-sm">
      {alerts.length > 0 && (
        <div className="alert alert-danger text-center">
          <h5>⚠️ Low Stock Alert</h5>
          <ul className="mb-0">
            {alerts.map((item, idx) => (
              <li key={idx}>
                <strong>{item.product}</strong>: {item.current_quantity} in stock (Min required: {item.min_qty})
              </li>
            ))}
          </ul>
        </div>
      )}
      <h4 className="text-center mb-3">📈 Forecast Demand</h4>

      {/* Filter Form */}
      {!loading && products.length > 0 && (
        <Form className="mb-4 text-center">
          <Row className="justify-content-center align-items-center">
            <Col md="2">
              <Form.Label>Select product</Form.Label>
              <Form.Select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md="2">
              <Form.Label>From date</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Col>
            <Col md="2">
              <Form.Label>To date</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Col>
            <Col md="2">
              <Form.Label>Model</Form.Label>
              <Form.Select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                <option value="ARIMA">ARIMA</option>
                <option value="LSTM">LSTM</option>
                <option value="HYBRID">Hybrid (ARIMA + LSTM)</option>
              </Form.Select>
            </Col>
            <Col md="2" className="mt-4">
              <Button variant="success" onClick={exportCSV}>
                📤 Export CSV
              </Button>
            </Col>
          </Row>
        </Form>
      )}

      {/* Spinner & Error */}
      {loading && <div className="text-center mt-4"><Spinner animation="border" variant="primary" /></div>}
      {error && <Alert variant="danger" className="text-center mt-3">{error}</Alert>}

      {/* Chart and Table */}
      {!loading && !error && filteredData.length > 0 && (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredData}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="predicted_quantity" stroke="#007bff" dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-4">
            <h5 className="text-center">📋 Detail Data</h5>
            <div className="table-responsive">
              <table className="table table-bordered table-striped text-center">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Product</th>
                    <th>Predicted Quantity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, idx) => {
                    const productId = typeof item.product === 'object' ? item.product.id : item.product;
                    const productName = products.find(p => String(p.id) === String(productId))?.name || 'N/A';
                    const isBelowMin = item.min_qty !== undefined && item.predicted_quantity < item.min_qty;

                    return (
                      <tr key={item.id || idx} className={isBelowMin ? "table-danger" : ""}>
                        <td>{idx + 1}</td>
                        <td>{item.date}</td>
                        <td>{productName}</td>
                        <td>
                          {item.predicted_quantity}
                          {isBelowMin && (
                            <span className="ms-2 badge bg-danger">⚠️ Below Min</span>
                          )}
                        </td>
                        <td>
                          <Button
                            variant="warning"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEdit(item)}
                          >
                            ✏️
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                          >
                            🗑️
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
</tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {!loading && !error && filteredData.length === 0 && (
        <p className="text-center mt-3">There is no forecast data in the selected range.</p>
      )}

      {editing && (
        <EditForecastForm
          data={editing}
          onCancel={() => setEditing(null)}
          onUpdated={handleUpdate}
        />
      )}

      <AddForecastForm onForecastAdded={handleUpdate} />
    </div>
  );
};

export default ForecastChart;
