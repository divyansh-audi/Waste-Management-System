// Create new file: client/src/CompleteModal.js
import React, { useState } from 'react';

// You can re-use the modal styles from your ScheduleModal
const modalStyle = {
  position: 'fixed', top: '50%', left: '50%', 
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white', padding: '20px', 
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)', zIndex: 1000
};
const overlayStyle = {
  position: 'fixed', top: 0, left: 0, 
  width: '100%', height: '100%', 
  backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999
};

function CompleteModal({ collection, onClose, onSubmit }) {
  const [weight, setWeight] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!weight) {
      alert('Please enter the actual weight collected.');
      return;
    }
    onSubmit(weight); // Pass just the weight back
  };

  return (
    <>
      <div style={overlayStyle} onClick={onClose} />
      <div style={modalStyle}>
        <h3>Complete Collection ID: {collection.collection_id}</h3>
        <p>For: {collection.organisation_name}</p>
        
        <form onSubmit={handleSubmit}>
          <label>Enter Actual Weight Collected (kg):</label>
          <input 
            type="number"
            step="0.01" // for decimals
            value={weight}
            onChange={e => setWeight(e.target.value)}
            placeholder="e.g., 120.5"
            required
          />
          
          <button type="submit">Confirm Completion</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </>
  );
}

export default CompleteModal;