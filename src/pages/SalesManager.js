import React, { useState } from "react";
import axios from "axios";
import Navbar from '../components/Navbar';
import '../assets/styles/salesManager.css';
import { useAuth } from '../contexts/AuthContexts';
import { useNavigate } from 'react-router-dom';

const SalesManager = () => {
    const [discountRate, setDiscountRate] = useState("");
    const [raiseAmount, setRaiseAmount] = useState("");
    const [productId, setProductId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [message, setMessage] = useState("");

    const { token, user, logout } = useAuth();
    const navigate = useNavigate();

    const applyDiscount = async () => {
        try {
            const response = await axios.put("http://localhost:1337/api/salesmanager/applyDiscount", {
                product_id: productId,
                discountRate: discountRate,
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage("Could not apply discount.");
        }
    };

    const applyRaise = async () => {
        try {
            const response = await axios.put("http://localhost:1337/api/salesmanager/applyRaise", {
                product_id: productId,
                raiseRate: raiseAmount,
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage("Could not apply raise.");
        }
    };

    const handleLogout = () => {
      logout();
      console.log("User logged out");  //çıkış pop up ı
      navigate('/'); 
      };

    const generateSalesReport = async () => {
        try {
            const response = await axios.post("http://localhost:1337/api/salesmanager/salesreport", { 
              startDate: startDate, 
              endDate: endDate, 
            });
            const file = new Blob([response.data], { type: "application/pdf" });
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
            setMessage("Sales report generated successfully.");
        } catch (error) {
            setMessage("Could not generate sales report.");
        }
    };

    return (
        <div className="sales-manager-panel">
          <Navbar/>
          <div className="mainContainer">
            <h1>Sales Manager Panel</h1>

            <div className="panel-section">
                <h2>Product Management</h2>
                <div className="card">
                    <h3>Apply Discount</h3>
                    <input
                        type="text"
                        placeholder="Product ID"
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Discount Rate (%)"
                        value={discountRate}
                        onChange={(e) => setDiscountRate(e.target.value)}
                    />
                    <button onClick={applyDiscount}>Apply Discount</button>
                </div>

                <div className="card">
                    <h3>Apply Raise</h3>
                    <input
                        type="text"
                        placeholder="Product ID"
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Raise Amount"
                        value={raiseAmount}
                        onChange={(e) => setRaiseAmount(e.target.value)}
                    />
                    <button onClick={applyRaise}>Apply Raise</button>
                </div>
            </div>

            <div className="panel-section">
                <h2>Sales Report</h2>
                <div className="card">
                    <h3>Generate Sales Report</h3>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                    <button onClick={generateSalesReport}>Generate Report</button>
                </div>
            </div>

            {message && <p className="status-message">{message}</p>}
            <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>  
        </div>
    );
};

export default SalesManager;