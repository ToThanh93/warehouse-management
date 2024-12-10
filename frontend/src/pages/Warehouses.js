import React, { useEffect, useState } from 'react';
import { Table, Container } from 'react-bootstrap';

function Warehouses() {
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    // Thay thế URL này bằng API thực tế của bạn
    fetch('http://localhost:8000/api/inventory/')
      .then((res) => res.json())
      .then((data) => setWarehouses(data))
      .catch((err) => console.error('Error fetching warehouses:', err));
  }, []);

  return (
    <Container className="mt-4">
      <h1 className="text-center">Warehouses</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Location</th>
            <th>Capacity</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {warehouses.map((warehouse, index) => (
            <tr key={index}>
              <td>{warehouse.id}</td>
              <td>{warehouse.location || 'N/A'}</td>
              <td>{warehouse.capacity || 'N/A'}</td>
              <td>{warehouse.status || 'Active'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default Warehouses;
