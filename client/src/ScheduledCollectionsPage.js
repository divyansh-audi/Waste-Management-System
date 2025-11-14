// In client/src/ScheduledCollectionsPage.js
import React, { useState, useEffect,useCallback } from 'react';
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
      setLoading(true); // Set loading true on re-fetch
      const config = { headers: { 'Authorization': `Bearer ${authToken}` } };
      const res = await axios.get('http://localhost:5000/api/admin/scheduled-collections', config);
      setCollections(res.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
    setLoading(false);
  }, [authToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCompleteClick = (collection) => {
    setSelectedCollection(collection);
    setIsModalOpen(true);
  };

  const handleCompleteSubmit = async (weight_kg) => {
    try {
      const config = { headers: { 'Authorization': `Bearer ${authToken}` } };
      const data = {
        collection_id: selectedCollection.collection_id,
        weight_kg: weight_kg
      };
      
      await axios.post('http://localhost:5000/api/admin/complete-collection', data, config);
      
      alert('Collection marked as complete!');
      setIsModalOpen(false);
      setSelectedCollection(null);

      const res = await axios.get('http://localhost:5000/api/admin/scheduled-collections', config);
      setCollections(res.data);
      
    } catch (error) {
      console.error("Failed to complete:", error);
      alert('Failed to mark as complete.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Scheduled Collections</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
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
                <button onClick={() => handleCompleteClick(col)}>
                  Mark as Complete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
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