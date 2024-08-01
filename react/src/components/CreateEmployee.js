import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createEmployee, getEmployees } from '../api';

function CreateEmployee({ onSave }) {
    const navigate = useNavigate();
    const [employee, setEmployee] = useState({
        first_name: '',
        last_name: '',
        position: '',
        email: '',
        phone: '',
        notes: '',
        manager_id: '',
    });
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState(null);
    const [managerFilter, setManagerFilter] = useState('');

    useEffect(() => {
        getEmployees()
            .then(response => setEmployees(response.data))
            .catch(error => setError(error.message));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee(prevEmployee => ({ ...prevEmployee, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createEmployee(employee)
            .then(() => {
                onSave();
                navigate('/'); // Redirect to home after creating
            })
            .catch(error => setError(error.message));
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <nav className="text-sm mb-4">
                <Link to="/" className="text-blue-500 hover:text-blue-700">Home</Link> / <span className="text-gray-500">Create Employee</span>
            </nav>
            <h2 className="text-3xl font-semibold mb-6 text-center">Create Employee</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col space-y-2">
                    <label className="text-gray-700">First Name</label>
                    <input
                        type="text"
                        name="first_name"
                        value={employee.first_name}
                        onChange={handleChange}
                        required
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <label className="text-gray-700">Last Name</label>
                    <input
                        type="text"
                        name="last_name"
                        value={employee.last_name}
                        onChange={handleChange}
                        required
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <label className="text-gray-700">Position</label>
                    <input
                        type="text"
                        name="position"
                        value={employee.position}
                        onChange={handleChange}
                        required
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <label className="text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={employee.email}
                        onChange={handleChange}
                        required
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <label className="text-gray-700">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={employee.phone}
                        onChange={handleChange}
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <label className="text-gray-700">Notes</label>
                    <textarea
                        name="notes"
                        value={employee.notes}
                        onChange={handleChange}
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <label className="text-gray-700">Search Manager by Name</label>
                    <input
                        type="text"
                        value={managerFilter}
                        onChange={(e) => setManagerFilter(e.target.value)}
                        placeholder="Type to search..."
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <label className="text-gray-700">Manager</label>
                    <select
                        name="manager_id"
                        value={employee.manager_id}
                        onChange={handleChange}
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">No Manager</option>
                        {employees
                            .filter(emp => `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(managerFilter.toLowerCase()))
                            .map(emp => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.first_name} {emp.last_name}
                                </option>
                            ))}
                    </select>
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                    Create
                </button>
            </form>
        </div>
    );
}

export default CreateEmployee;
