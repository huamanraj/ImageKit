import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import UploadPage from "./pages/UploadPage";
import Auth from './pages/Auth';
import Gallery from './pages/Gallery';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingOverlay from "./components/LoadingOverlay";
import { Toaster } from 'react-hot-toast';

const App = () => (
  <AuthProvider>
    <>
      <Toaster position="top-right" />
      <AppContent />
    </>
  </AuthProvider>
);

const AppContent = () => {
  const { initializing } = useAuth();

  return initializing ? (
    <LoadingOverlay />
  ) : (
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
  );
};

export default App;
