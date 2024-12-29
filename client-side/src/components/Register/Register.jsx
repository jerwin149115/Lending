// import { useNavigate } from 'react-router-dom';
import { register } from '../../api/AuthUserApi';
import React, { useState } from 'react';
import './Register.css'

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    // const navigate = useNavigate();
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      setLoading(true);
      try {
        const data = await register({ username, password });
        navigate('/dashboard')
        setSuccessMessage('Register successfully!')
        console.log('Registration successful');
      } catch (err) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className='register-page'>
        <div className="register-container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className='register-btn' type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
          {error && <p className="error">{error}</p>}
          {successMessage && <p className="success">{successMessage}</p>}
        </form>
        <p className="login-link">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
      </div>
    );
}

export default Register