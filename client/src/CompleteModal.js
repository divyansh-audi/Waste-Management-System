import React, { useState } from 'react';

function CompleteModal({ collection, onClose, onSubmit }) {
  const [weight, setWeight] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!weight) {
      alert('Please enter the actual weight collected.');
      return;
    }
    onSubmit(weight);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Complete Collection #{collection.collection_id}</h2>
        <p style={{marginBottom: '1rem', color: '#7f8c8d'}}>
          <strong>For:</strong> {collection.organisation_name}
        </p>
        
        <form onSubmit={handleSubmit}>
          <label>Actual Weight Collected (kg)</label>
          <input 
            className="form-control"
            type="number"
            step="0.01"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            placeholder="e.g., 120.5"
            required
          />
          
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn">Confirm Completion</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CompleteModal;