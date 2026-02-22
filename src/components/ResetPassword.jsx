import React, { useState, useEffect } from 'react'; 
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Key, CheckCircle, XCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPassword, handlePasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState('request');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const mode = searchParams.get('mode');
    const oobCode = searchParams.get('oobCode');
    
    if (mode === 'resetPassword' && oobCode) {
      setStep('reset');
    }
  }, [searchParams]);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const result = await resetPassword(email);
    
    if (result.success) {
      setMessage({ 
        type: 'success', 
        text: 'Email reset password telah dikirim ke ' + email 
      });
      setEmail('');
      
      // Auto redirect ke login setelah 5 detik
      setTimeout(() => {
        navigate('/');
      }, 5000);
    } else {
      setMessage({ type: 'error', text: result.error });
    }
    
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Password tidak cocok!' });
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Password minimal 6 karakter' });
      setLoading(false);
      return;
    }

    const oobCode = searchParams.get('oobCode');
    const result = await handlePasswordReset(oobCode, password);
    
    if (result.success) {
      setMessage({ 
        type: 'success', 
        text: 'Password berhasil direset! Anda akan diarahkan ke halaman login.' 
      });
      
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } else {
      setMessage({ type: 'error', text: result.error });
    }
    
    setLoading(false);
  };

  const getStatusColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-green-500/30 bg-green-500/10 text-green-400';
      case 'error':
        return 'border-red-500/30 bg-red-500/10 text-red-400';
      default:
        return 'border-blue-500/30 bg-blue-500/10 text-blue-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/90 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 shadow-2xl max-w-md w-full"
      >
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Login
        </button>

        <div className="text-center mb-8">
          <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r ${
            step === 'request' ? 'from-purple-500 to-purple-600' : 'from-green-500 to-green-600'
          } flex items-center justify-center p-2`}>
            <Key className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {step === 'request' ? 'Reset Password' : 'Buat Password Baru'}
          </h1>
          <p className="text-gray-400">
            {step === 'request' 
              ? 'Masukkan email untuk menerima link reset password' 
              : 'Masukkan password baru untuk akun Anda'}
          </p>
        </div>

        {step === 'request' ? (
          <form onSubmit={handleRequestReset} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="email@example.com"
                required
              />
            </div>

            {message.text && (
              <div className={`p-4 rounded-lg border ${getStatusColor(message.type)}`}>
                <p className="text-sm">{message.text}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-3 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Mengirim...' : 'Kirim Link Reset Password'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">Password Baru</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10"
                    placeholder="Minimal 6 karakter"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">Konfirmasi Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10"
                    placeholder="Ketik ulang password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {message.text && (
              <div className={`p-4 rounded-lg border ${getStatusColor(message.type)}`}>
                <p className="text-sm">{message.text}</p>
              </div>
            )}

            <div className="bg-gray-800/30 p-4 rounded-lg">
              <h4 className="font-semibold text-white mb-2 text-sm">Persyaratan Password:</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${password.length >= 6 ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                  Minimal 6 karakter
                </li>
                <li className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${password === confirmPassword && password ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                  Password cocok
                </li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Mereset...' : 'Reset Password'}
            </button>
          </form>
        )}

        <button
          onClick={() => navigate('/')}
          className="w-full mt-6 px-4 py-3 border border-gray-700 text-gray-300 font-semibold rounded-xl hover:bg-gray-800 transition-all duration-300"
        >
          Kembali ke Login
        </button>

        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="text-sm text-gray-500 space-y-2">
            <p>Tips:</p>
            <ul className="list-disc list-inside pl-2 space-y-1">
              <li>Password harus minimal 6 karakter</li>
              <li>Link reset password hanya berlaku 24 jam</li>
              <li>Jika tidak menerima email, cek folder spam</li>
              <li>Gunakan password yang mudah diingat tapi sulit ditebak</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ResetPassword;