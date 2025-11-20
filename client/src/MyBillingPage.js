import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

function MyBillingPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authToken } = useAuth();

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

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const handlePay = async (payment_id) => {
    try {
      const config = { headers: { 'Authorization': `Bearer ${authToken}` } };
      await axios.post(`http://localhost:5000/api/pay-bill/${payment_id}`, {}, config);
      alert('Payment successful!');
      fetchPayments();
    } catch (error) {
      console.error("Payment failed:", error);
      alert('Payment failed.');
    }
  };

  if (loading) return <div className="page-container">Loading...</div>;

  return (
    <div className="page-container">
      <div className="card">
        <h2>My Billing History</h2>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
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
                  <td>
                    <span style={{
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      background: pay.status === 'Paid' ? '#d4edda' : '#fff3cd',
                      color: pay.status === 'Paid' ? '#155724' : '#856404'
                    }}>
                      {pay.status}
                    </span>
                  </td>
                  <td>
                    {pay.status === 'Pending' ? (
                      <button className="btn btn-sm" onClick={() => handlePay(pay.payment_id)}>Pay Now</button>
                    ) : 'Paid'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MyBillingPage;