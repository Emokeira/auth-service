import React, { useState } from 'react';
import { loginUser } from '../api';
import { useNavigate } from 'react-router-dom';

const formStyle = {
  maxWidth: '400px',
  margin: '2rem auto',
  padding: '2rem',
  borderRadius: '8px',
  backgroundColor: '#e0f7fa', // very light cyan/teal background
  boxShadow: '0 4px 12px rgba(0, 128, 128, 0.15)',
};

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  marginBottom: '1rem',
  borderRadius: '4px',
  border: '1.5px solid #4db6ac', // teal border
  fontSize: '1rem',
};

const buttonStyle = {
  backgroundColor: '#008080', // teal
  color: 'white',
  padding: '12px 20px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '1rem',
};

const errorStyle = {
  color: '#d32f2f', // red for error
  marginBottom: '1rem',
};

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const { email, password } = formData;

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      const response = await loginUser({ email, password });
      if (response.error) {
        setError(response.error);
      } else if (response.token) {
        localStorage.setItem('accessToken',token);
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userName', user.fullname);

        if (expiresIn) {
          const expiresAt = Date.now() + expiresIn * 1000;
          localStorage.setItem('expiresAt', expiresAt);
        }
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Login failed, please try again');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2 style={{ color: '#00695c', marginBottom: '1.5rem' }}>Login</h2>
      {error && <p style={errorStyle}>{error}</p>}
      <input
        style={inputStyle}
        type="email"
        name="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        style={inputStyle}
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button type="submit" style={buttonStyle}>Log In</button>
    </form>
  );
}
