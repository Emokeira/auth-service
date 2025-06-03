import React from 'react';

const profileBoxStyle = {
  padding: '1.5rem',
  border: '1px solid #b2dfdb',
  borderRadius: '8px',
  backgroundColor: '#ffffff',
  boxShadow: '0 2px 6px rgba(0, 150, 136, 0.1)',
};

const fieldStyle = {
  fontSize: '1rem',
  margin: '0.5rem 0',
  color: '#004d40',
};

export default function UserProfile({ user }) {
  return (
    <div style={profileBoxStyle}>
      <h2 style={{ color: '#00796b' }}>Your Profile</h2>
      <p style={fieldStyle}>👤 <strong>Name:</strong> {user.name}</p>
      <p style={fieldStyle}>📧 <strong>Email:</strong> {user.email}</p>
      <p style={fieldStyle}>🧾 <strong>Role:</strong> {user.role}</p>
    </div>
  );
}
