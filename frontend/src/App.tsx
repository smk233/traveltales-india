import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Navbar from './components/navbar';
import Footer from './components/footer';

// Pages
import Home from './pages/home';
import SignIn from './pages/signin';
import SignUp from './pages/signup';
import CreateBlog from './pages/create-blog';
import BlogDetails from './pages/blog-details';
import Destinations from './pages/destinations';
import DestinationDetails from './pages/destination-details';
import Profile from './pages/profile';
import AdminDashboard from './pages/admin';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors text-slate-800 dark:text-slate-200">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/blog/:slug" element={<BlogDetails />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/destination/:id" element={<DestinationDetails />} />
              <Route path="/profile/:id" element={<Profile />} />

              <Route
                path="/create-blog"
                element={
                  <ProtectedRoute>
                    <CreateBlog />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
