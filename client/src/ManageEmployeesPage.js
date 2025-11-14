// Create new file: client/src/ManageEmployeesPage.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

function ManageEmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authToken } = useAuth();

  // Form state for new employee
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] =useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('driver');

  // 1. Fetch all employees
  const fetchEmployees = useCallback(async () => {
    try {
      const config = { headers: { 'Authorization': `Bearer ${authToken}` } };
      const res = await axios.get('http://localhost:5000/api/admin/employees', config);
      setEmployees(res.data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
    setLoading(false);
  }, [authToken]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // 2. Handle the "Add Employee" form submission
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { 'Authorization': `Bearer ${authToken}` } };
      const data = { name, email, contact, age, password,role };
      
      await axios.post('http://localhost:5000/api/admin/employees', data, config);
      
      alert('Employee added successfully!');
      // Clear form and refresh list
      // setName('');
      // setEmail('');
      // setContact('');
      // setAge('');
      // setPassword('');
      setRole('driver');
      fetchEmployees();
      
    } catch (error) {
      console.error("Failed to add employee:", error);
      alert(`Error: ${error.response.data.message}`);
    }
  };

  if (loading) return <div>Loading employees...</div>;

  return (
    <div style={{ display: 'flex', gap: '40px' }}>
      
      {/* 3. The "Add Employee" Form */}
      <div style={{ flex: 1 }}>
        <h2>Add New Employee</h2>
        <form onSubmit={handleAddEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Contact (Optional)"
            value={contact}
            onChange={e => setContact(e.target.value)}
          />
          <input
            type="number"
            placeholder="Age (Optional)"
            value={age}
            onChange={e => setAge(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <label>Role:</label>
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="driver">Driver</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">Add Employee</button>
        </form>
      </div>

      {/* 4. The List of Current Employees */}
      <div style={{ flex: 2 }}>
        <h2>Current Staff</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#eee' }}>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.employee_id}>
                <td>{emp.employee_id}</td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.contact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageEmployeesPage;