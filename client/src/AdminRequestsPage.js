import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import ScheduleModal from './ScheduleModal';

function AdminRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authToken } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = { headers: { 'Authorization': `Bearer ${authToken}` } };
        const [reqRes, empRes, vehRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/requests', config),
          axios.get('http://localhost:5000/api/admin/employees', config),
          axios.get('http://localhost:5000/api/admin/vehicles', config)
        ]);
        setRequests(reqRes.data);
        setEmployees(empRes.data);
        setVehicles(vehRes.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, [authToken]);

  const handleScheduleClick = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleScheduleSubmit = async (formData) => {
    try {
      const config = { headers: { 'Authorization': `Bearer ${authToken}` } };
      await axios.post('http://localhost:5000/api/admin/schedule', formData, config);
      
      alert('Schedule successful!');
      setIsModalOpen(false);
      setSelectedRequest(null);
      
      // Refresh list
      const response = await axios.get('http://localhost:5000/api/admin/requests', config);
      setRequests(response.data);
    } catch (error) {
      console.error("Failed to schedule:", error);
      alert('Failed to schedule request.');
    }
  };

  if (loading) return <div className="page-container">Loading pending requests...</div>;

  return (
    <div className="page-container">
      <div className="card">
        <h2>Pending Waste Requests</h2>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Org. Name</th>
                <th>Waste Type</th>
                <th>Pickup Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr><td colSpan="5" style={{textAlign: 'center'}}>No pending requests.</td></tr>
              ) : (
                requests.map(req => (
                  <tr key={req.request_id}>
                    <td>{req.organisation_name}</td>
                    <td>{req.waste_type}</td>
                    <td>{new Date(req.pickup_date).toLocaleDateString()}</td>
                    <td><span style={{padding:'4px 8px', background:'#fff3cd', borderRadius:'4px', color:'#856404'}}>{req.status}</span></td>
                    <td>
                      <button className="btn btn-sm" onClick={() => handleScheduleClick(req)}>Schedule</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {isModalOpen && (
        <ScheduleModal
          request={selectedRequest}
          employees={employees}
          vehicles={vehicles}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleScheduleSubmit}
        />
      )}
    </div>
  );
}

export default AdminRequestsPage;