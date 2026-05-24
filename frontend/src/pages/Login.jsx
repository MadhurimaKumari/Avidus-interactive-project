import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const user = await login(form);
      const nextPath = location.state?.from?.pathname || (user.role === 'Admin' ? '/admin' : '/dashboard');
      navigate(nextPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <section className="auth-page">
      <form className="auth-panel form" onSubmit={handleSubmit}>
        <h1>Login</h1>
        {error && <p className="alert error">{error}</p>}
        <label>
          Email
          <input
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            required
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
        </label>
        <button className="button" type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
        <p>New here? <Link to="/register">Create an account</Link></p>
      </form>
    </section>
  );
};

export default Login;
