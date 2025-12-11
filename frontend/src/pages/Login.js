import React, { useState } from 'react';
import useAuth from '../auth/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      await login(username, password);
      nav('/');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="p-4">
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="username" />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="password" type="password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
