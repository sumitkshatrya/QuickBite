import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerAdmin } from '../../store/authSlice.js';

const AdminRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);
  const authError = useSelector((state) => state.auth.error);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    phone: '',
    adminSecret: '',
  });
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    if (form.password !== form.confirm) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      await dispatch(
        registerAdmin({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          adminSecret: form.adminSecret,
        })
      ).unwrap();
      navigate('/admin');
    } catch {
      // handled by auth state
    }
  };

  return (
    <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white/90 p-8 shadow-xl backdrop-blur-md">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-slate-900">Create Admin Account</h2>
        <p className="mt-2 text-sm text-slate-600">Register your restaurant management account</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Full Name</span>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
            placeholder="John Doe"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
            placeholder="admin@restaurant.com"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Phone</span>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
            placeholder="+1234567890"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Admin Secret</span>
          <input
            type="password"
            name="adminSecret"
            value={form.adminSecret}
            onChange={handleChange}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
            placeholder="Required when ADMIN_SECRET is enabled"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Password</span>
          <div className="relative mt-1">
            <input
              type={show ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
              placeholder="Minimum 8 characters"
            />
            <button
              type="button"
              onClick={() => setShow((current) => !current)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500 hover:text-slate-700"
            >
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">Confirm Password</span>
          <input
            type={show ? 'text' : 'password'}
            name="confirm"
            value={form.confirm}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
            placeholder="Repeat your password"
          />
        </label>

        {(message || authError) && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {message || authError}
          </div>
        )}

        <button
          type="submit"
          disabled={authStatus === 'loading'}
          className="mt-2 w-full rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {authStatus === 'loading' ? 'Creating...' : 'Create Admin Account'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-600">
          Already have an admin account?{' '}
          <Link to="/admin/login" className="font-semibold text-slate-900 hover:text-slate-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminRegister;
