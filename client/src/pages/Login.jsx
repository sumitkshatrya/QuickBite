import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../store/authSlice.js';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);
  const authError = useSelector((state) => state.auth.error);
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await dispatch(loginUser(form)).unwrap();
      navigate(response.isAdmin || response.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      setMessage(error || authError || 'Unable to login');
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl bg-white/90 p-8 shadow-xl backdrop-blur-md">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
        <p className="mt-2 text-slate-600">Sign in to your QuickBite account</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Email Address</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
            placeholder="you@example.com"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Password</span>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
            placeholder="********"
          />
        </label>

        {(message || authError) && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {message || authError}
          </div>
        )}

        {authStatus === 'loading' && (
          <p className="text-center text-sm text-slate-500">Signing in...</p>
        )}

        <button
          type="submit"
          disabled={authStatus === 'loading'}
          className="w-full rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {authStatus === 'loading' ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-slate-900 hover:text-slate-700">
            Create one
          </Link>
        </p>
      </div>

      <div className="mt-4 text-center">
        <p className="text-slate-600">
          Are you a restaurant admin?{' '}
          <Link to="/admin/login" className="font-semibold text-slate-900 hover:text-slate-700">
            Admin login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
