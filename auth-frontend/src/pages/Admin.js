// pages/admin.js
import { useEffect, useState } from 'react';
import { getAdmin } from '../api/auth';

export default function AdminPage() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    getAdmin(token)
      .then(res => setMessage(res.data.message))
      .catch(() => setMessage('Access denied or not logged in'));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Admin Area</h1>
      <p className="mt-4">{message}</p>
    </div>
  );
}
