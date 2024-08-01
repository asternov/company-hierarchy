// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Updated import
import EmployeeTree from './components/EmployeeTree';
import EditEmployee from './components/EditEmployee';
import CreateEmployee from './components/CreateEmployee';
import { getEmployees } from './api';

function App() {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = () => {
        getEmployees().then((response) => setEmployees(response.data));
    };

    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
    };

    const handleSave = () => {
        setSelectedEmployee(null);
        fetchEmployees();
    };

    return (
        <Router>
            <div>
                <Routes> {/* Switch is now Routes */}
                    <Route path="/" element={<EmployeeTree />} />
                    <Route path="/edit/:id" element={<EditEmployee onSave={handleSave} />} />
                    <Route path="/create" element={<CreateEmployee onSave={handleSave} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
