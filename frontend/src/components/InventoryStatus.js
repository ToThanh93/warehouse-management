import React, { useEffect, useState } from 'react';
import axios from 'axios';

function InventoryStatus() {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    axios.get('/api/inventory/')
      .then(response => setInventory(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h2>Trạng thái tồn kho</h2>
      <ul>
        {inventory.map(item => (
          <li key={item.id}>
            {item.product.name}: {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InventoryStatus;
