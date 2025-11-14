// Create new file: client/src/DriverDashboardPage.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import CompleteModal from './CompleteModal'; // We can re-use this!

function DriverDashboardPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const { authToken, user } = useAuth(); // Get 'user' to display their name

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const config = { headers: { 'Authorization': `Bearer ${authToken}` } };
      const res = await axios.get('http://localhost:5000/api/driver/my-jobs', config);
      setJobs(res.data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    }
    setLoading(false);
  }, [authToken]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleCompleteClick = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCompleteSubmit = async (weight_kg) => {
    try {
      const config = { headers: { 'Authorization': `Bearer ${authToken}` } };
      const data = {
        collection_id: selectedJob.collection_id,
        weight_kg: weight_kg
      };
      
      // Call the NEW driver-specific route
      await axios.post('http://localhost:5000/api/driver/complete-job', data, config);
      
      alert('Job marked as complete!');
      setIsModalOpen(false);
      setSelectedJob(null);
      fetchJobs(); // Refresh the list
      
    } catch (error) {
      console.error("Failed to complete:", error);
      alert(`Error: ${error.response.data.message}`);
    }
  };

  if (loading) return <div>Loading your jobs...</div>;

  return (
    <div>
      <h2>Welcome, {user ? user.email : 'Driver'}! Here are your jobs:</h2>
      
      {jobs.length === 0 ? (
        <p>No scheduled jobs found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#eee' }}>
              <th>Org. Name</th>
              <th>Address</th>
              <th>Vehicle</th>
              <th>Pickup Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job.collection_id}>
                <td>{job.organisation_name}</td>
                <td>{job.organisation_address}</td>
                <td>{job.vehicle_type} ({job.reg_no})</td>
                <td>{new Date(job.pickup_datetime).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleCompleteClick(job)}>
                    Mark as Complete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      {isModalOpen && (
        <CompleteModal
          collection={selectedJob}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCompleteSubmit}
        />
      )}
    </div>
  );
}

export default DriverDashboardPage;