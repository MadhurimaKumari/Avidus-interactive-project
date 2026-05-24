import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    const { data } = await api.get('/admin/users');
    setUsers(data.data);
  };

  useEffect(() => {
    fetchUsers().catch((err) => setError(err.response?.data?.message || 'Unable to load users'));
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/admin/users/${id}/status`, { status });
    await fetchUsers();
  };

  const deleteUser = async (id) => {
    await api.delete(`/admin/users/${id}`);
    await fetchUsers();
  };

  return (
    <section className="page-stack">
      <div className="page-header">
        <div>
          <h1>User Management</h1>
          <p>{users.length} registered user{users.length === 1 ? '' : 's'}</p>
        </div>
      </div>
      {error && <p className="alert error">{error}</p>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((item) => {
              const isSelf = item._id === currentUser?._id;
              return (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.role}</td>
                  <td><span className={`status ${item.status === 'Active' ? 'completed' : ''}`}>{item.status}</span></td>
                  <td className="row-actions">
                    <button
                      className="button secondary"
                      type="button"
                      disabled={isSelf}
                      onClick={() => updateStatus(item._id, item.status === 'Active' ? 'Inactive' : 'Active')}
                    >
                      {item.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      className="button danger"
                      type="button"
                      disabled={isSelf}
                      onClick={() => deleteUser(item._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default UserManagement;
