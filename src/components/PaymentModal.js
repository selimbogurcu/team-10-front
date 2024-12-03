import React, { useState } from "react";
import Modal from "react-modal";
import "../assets/styles/modal.css";
import creditCardImage from "../assets/images/creditcard.png"; // Dinamik kredi kartı görseli

const PaymentModal = ({ isOpen, onClose, onPaymentSuccess }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  // Kart numarası formatlayıcı (4 haneli gruplar)
  const formatCardNumber = (value) => {
    return value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
  };

  // Tarih formatlayıcı (MM/YY)
  const formatExpiry = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d{0,2})/, (_, mm, yy) => (yy ? `${mm}/${yy}` : mm));
  };

  // Ödeme işlemi gönderici
  const handlePayment = async () => {
    const paymentPayload = {
      order_id: "12345", // Örnek sipariş ID
      amount: 100, // Tutar (örnek)
      status: "Pending",
      transaction_id: `TRX${Date.now()}`, // Benzersiz işlem ID'si
    };

    try {
      const response = await fetch("http://localhost:1337/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentPayload),
      });

      if (!response.ok) throw new Error("Payment failed");
      const result = await response.json();
      alert("Payment successful!");
      onPaymentSuccess();
    } catch (error) {
      alert("Payment failed. Please try again.");
      console.error(error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <button className="close-button" onClick={onClose}>
        &times;
      </button>
      <h2>Kredi Kartı Ödeme</h2>
      <div style={{ display: "flex", gap: "20px" }}>
        {/* Kart Bilgi Formu */}
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            flex: 1,
          }}
        >
          <label>
            Kart No
            <input
              type="text"
              value={cardNumber}
              onChange={(e) =>
                setCardNumber(formatCardNumber(e.target.value))
              }
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              required
            />
          </label>
          <label>
            Kart Üzerindeki İsim
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </label>
          <label>
            Son Kullanma Tarihi
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              placeholder="MM/YY"
              maxLength={5}
              required
            />
          </label>
          <label>
            Güvenlik Kodu (CVC)
            <input
              type="text"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              placeholder="123"
              maxLength={3}
              required
            />
          </label>
          <button
            type="button"
            onClick={handlePayment}
            style={{
              padding: "10px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Ödemeyi Tamamla
          </button>
        </form>

        {/* Dinamik Kredi Kartı Görseli */}
        <div
          style={{
            width: "300px",
            height: "180px",
            backgroundImage: `url(${creditCardImage})`,
            backgroundSize: "cover",
            borderRadius: "12px",
            padding: "20px",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div style={{ fontSize: "1.2rem", letterSpacing: "2px" }}>
            {cardNumber || "•••• •••• •••• ••••"}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>{cardName || "CARDHOLDER NAME"}</div>
            <div>{expiry || "MM/YY"}</div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentModal;
