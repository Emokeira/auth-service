import React, { useEffect, useState } from 'react';

const listStyle = {
  marginTop: '2rem',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  padding: '1rem 1.5rem',
  boxShadow: '0 2px 6px rgba(0, 150, 136, 0.1)',
};

const userItemStyle = {
  borderBottom: '1px solid #b2dfdb',
  padding: '0.75rem 0',
  textAlign: 'left',
};

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const res = await fetch('http://localhost:5000/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError('Could not load user list.');
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={listStyle}>
      <h2 style={{ color: '#00796b' }}>User List</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {users.map((u) => (
            <li key={u.email} style={userItemStyle}>
              <strong>{u.name}</strong> — {u.email} ({u.role})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
