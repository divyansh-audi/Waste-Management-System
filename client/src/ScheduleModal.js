import React, { useState } from 'react';

function ScheduleModal({ request, employees, vehicles, onClose, onSubmit }) {
  const [employeeId, setEmployeeId] = useState('');
  const [vehicleReg, setVehicleReg] = useState('');
  const [pickupTime, setPickupTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!employeeId || !vehicleReg || !pickupTime) {
      alert('Please fill out all fields.');
      return;
    }
    onSubmit({
      request_id: request.request_id,
      employee_id: employeeId,
      vehicle_reg: vehicleReg,
      pickup_datetime: pickupTime
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Schedule Request #{request.request_id}</h2>
        <p style={{marginBottom: '1rem', color: '#7f8c8d'}}>
          <strong>Organization:</strong> {request.organisation_name}<br/>
          <strong>Requested Date:</strong> {new Date(request.pickup_date).toLocaleDateString()}
        </p>
        
        <form onSubmit={handleSubmit}>
          <label>Assign Employee</label>
          <select className="form-control" value={employeeId} onChange={e => setEmployeeId(e.target.value)} required>
            <option value="">Select Employee...</option>
            {employees.map(emp => (
              <option key={emp.employee_id} value={emp.employee_id}>{emp.name}</option>
            ))}
          </select>

          <label>Assign Vehicle</label>
          <select className="form-control" value={vehicleReg} onChange={e => setVehicleReg(e.target.value)} required>
            <option value="">Select Vehicle...</option>
            {vehicles.map(v => (
              <option key={v.reg_no} value={v.reg_no}>{v.vehicle_type} ({v.reg_no})</option>
            ))}
          </select>
          
          <label>Pickup Date & Time</label>
          <input className="form-control" type="datetime-local" value={pickupTime} onChange={e => setPickupTime(e.target.value)} required />
          
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn">Confirm</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ScheduleModal;