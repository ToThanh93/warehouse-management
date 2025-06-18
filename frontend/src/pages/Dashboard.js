import React, { useEffect, useState } from 'react';
import { Table, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import ForecastChart from '../components/ForecastChart';

function Dashboard() {
  const [summary, setSummary] = useState({
    total_products: 0,
    total_warehouses: 0,
    total_transactions: 0
  });
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem('access');

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };

  fetch('http://localhost:8000/api/summary/', { headers })
    .then((res) => {
      if (!res.ok) throw new Error('Failed to fetch summary');
      return res.json();
    })
    .then((data) => setSummary(data))
    .catch((err) => console.error('Error fetching summary:', err));

  fetch('http://localhost:8000/api/transactions/', { headers })
    .then((res) => {
      if (!res.ok) throw new Error('Failed to fetch transactions');
      return res.json();
    })
    .then((data) => setTransactions(data))
    .catch((err) => console.error('Error fetching transactions:', err));
}, []);

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col md={4}>
          <Card className="card-red" onClick={() => navigate('/products')} style={{ cursor: 'pointer' }}>
            <Card.Body>
              <Card.Title>Total Products</Card.Title>
              <Card.Text>{summary.total_products}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="card-blue" onClick={() => navigate('/warehouses')} style={{ cursor: 'pointer' }}>
            <Card.Body>
              <Card.Title>Total Warehouses</Card.Title>
              <Card.Text>{summary.total_warehouses}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="card-green" onClick={() => navigate('/transactions')} style={{ cursor: 'pointer' }}>
            <Card.Body>
              <Card.Title>Total Transactions</Card.Title>
              <Card.Text>{summary.total_transactions}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card className="card-upload" onClick={() => navigate('/upload')} style={{ cursor: 'pointer' }}>
            <Card.Body>
              <Card.Title>📤 Upload CSV</Card.Title>
              <Card.Text>Import products or transactions</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="card-inventory" onClick={() => navigate('/inventory-overview')} style={{ cursor: 'pointer' }}>
            <Card.Body>
              <Card.Title>📦 Inventory Overview</Card.Title>
              <Card.Text>Check current stock levels</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <h4 className="text-center">Recent Transactions</h4>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>
                  <td>{transaction.product?.name || 'N/A'}</td>
                  <td>{transaction.quantity}</td>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <ForecastChart />
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
