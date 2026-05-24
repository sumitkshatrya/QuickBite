import { request } from './api.js';

export const fetchUsers = () => request('/users');
export const fetchRestaurantList = () => request('/restaurants');
export const fetchFoods = () => request('/foods');
export const createRestaurant = (data) => request('/restaurants', { method: 'POST', body: JSON.stringify(data) });
export const deleteRestaurant = (id) => request(`/restaurants/${id}`, { method: 'DELETE' });
export const createFood = (data) => request('/foods', { method: 'POST', body: JSON.stringify(data) });
export const deleteFood = (id) => request(`/foods/${id}`, { method: 'DELETE' });
export const toggleUserAdmin = (id, isAdmin, userData) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify({ ...userData, isAdmin }) });
export const removeUser = (id) => request(`/users/${id}`, { method: 'DELETE' });
export const updateOrder = (id, status) => request(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
