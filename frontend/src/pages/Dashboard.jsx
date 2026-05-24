import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import TaskCard from '../components/TaskCard.jsx';
import TaskModal from '../components/TaskModal.jsx';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    const { data } = await api.get('/tasks');
    setTasks(data.data);
  };

  useEffect(() => {
    fetchTasks().catch((err) => setError(err.response?.data?.message || 'Unable to load tasks'));
  }, []);

  const openCreate = () => {
    setSelectedTask(null);
    setModalOpen(true);
  };

  const handleSave = async (payload) => {
    if (selectedTask) {
      await api.put(`/tasks/${selectedTask._id}`, payload);
    } else {
      await api.post('/tasks', payload);
    }

    setModalOpen(false);
    await fetchTasks();
  };

  const handleDelete = async (id) => {
    await api.delete(`/tasks/${id}`);
    await fetchTasks();
  };

  return (
    <section className="page-stack">
      <div className="page-header">
        <div>
          <h1>My Tasks</h1>
          <p>{tasks.length} task{tasks.length === 1 ? '' : 's'} assigned to you</p>
        </div>
        <button className="button" type="button" onClick={openCreate}>New Task</button>
      </div>
      {error && <p className="alert error">{error}</p>}
      <div className="task-grid">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={(item) => {
              setSelectedTask(item);
              setModalOpen(true);
            }}
            onDelete={handleDelete}
          />
        ))}
      </div>
      {!tasks.length && !error && <p className="empty-state">No tasks yet.</p>}
      <TaskModal
        open={modalOpen}
        task={selectedTask}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </section>
  );
};

export default Dashboard;
