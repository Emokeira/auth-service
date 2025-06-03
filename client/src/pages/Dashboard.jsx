import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import UserList from '../components/UserList';
import UserProfile from '../components/UserProfile';

const containerStyle = {
  maxWidth: '800px',
  margin: '2rem auto',
  padding: '2rem',
  borderRadius: '8px',
  backgroundColor: '#e0f7fa',
  boxShadow: '0 4px 12px rgba(0, 128, 128, 0.15)',
  textAlign: 'center',
};

const headingStyle = {
  color: '#00695c',
  marginBottom: '1.5rem',
};

export default function Dashboard() {
  const { user, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-logout if token expired
    const expiry = localStorage.getItem('tokenExpiry');
    if (expiry && Date.now() > parseInt(expiry)) {
      logout();
    }
  }, [logout]);

  if (loading) return <p style={{ textAlign: 'center', marginTop: '3rem' }}>Loading...</p>;
  if (!user) return <p style={{ textAlign: 'center', marginTop: '3rem' }}>User not found</p>;

  return (
    <>
      <Navbar />
      <div style={containerStyle}>
        <h1 style={headingStyle}>Dashboard</h1>
        {user.role === 'ADMIN' ? (
          <>
            <p style={{ marginBottom: '1rem' }}>
              👋 Welcome Admin, <strong>{user.name}</strong>!
            </p>
            <UserList />
          </>
        ) : (
          <UserProfile user={user} />
        )}
      </div>
    </>
  );
}
