// pages/dashboard.js
import { useEffect, useState } from 'react';
import { getMe } from '../api/auth';

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    getMe(token).then(res => setUser(res.data)).catch(() => setUser(null));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {user ? (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
}
