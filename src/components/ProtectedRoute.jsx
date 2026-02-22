import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { currentUser, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-400">Memeriksa autentikasi...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    // Redirect to login with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if admin access is required
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center max-w-md p-8 bg-gray-900/50 rounded-2xl border border-red-800/30">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-red-500/20 to-red-600/20 flex items-center justify-center">
            <Shield className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Akses Ditolak</h2>
          <p className="text-gray-400 mb-6">Halaman ini hanya untuk administrator</p>
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Kembali
            </button>
            <button
              onClick={() => window.location.href = '/profile'}
              className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-lg transition-all duration-200"
            >
              Ke Profil Saya
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;