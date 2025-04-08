import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BookList from './pages/BookList';
import AddBook from './pages/AddBook';
import EditBook from './pages/EditBook';
import Login from './pages/Login';
import { isLoggedIn } from './auth';

function ProtectedRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><BookList /></ProtectedRoute>} />
        <Route path="/add" element={<ProtectedRoute><AddBook /></ProtectedRoute>} />
        <Route path="/edit/:id" element={<ProtectedRoute><EditBook /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}
