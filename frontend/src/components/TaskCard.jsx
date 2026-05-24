const TaskCard = ({ task, onEdit, onDelete }) => {
  const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date';

  return (
    <article className="task-card">
      <div>
        <span className={`status ${task.status === 'Completed' ? 'completed' : ''}`}>
          {task.status}
        </span>
        <h3>{task.title}</h3>
        <p>{task.description || 'No description added.'}</p>
      </div>
      <div className="task-footer">
        <span>{dueDate}</span>
        <div className="row-actions">
          <button className="button secondary" type="button" onClick={() => onEdit(task)}>Edit</button>
          <button className="button danger" type="button" onClick={() => onDelete(task._id)}>Delete</button>
        </div>
      </div>
    </article>
  );
};

export default TaskCard;
