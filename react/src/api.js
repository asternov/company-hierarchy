import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const getEmployeeHierarchy = () => axios.get(`${API_BASE_URL}/hierarchy`);

export const getSubordinates = (managerId) => axios.get(`${API_BASE_URL}/hierarchy/subordinates/${managerId}`);

export const createEmployee = (employeeData) => axios.post(`${API_BASE_URL}/employees`, employeeData);

export const updateEmployee = (id, employeeData) => axios.put(`${API_BASE_URL}/employees/${id}`, employeeData);

export const deleteEmployee = (id) => axios.delete(`${API_BASE_URL}/employees/${id}`);
export const getEmployees = () => axios.get(`${API_BASE_URL}/employees`);
export const getEmployee = (id) => axios.get(`${API_BASE_URL}/employees/${id}`);
