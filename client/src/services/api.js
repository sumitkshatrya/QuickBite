const BASE_URL = import.meta.env.VITE_API_URL;

const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, value);
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

export const request = async (path, options = {}) => {
  const token = localStorage.getItem('quickbiteToken');
  const hasJsonBody = options.body !== undefined && !(options.body instanceof FormData);
  const headers = {
    ...(options.headers || {}),
    ...(hasJsonBody ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error('Unable to connect to the server. Please check your network or API configuration.');
  }

  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    throw new Error(body?.message || `API request failed with status ${response.status}`);
  }

  return body;
};

export const login = (data) => request('/auth/login-user', { method: 'POST', body: JSON.stringify(data) });
export const register = (data) => request('/auth/register-user', { method: 'POST', body: JSON.stringify(data) });
export const loginUser = (data) => request('/auth/login-user', { method: 'POST', body: JSON.stringify(data) });
export const registerUser = (data) => request('/auth/register-user', { method: 'POST', body: JSON.stringify(data) });
export const loginAdmin = (data) => request('/auth/login-admin', { method: 'POST', body: JSON.stringify(data) });
export const registerAdmin = (data) => request('/auth/register-admin', { method: 'POST', body: JSON.stringify(data) });
export const fetchCurrentUser = () => request('/auth/current-user');
export const fetchRestaurants = (params = {}) => request(`/restaurants${buildQueryString(params)}`);
export const fetchRestaurantById = (id) => request(`/restaurants/${id}`);
export const fetchFoods = (params = {}) => request(`/foods${buildQueryString(params)}`);
export const fetchFoodDetails = (id) => request(`/foods/${id}`);
export const createFoodsBulk = (items) => request('/foods/bulk', { method: 'POST', body: JSON.stringify({ items }) });
export const fetchUsers = () => request('/users');
export const placeOrder = (data) => request('/orders', { method: 'POST', body: JSON.stringify(data) });
export const uploadImage = (formData) => request('/uploads/image', { method: 'POST', body: formData, headers: {} });
export const fetchOrders = () => request('/orders');
export const fetchOrderById = (id) => request(`/orders/${id}`);
export const fetchOrderTracking = (id) => request(`/orders/${id}/track`);
export const updateOrderStatus = (id, status) => request(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
