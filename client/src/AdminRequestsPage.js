import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import ScheduleModal from './ScheduleModal';

function AdminRequestsPage() {
  const [requests, setRequests] = useState([]); // To store the list of requests
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
      
      // Use Promise.all to run all fetches at the same time
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
  }, [authToken]); // Note: fetchData is not in dependency array to avoid complexity

  // 3. This runs when the admin clicks the "Schedule" button
  const handleScheduleClick = (request) => {
    setSelectedRequest(request); // Remember which request was clicked
    setIsModalOpen(true);       // Open the modal
  };

  const handleScheduleSubmit = async (formData) => {
    try {
      const config = { headers: { 'Authorization': `Bearer ${authToken}` } };
      await axios.post('http://localhost:5000/api/admin/schedule', formData, config);
      
      alert('Schedule successful!');
      setIsModalOpen(false);      // Close the modal
      setSelectedRequest(null);   // Clear the selected request
      
      // Refresh the list of pending requests
      const response = await axios.get('http://localhost:5000/api/admin/requests', config);
      setRequests(response.data);
      
    } catch (error) {
      console.error("Failed to schedule:", error);
      alert('Failed to schedule request.');
    }
  };


  // useEffect(() => {
  //   const fetchRequests = async () => {
  //     try {
  //       const config = {
  //         headers: { 'Authorization': `Bearer ${authToken}` }
  //       };
  //       const response = await axios.get('http://localhost:5000/api/admin/requests', config);
  //       setRequests(response.data);
  //     } catch (error) {
  //       console.error("Failed to fetch requests:", error);
  //     }
  //     setLoading(false);
  //   };

  //   fetchRequests();
  // }, [authToken]); 

  if (loading) {
    return <div>Loading pending requests...</div>;
  }

//   return (
//     <div>
//       <h2>Pending Waste Requests</h2>
//       <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//         <thead>
//           <tr style={{ background: '#eee' }}>
//             <th style={{ padding: '8px', border: '1px solid #ddd' }}>Org. Name</th>
//             <th style={{ padding: '8px', border: '1px solid #ddd' }}>Waste Type</th>
//             <th style={{ padding: '8px', border: '1px solid #ddd' }}>Pickup Date</th>
//             <th style={{ padding: '8px', border: '1px solid #ddd' }}>Status</th>
//             <th style={{ padding: '8px', border: '1px solid #ddd' }}>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {requests.length === 0 ? (
//             <tr>
//               <td colSpan="5" style={{ textAlign: 'center', padding: '10px' }}>No pending requests.</td>
//             </tr>
//           ) : (
//             requests.map(req => (
//               <tr key={req.request_id}>
//                 <td style={{ padding: '8px', border: '1px solid #ddd' }}>{req.organisation_name}</td>
//                 <td style={{ padding: '8px', border: '1px solid #ddd' }}>{req.waste_type}</td>
//                 <td style={{ padding: '8px', border: '1px solid #ddd' }}>{new Date(req.pickup_date).toLocaleDateString()}</td>
//                 <td style={{ padding: '8px', border: '1px solid #ddd' }}>{req.status}</td>
//                 <td style={{ padding: '8px', border: '1px solid #ddd' }}>
//                   <button>Schedule</button> {/* This is your next step! */}
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default AdminRequestsPage;

return (
    <div>
      <h2>Pending Waste Requests</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        {/* ... your <thead> ... */}
        <tbody>
          {requests.length === 0 ? (
            <tr><td colSpan="5">No pending requests.</td></tr>
          ) : (
            requests.map(req => (
              <tr key={req.request_id}>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{req.organisation_name}</td>
                <td style={{ padding: '8px', border: '1Gpx solid #ddd' }}>{req.waste_type}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{new Date(req.pickup_date).toLocaleDateString()}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{req.status}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                  {/* 5. The button that triggers the modal */}
                  <button onClick={() => handleScheduleClick(req)}>
                    Schedule
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      
      {/* 6. This renders the modal (but only if isModalOpen is true) */}
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