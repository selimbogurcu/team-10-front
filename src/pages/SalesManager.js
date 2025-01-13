import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SalesManager = () => {
    const [discounts, setDiscounts] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [loading, setLoading] = useState(true);

    //useEffect(() => {
    //    fetchData();
    //}, []);

    const fetchData = async () => {
        try {
            //const discountsResponse = await axios.get('/api/salesmanager/discounts');
            //setDiscounts(discountsResponse.data);

            //const invoicesResponse = await axios.get('/api/salesmanager/invoices');
            //setInvoices(invoicesResponse.data);

            //const revenueResponse = await axios.get('/api/salesmanager/revenue');
            //setRevenueData(revenueResponse.data);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleApplyDiscount = async (productId, discountRate) => {
        try {
            await axios.put('http://localhost:1337/api/salesmanager/applyDiscount', { product_id: productId, discountRate });
            alert('Discount applied successfully!');
            fetchData();
        } catch (error) {
            console.error('Error applying discount:', error);
        }
    };

    const handleApplyRaise = async (productId, raiseRate) => {
        try {
            await axios.put('http://localhost:1337/api/salesmanager/applyRaise', { product_id: productId, raiseRate });
            alert('Raise applied successfully!');
            fetchData();
        } catch (error) {
            console.error('Error applying raise:', error);
        }
    };

    const handleGenerateSalesReport = async (startDate, endDate) => {
        try {
            const response = await axios.post('http://localhost:1337/api/salesmanager/salesreport', { startDate, endDate });
            console.log('Sales report data:', response.data);
            alert('Sales report generated successfully!');
        } catch (error) {
            console.error('Error generating sales report:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Navbar />
            <div className="sales-manager">
                <h1>Sales Manager Dashboard</h1>

                <section>
                    <h2>Apply Discounts or Raises</h2>
                    <ul>
                        {discounts.map((discount) => (
                            <li key={discount.productId}>
                                <p>Product: {discount.productName}</p>
                                <p>Current Price: {discount.price} ₺</p>
                                <input
                                    type="number"
                                    placeholder="Rate (%)"
                                    onBlur={(e) => handleApplyDiscount(discount.productId, e.target.value)}
                                />
                                <button onClick={() => handleApplyDiscount(discount.productId, 10)}>
                                    Apply 10% Discount
                                </button>
                                <button onClick={() => handleApplyRaise(discount.productId, 10)}>
                                    Apply 10% Raise
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h2>Invoice List</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Invoice ID</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((invoice) => (
                                <tr key={invoice.id}>
                                    <td>{invoice.id}</td>
                                    <td>{new Date(invoice.date).toLocaleDateString()}</td>
                                    <td>{invoice.total} ₺</td>
                                    <td>
                                        <button onClick={() => alert(`PDF for Invoice ${invoice.id} downloaded!`)}>
                                            Download PDF
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <section>
                    <h2>Revenue Overview</h2>
                    <LineChart width={600} height={300} data={revenueData}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <CartesianGrid stroke="#ccc" />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                    </LineChart>
                </section>

                <section>
                    <h2>Generate Sales Report</h2>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            handleGenerateSalesReport(formData.get('startDate'), formData.get('endDate'));
                        }}
                    >
                        <label>
                            Start Date:
                            <input type="date" name="startDate" required />
                        </label>
                        <label>
                            End Date:
                            <input type="date" name="endDate" required />
                        </label>
                        <button type="submit">Generate Report</button>
                    </form>
                </section>

                <Footer />
            </div>
        </div>
    );
};

export default SalesManager;
