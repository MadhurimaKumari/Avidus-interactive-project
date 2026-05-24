import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import MetricCard from '../components/MetricCard.jsx';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/analytics')
      .then(({ data }) => setMetrics(data.data))
      .catch((err) => setError(err.response?.data?.message || 'Unable to load analytics'));
  }, []);

  return (
    <section className="page-stack">
      <div className="page-header">
        <div>
          <h1>Admin Analytics</h1>
          <p>System-wide task and user totals</p>
        </div>
      </div>
      {error && <p className="alert error">{error}</p>}
      <div className="metric-grid">
        <MetricCard label="Total Users" value={metrics.totalUsers} />
        <MetricCard label="Total Tasks" value={metrics.totalTasks} />
        <MetricCard label="Completed Tasks" value={metrics.completedTasks} />
        <MetricCard label="Pending Tasks" value={metrics.pendingTasks} />
      </div>
    </section>
  );
};

export default AdminDashboard;
