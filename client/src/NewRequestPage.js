// In client/src/NewRequestPage.js
import React, { useState, useEffect } from 'react'; // 1. Import useEffect
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function NewRequestPage() {
  // 2. Change 'category' state to 'categoryId'
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]); // 3. New state for the list
  
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [startingDate, setStartingDate] = useState('');
  const { authToken } = useAuth();
  const navigate = useNavigate();

  // 4. This effect runs once to fetch the categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const config = {
          headers: { 'Authorization': `Bearer ${authToken}` }
        };
        const response = await axios.get('http://localhost:5000/api/waste-categories', config);
        setCategories(response.data); // Save the list
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, [authToken]); // It runs when the component loads

  const handleSubmit = (e) => {
    e.preventDefault();

    const config = {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    };

    // 5. Build the 'data' object with the correct keys
    const data = {
      category_id: categoryId, // Send the ID, not the name
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

      {/* 6. This is now a dropdown menu (<select>) */}
      <select 
        value={categoryId} 
        onChange={e => setCategoryId(e.target.value)} 
        required
      >
        <option value="">Select a Waste Category...</option>
        {categories.map(cat => (
          <option key={cat.category_id} value={cat.category_id}>
            {cat.category}
          </option>
        ))}
      </select>

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