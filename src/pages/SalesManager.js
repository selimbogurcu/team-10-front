import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const SalesManagerDashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch sales stats
      const salesResponse = await axios.get('/api/salesmanager/sales');
      setSalesData(salesResponse.data);

      // Fetch all orders
      const ordersResponse = await axios.get('/api/orders');
      setOrders(ordersResponse.data);

      // Fetch top-performing products
      const productsResponse = await axios.get('/api/salesmanager/top-products');
      setTopProducts(productsResponse.data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Sales Manager Dashboard</h1>

      <section style={{ marginBottom: '30px' }}>
        <h2>Sales Overview</h2>
        <LineChart width={600} height={300} data={salesData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <CartesianGrid stroke="#ccc" />
          <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
        </LineChart>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>Top Products</h2>
        <BarChart width={600} height={300} data={topProducts}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <CartesianGrid stroke="#ccc" />
          <Bar dataKey="sales" fill="#82ca9d" />
        </BarChart>
      </section>

      <section>
        <h2>Orders</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Order ID</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Customer</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.id}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.customer_name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.status}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.total_price}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <button onClick={() => updateOrderStatus(order.id, 'Completed')}>Complete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

const updateOrderStatus = async (orderId, status) => {
  try {
    await axios.put(`/api/orders/${orderId}`, { status });
    alert('Order status updated successfully!');
  } catch (error) {
    console.error('Error updating order status:', error);
  }
};

export default SalesManagerDashboard;
