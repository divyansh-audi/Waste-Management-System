import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function NewRequestPage() {
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [startingDate, setStartingDate] = useState('');
  const { authToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const config = { headers: { 'Authorization': `Bearer ${authToken}` } };
        const response = await axios.get('http://localhost:5000/api/waste-categories', config);
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, [authToken]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const config = { headers: { 'Authorization': `Bearer ${authToken}` } };
    const data = { category_id: categoryId, weight_kg: weight, notes: notes, pickup_date: startingDate };

    axios.post('http://localhost:5000/api/requests', data, config)
      .then(response => {
        alert('Request submitted!');
        navigate('/dashboard');
      })
      .catch(err => {
        console.error("Error submitting request:", err.response.data);
        alert(`Error: ${err.response.data.message}`);
      });
  };

  return (
    <div className="page-container">
      <div className="card" style={{maxWidth: '600px', margin: '0 auto'}}>
        <h2>Create New Waste Request</h2>
        <form onSubmit={handleSubmit}>
          <label>Waste Category</label>
          <select className="form-control" value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
            <option value="">Select a Waste Category...</option>
            {categories.map(cat => (
              <option key={cat.category_id} value={cat.category_id}>{cat.category}</option>
            ))}
          </select>

          <label>Estimated Weight (kg)</label>
          <input className="form-control" type="number" placeholder="e.g., 50" value={weight} onChange={e => setWeight(e.target.value)} />

          <label>Preferred Pickup Date</label>
          <input className="form-control" type="date" value={startingDate} onChange={e => setStartingDate(e.target.value)} required />

          <label>Special Instructions</label>
          <textarea className="form-control" rows="4" placeholder="e.g., Bins are behind the gate..." value={notes} onChange={e => setNotes(e.target.value)}></textarea>

          <button className="btn btn-block" type="submit">Submit Request</button>
        </form>
      </div>
    </div>
  );
}

export default NewRequestPage;