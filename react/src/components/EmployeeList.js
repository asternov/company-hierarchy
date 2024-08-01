// src/components/EmployeeList.js
import React from 'react';
import { deleteEmployee } from '../api';

function EmployeeList({ employees, onEdit, onDelete }) {
    return (
        <ul>
            {employees.map((employee) => (
                <li key={employee.id}>
                    {employee.first_name} {employee.last_name}
                    <button onClick={() => onEdit(employee)}>Edit</button>
                    <button onClick={() => deleteEmployee(employee.id).then(onDelete)}>Delete</button>
                </li>
            ))}
        </ul>
    );
}

export default EmployeeList;
