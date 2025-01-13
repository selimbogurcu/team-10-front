import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SalesManagerDashboard = () => {
    const [discountData, setDiscountData] = useState({ productIds: [], discountRate: 0 });
    const [salesReport, setSalesReport] = useState(null);
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/api/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const applyDiscount = async () => {
        try {
            await axios.put('/api/salesmanager/applyDiscount', discountData);
            alert('Discount applied successfully!');
        } catch (error) {
            console.error('Error applying discount:', error);
        }
    };

    const generateSalesReport = async (startDate, endDate) => {
        try {
            const response = await axios.post('/api/salesmanager/salesreport', { startDate, endDate });
            setSalesReport(response.data);
        } catch (error) {
            console.error('Error generating sales report:', error);
        }
    };

    const processRefund = async (orderId, productId) => {
        try {
            await axios.put(`/api/salesmanager/refund/${orderId}`, { productId });
            alert('Refund processed successfully!');
        } catch (error) {
            console.error('Error processing refund:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div>
            <h1>Sales Manager Dashboard</h1>

            <div>
                <h2>Apply Discount</h2>
                <input
                    type="text"
                    placeholder="Product IDs (comma-separated)"
                    onChange={(e) => setDiscountData({ ...discountData, productIds: e.target.value.split(',') })}
                />
                <input
                    type="number"
                    placeholder="Discount Rate (%)"
                    onChange={(e) => setDiscountData({ ...discountData, discountRate: Number(e.target.value) })}
                />
                <button onClick={applyDiscount}>Apply Discount</button>
            </div>

            <div>
                <h2>Generate Sales Report</h2>
                <button onClick={() => generateSalesReport('2023-01-01', '2023-12-31')}>Download Report</button>
            </div>

            <div>
                <h2>Refund Requests</h2>
                {orders.map((order) => (
                    <div key={order.id}>
                        <h3>Order #{order.id}</h3>
                        {order.products.map((product) => (
                            <div key={product.id}>
                                {product.name}
                                <button onClick={() => processRefund(order.id, product.id)}>Refund</button>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SalesManagerDashboard;
