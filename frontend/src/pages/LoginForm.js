import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

function LoginPageForm({ onLogin }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        onLogin?.(); // Gọi callback nếu có
      } else {
        setMessage('Login failed: ' + (data?.detail || 'Invalid credentials'));
      }
    } catch (err) {
      setMessage('Error logging in');
    }
  };

  return (
    <Form onSubmit={handleLogin} className="mt-4" style={{ maxWidth: '400px', margin: 'auto' }}>
      <h3>Login</h3>
      {message && <Alert variant="danger">{message}</Alert>}
      <Form.Group className="mb-3">
        <Form.Label>Username</Form.Label>
        <Form.Control type="text" name="username" onChange={handleChange} required />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" name="password" onChange={handleChange} required />
      </Form.Group>
      <Button type="submit" className="w-100">Login</Button>
    </Form>
  );
}

export default LoginPageForm;
