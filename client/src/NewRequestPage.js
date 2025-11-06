import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function NewRequestPage(){
  const [category, setCategory] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [startingDate, setStartingDate] = useState('');
  const { authToken } = useAuth();  
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const config = {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    };

    const data = {
      category: category,
      weight_kg: weight,
      notes: notes,
      pickup_date: startingDate
    };

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
    <form onSubmit={handleSubmit}>
      <h2>Create New Waste Request</h2>
      <input 
        type="text" 
        placeholder="Category (e.g., Plastic, Paper)" 
        value={category}
        onChange={e => setCategory(e.target.value)} 
      />
      <input 
        type="number" 
        placeholder="Weight (kg)" 
        value={weight}
        onChange={e => setWeight(e.target.value)} 
      />
      <input 
        type="date" 
        value={startingDate}
        onChange={e => setStartingDate(e.target.value)} 
        required
      />
      <textarea 
        placeholder="Notes (e.g., bins are behind gate)"
        value={notes}
        onChange={e => setNotes(e.target.value)}
      ></textarea>
      <button type="submit">Submit Request</button>
    </form>
    );
}

export default NewRequestPage;
