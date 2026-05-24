import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <Link className="brand" to="/dashboard">Avidus Tasks</Link>
      <nav className="nav-links">
        {isAuthenticated && <NavLink to="/dashboard">Tasks</NavLink>}
        {isAdmin && <NavLink to="/admin">Analytics</NavLink>}
        {isAdmin && <NavLink to="/admin/users">Users</NavLink>}
        {isAdmin && <NavLink to="/admin/tasks">All Tasks</NavLink>}
        {isAdmin && <NavLink to="/admin/logs">Logs</NavLink>}
      </nav>
      <div className="nav-actions">
        {isAuthenticated ? (
          <>
            <span className="user-chip">{user?.name} · {user?.role}</span>
            <button className="button secondary" type="button" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link className="button secondary" to="/login">Login</Link>
            <Link className="button" to="/register">Register</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
