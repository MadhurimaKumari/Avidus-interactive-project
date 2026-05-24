import { useEffect, useState } from 'react';
import api from '../api/axios.js';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/logs')
      .then(({ data }) => setLogs(data.data))
      .catch((err) => setError(err.response?.data?.message || 'Unable to load activity logs'));
  }, []);

  return (
    <section className="page-stack">
      <div className="page-header">
        <div>
          <h1>Activity Logs</h1>
          <p>{logs.length} recorded event{logs.length === 1 ? '' : 's'}</p>
        </div>
      </div>
      {error && <p className="alert error">{error}</p>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>User</th>
              <th>Action</th>
              <th>Details</th>
              <th>IP</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td>{new Date(log.createdAt).toLocaleString()}</td>
                <td>{log.user?.name || 'Deleted user'}</td>
                <td>{log.action}</td>
                <td>{log.details}</td>
                <td>{log.ipAddress || 'unknown'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ActivityLogs;
