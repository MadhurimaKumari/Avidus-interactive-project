import { useEffect, useState } from 'react';
import api from '../api/axios.js';

const TaskMonitoring = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    const { data } = await api.get('/admin/tasks');
    setTasks(data.data);
  };

  useEffect(() => {
    fetchTasks().catch((err) => setError(err.response?.data?.message || 'Unable to load tasks'));
  }, []);

  const deleteTask = async (id) => {
    await api.delete(`/admin/tasks/${id}`);
    await fetchTasks();
  };

  return (
    <section className="page-stack">
      <div className="page-header">
        <div>
          <h1>Task Monitoring</h1>
          <p>{tasks.length} task{tasks.length === 1 ? '' : 's'} across all users</p>
        </div>
      </div>
      {error && <p className="alert error">{error}</p>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>{task.user?.name || 'Deleted user'}</td>
                <td><span className={`status ${task.status === 'Completed' ? 'completed' : ''}`}>{task.status}</span></td>
                <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</td>
                <td>
                  <button className="button danger" type="button" onClick={() => deleteTask(task._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TaskMonitoring;
