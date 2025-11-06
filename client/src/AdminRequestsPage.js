import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

function AdminRequestsPage() {
  const [requests, setRequests] = useState([]); // To store the list of requests
  const [loading, setLoading] = useState(true);
  const { authToken } = useAuth();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const config = {
          headers: { 'Authorization': `Bearer ${authToken}` }
        };
        const response = await axios.get('http://localhost:5000/api/admin/requests', config);
        setRequests(response.data);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      }
      setLoading(false);
    };

    fetchRequests();
  }, [authToken]); 

  if (loading) {
    return <div>Loading pending requests...</div>;
  }

  return (
    <div>
      <h2>Pending Waste Requests</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Org. Name</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Waste Type</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Pickup Date</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Status</th>
            <th style={{ padding: '8px', border: '1px solid #ddd' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '10px' }}>No pending requests.</td>
            </tr>
          ) : (
            requests.map(req => (
              <tr key={req.request_id}>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{req.organisation_name}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{req.waste_type}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{new Date(req.pickup_date).toLocaleDateString()}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{req.status}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  <button>Schedule</button> {/* This is your next step! */}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminRequestsPage;