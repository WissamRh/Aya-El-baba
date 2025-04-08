import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    try {
      const res = await api.post('/login', form);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 400, margin: '4em auto' }}>
      <Typography variant="h5" gutterBottom>Login</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          name="username"
          label="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <TextField
          name="password"
          type="password"
          label="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained">Login</Button>
      </Box>
    </Paper>
  );
}
