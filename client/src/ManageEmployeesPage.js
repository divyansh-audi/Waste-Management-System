import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

function ManageEmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authToken } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] =useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('driver');

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

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { 'Authorization': `Bearer ${authToken}` } };
      const data = { name, email, contact, age, password, role };
      await axios.post('http://localhost:5000/api/admin/employees', data, config);
      alert('Employee added successfully!');
      setRole('driver');
      fetchEmployees();
    } catch (error) {
      console.error("Failed to add employee:", error);
      alert(`Error: ${error.response.data.message}`);
    }
  };

  if (loading) return <div className="page-container">Loading employees...</div>;

  return (
    <div className="page-container split-layout">
      <div className="card">
        <h2>Add New Employee</h2>
        <form onSubmit={handleAddEmployee}>
          <input className="form-control" type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
          <input className="form-control" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="form-control" type="text" placeholder="Contact" value={contact} onChange={e => setContact(e.target.value)} />
          <input className="form-control" type="number" placeholder="Age" value={age} onChange={e => setAge(e.target.value)} />
          <input className="form-control" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <select className="form-control" value={role} onChange={e => setRole(e.target.value)}>
            <option value="driver">Driver</option>
            <option value="admin">Admin</option>
          </select>
          <button className="btn btn-block" type="submit">Add Employee</button>
        </form>
      </div>

      <div className="card">
        <h2>Current Staff</h2>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
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
    </div>
  );
}

export default ManageEmployeesPage;