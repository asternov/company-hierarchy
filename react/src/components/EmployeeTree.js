import React, { useState, useEffect } from 'react';
import { getEmployeeHierarchy, getSubordinates, deleteEmployee } from '../api';
import { Link, useNavigate } from 'react-router-dom';

function EmployeeTree() {
    const [treeData, setTreeData] = useState([]);
    const [expandedNodes, setExpandedNodes] = useState({});
    const [loadingSubordinates, setLoadingSubordinates] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        getEmployeeHierarchy()
            .then(response => setTreeData(response.data))
            .catch(error => console.error('Error fetching hierarchy data:', error));
    };

    const fetchSubordinates = (id) => {
        setLoadingSubordinates(prevState => ({ ...prevState, [id]: true }));
        getSubordinates(id)
            .then(response => {
                setTreeData(prevData =>
                    prevData.map(employee => {
                        if (employee.id === id) {
                            return { ...employee, subordinates: response.data };
                        }
                        // Update nested subordinates
                        const updateSubordinates = (subordinates) => {
                            return subordinates.map(sub => {
                                if (sub.id === id) {
                                    return { ...sub, subordinates: response.data };
                                }
                                if (sub.subordinates) {
                                    sub.subordinates = updateSubordinates(sub.subordinates);
                                }
                                return sub;
                            });
                        };
                        if (employee.subordinates) {
                            employee.subordinates = updateSubordinates(employee.subordinates);
                        }
                        return employee;
                    })
                );
                setLoadingSubordinates(prevState => ({ ...prevState, [id]: false }));
            })
            .catch(error => {
                console.error('Error fetching subordinates:', error);
                setLoadingSubordinates(prevState => ({ ...prevState, [id]: false }));
            });
    };

    const toggleNode = (node) => {
        const { id, subordinates } = node;
        if (expandedNodes[id]) {
            setExpandedNodes(prevState => ({ ...prevState, [id]: false }));
        } else {
            if (!subordinates || subordinates.length === 0) {
                fetchSubordinates(id);
            }
            setExpandedNodes(prevState => ({ ...prevState, [id]: true }));
        }
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            deleteEmployee(id)
                .then(() => fetchData())
                .catch(error => console.error('Error deleting employee:', error));
        }
    };

    const renderTree = (nodes) => {
        if (!nodes || nodes.length === 0) return null;

        return (
            <ul className="ml-6 border-l border-gray-300 pl-4">
                {nodes.map((node) => (
                    <li key={node.id} className="relative mb-4">
                        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => toggleNode(node)}>
                            {node.subordinates && node.subordinates.length > 0 && (
                                <span className={`text-gray-500 ${expandedNodes[node.id] ? 'rotate-90' : ''} transform transition-transform duration-150`}>▶</span>
                            )}
                            <span className="font-medium">{node.first_name} {node.last_name}</span>
                            <span className="text-sm text-gray-500">({node.subordinates_count || 0} subordinates)</span>
                        </div>
                        <div className="flex space-x-4 text-sm mt-1 ml-6">
                            <Link to={`/edit/${node.id}`} className="text-blue-500 hover:text-blue-700">Edit</Link>
                            <button onClick={() => handleDelete(node.id)} className="text-red-500 hover:text-red-700">Delete</button>
                        </div>
                        {expandedNodes[node.id] && node.subordinates && (
                            loadingSubordinates[node.id] ? <p>Loading...</p> : renderTree(node.subordinates)
                        )}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-center">Employee Hierarchy</h2>
            <div className="mb-4 text-right">
                <button onClick={() => navigate('/create')} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">Create Employee</button>
            </div>
            {renderTree(treeData)}
        </div>
    );
}

export default EmployeeTree;
