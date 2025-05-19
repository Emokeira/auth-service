import React, { useEffect, useState } from 'react';
import { getAdmin } from '../api/auth'; // ✅ Correct relative path

const Moderators = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    getAdmin(token)
      .then((res) => setMessage(res.data.message))
      .catch((err) => setMessage('Access denied'));
  }, []);

  return <div>{message}</div>;
};

export default Moderators;
