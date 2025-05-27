import React, { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';

function WarehousesList() {
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/warehouses/')
      .then((res) => res.json())
      .then((data) => setWarehouses(data))
      .catch((err) => console.error('Error fetching warehouses:', err));
  }, []);

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Warehouse List</h1>
      <Table striped bordered hover responsive>
        <thead className="table-dark">
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
              <td>{warehouse.status || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default WarehousesList;
