import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import CompleteModal from './CompleteModal'; 

function ScheduledCollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const { authToken } = useAuth();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const config = { headers: { 'Authorization': `Bearer ${authToken}` } };
      const res = await axios.get('http://localhost:5000/api/admin/scheduled-collections', config);
      setCollections(res.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
    setLoading(false);
  }, [authToken]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCompleteClick = (collection) => {
    setSelectedCollection(collection);
    setIsModalOpen(true);
  };

  const handleCompleteSubmit = async (weight_kg) => {
    try {
      const config = { headers: { 'Authorization': `Bearer ${authToken}` } };
      const data = { collection_id: selectedCollection.collection_id, weight_kg: weight_kg };
      await axios.post('http://localhost:5000/api/admin/complete-collection', data, config);
      alert('Collection marked as complete!');
      setIsModalOpen(false);
      setSelectedCollection(null);
      
      // Refresh list (manual fetch call since we can't call fetchData easily without causing loops or warning issues if not careful, but here it's safe to just re-fetch via axios or dependency)
      // Actually, let's just re-call the API directly to avoid deps issues
      const res = await axios.get('http://localhost:5000/api/admin/scheduled-collections', config);
      setCollections(res.data);

    } catch (error) {
      console.error("Failed to complete:", error);
      alert('Failed to mark as complete.');
    }
  };

  if (loading) return <div className="page-container">Loading...</div>;

  return (
    <div className="page-container">
      <div className="card">
        <h2>Scheduled Collections</h2>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Org. Name</th>
                <th>Employee</th>
                <th>Vehicle</th>
                <th>Pickup Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {collections.map(col => (
                <tr key={col.collection_id}>
                  <td>{col.organisation_name}</td>
                  <td>{col.employee_name}</td>
                  <td>{col.vehicle_type} ({col.reg_no})</td>
                  <td>{new Date(col.pickup_datetime).toLocaleString()}</td>
                  <td>
                    <button className="btn btn-sm" onClick={() => handleCompleteClick(col)}>Mark Complete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {isModalOpen && (
        <CompleteModal
          collection={selectedCollection}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCompleteSubmit}
        />
      )}
    </div>
  );
}

export default ScheduledCollectionsPage;