import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

export default function AddBook() {
  const [form, setForm] = useState({ title: '', author: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    api.post('/books', form).then(() => navigate('/'));
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, margin: '2em auto' }}>
      <Typography variant="h5" gutterBottom>Add Book</Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          name="title"
          label="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <TextField
          name="author"
          label="Author"
          value={form.author}
          onChange={handleChange}
          required
        />
        <Button variant="contained" type="submit">
          Add Book
        </Button>
      </Box>
    </Paper>
  );
}
