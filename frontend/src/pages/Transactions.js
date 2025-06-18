import React, { useEffect, useState } from 'react';
import { Table, Container } from 'react-bootstrap';
import AddTransactionForm from '../components/AddTransactionForm';

function Transactions() {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = () => {
    fetch('http://localhost:8000/api/transactions/')
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((err) => console.error('Error fetching transactions:', err));
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <Container className="mt-4">
      <h1 className="text-center">Transactions</h1>

      {/* Form thêm giao dịch */}
      <AddTransactionForm onSuccess={fetchTransactions} />

      <Table striped bordered hover responsive className="mt-4">
        <thead className="table-light text-center">
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Type</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {transactions.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.id}</td>
              <td>{transaction.product?.name || 'N/A'}</td>
              <td>{transaction.quantity}</td>
              <td>
                {transaction.transaction_type === 'IN' ? 'Import' : 
                 transaction.transaction_type === 'OUT' ? 'Export' : 
                 transaction.transaction_type}
              </td>
              <td>{new Date(transaction.date).toLocaleDateString('vi-VN')}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default Transactions;
