import React, { useEffect, useState } from 'react';
import { Table, Container } from 'react-bootstrap';

function Transactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Thay thế URL này bằng API thực tế của bạn
    fetch('http://localhost:8000/api/transactions/')
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((err) => console.error('Error fetching transactions:', err));
  }, []);

  return (
    <Container className="mt-4">
      <h1 className="text-center">Transactions</h1>
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
          {transactions.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.id}</td>
              <td>{transaction.product.name || 'N/A'}</td>
              <td>{transaction.quantity}</td>
              <td>{new Date(transaction.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default Transactions;
