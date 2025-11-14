import React, { useState } from 'react';

const modalStyle = {
  position: 'fixed', top: '50%', left: '50%', 
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white', padding: '20px', 
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)', zIndex: 1000,
  border: '1px solid #ccc', borderRadius: '8px'
};

const overlayStyle = {
  position: 'fixed', top: 0, left: 0, 
  width: '100%', height: '100%', 
  backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999
};

function ScheduleModal({ request, employees, vehicles, onClose, onSubmit }) {
  // State for the form fields
  const [employeeId, setEmployeeId] = useState('');
  const [vehicleReg, setVehicleReg] = useState('');
  const [pickupTime, setPickupTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!employeeId || !vehicleReg || !pickupTime) {
      alert('Please fill out all fields.');
      return;
    }
    
    // Send the data back to the parent page
    onSubmit({
      request_id: request.request_id,
      employee_id: employeeId,
      vehicle_reg: vehicleReg,
      pickup_datetime: pickupTime // This should be in 'YYYY-MM-DDTHH:MM' format
    });
  };

return (
    <>
      <div style={overlayStyle} onClick={onClose} />
      <div style={modalStyle}>
        <h3>Schedule Request ID: {request.request_id}</h3>
        <p>For: {request.organisation_name}</p>
        <p>Requested Date: {new Date(request.pickup_date).toLocaleDateString()}</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          <label>Assign Employee:</label>
          <select value={employeeId} onChange={e => setEmployeeId(e.target.value)} required>
            <option value="">Select Employee...</option>
            {employees.map(emp => (
              <option key={emp.employee_id} value={emp.employee_id}>
                {emp.name}
              </option>
            ))}
          </select>

          <label>Assign Vehicle:</label>
          <select value={vehicleReg} onChange={e => setVehicleReg(e.target.value)} required>
            <option value="">Select Vehicle...</option>
            {vehicles.map(v => (
              <option key={v.reg_no} value={v.reg_no}>
                {v.vehicle_type} ({v.reg_no})
              </option>
            ))}
          </select>
          
          <label>Set Pickup Date & Time:</label>
          <input 
            type="datetime-local" 
            value={pickupTime}
            onChange={e => setPickupTime(e.target.value)}
            required
          />
          
          <div style={{ display: 'flex', justifyContent: 'end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Confirm Schedule</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ScheduleModal;