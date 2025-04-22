import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';
import './AnalyzeReports.css'; // Import the CSS file

const AnalyzeReports = () => {
  const { user } = useOutletContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrderData = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8080/backend/api/Company/view_orders.php',
        {
          companyOwnerID: user.companyOwnerID,
        }
      );
      setOrders(response.data);
    } catch (error) {
      setError('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, [user.companyOwnerID]);

  const totalSales = orders.reduce((total, order) => total + (order.quantity*order.price || 0), 0);
  const totalOrders = orders.length;
  const orderStatusCounts = orders.reduce((counts, order) => {
    counts[order.status] = (counts[order.status] || 0) + 1;
    return counts;
  }, {});

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="analyze-reports">
      <h3>Order Analysis Report</h3>
      <div className="report-summary">
        <p>Total Orders: {totalOrders}</p>
        <p>Total Sales: Rs. {totalSales}</p>
        <div className="order-status">
          <h4>Order Status Breakdown:</h4>
          <ul>
            {Object.entries(orderStatusCounts).map(([status, count]) => (
              <li key={status}>
                {status}: {count}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* You can add more detailed reports or charts here */}
    </div>
  );
};

export default AnalyzeReports;
