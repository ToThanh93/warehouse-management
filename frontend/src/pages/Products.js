import React, { useEffect, useState } from 'react';
import { Table, Container } from 'react-bootstrap';
import AddProductForm from '../components/AddProductForm'; // đảm bảo đúng đường dẫn

function Products() {
  const [products, setProducts] = useState([]);

  // Hàm load sản phẩm
  const fetchProducts = () => {
    fetch('http://localhost:8000/api/products/')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error fetching products:', err));
  };

  useEffect(() => {
    fetchProducts(); // load ban đầu
  }, []);

  return (
    <Container className="mt-4">
      <h1 className="text-center">📦 Products</h1>

      {/* 🔽 Form thêm sản phẩm */}
      <AddProductForm onSuccess={fetchProducts} />

      {/* 🔽 Bảng hiển thị danh sách */}
      <Table striped bordered hover className="mt-4">
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
            <tr key={product.id}>
              <td>{index + 1}</td>
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
