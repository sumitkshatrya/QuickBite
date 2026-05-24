import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  login as loginApi,
  register as registerApi,
  fetchCurrentUser as fetchCurrentUserApi,
  loginAdmin as loginAdminApi,
  registerAdmin as registerAdminApi,
} from '../services/api.js';

const parseStoredUser = () => {
  try {
    const value = localStorage.getItem('quickbiteUser');
    return value ? JSON.parse(value) : null;
  } catch {
    localStorage.removeItem('quickbiteUser');
    return null;
  }
};

const tokenFromStorage = localStorage.getItem('quickbiteToken');
const parsedUserFromStorage = parseStoredUser();

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, thunkAPI) => {
  try {
    const response = await loginApi(credentials);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/registerUser', async (data, thunkAPI) => {
  try {
    const response = await registerApi(data);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Registration failed');
  }
});

export const registerAdmin = createAsyncThunk('auth/registerAdmin', async (data, thunkAPI) => {
  try {
    const response = await registerAdminApi(data);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Registration failed');
  }
});

export const loginAdmin = createAsyncThunk('auth/loginAdmin', async (credentials, thunkAPI) => {
  try {
    const response = await loginAdminApi(credentials);
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Login failed');
  }
});

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, thunkAPI) => {
  try {
    const response = await fetchCurrentUserApi();
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message || 'Unable to fetch current user');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: parsedUserFromStorage
      ? { ...parsedUserFromStorage, isAdmin: parsedUserFromStorage.isAdmin || false }
      : null,
    token: tokenFromStorage || null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('quickbiteUser');
      localStorage.removeItem('quickbiteToken');
    },
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('quickbiteUser', JSON.stringify(action.payload.user));
      localStorage.setItem('quickbiteToken', action.payload.token);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = {
          _id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
          isAdmin: action.payload.isAdmin || false,
          role: action.payload.role || 'user',
        };
        state.token = action.payload.token;
        localStorage.setItem('quickbiteUser', JSON.stringify(state.user));
        localStorage.setItem('quickbiteToken', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = {
          _id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
          isAdmin: action.payload.isAdmin || false,
          role: action.payload.role || 'user',
        };
        state.token = action.payload.token;
        localStorage.setItem('quickbiteUser', JSON.stringify(state.user));
        localStorage.setItem('quickbiteToken', action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(registerAdmin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerAdmin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = {
          _id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
          isAdmin: action.payload.isAdmin || false,
          role: action.payload.role || 'admin',
        };
        state.token = action.payload.token;
        localStorage.setItem('quickbiteUser', JSON.stringify(state.user));
        localStorage.setItem('quickbiteToken', action.payload.token);
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(loginAdmin.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = {
          _id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
          isAdmin: action.payload.isAdmin || false,
          role: action.payload.role || 'admin',
        };
        state.token = action.payload.token;
        localStorage.setItem('quickbiteUser', JSON.stringify(state.user));
        localStorage.setItem('quickbiteToken', action.payload.token);
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = {
          _id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
          isAdmin: action.payload.isAdmin || false,
          role: action.payload.role || 'user',
        };
        localStorage.setItem('quickbiteUser', JSON.stringify(state.user));
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
        state.user = null;
        state.token = null;
        localStorage.removeItem('quickbiteUser');
        localStorage.removeItem('quickbiteToken');
      });
  },
});

export const { logout, clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;
