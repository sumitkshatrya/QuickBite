import { useEffect, useState } from 'react';
import { fetchUsers, request } from '../../services/api.js';

const updateUser = (id, data) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
const deleteUser = (id) => request(`/users/${id}`, { method: 'DELETE' });

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      setUsers(await fetchUsers());
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleAdmin = async (user) => {
    try {
      await updateUser(user._id, { isAdmin: !user.isAdmin, name: user.name, email: user.email });
      await load();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const remove = async (id) => {
    try {
      await deleteUser(id);
      await load();
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Users</h2>
            <p className="text-sm text-slate-500">View users and manage admin privileges.</p>
          </div>
        </div>
        {message && <div className="mt-4 rounded-xl bg-slate-100 px-4 py-3 text-slate-700">{message}</div>}
        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
          <div className="grid gap-0 divide-y divide-slate-200">
            {loading ? (
              <div className="p-6 text-slate-500">Loading users…</div>
            ) : (
              users.map((user) => (
                <div key={user._id} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => toggleAdmin(user)}
                      className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      {user.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                    </button>
                    <button
                      onClick={() => remove(user._id)}
                      className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
