import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  updateProfile,
  updatePassword,
  EmailAuthProvider, 
  reauthenticateWithCredential 
} from 'firebase/auth';
import { auth } from '../firebase/config';
import {
  User,
  Camera,
  Save,
  X,
  Lock,
  Mail,
  Calendar,
  Shield,
  Phone,
  MapPin,
  Award,
  ChevronLeft,
  LogOut,
  Eye,
  EyeOff,
  Check,
  Loader2,
  MessageSquare,
  Image as ImageIcon,
  Volume2,
  Database,
  Activity,
  RefreshCw
} from 'lucide-react';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [stats, setStats] = useState({
    messages: 0,
    images: 0,
    voiceMessages: 0,
    lastSync: null
  });

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
      setEmail(currentUser.email || '');
      setPhotoURL(currentUser.photoURL || '');
      
      const savedPhoto = localStorage.getItem(`user_photo_${currentUser.uid}`);
      if (savedPhoto) {
        setPhotoURL(savedPhoto);
      }
      
      const savedBio = localStorage.getItem(`user_bio_${currentUser.uid}`);
      const savedPhone = localStorage.getItem(`user_phone_${currentUser.uid}`);
      const savedLocation = localStorage.getItem(`user_location_${currentUser.uid}`);
      const savedDisplayName = localStorage.getItem(`user_displayName_${currentUser.uid}`);
      
      if (savedDisplayName) {
        setDisplayName(savedDisplayName);
      }
      
      setBio(savedBio || 'Siswa PPLG 1');
      setPhone(savedPhone || 'Belum diatur');
      setLocation(savedLocation || 'Nganjuk, Jawa Timur');
      
      loadStats();
    }
  }, [currentUser]);

  const loadStats = () => {
    try {
      const userStats = JSON.parse(localStorage.getItem(`user_stats_${currentUser?.uid}`)) || {
        messages: 0,
        images: 0,
        voiceMessages: 0,
        lastSync: new Date().toISOString()
      };
      setStats(userStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const syncChatMessagesWithProfile = () => {
    if (!currentUser) return;
    
    try {
      const savedMessages = localStorage.getItem('chatMessages');
      if (!savedMessages) return 0;
      
      const messages = JSON.parse(savedMessages);
      let updatedCount = 0;
      
      const updatedMessages = messages.map(msg => {
        if (msg.senderId === currentUser.uid) {
          const updatedMsg = { ...msg };
          let hasChanges = false;
          
          if (displayName.trim() && msg.senderName !== displayName.trim()) {
            updatedMsg.senderName = displayName.trim();
            hasChanges = true;
          }
          
          const currentPhoto = photoURL || localStorage.getItem(`user_photo_${currentUser.uid}`);
          if (currentPhoto && msg.senderPhoto !== currentPhoto) {
            updatedMsg.senderPhoto = currentPhoto;
            hasChanges = true;
          }
          
          if (hasChanges) {
            updatedCount++;
          }
          
          return updatedMsg;
        }
        return msg;
      });
      
      if (updatedCount > 0) {
        localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
        return updatedCount;
      }
      
      return 0;
      
    } catch (error) {
      console.error('Error syncing chat messages:', error);
      return 0;
    }
  };

  const calculateStatsFromChat = () => {
    if (!currentUser) return stats;
    
    try {
      const savedMessages = localStorage.getItem('chatMessages');
      if (!savedMessages) return stats;
      
      const messages = JSON.parse(savedMessages);
      const userMessages = messages.filter(msg => msg.senderId === currentUser.uid);
      
      const newStats = {
        messages: userMessages.filter(msg => msg.type === 'text').length,
        images: userMessages.filter(msg => msg.type === 'image').length,
        voiceMessages: userMessages.filter(msg => msg.type === 'audio').length,
        lastSync: new Date().toISOString()
      };
      
      localStorage.setItem(`user_stats_${currentUser.uid}`, JSON.stringify(newStats));
      setStats(newStats);
      
      return newStats;
      
    } catch (error) {
      console.error('Error calculating stats:', error);
      return stats;
    }
  };

  const handleManualSync = () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const updatedCount = syncChatMessagesWithProfile();
      const newStats = calculateStatsFromChat();
      
      setMessage({ 
        type: 'success', 
        text: `✅ Sinkronisasi berhasil! ${updatedCount} pesan diperbarui.` 
      });
      
      loadStats();
      
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: `❌ Gagal sinkronisasi: ${error.message}` 
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentUser) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Hanya file gambar (JPEG, PNG, GIF, WebP)' });
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Ukuran gambar maksimal 2MB' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const base64Image = event.target.result;
          
          localStorage.setItem(`user_photo_${currentUser.uid}`, base64Image);
          setPhotoURL(base64Image);
          
          try {
            await updateProfile(currentUser, { 
              photoURL: base64Image 
            });
          } catch (firebaseError) {
            console.warn('Firebase Auth update failed:', firebaseError);
          }
          
          const updatedCount = syncChatMessagesWithProfile();
          
          setMessage({ 
            type: 'success', 
            text: `✅ Foto profil berhasil disimpan! ${updatedCount} pesan chat diperbarui.` 
          });
          
        } catch (error) {
          console.error('Error processing image:', error);
          setMessage({ 
            type: 'error', 
            text: '❌ Gagal memproses gambar' 
          });
        } finally {
          setUploading(false);
        }
      };
      
      reader.onerror = () => {
        setMessage({ 
          type: 'error', 
          text: '❌ Gagal membaca file' 
        });
        setUploading(false);
      };
      
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ 
        type: 'error', 
        text: `❌ Error: ${error.message}` 
      });
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleUpdateProfile = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const updates = {};
      let hasChanges = false;
      
      const newDisplayName = displayName.trim();
      const currentDisplayName = currentUser.displayName || '';
      const savedDisplayName = localStorage.getItem(`user_displayName_${currentUser.uid}`);
      
      if (newDisplayName && newDisplayName !== currentDisplayName && newDisplayName !== savedDisplayName) {
        localStorage.setItem(`user_displayName_${currentUser.uid}`, newDisplayName);
        updates.displayName = newDisplayName;
        hasChanges = true;
      }
      
      const newBio = bio.trim();
      const savedBio = localStorage.getItem(`user_bio_${currentUser.uid}`);
      if (newBio && newBio !== savedBio) {
        localStorage.setItem(`user_bio_${currentUser.uid}`, newBio);
        hasChanges = true;
      }
      
      const newPhone = phone.trim();
      const savedPhone = localStorage.getItem(`user_phone_${currentUser.uid}`);
      if (newPhone && newPhone !== savedPhone) {
        localStorage.setItem(`user_phone_${currentUser.uid}`, newPhone);
        hasChanges = true;
      }
      
      const newLocation = location.trim();
      const savedLocation = localStorage.getItem(`user_location_${currentUser.uid}`);
      if (newLocation && newLocation !== savedLocation) {
        localStorage.setItem(`user_location_${currentUser.uid}`, newLocation);
        hasChanges = true;
      }
      
      if (Object.keys(updates).length > 0) {
        try {
          await updateProfile(currentUser, updates);
        } catch (error) {
          console.warn('Firebase update failed:', error);
        }
      }
      
      if (hasChanges) {
        const updatedCount = syncChatMessagesWithProfile();
        
        setMessage({ 
          type: 'success', 
          text: `✅ Profil berhasil diperbarui! ${updatedCount} pesan chat disinkronkan.` 
        });
        
      } else {
        setMessage({ 
          type: 'info', 
          text: 'ℹ️ Tidak ada perubahan untuk disimpan' 
        });
      }
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ 
        type: 'error', 
        text: `❌ Gagal: ${error.message}` 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentUser || !currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: '❌ Harap isi semua field' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: '❌ Password baru tidak cocok' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: '❌ Password minimal 6 karakter' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);
      
      setMessage({ 
        type: 'success', 
        text: '✅ Password berhasil diubah!' 
      });
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      
    } catch (error) {
      console.error('Error changing password:', error);
      if (error.code === 'auth/wrong-password') {
        setMessage({ type: 'error', text: '❌ Password saat ini salah' });
      } else if (error.code === 'auth/requires-recent-login') {
        setMessage({ type: 'error', text: '❌ Silakan login ulang terlebih dahulu' });
      } else {
        setMessage({ type: 'error', text: `❌ ${error.message}` });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getJoinDate = () => {
    if (!currentUser) return 'Tidak diketahui';
    
    let joinDate = null;
    
    if (currentUser.metadata) {
      if (currentUser.metadata.createdAt) {
        joinDate = new Date(currentUser.metadata.createdAt);
      }
      else if (currentUser.metadata.creationTime) {
        joinDate = new Date(currentUser.metadata.creationTime);
      }
    }
    
    if (!joinDate) {
      const savedJoinDate = localStorage.getItem(`user_joinDate_${currentUser.uid}`);
      if (savedJoinDate) {
        joinDate = new Date(savedJoinDate);
      }
    }
    
    if (!joinDate) {
      joinDate = new Date();
      localStorage.setItem(`user_joinDate_${currentUser.uid}`, joinDate.toISOString());
    }
    
    return joinDate.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getLastSyncTime = () => {
    if (!stats.lastSync) return 'Belum pernah';
    
    try {
      const date = new Date(stats.lastSync);
      if (isNaN(date.getTime())) return 'Format salah';
      
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Error';
    }
  };

  const getCurrentPhoto = () => {
    const localPhoto = localStorage.getItem(`user_photo_${currentUser?.uid}`);
    if (localPhoto) return localPhoto;
    if (currentUser?.photoURL) return currentUser.photoURL;
    const name = displayName || currentUser?.email?.split('@')[0] || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f97316&color=fff`;
  };

  const getStatsDisplay = () => {
    return {
      messages: stats.messages || 0,
      images: stats.images || 0,
      voiceMessages: stats.voiceMessages || 0,
      total: (stats.messages || 0) + (stats.images || 0) + (stats.voiceMessages || 0)
    };
  };

  const statsDisplay = getStatsDisplay();

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Memuat profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-orange-400"
              >
                <ChevronLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                  Profil Saya
                </h1>
                <p className="text-sm text-gray-400">Kelola akun dan informasi pribadi</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-lg font-medium flex items-center gap-2 transition-all duration-200"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="relative">
              <div className="h-48 rounded-2xl overflow-hidden bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-800 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10"></div>
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-gray-900 to-transparent"></div>
                
                <div className="absolute -bottom-12 left-8">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full border-4 border-gray-900 overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                      <img 
                        src={getCurrentPhoto()} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          const name = displayName || currentUser.email?.split('@')[0] || 'User';
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f97316&color=fff`;
                        }}
                      />
                    </div>
                    
                    <button
                      onClick={triggerFileInput}
                      disabled={uploading}
                      className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 flex items-center justify-center shadow-lg transition-all duration-200 z-10"
                      title="Ubah foto profil"
                    >
                      {uploading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Camera size={18} />
                      )}
                    </button>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-400 text-center">
                    <p>Klik kamera untuk upload foto</p>
                    <p>JPEG/PNG, max 2MB</p>
                  </div>
                </div>
              </div>

              <div className="pt-16 pl-40">
                <h2 className="text-2xl font-bold mb-1">
                  {displayName || currentUser.email?.split('@')[0] || 'User'}
                </h2>
                <p className="text-gray-400 mb-2">{email || currentUser.email}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Award size={14} />
                    <span>Siswa PPLG 1</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Calendar size={14} />
                    <span>Bergabung {getJoinDate()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-400">
                    <Activity size={14} />
                    <span>{statsDisplay.total} aktivitas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mb-8 border-b border-gray-800">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 font-medium transition-all duration-200 border-b-2 ${
                activeTab === 'profile' 
                  ? 'border-orange-500 text-orange-400' 
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <User size={18} />
                <span>Informasi Profil</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('password')}
              className={`px-6 py-3 font-medium transition-all duration-200 border-b-2 ${
                activeTab === 'password' 
                  ? 'border-orange-500 text-orange-400' 
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Lock size={18} />
                <span>Keamanan</span>
              </div>
            </button>
          </div>

          {message.text && (
            <div className={`mb-6 p-4 rounded-xl border ${
              message.type === 'success' 
                ? 'bg-green-900/20 border-green-800 text-green-400' 
                : message.type === 'error' 
                ? 'bg-red-900/20 border-red-800 text-red-400'
                : message.type === 'warning'
                ? 'bg-yellow-900/20 border-yellow-800 text-yellow-400'
                : 'bg-blue-900/20 border-blue-800 text-blue-400'
            }`}>
              <div className="flex items-center gap-2">
                {message.type === 'success' && <Check size={18} />}
                {message.text}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
                  <h3 className="text-lg font-semibold mb-4 text-orange-400">Informasi Pribadi</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white"
                        placeholder="Masukkan nama lengkap"
                      />
                      <p className="text-xs text-gray-500 mt-1">Nama akan ditampilkan di chat</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={email || currentUser.email}
                          disabled
                          className="w-full px-4 py-3 bg-gray-800/30 border border-gray-700 rounded-xl text-gray-400 cursor-not-allowed"
                        />
                        <Mail size={18} className="absolute right-3 top-3.5 text-gray-500" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Email tidak dapat diubah</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows="3"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white resize-none"
                        placeholder="Ceritakan tentang diri Anda..."
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-6">
                  <h3 className="text-lg font-semibold mb-4 text-orange-400">Informasi Tambahan</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        <div className="flex items-center gap-2">
                          <Phone size={16} />
                          <span>Nomor Telepon</span>
                        </div>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white"
                        placeholder="0812-3456-7890"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          <span>Lokasi</span>
                        </div>
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white"
                        placeholder="Kota, Provinsi"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-6">
                  <h3 className="text-lg font-semibold mb-4 text-orange-400">Status Akun</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-800">
                      <span className="text-gray-400">Status Verifikasi</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        currentUser.emailVerified || currentUser.providerData?.[0]?.providerId === 'google.com'
                          ? 'bg-green-900/30 text-green-400 border border-green-800' 
                          : 'bg-yellow-900/30 text-yellow-400 border border-yellow-800'
                      }`}>
                        {currentUser.emailVerified || currentUser.providerData?.[0]?.providerId === 'google.com' 
                          ? '✅ Terverifikasi' 
                          : '⏳ Belum Verifikasi'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between py-2 border-b border-gray-800">
                      <span className="text-gray-400">ID Pengguna</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-300 font-mono bg-gray-800/50 px-2 py-1 rounded">
                          {currentUser.uid.substring(0, 10)}...
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(currentUser.uid);
                            setMessage({ type: 'success', text: '✅ ID berhasil disalin!' });
                            setTimeout(() => setMessage({ type: '', text: '' }), 2000);
                          }}
                          className="text-gray-500 hover:text-orange-400 transition-colors"
                          title="Salin ID"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <span className="text-gray-400">Metode Login</span>
                      <div className="flex items-center gap-2">
                        {currentUser.providerData?.[0]?.providerId === 'google.com' ? (
                          <>
                            <svg width="16" height="16" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            <span className="text-sm font-medium text-blue-400">Google</span>
                          </>
                        ) : (
                          <>
                            <Mail size={16} className="text-gray-400" />
                            <span className="text-sm font-medium text-amber-400">Email</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 flex items-center justify-center">
                    <Shield size={24} className="text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-orange-400">Ubah Password</h3>
                    <p className="text-gray-400">Pastikan password baru Anda kuat dan unik</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Password Saat Ini
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white pr-12"
                        placeholder="Masukkan password saat ini"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-orange-400"
                      >
                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Password Baru
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white pr-12"
                        placeholder="Minimal 6 karakter"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-orange-400"
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Konfirmasi Password Baru
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white pr-12"
                        placeholder="Ketik ulang password baru"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-orange-400"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleChangePassword}
                      disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed rounded-xl font-bold text-white transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>Memproses...</span>
                        </>
                      ) : (
                        <>
                          <Lock size={18} />
                          <span>Ubah Password</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => {
                        setCurrentPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                        setMessage({ type: '', text: '' });
                      }}
                      className="px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl font-medium text-gray-300 hover:text-white transition-all duration-200"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={() => {
                  setDisplayName(currentUser.displayName || '');
                  setBio(localStorage.getItem(`user_bio_${currentUser.uid}`) || 'Siswa PPLG 1');
                  setPhone(localStorage.getItem(`user_phone_${currentUser.uid}`) || 'Belum diatur');
                  setLocation(localStorage.getItem(`user_location_${currentUser.uid}`) || 'Nganjuk, Jawa Timur');
                  setMessage({ type: 'info', text: 'ℹ️ Form telah direset' });
                }}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl font-medium text-gray-300 hover:text-white transition-all duration-200"
              >
                Reset Form
              </button>
              
              <button
                onClick={handleUpdateProfile}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed rounded-xl font-bold text-white transition-all duration-200 shadow-lg shadow-orange-500/20 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Simpan Perubahan</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 border-t border-gray-800 pt-6 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-1">Sinkronisasi Data</h4>
                  <p className="text-xs text-gray-400">
                    Data profil disimpan di <code className="text-amber-400">localStorage</code> dan tersinkron dengan chat
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">
                    User ID: <span className="font-mono text-gray-300">{currentUser?.uid?.substring(0, 10)}...</span>
                  </p>
                  <p className="text-xs text-gray-400">
                    Storage: <span className="text-green-400">Lokal Browser</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;