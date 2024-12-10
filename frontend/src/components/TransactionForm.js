import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';

function TransactionForm() {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState('');
  const [transactionType, setTransactionType] = useState('IN');
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    axios.get('/api/products/')
      .then(response => setProducts(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/transactions/', {
      product: product,
      transaction_type: transactionType,
      quantity: quantity,
      user: 1, // Giả sử người dùng có id là 1
    })
    .then(response => {
      alert('Giao dịch thành công!');
    })
    .catch(error => {
      console.error(error);
      alert('Có lỗi xảy ra!');
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2>Ghi nhận giao dịch</h2>
      <Form.Group controlId="formProduct">
        <Form.Label>Sản phẩm:</Form.Label>
        <Form.Control as="select" value={product} onChange={e => setProduct(e.target.value)}>
          <option value="">Chọn sản phẩm</option>
          {products.map(prod => (
            <option key={prod.id} value={prod.id}>{prod.name}</option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="formTransactionType">
        <Form.Label>Loại giao dịch:</Form.Label>
        <Form.Control as="select" value={transactionType} onChange={e => setTransactionType(e.target.value)}>
          <option value="IN">Nhập kho</option>
          <option value="OUT">Xuất kho</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="formQuantity">
        <Form.Label>Số lượng:</Form.Label>
        <Form.Control type="number" value={quantity} onChange={e => setQuantity(e.target.value)} />
      </Form.Group>

      <Button variant="primary" type="submit" className="mt-3">
        Ghi nhận
      </Button>
    </Form>
  );
}

export default TransactionForm;
