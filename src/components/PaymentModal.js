import React, { useState } from 'react';
import Modal from 'react-modal';
import '../assets/styles/modal.css';
import cardImage from '../assets/images/creditcard.png'; // Kredi kartı görseli

const PaymentModal = ({ isOpen, onClose, handleOrder }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');

  // Kart numarası formatlama
  const formatCardNumber = (value) =>
    value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();

  // Expiration Date formatlama
  const formatExpiryDate = (value) => {
    const cleanValue = value.replace(/\D/g, ''); // Sadece sayılar
    if (cleanValue.length <= 2) {
      return cleanValue; // İlk iki hane (Ay)
    }
    return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}`; // MM/YY formatı
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="payment-modal"
      overlayClassName="modal-overlay"
    >
      <button className="close-button" onClick={onClose}>
        &times;
      </button>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Sol taraf: Form */}
        <form style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
          <label>
            Card Number
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              required
            />
          </label>
          <label>
            Cardholder Name
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </label>
          <label>
            Expiration Date
            <input
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
              placeholder="MM/YY"
              maxLength={5} // MM/YY formatına uygun
              required
            />
          </label>
          <label>
            Security Code (CVC)
            <input
              type="text"
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))} // Sadece sayılar
              placeholder="123"
              maxLength={3}
              required
            />
          </label>
        </form>

        {/* Sağ taraf: Dinamik kredi kartı */}
        <div
          style={{
            width: '300px',
            height: '180px',
            backgroundImage: `url(${cardImage})`,
            backgroundSize: 'cover',
            borderRadius: '8px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            color: '#fff',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          <div style={{ fontSize: '1.2rem', letterSpacing: '2px' }}>
            {cardNumber || '•••• •••• •••• ••••'}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>{cardName || 'CARDHOLDER NAME'}</div>
            <div>{expiryDate || 'MM/YY'}</div>
          </div>
        </div>
      </div>

      {/* Make Payment Button - En alta taşındı */}
      <div style={{ marginTop: 'auto', padding: '20px 0', textAlign: 'center' }}>
        <button
          style={{
            padding: '10px 20px',
            backgroundColor: 'green',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
          onClick={handleOrder} // handleOrder fonksiyonu çağrılır
        >
          Make Payment
        </button>
      </div>
    </Modal>
  );
};

export default PaymentModal;
