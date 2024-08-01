import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEmployee, updateEmployee, getEmployees, deleteEmployee } from '../api';

function EditEmployee({ onSave }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState({});
    const [employees, setEmployees] = useState([]);
    const [managerFilter, setManagerFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [subordinates, setSubordinates] = useState([]);

    useEffect(() => {
        Promise.all([getEmployee(id), getEmployees()])
            .then(([employeeResponse, employeesResponse]) => {
                const currentEmployee = employeeResponse.data;
                setEmployee(currentEmployee);
                setEmployees(employeesResponse.data);
                setSubordinates(employeesResponse.data.filter(emp => emp.manager_id === currentEmployee.id));
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee(prevEmployee => ({ ...prevEmployee, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateEmployee(id, employee)
            .then(() => {
                onSave();
                navigate('/'); // Redirect to home after saving
            })
            .catch(error => setError(error.message));
    };

    const handleDeleteSubordinate = (subId) => {
        if (window.confirm("Are you sure you want to delete this subordinate?")) {
            deleteEmployee(subId)
                .then(() => {
                    setSubordinates(prevSubordinates => prevSubordinates.filter(sub => sub.id !== subId));
                })
                .catch(error => console.error('Error deleting subordinate:', error));
        }
    };

    const handleDeleteCurrentEmployee = () => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            deleteEmployee(id)
                .then(() => {
                    navigate('/'); // Redirect to home after deleting
                })
                .catch(error => console.error('Error deleting employee:', error));
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <nav className="text-sm mb-4">
                <Link to="/" className="text-blue-500 hover:text-blue-700">Home</Link> / <span className="text-gray-500">Edit Employee</span>
            </nav>
            <h2 className="text-3xl font-semibold mb-6 text-center">Edit Employee</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col space-y-2">
                    <label className="text-gray-700">First Name</label>
                    <input
                        type="text"
                        name="first_name"
                        value={employee.first_name || ''}
                        onChange={handleChange}
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <label className="text-gray-700">Last Name</label>
                    <input
                        type="text"
                        name="last_name"
                        value={employee.last_name || ''}
                        onChange={handleChange}
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <label className="text-gray-700">Position</label>
                    <input
                        type="text"
                        name="position"
                        value={employee.position || ''}
                        onChange={handleChange}
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <label className="text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={employee.email || ''}
                        onChange={handleChange}
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <label className="text-gray-700">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={employee.phone || ''}
                        onChange={handleChange}
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <label className="text-gray-700">Notes</label>
                    <textarea
                        name="notes"
                        value={employee.notes || ''}
                        onChange={handleChange}
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <label className="text-gray-700">Filter Managers</label>
                    <input
                        type="text"
                        placeholder="Search manager by name"
                        value={managerFilter}
                        onChange={(e) => setManagerFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <label className="text-gray-700">Manager</label>
                    <select
                        name="manager_id"
                        value={employee.manager_id || ''}
                        onChange={handleChange}
                        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">No Manager</option>
                        {employees
                            .filter(emp => emp.id !== parseInt(id))
                            .filter(emp => `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(managerFilter.toLowerCase()))
                            .map(emp => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.first_name} {emp.last_name}
                                </option>
                            ))}
                    </select>
                </div>
                {subordinates.length > 0 && (
                    <div className="mt-6">
                        <h4 className="text-lg font-medium mb-2">Subordinates of this employee:</h4>
                        <ul className="list-disc list-inside">
                            {subordinates.map(sub => (
                                <li key={sub.id} className="flex justify-between">
                                    <span>
                                        {sub.first_name} {sub.last_name}
                                    </span>
                                    <span className="text-right">
                                        <Link to={`/edit/${sub.id}`} className="text-blue-500 hover:text-blue-700">Edit</Link> |{' '}
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteSubordinate(sub.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            Delete
                                        </button>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className="flex justify-between items-center mt-6">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={handleDeleteCurrentEmployee}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                    >
                        Delete Current Employee
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditEmployee;
