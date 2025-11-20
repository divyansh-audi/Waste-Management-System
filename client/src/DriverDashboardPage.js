import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import CompleteModal from './CompleteModal';

function DriverDashboardPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const { authToken, user } = useAuth();

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
      const data = { collection_id: selectedJob.collection_id, weight_kg: weight_kg };
      await axios.post('http://localhost:5000/api/driver/complete-job', data, config);
      
      alert('Job marked as complete!');
      setIsModalOpen(false);
      setSelectedJob(null);
      fetchJobs();
    } catch (error) {
      console.error("Failed to complete:", error);
      alert(`Error: ${error.response.data.message}`);
    }
  };

  if (loading) return <div className="page-container">Loading your jobs...</div>;

  return (
    <div className="page-container">
      <div className="card">
        <h2>Welcome, {user ? user.email : 'Driver'}!</h2>
        <p style={{color: '#666', marginBottom: '20px'}}>Here are your assigned jobs for today.</p>
        
        <div className="table-container">
            {jobs.length === 0 ? (
            <p>No scheduled jobs found.</p>
            ) : (
            <table className="custom-table">
                <thead>
                <tr>
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
                        <button className="btn btn-sm" onClick={() => handleCompleteClick(job)}>Mark Complete</button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            )}
        </div>
      </div>
      
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