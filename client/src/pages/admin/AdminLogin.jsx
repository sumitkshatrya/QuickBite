import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginAdmin } from '../../store/authSlice.js';

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);
  const authError = useSelector((state) => state.auth.error);
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await dispatch(loginAdmin(form)).unwrap();
      navigate('/admin');
    } catch {
      // handled by auth state
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl bg-white/90 p-8 shadow-xl backdrop-blur-md">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-900">Admin Login</h2>
        <p className="mt-2 text-slate-600">Sign in to your restaurant dashboard</p>
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
            placeholder="admin@example.com"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Password</span>
          <div className="relative mt-2">
            <input
              type={show ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
              placeholder="********"
            />
            <button
              type="button"
              onClick={() => setShow((current) => !current)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
        </label>

        {authError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {authError}
          </div>
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
          Don't have an admin account?{' '}
          <Link to="/admin/register" className="font-semibold text-slate-900 hover:text-slate-700">
            Create one
          </Link>
        </p>
      </div>

      <div className="mt-4 text-center">
        <Link to="/login" className="font-semibold text-slate-900 hover:text-slate-700">
          Back to user login
        </Link>
      </div>
    </div>
  );
};

export default AdminLogin;
