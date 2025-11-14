// Create new file: client/src/ManageVehiclesPage.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

function ManageVehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authToken } = useAuth();

  // Form state for new vehicle
  const [regNo, setRegNo] = useState('');
  const [type, setType] = useState('');
  const [capacity, setCapacity] = useState('');

  // 1. Fetch all vehicles
  const fetchVehicles = useCallback(async () => {
    try {
      const config = { headers: { 'Authorization': `Bearer ${authToken}` } };
      const res = await axios.get('http://localhost:5000/api/admin/vehicles', config);
      setVehicles(res.data);
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    }
    setLoading(false);
  }, [authToken]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // 2. Handle the "Add Vehicle" form submission
  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { 'Authorization': `Bearer ${authToken}` } };
      const data = {
        reg_no: regNo,
        vehicle_type: type,
        capacity_kg: capacity
      };
      
      await axios.post('http://localhost:5000/api/admin/vehicles', data, config);
      
      alert('Vehicle added successfully!');
      // Clear form and refresh list
      setRegNo('');
      setType('');
      setCapacity('');
      fetchVehicles();
      
    } catch (error) {
      console.error("Failed to add vehicle:", error);
      alert(`Error: ${error.response.data.message}`);
    }
  };

  if (loading) return <div>Loading vehicles...</div>;

  return (
    <div style={{ display: 'flex', gap: '40px' }}>
      
      {/* 3. The "Add Vehicle" Form */}
      <div style={{ flex: 1 }}>
        <h2>Add New Vehicle</h2>
        <form onSubmit={handleAddVehicle}>
          <input
            type="text"
            placeholder="Registration No (e.g., MP04-T-1234)"
            value={regNo}
            onChange={e => setRegNo(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Vehicle Type (e.g., Garbage Truck)"
            value={type}
            onChange={e => setType(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Capacity (kg)"
            value={capacity}
            onChange={e => setCapacity(e.target.value)}
            required
          />
          <button type="submit">Add Vehicle</button>
        </form>
      </div>

      {/* 4. The List of Current Vehicles */}
      <div style={{ flex: 2 }}>
        <h2>Current Fleet</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#eee' }}>
              <th>Reg. No</th>
              <th>Type</th>
              <th>Capacity (kg)</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(v => (
              <tr key={v.reg_no}>
                <td>{v.reg_no}</td>
                <td>{v.vehicle_type}</td>
                <td>{v.capacity_kg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageVehiclesPage;