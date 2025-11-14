// In client/src/MyBillingPage.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

function MyBillingPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authToken } = useAuth();

  // Fetch payments
  const fetchPayments = useCallback(async () => {
    try {
      const config = { headers: { 'Authorization': `Bearer ${authToken}` } };
      const res = await axios.get('http://localhost:5000/api/my-payments', config);
      setPayments(res.data);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    }
    setLoading(false);
  }, [authToken]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Handle "Pay" button click
  const handlePay = async (payment_id) => {
    try {
      const config = { headers: { 'Authorization': `Bearer ${authToken}` } };
      await axios.post(`http://localhost:5000/api/pay-bill/${payment_id}`, {}, config);
      alert('Payment successful!');
      fetchPayments(); // Refresh the list
    } catch (error) {
      console.error("Payment failed:", error);
      alert('Payment failed.');
    }
  };

  if (loading) return <div>Loading payments...</div>;

  return (
    <div>
      <h2>My Billing History</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th>Payment ID</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(pay => (
            <tr key={pay.payment_id}>
              <td>{pay.payment_id}</td>
              <td>{new Date(pay.payment_date).toLocaleDateString()}</td>
              <td>${pay.amount}</td>
              <td>{pay.status}</td>
              <td>
                {pay.status === 'Pending' ? (
                  <button onClick={() => handlePay(pay.payment_id)}>Pay Now</button>
                ) : (
                  'Paid'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MyBillingPage;