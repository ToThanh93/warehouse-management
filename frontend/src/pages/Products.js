import React, { useEffect, useState } from 'react';
import { Table, Container } from 'react-bootstrap';

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Thay thế URL này bằng API thực tế của bạn
    fetch('http://localhost:8000/api/products/')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error fetching products:', err));
  }, []);

  return (
    <Container className="mt-4">
      <h1 className="text-center">Products</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Description</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.description || 'N/A'}</td>
              <td>{product.category || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default Products;
