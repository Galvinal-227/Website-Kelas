import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Shield, Lock, User, Mail, Key, UserPlus, Eye, EyeOff, ArrowLeft } from 'lucide-react';

function Login() {
  const { 
    loginWithGoogle, 
    registerWithEmail, 
    loginWithEmail,
    loginAsAdmin 
  } = useAuth();
  
  const [view, setView] = useState('main');
  const [adminCredentials, setAdminCredentials] = useState({
    username: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    const result = await loginWithGoogle();
    setLoading(false);
    
    if (result.success) {
      if (result.user?.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } else {
      setError(result.error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (registerData.password !== registerData.confirmPassword) {
      setError('Password tidak cocok!');
      setLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setError('Password minimal 6 karakter');
      setLoading(false);
      return;
    }

    const userData = {
      name: registerData.name,
      email: registerData.email,
      role: 'user',
      registeredAt: new Date().toISOString(),
      kelas: 'XI PPLG 1',
      jurusan: 'PPLG'
    };

    const result = await registerWithEmail(
      registerData.email, 
      registerData.password, 
      userData
    );

    setLoading(false);
    
    if (result.success) {
      setSuccess('Registrasi berhasil! Silakan login.');
      setTimeout(() => {
        setView('login-email');
        setRegisterData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
      }, 2000);
    } else {
      setError(result.error);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await loginWithEmail(loginData.email, loginData.password);
    setLoading(false);

    if (result.success) {
      if (result.user?.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } else {
      setError(result.error);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const ADMIN_CREDENTIALS = {
      username: 'admin',
      password: 'pplg1admin'
    };

    if (adminCredentials.username === ADMIN_CREDENTIALS.username && 
        adminCredentials.password === ADMIN_CREDENTIALS.password) {
      
      const adminUser = {
        id: 1,
        uid: `admin_${Date.now()}`,
        username: 'admin',
        email: 'admin@gmail.com',
        name: 'Administrator XI PPLG 1',
        role: 'admin',
        isAdmin: true,
        photoURL: 'https://ui-avatars.com/api/?name=Admin&background=dc2626&color=fff&bold=true',
        provider: 'admin',
        emailVerified: true,
        loginTime: new Date().toISOString(),
        permissions: ['all']
      };
      
      const result = loginAsAdmin(adminUser);
      
      if (result.success) {
        setAdminCredentials({ username: '', password: '' });
        setError('');
        
        navigate('/admin');
        
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        setError(result.error);
      }
    } else {
      setError('Username atau password admin salah!');
    }
    
    setLoading(false);
  };

  const handleQuickAdminLogin = async () => {
    setLoading(true);
    
    const adminUser = {
      id: 1,
      uid: `admin_${Date.now()}`,
      username: 'admin',
      email: 'admin@gmail.com',
      name: 'Administrator XI PPLG 1',
      role: 'admin',
      isAdmin: true,
      photoURL: 'https://ui-avatars.com/api/?name=Admin&background=dc2626&color=fff&bold=true',
      provider: 'admin',
      emailVerified: true,
      loginTime: new Date().toISOString(),
      permissions: ['all']
    };
    
    const result = loginAsAdmin(adminUser);
    setLoading(false);
    
    if (result.success) {
      navigate('/admin');
      setTimeout(() => window.location.reload(), 100);
    }
  };

  const handleBack = () => {
    setView('main');
    setError('');
    setSuccess('');
    setAdminCredentials({ username: '', password: '' });
    setRegisterData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setLoginData({
      email: '',
      password: ''
    });
  };

  const renderMainView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border-2 border-orange-500/30 p-8 shadow-xl"
    >
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-500 to-amber-600 flex items-center justify-center">
          <LogIn className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          XI PPLG 1
        </h1>
        <p className="text-gray-400">SMKN 2 Nganjuk</p>
        <p className="text-orange-400 text-sm mt-2 font-medium">Code, Create, Innovate</p>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-emerald-500 text-gray-800 font-semibold rounded-xl hover:bg-emerald-600 transition-all duration-300 disabled:opacity-50"
        >
          <User size={20} />
          {loading ? 'Memproses...' : 'Login dengan Google'}
        </button>

        <button
          onClick={() => setView('register')}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 disabled:opacity-50"
        >
          <UserPlus size={20} />
          Daftar Akun Baru
        </button>

        <button
          onClick={() => setView('login-email')}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-300 disabled:opacity-50"
        >
          <Mail size={20} />
          Login dengan Email
        </button>

        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="px-4 text-gray-500 text-sm">atau</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        <button
          onClick={() => setView('admin')}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 disabled:opacity-50"
        >
          <Shield size={20} />
          Login sebagai Admin
        </button>
      </div>

      <p className="text-center text-gray-500 text-sm mt-6">
        Halaman Login Anggota & Admin Kelas XI PPLG 1
      </p>
    </motion.div>
  );

  const renderRegisterView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border-2 border-blue-500/30 p-8 shadow-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Kembali</span>
        </button>
        <h1 className="text-xl font-bold text-white">Daftar Akun</h1>
        <div className="w-10"></div>
      </div>

      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <p className="text-gray-400">Registrasi anggota XI PPLG 1</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-2 text-sm">Nama Lengkap</label>
          <input
            type="text"
            value={registerData.name}
            onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Masukkan nama lengkap"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2 text-sm">Email</label>
          <input
            type="email"
            value={registerData.email}
            onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="contoh: nama@email.com"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2 text-sm">Password</label>
          <div className="relative">
            <input
              type={showRegisterPassword ? "text" : "password"}
              value={registerData.password}
              onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
              placeholder="Minimal 6 karakter"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowRegisterPassword(!showRegisterPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showRegisterPassword ? <EyeOff className='text-black' size={20} /> : <Eye className='text-black' size={20} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-gray-300 mb-2 text-sm">Konfirmasi Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={registerData.confirmPassword}
              onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
              placeholder="Ulangi password"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showConfirmPassword ? <EyeOff className='text-black' size={20} /> : <Eye className='text-black' size={20} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-green-400 text-sm text-center">{success}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50"
        >
          {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-gray-800">
        <p className="text-center text-gray-500 text-sm">
          Sudah punya akun?{' '}
          <button
            onClick={() => {
              setView('login-email');
              setError('');
              setSuccess('');
            }}
            className="text-blue-400 hover:text-blue-300"
          >
            Login disini
          </button>
        </p>
      </div>
    </motion.div>
  );

  const renderLoginEmailView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border-2 border-green-500/30 p-8 shadow-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Kembali</span>
        </button>
        <h1 className="text-xl font-bold text-white">Login Email</h1>
        <div className="w-10"></div>
      </div>

      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <p className="text-gray-400">Masuk dengan akun terdaftar</p>
      </div>

      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-2 text-sm">Email</label>
          <input
            type="email"
            value={loginData.email}
            onChange={(e) => setLoginData({...loginData, email: e.target.value})}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="contoh: nama@email.com"
            required
            disabled={loading}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-gray-300 text-sm">Password</label>
            <button
              type="button"
              onClick={() => navigate('/reset-password')}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              Lupa Password?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10"
              placeholder="Masukkan password"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff className='text-black' size={20} /> : <Eye className='text-black' size={20} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50"
        >
          {loading ? 'Memproses...' : 'Login dengan Email'}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-gray-800">
        <p className="text-center text-gray-500 text-sm">
          Belum punya akun?{' '}
          <button
            onClick={() => {
              setView('register');
              setError('');
            }}
            className="text-blue-400 hover:text-blue-300"
          >
            Daftar disini
          </button>
        </p>
      </div>
    </motion.div>
  );

  const renderAdminView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border-2 border-orange-500/30 p-8 shadow-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Kembali</span>
        </button>
        <h1 className="text-xl font-bold text-white">Admin Login</h1>
        <div className="w-10"></div>
      </div>

      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <p className="text-gray-400">Panel Admin XI PPLG 1</p>
      </div>

      <form onSubmit={handleAdminLogin} className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-2 text-sm">Username</label>
          <input
            type="text"
            value={adminCredentials.username}
            onChange={(e) => setAdminCredentials({...adminCredentials, username: e.target.value})}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Masukkan username admin"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2 text-sm">Password</label>
          <div className="relative">
            <input
              type="password"
              value={adminCredentials.password}
              onChange={(e) => setAdminCredentials({...adminCredentials, password: e.target.value})}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Masukkan password admin"
              required
              disabled={loading}
            />
            <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 disabled:opacity-50"
        >
          {loading ? 'Memproses...' : 'Login sebagai Admin'}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-gray-800">
        <p className="text-xs text-gray-500 text-center">
          Login hanya untuk admin kelas XI PPLG 1<br />
          <span className="text-red-400">⚠️ Gunakan hanya untuk keperluan administrasi</span>
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {view === 'main' && renderMainView()}
          {view === 'register' && renderRegisterView()}
          {view === 'login-email' && renderLoginEmailView()}
          {view === 'admin' && renderAdminView()}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Login;