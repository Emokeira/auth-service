import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const navbarStyle = {
  backgroundColor: '#004d40',
  padding: '1rem 2rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  color: '#fff',
};

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  marginRight: '1.5rem',
  fontWeight: '500',
};

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={navbarStyle}>
      <div>
        <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
        {user?.role === 'ADMIN' && <Link to="/admin" style={linkStyle}>Admin</Link>}
      </div>
      <div>
        {user && <span style={{ marginRight: '1rem' }}>👤 {user.name}</span>}
        {user && <button onClick={logout} style={{
          background: 'transparent',
          border: '1px solid #fff',
          borderRadius: '4px',
          padding: '6px 12px',
          color: '#fff',
          cursor: 'pointer',
        }}>Logout</button>}
      </div>
    </div>
  );
}
