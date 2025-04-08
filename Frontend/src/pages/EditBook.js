import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
} from '@mui/material';

export default function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    author: '',
    genre: '',
    year_published: '',
    isbn: '',
    checked_in: true,
  });

  useEffect(() => {
    api.get('/books')
      .then(res => {
        const book = res.data.find(b => b.id === parseInt(id));
        if (book) setForm(book);
        else alert("Book not found");
      });
  }, [id]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    api.put(`/books/${id}`, form).then(() => navigate('/'));
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 600, margin: '2em auto' }}>
      <Typography variant="h5" gutterBottom>Edit Book</Typography>

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
        <TextField
          name="genre"
          label="Genre"
          value={form.genre}
          onChange={handleChange}
        />
        <TextField
          name="year_published"
          label="Year Published"
          type="number"
          value={form.year_published || ''}
          onChange={handleChange}
        />
        <TextField
          name="isbn"
          label="ISBN"
          value={form.isbn}
          onChange={handleChange}
        />
        <FormControlLabel
          control={
            <Checkbox
              name="checked_in"
              checked={form.checked_in}
              onChange={handleChange}
            />
          }
          label="Checked In"
        />
        <Button variant="contained" color="primary" type="submit">
          Update Book
        </Button>
      </Box>
    </Paper>
  );
}
