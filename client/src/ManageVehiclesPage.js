import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

function ManageVehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authToken } = useAuth();
  const [regNo, setRegNo] = useState('');
  const [type, setType] = useState('');
  const [capacity, setCapacity] = useState('');

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

  useEffect(() => { fetchVehicles(); }, [fetchVehicles]);

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { 'Authorization': `Bearer ${authToken}` } };
      const data = { reg_no: regNo, vehicle_type: type, capacity_kg: capacity };
      await axios.post('http://localhost:5000/api/admin/vehicles', data, config);
      alert('Vehicle added successfully!');
      setRegNo(''); setType(''); setCapacity('');
      fetchVehicles();
    } catch (error) {
      console.error("Failed to add vehicle:", error);
      alert(`Error: ${error.response.data.message}`);
    }
  };

  if (loading) return <div className="page-container">Loading vehicles...</div>;

  return (
    <div className="page-container split-layout">
      {/* Left: Form */}
      <div className="card">
        <h2>Add New Vehicle</h2>
        <form onSubmit={handleAddVehicle}>
          <input className="form-control" type="text" placeholder="Registration No" value={regNo} onChange={e => setRegNo(e.target.value)} required />
          <input className="form-control" type="text" placeholder="Vehicle Type" value={type} onChange={e => setType(e.target.value)} required />
          <input className="form-control" type="number" placeholder="Capacity (kg)" value={capacity} onChange={e => setCapacity(e.target.value)} required />
          <button className="btn btn-block" type="submit">Add Vehicle</button>
        </form>
      </div>

      {/* Right: Table */}
      <div className="card">
        <h2>Current Fleet</h2>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
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
    </div>
  );
}

export default ManageVehiclesPage;