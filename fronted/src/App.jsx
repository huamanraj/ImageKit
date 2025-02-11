import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import UploadPage from "./pages/UploadPage";
import Auth from './pages/Auth';
import Gallery from './pages/Gallery';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => (
  <AuthProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/upload" element={
          <ProtectedRoute>
            <UploadPage />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Auth />} />
        <Route path="/gallery" element={
          <ProtectedRoute>
            <Gallery />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
