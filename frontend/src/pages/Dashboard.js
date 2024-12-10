import React, { useEffect, useState } from 'react';
import { Table, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate(); // Sử dụng để điều hướng

  useEffect(() => {
    fetch('http://localhost:8000/api/products/')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error fetching products:', err));

    fetch('http://localhost:8000/api/inventory/')
      .then((res) => res.json())
      .then((data) => setInventory(data))
      .catch((err) => console.error('Error fetching inventory:', err));

    fetch('http://localhost:8000/api/transactions/')
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((err) => console.error('Error fetching transactions:', err));
  }, []);

  return (
    <Container className="mt-4">
      <Row>
        <Col md={4}>
          <Card className="card-red" onClick={() => navigate('/products')} style={{ cursor: 'pointer' }}>
            <Card.Body>
              <Card.Title>Total Products</Card.Title>
              <Card.Text>{products.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="card-blue" onClick={() => navigate('/warehouses')} style={{ cursor: 'pointer' }}>
            <Card.Body>
              <Card.Title>Total Warehouses</Card.Title>
              <Card.Text>{inventory.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="card-green" onClick={() => navigate('/transactions')} style={{ cursor: 'pointer' }}>
            <Card.Body>
              <Card.Title>Total Transactions</Card.Title>
              <Card.Text>{transactions.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <h4 className="text-center">Recent Transactions</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.id}</td>
                  <td>{transaction.product.name || 'N/A'}</td>
                  <td>{transaction.quantity}</td>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
