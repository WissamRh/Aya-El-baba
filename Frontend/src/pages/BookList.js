import { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';






export default function BookList() {
  const [books, setBooks] = useState([]);
  const [titleFilter, setTitleFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchBooks = () => {
    const params = {};
    if (titleFilter) params.title = titleFilter;
    if (authorFilter) params.author = authorFilter;

    const endpoint = Object.keys(params).length > 0 ? '/books/search' : '/books';
    api.get(endpoint, { params }).then(res => setBooks(res.data));
  };

  const handleSearch = e => {
    e.preventDefault();
    fetchBooks();
  };

  const confirmDelete = book => {
    setBookToDelete(book);
    setDialogOpen(true);
  };

  const handleDeleteConfirmed = () => {
    if (!bookToDelete) return;

    api.delete(`/books/${bookToDelete.id}`)
      .then(() => {
        setBooks(prev => prev.filter(book => book.id !== bookToDelete.id));
        setDialogOpen(false);
        setBookToDelete(null);
      })
      .catch(err => {
        console.error('Error deleting book:', err);
        alert('Failed to delete book');
      });
  };

  return (
    <Box sx={{ padding: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4">Books</Typography>
            <Button variant="outlined" color="error" onClick={handleLogout}>
            Logout
            </Button>
        </Box>
      <Typography variant="h4" gutterBottom>Books</Typography>

      <Button
        component={Link}
        to="/add"
        variant="contained"
        sx={{ mb: 2 }}
      >
        Add Book
      </Button>

      <Box
        component="form"
        onSubmit={handleSearch}
        sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}
      >
        <TextField
          label="Search by title"
          value={titleFilter}
          onChange={e => setTitleFilter(e.target.value)}
        />
        <TextField
          label="Search by author"
          value={authorFilter}
          onChange={e => setAuthorFilter(e.target.value)}
        />
        <Button type="submit" variant="outlined">Search</Button>
        <Button type="button" variant="outlined" color="secondary" onClick={() => {
          setTitleFilter('');
          setAuthorFilter('');
          fetchBooks();
        }}>
          Reset
        </Button>
      </Box>

      <Grid container spacing={2}>
        {books.map(book => (
          <Grid item xs={12} md={6} key={book.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{book.title}</Typography>
                <Typography variant="subtitle1" gutterBottom>
                  by {book.author}
                </Typography>
                <Typography variant="body2">
                  {book.checked_in ? "📚 In Library" : "📦 Checked Out"}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  <Button
                    component={Link}
                    to={`/edit/${book.id}`}
                    variant="outlined"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => confirmDelete(book)}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{bookToDelete?.title}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirmed} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
