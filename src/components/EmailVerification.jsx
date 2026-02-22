import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Mail, RefreshCw } from 'lucide-react';

function EmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { 
    handleEmailVerification, 
    resendVerificationEmail, 
    checkEmailVerification,
    currentUser 
  } = useAuth();
  
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const mode = searchParams.get('mode');
      const oobCode = searchParams.get('oobCode');
      
      if (mode === 'verifyEmail' && oobCode) {
        try {
          const result = await handleEmailVerification(oobCode);
          if (result.success) {
            setStatus('success');
            setMessage('Email berhasil diverifikasi! Anda dapat login sekarang.');
            
            // Redirect ke login setelah 3 detik
            setTimeout(() => {
              navigate('/login');
            }, 3000);
          } else {
            setStatus('error');
            setMessage(result.error || 'Gagal memverifikasi email.');
          }
        } catch (error) {
          setStatus('error');
          setMessage('Terjadi kesalahan saat memverifikasi email.');
        }
      } else {
        setStatus('info');
        setMessage('Link verifikasi tidak valid atau telah kadaluarsa.');
      }
    };

    verifyEmail();
  }, [searchParams, navigate, handleEmailVerification]);

  const handleResendVerification = async () => {
    setIsResending(true);
    const result = await resendVerificationEmail();
    
    if (result.success) {
      setMessage('Email verifikasi telah dikirim ulang. Silakan cek inbox Anda.');
    } else {
      setMessage(result.error);
    }
    
    setIsResending(false);
  };

  const handleCheckVerification = async () => {
    const result = await checkEmailVerification();
    
    if (result.verified) {
      setStatus('success');
      setMessage('Email Anda sudah diverifikasi! Anda akan diarahkan ke halaman utama.');
      
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    } else {
      setMessage('Email belum diverifikasi. Silakan cek email Anda.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border-2 border-blue-500/30 p-8 shadow-xl max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
            {status === 'loading' ? (
              <Mail className="w-10 h-10 text-white" />
            ) : status === 'success' ? (
              <CheckCircle className="w-10 h-10 text-white" />
            ) : (
              <XCircle className="w-10 h-10 text-white" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {status === 'loading' ? 'Memverifikasi Email...' : 
             status === 'success' ? 'Email Terverifikasi!' : 
             'Verifikasi Email'}
          </h1>
        </div>

        <div className="space-y-6">
          <div className={`p-4 rounded-lg text-center ${
            status === 'success' ? 'bg-green-500/10 border border-green-500/20' :
            status === 'error' ? 'bg-red-500/10 border border-red-500/20' :
            'bg-blue-500/10 border border-blue-500/20'
          }`}>
            <p className={`font-medium ${
              status === 'success' ? 'text-green-400' :
              status === 'error' ? 'text-red-400' :
              'text-blue-400'
            }`}>
              {message}
            </p>
          </div>

          {status === 'info' && currentUser && (
            <div className="space-y-4">
              <button
                onClick={handleResendVerification}
                disabled={isResending}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 disabled:opacity-50"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Kirim Ulang Email Verifikasi
                  </>
                )}
              </button>

              <button
                onClick={handleCheckVerification}
                className="w-full px-4 py-3 bg-gray-700 text-white font-semibold rounded-xl hover:bg-gray-600 transition-all duration-300"
              >
                Saya Sudah Verifikasi
              </button>
            </div>
          )}

          <button
            onClick={() => navigate('/login')}
            className="w-full px-4 py-3 border border-gray-700 text-gray-300 font-semibold rounded-xl hover:bg-gray-800 transition-all duration-300"
          >
            Kembali ke Login
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-800">
          <p className="text-sm text-gray-500 text-center">
            Pastikan Anda mengecek folder spam jika email verifikasi tidak ditemukan di inbox.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default EmailVerification;