import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Common/Navbar';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ChangePassword from './components/Auth/ChangePassword';
import AdminDashboard from './components/Admin/AdminDashboard';
import UserList from './components/Admin/UserList';
import UserDetails from './components/Admin/UserDetails';
import StoreList from './components/Admin/StoreList';
import UserStores from './components/User/UserStores';
import StoreOwnerDashboard from './components/StoreOwner/StoreOwnerDashboard';
import './App.css';

const HomeRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  switch (user.role) {
    case 'admin': return <Navigate to="/admin/dashboard" />;
    case 'store_owner': return <Navigate to="/store-owner/dashboard" />;
    default: return <Navigate to="/user/stores" />;
  }
};

const AppLayout = ({ children }) => {
  const { user } = useAuth();
  if (!user) return children;

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/" element={<AppLayout><HomeRedirect /></AppLayout>} />
            <Route path="/change-password" element={
              <AppLayout><ProtectedRoute><ChangePassword /></ProtectedRoute></AppLayout>
            } />

            <Route path="/admin/dashboard" element={
              <AppLayout><ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute></AppLayout>
            } />
            <Route path="/admin/users" element={
              <AppLayout><ProtectedRoute roles={['admin']}><UserList /></ProtectedRoute></AppLayout>
            } />
            <Route path="/admin/users/:id" element={
              <AppLayout><ProtectedRoute roles={['admin']}><UserDetails /></ProtectedRoute></AppLayout>
            } />
            <Route path="/admin/stores" element={
              <AppLayout><ProtectedRoute roles={['admin']}><StoreList /></ProtectedRoute></AppLayout>
            } />

            <Route path="/user/stores" element={
              <AppLayout><ProtectedRoute roles={['user']}><UserStores /></ProtectedRoute></AppLayout>
            } />

            <Route path="/store-owner/dashboard" element={
              <AppLayout><ProtectedRoute roles={['store_owner']}><StoreOwnerDashboard /></ProtectedRoute></AppLayout>
            } />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
