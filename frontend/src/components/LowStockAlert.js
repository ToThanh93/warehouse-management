import { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";

const LowStockAlert = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/alerts/low-stock/")
      .then(res => res.json())
      .then(data => setAlerts(data))
      .catch(err => console.error("Failed to load low stock alerts:", err));
  }, []);

  if (alerts.length === 0) return null;

  return (
    <div className="my-4">
      <Alert variant="danger">
        <h5>🚨 Low Stock Alert</h5>
        <ul className="mb-0">
          {alerts.map((item, idx) => (
            <li key={idx}>
              <strong>{item.product}</strong> in <em>{item.warehouse}</em> has only <strong>{item.quantity}</strong> (Min Required: {item.min_quantity})
            </li>
          ))}
        </ul>
      </Alert>
    </div>
  );
};

export default LowStockAlert;
