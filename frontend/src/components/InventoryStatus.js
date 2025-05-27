import React, { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';

function InventoryOverview() {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/inventory/')
      .then((res) => res.json())
      .then((data) => setInventory(data))
      .catch((err) => console.error('Error fetching inventory:', err));
  }, []);

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">📦 Inventory Overview</h1>
      <Table striped bordered hover responsive>
        <thead className="table-dark text-center">
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>Warehouse</th>
            <th>Quantity</th>
            <th>Min Qty</th>
            <th>Max Qty</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item, index) => (
            <tr key={item.id}>
              <td className="text-center">{index + 1}</td>
              <td>{item.product?.name || 'N/A'}</td>
              <td>{item.warehouse || 'N/A'}</td>
              <td className="text-center">{item.quantity}</td>
              <td className="text-center">{item.min_quantity}</td>
              <td className="text-center">{item.max_quantity}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default InventoryOverview;
