import { useEffect, useState } from 'react';

const emptyForm = {
  title: '',
  description: '',
  status: 'Pending',
  dueDate: '',
};

const TaskModal = ({ open, task, onClose, onSave }) => {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'Pending',
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [task, open]);

  if (!open) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      ...form,
      dueDate: form.dueDate || undefined,
    });
  };

  return (
    <div className="modal-backdrop">
      <section className="modal">
        <header className="modal-header">
          <h2>{task ? 'Edit Task' : 'New Task'}</h2>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close">x</button>
        </header>
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Title
            <input
              required
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
            />
          </label>
          <label>
            Description
            <textarea
              rows="4"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
            />
          </label>
          <div className="form-grid">
            <label>
              Status
              <select
                value={form.status}
                onChange={(event) => setForm({ ...form, status: event.target.value })}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </label>
            <label>
              Due Date
              <input
                type="date"
                value={form.dueDate}
                onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
              />
            </label>
          </div>
          <div className="modal-actions">
            <button className="button secondary" type="button" onClick={onClose}>Cancel</button>
            <button className="button" type="submit">Save Task</button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default TaskModal;
