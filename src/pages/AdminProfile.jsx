// pages/AdminProfile.jsx
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
  Save,
  Lock,
  Mail,
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
  Users,
  Settings,
  Database,
  Activity,
  BarChart3,
  ShieldCheck,
  AlertTriangle,
  Edit,
  Trash2,
  Search,
  Download,
  RefreshCw,
  Eye as EyeIcon,
  Ban,
  CheckCircle,
  XCircle,
  Crown,
  Calendar
} from 'lucide-react';

const AdminProfile = () => {
  const { currentUser, logout, isAdmin } = useAuth();
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
  const [joinDate, setJoinDate] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [realUsers, setRealUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    storageUsed: '0 MB',
    lastUpdated: null
  });

  useEffect(() => {
    if (currentUser && isAdmin) {
      setDisplayName(currentUser.displayName || 'Admin');
      setEmail(currentUser.email || '');
      const savedPhoto = localStorage.getItem(`admin_photo_${currentUser.uid}`);
      setPhotoURL(savedPhoto || currentUser.photoURL || '');
      const savedBio = localStorage.getItem(`admin_bio_${currentUser.uid}`);
      const savedPhone = localStorage.getItem(`admin_phone_${currentUser.uid}`);
      const savedLocation = localStorage.getItem(`admin_location_${currentUser.uid}`);
      const savedJoinDate = localStorage.getItem(`admin_joinDate_${currentUser.uid}`);
      
      setBio(savedBio || 'Administrator Sistem');
      setPhone(savedPhone || '');
      setLocation(savedLocation || '');
      setJoinDate(savedJoinDate || new Date().toISOString().split('T')[0]);
      
      loadRealUsersFromStorage();
      calculateRealSystemStats();
      
      const interval = setInterval(() => {
        loadRealUsersFromStorage();
        calculateRealSystemStats();
      }, 30000);
      
      return () => clearInterval(interval);
    } else {
      navigate('/profile');
    }
  }, [currentUser, isAdmin]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      setMessage({ type: 'error', text: `❌ Gagal logout: ${error.message}` });
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Password baru tidak cocok!' });
      return;
    }
    
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password minimal 6 karakter!' });
      return;
    }
    
    setLoading(true);
    
    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);
      
      setMessage({ type: 'success', text: '✅ Password berhasil diubah!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: `❌ Gagal: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const loadRealUsersFromStorage = () => {
    try {
      const usersMap = new Map();

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        let uid = null;
        
        if (key.includes('user_') || key.includes('admin_')) {
          const parts = key.split('_');
          if (parts.length >= 3) {
            uid = parts[2];
          } else if (parts.length === 2) {
            uid = parts[1];
          }
        }
        
        if (uid) {
          if (!usersMap.has(uid)) {
            usersMap.set(uid, {
              uid,
              isAdmin: key.includes('admin_'),
              storageKeys: new Set()
            });
          }
          
          const userData = usersMap.get(uid);
          userData.storageKeys.add(key);
          
          const value = localStorage.getItem(key);
          
          if (key.includes('displayName')) {
            userData.displayName = value;
          } else if (key.includes('email')) {
            userData.email = value;
          } else if (key.includes('photo')) {
            userData.photoURL = value;
          } else if (key.includes('bio')) {
            userData.bio = value;
          } else if (key.includes('phone')) {
            userData.phone = value;
          } else if (key.includes('location')) {
            userData.location = value;
          } else if (key.includes('joinDate')) {
            userData.joinDate = value;
          } else if (key.includes('lastActive')) {
            userData.lastActive = value;
          }
        }
      }
      
      const usersArray = Array.from(usersMap.values()).map(user => {
        const isActive = user.lastActive ? 
          (Date.now() - new Date(user.lastActive).getTime() < 24 * 60 * 60 * 1000) : 
          false;
        
        let userStorageSize = 0;
        user.storageKeys.forEach(key => {
          const value = localStorage.getItem(key);
          userStorageSize += key.length + (value ? value.length : 0);
        });
        
        return {
          ...user,
          status: isActive ? 'active' : 'inactive',
          storageSize: `${(userStorageSize / 1024).toFixed(1)} KB`,
          lastSeen: user.lastActive ? 
            formatRelativeTime(new Date(user.lastActive)) : 
            'Never'
        };
      });
      
      setRealUsers(usersArray);
      setFilteredUsers(usersArray);
      
    } catch (error) {
      console.error('Error loading real users:', error);
      setMessage({ 
        type: 'error', 
        text: `Gagal memuat data pengguna: ${error.message}` 
      });
    }
  };

  const calculateRealSystemStats = () => {
    try {
      const totalItems = localStorage.length;
      
      let totalSize = 0;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        const itemSize = (key.length + value.length) / 1024;
        totalSize += itemSize;
      }
      
      const activeUsers = realUsers.filter(user => user.status === 'active').length;
      
      setSystemStats({
        totalUsers: realUsers.length,
        activeUsers,
        storageUsed: `${(totalSize / 1024).toFixed(2)} MB`,
        lastUpdated: new Date().toLocaleTimeString('id-ID'),
        localStorageItems: totalItems
      });
      
    } catch (error) {
      console.error('Error calculating system stats:', error);
    }
  };

  const formatRelativeTime = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return date.toLocaleDateString('id-ID');
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    
    const details = {
      ...user,
      storageKeys: Array.from(user.storageKeys || [])
    };
    
    setUserDetails(details);
  };

  const deleteUserData = (uid) => {
    if (!window.confirm(`Hapus semua data untuk user ${uid}?`)) return;
    
    try {
      let deletedCount = 0;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.includes(uid)) {
          localStorage.removeItem(key);
          deletedCount++;
          i--;
        }
      }
      
      setMessage({ 
        type: 'success', 
        text: `✅ Berhasil menghapus ${deletedCount} item data user` 
      });
      
      setTimeout(() => {
        loadRealUsersFromStorage();
        calculateRealSystemStats();
      }, 1000);
      
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: `❌ Gagal menghapus: ${error.message}` 
      });
    }
  };

  const exportAllData = () => {
    try {
      const allData = {};
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        allData[key] = localStorage.getItem(key);
      }
      
      const dataStr = JSON.stringify(allData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `data-backup-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      setMessage({ 
        type: 'success', 
        text: '✅ Data berhasil dieksport' 
      });
      
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: `❌ Gagal mengexport: ${error.message}` 
      });
    }
  };

  const handleRefreshData = () => {
    setLoading(true);
    setMessage({ type: 'info', text: '🔄 Memuat ulang data...' });
    
    setTimeout(() => {
      loadRealUsersFromStorage();
      calculateRealSystemStats();
      setLoading(false);
      setMessage({ type: 'success', text: '✅ Data diperbarui' });
      setTimeout(() => setMessage({ type: '', text: '' }), 2000);
    }, 1000);
  };

  const handleUpdateAdminProfile = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Simpan ke localStorage individual keys
      if (displayName.trim()) {
        localStorage.setItem(`admin_displayName_${currentUser.uid}`, displayName.trim());
      }
      if (bio.trim()) {
        localStorage.setItem(`admin_bio_${currentUser.uid}`, bio.trim());
      }
      if (phone.trim()) {
        localStorage.setItem(`admin_phone_${currentUser.uid}`, phone.trim());
      }
      if (location.trim()) {
        localStorage.setItem(`admin_location_${currentUser.uid}`, location.trim());
      }
      if (joinDate) {
        localStorage.setItem(`admin_joinDate_${currentUser.uid}`, joinDate);
      }
      
      // ✅ TAMBAHKAN INI - Simpan data untuk halaman Help
      const adminHelpData = {
        displayName: displayName.trim() || 'Administrator XI PPLG 1',
        email: currentUser.email || 'admin@gmail.com',
        bio: bio.trim() || `ولا تقرّبوا الرَّحْى إِنَّهُ كَانَ فَاحِشَةً وَسَاءَ سَبِيلًا
Janganlah kamu mendekati zina.
Sesungguhnya (zina) itu adalah perbuatan keji dan izin terhadap`,
        phone: phone.trim() || '085647527381',
        location: location.trim() || 'SMKN 2 NGANJUK',
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('adminHelpData', JSON.stringify(adminHelpData));
      
      // Update Firebase jika perlu
      if (displayName.trim() && displayName.trim() !== currentUser.displayName) {
        await updateProfile(currentUser, { displayName: displayName.trim() });
      }
      
      setMessage({ 
        type: 'success', 
        text: '✅ Profil admin berhasil diperbarui' 
      });
      
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: `❌ Gagal: ${error.message}` 
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPhoto = () => {
    const localPhoto = localStorage.getItem(`admin_photo_${currentUser?.uid}`);
    if (localPhoto) return localPhoto;
    if (currentUser?.photoURL) return currentUser.photoURL;
    return `https://ui-avatars.com/api/?name=Admin&background=dc2626&color=fff&bold=true`;
  };

  if (!currentUser || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <ShieldCheck size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Akses Ditolak</h2>
          <p className="text-gray-400 mb-6">Halaman ini hanya untuk administrator</p>
          <button
            onClick={() => navigate('/profile')}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg font-medium"
          >
            Ke Profile Biasa
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
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
                <h1 className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-400">Panel Administrasi</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={handleRefreshData}
                disabled={loading}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-green-400"
                title="Refresh Data"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              </button>
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
      </div>

      <div className="container mx-auto px-4 py-8">
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl border ${
            message.type === 'success' 
              ? 'bg-green-900/20 border-green-800 text-green-400' 
              : message.type === 'error' 
              ? 'bg-red-900/20 border-red-800 text-red-400'
              : 'bg-blue-900/20 border-blue-800 text-blue-400'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {message.type === 'success' && <Check size={18} />}
                {message.type === 'error' && <AlertTriangle size={18} />}
                {message.text}
              </div>
              <button
                onClick={() => setMessage({ type: '', text: '' })}
                className="text-gray-400 hover:text-white"
              >
                <XCircle size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Admin Profile Section */}
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="mb-8">
            <div className="relative">
              <div className="h-40 rounded-2xl overflow-hidden bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-800 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10"></div>
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-gray-900 to-transparent"></div>
                
                <div className="absolute -bottom-12 left-8">
                  <div className="relative group">
                    <div className="w-28 h-28 rounded-full border-4 border-gray-900 overflow-hidden bg-gradient-to-br from-red-500/20 to-orange-500/20">
                      <img 
                        src={getCurrentPhoto()} 
                        alt="Admin Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <h2 className="text-2xl font-bold">{displayName}</h2>
                    <p className="text-gray-400 text-sm">{email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-1 bg-red-900/30 text-red-400 text-xs rounded-full border border-red-800">
                        Administrator
                      </span>
                      <span className="px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded-full border border-blue-800">
                        {systemStats.lastUpdated ? `Updated: ${systemStats.lastUpdated}` : 'Loading...'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-gray-800 overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-3 font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                activeTab === 'dashboard' 
                  ? 'border-red-500 text-red-400' 
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 size={18} />
                <span>Dashboard</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                activeTab === 'users' 
                  ? 'border-red-500 text-red-400' 
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users size={18} />
                <span>Pengguna ({realUsers.length})</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                activeTab === 'profile' 
                  ? 'border-red-500 text-red-400' 
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings size={18} />
                <span>Profil Admin</span>
              </div>
            </button>
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-gray-800 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Users size={24} className="text-blue-400" />
                    <span className="text-sm text-gray-400">Total</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white">{systemStats.totalUsers}</h3>
                  <p className="text-gray-400 text-sm mt-2">Pengguna Terdaftar</p>
                  <div className="mt-4 text-xs text-green-400 flex items-center gap-1">
                    <Activity size={12} />
                    <span>{systemStats.activeUsers} aktif</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-gray-800 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Database size={24} className="text-amber-400" />
                    <span className="text-sm text-gray-400">Penyimpanan</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white">{systemStats.storageUsed}</h3>
                  <p className="text-gray-400 text-sm mt-2">LocalStorage</p>
                  <div className="mt-4 text-xs text-gray-400">
                    <span>{systemStats.localStorageItems || 0} item</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-gray-800 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Award size={24} className="text-purple-400" />
                    <span className="text-sm text-gray-400">Role</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white">Admin</h3>
                  <p className="text-gray-400 text-sm mt-2">Akses Penuh</p>
                  <div className="mt-4 text-xs text-purple-400">
                    <span>Super Administrator</span>
                  </div>
                </div>
              </div>

              {/* Recent Users */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-gray-800 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-red-400">Pengguna Terbaru</h3>
                  <button
                    onClick={() => setActiveTab('users')}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    Lihat semua →
                  </button>
                </div>
                
                <div className="space-y-3">
                  {realUsers.slice(0, 5).map((user) => (
                    <div 
                      key={user.uid} 
                      className="flex items-center justify-between p-3 hover:bg-gray-800/50 rounded-lg cursor-pointer"
                      onClick={() => viewUserDetails(user)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800">
                          {user.photoURL ? (
                            <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                              <User size={16} />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{user.displayName || 'Unknown User'}</h4>
                          <p className="text-xs text-gray-400">{user.email || 'No email'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.status === 'active' 
                            ? 'bg-green-900/30 text-green-400 border border-green-800' 
                            : 'bg-gray-800 text-gray-400 border border-gray-700'
                        }`}>
                          {user.status === 'active' ? 'Aktif' : 'Tidak aktif'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {user.lastSeen}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {realUsers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Users size={32} className="mx-auto mb-3 opacity-50" />
                      <p>Belum ada data pengguna</p>
                    </div>
                  )}
                </div>
              </div>

              {/* System Actions */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-red-400 mb-6">Aksi Sistem</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={exportAllData}
                    className="p-4 bg-gray-800/50 hover:bg-gray-800 rounded-lg border border-gray-700 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Download size={20} className="text-green-400" />
                      <span className="font-medium">Export Data</span>
                    </div>
                    <p className="text-sm text-gray-400">Simpan semua data ke file JSON</p>
                  </button>
                  
                  <button
                    onClick={handleRefreshData}
                    disabled={loading}
                    className="p-4 bg-gray-800/50 hover:bg-gray-800 rounded-lg border border-gray-700 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <RefreshCw size={20} className={`text-blue-400 ${loading ? 'animate-spin' : ''}`} />
                      <span className="font-medium">Refresh Data</span>
                    </div>
                    <p className="text-sm text-gray-400">Muat ulang data dari storage</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-gray-800 p-6">
                <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-red-400">Manajemen Pengguna</h3>
                    <p className="text-gray-400 text-sm">
                      {realUsers.length} pengguna ditemukan
                    </p>
                  </div>
                  
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-3 text-gray-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari pengguna..."
                      className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white w-full md:w-64"
                    />
                  </div>
                </div>
                
                {/* Users Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Pengguna</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Terakhir Aktif</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr 
                          key={user.uid} 
                          className="border-b border-gray-800/50 hover:bg-gray-800/30 cursor-pointer"
                          onClick={() => viewUserDetails(user)}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full overflow-hidden">
                                {user.photoURL ? (
                                  <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-700">
                                    <User size={14} />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium">
                                  {user.displayName || 'Unknown User'}
                                  {user.isAdmin && (
                                    <span className="ml-2 px-2 py-0.5 bg-red-900/30 text-red-400 text-xs rounded-full">
                                      Admin
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-400">{user.email || 'No email'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              user.status === 'active' 
                                ? 'bg-green-900/30 text-green-400' 
                                : 'bg-gray-800 text-gray-400'
                            }`}>
                              {user.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm">{user.lastSeen}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  viewUserDetails(user);
                                }}
                                className="p-1 hover:bg-gray-700 rounded"
                                title="Lihat detail"
                              >
                                <EyeIcon size={16} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteUserData(user.uid);
                                }}
                                className="p-1 hover:bg-red-900/30 rounded text-red-400"
                                title="Hapus user"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      
                      {filteredUsers.length === 0 && (
                        <tr>
                          <td colSpan="4" className="py-8 text-center text-gray-500">
                            <Users size={32} className="mx-auto mb-3 opacity-50" />
                            <p>Tidak ada pengguna ditemukan</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* User Details Modal */}
              {selectedUser && userDetails && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                  <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-gray-800 max-w-md w-full">
                    <div className="sticky top-0 bg-gray-900/90 backdrop-blur-sm border-b border-gray-800 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden">
                            {selectedUser.photoURL ? (
                              <img src={selectedUser.photoURL} alt={selectedUser.displayName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-700">
                                <User size={20} />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">{selectedUser.displayName}</h3>
                            <p className="text-gray-400">{selectedUser.email}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedUser(null);
                            setUserDetails(null);
                          }}
                          className="p-2 hover:bg-gray-800 rounded-lg"
                        >
                          <XCircle size={20} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-4">
                      {/* Basic Info */}
                      <div>
                        <h4 className="text-lg font-semibold mb-3 text-red-400">Informasi User</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm text-gray-400">User ID</label>
                            <div className="font-mono text-sm bg-gray-800/50 p-2 rounded">
                              {selectedUser.uid}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-gray-400">Role</label>
                            <div className="text-sm">
                              {selectedUser.isAdmin ? (
                                <span className="px-2 py-1 bg-red-900/30 text-red-400 rounded-full">
                                  Administrator
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded-full">
                                  User Biasa
                                </span>
                              )}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-gray-400">Status</label>
                            <div className="text-sm">
                              <span className={`px-2 py-1 rounded-full ${
                                selectedUser.status === 'active' 
                                  ? 'bg-green-900/30 text-green-400' 
                                  : 'bg-gray-800 text-gray-400'
                              }`}>
                                {selectedUser.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                              </span>
                            </div>
                          </div>
                          {selectedUser.joinDate && (
                            <div>
                              <label className="text-sm text-gray-400">Bergabung</label>
                              <div className="text-sm">
                                {new Date(selectedUser.joinDate).toLocaleDateString('id-ID')}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-4 border-t border-gray-800">
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              deleteUserData(selectedUser.uid);
                              setSelectedUser(null);
                              setUserDetails(null);
                            }}
                            className="flex-1 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg border border-red-800"
                          >
                            Hapus Data User
                          </button>
                          <button
                            onClick={() => setSelectedUser(null)}
                            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
                          >
                            Tutup
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Admin Profile Tab */}
          {activeTab === 'profile' && (
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-6">
                    <h3 className="text-lg font-semibold mb-4 text-red-400">Informasi Admin</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Nama Admin
                        </label>
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
                          placeholder="Nama administrator"
                        />
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
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Bio Admin
                        </label>
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          rows="3"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white resize-none"
                          placeholder="Deskripsi peran admin..."
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-6">
                    <h3 className="text-lg font-semibold mb-4 text-red-400">Informasi Kontak</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          <div className="flex items-center gap-2">
                            <Phone size={16} />
                            <span>Telepon</span>
                          </div>
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
                          placeholder="0812-xxxx-xxxx"
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
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white"
                          placeholder="Lokasi"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-6">
                    <h3 className="text-lg font-semibold mb-4 text-red-400">Keamanan Admin</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Password Saat Ini
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white pr-12"
                            placeholder="Password saat ini"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-3.5 text-gray-400 hover:text-red-400"
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
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white pr-12"
                            placeholder="Minimal 6 karakter"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-3.5 text-gray-400 hover:text-red-400"
                          >
                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Konfirmasi Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white pr-12"
                            placeholder="Ulangi password baru"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-3.5 text-gray-400 hover:text-red-400"
                          >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleChangePassword}
                        disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                        className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed rounded-xl font-bold text-white transition-all duration-200 flex items-center justify-center gap-2"
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
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-6">
                    <h3 className="text-lg font-semibold mb-4 text-red-400">Status Akun Admin</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-gray-800">
                        <span className="text-gray-400">Level Akses</span>
                        <span className="font-bold text-red-400">Administrator Penuh</span>
                      </div>
                      
                      <div className="flex items-center justify-between py-2 border-b border-gray-800">
                        <span className="text-gray-400">ID Admin</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono bg-gray-800/50 px-2 py-1 rounded">
                            {currentUser?.uid?.substring(0, 12)}...
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between py-2">
                        <span className="text-gray-400">Akses Terakhir</span>
                        <span className="text-sm">{new Date().toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Save Button */}
              <div className="mt-8 flex justify-end gap-4">
                <button
                  onClick={() => {
                    setDisplayName(currentUser.displayName || '');
                    setBio(localStorage.getItem(`admin_bio_${currentUser.uid}`) || 'Administrator Sistem');
                    setPhone(localStorage.getItem(`admin_phone_${currentUser.uid}`) || '');
                    setLocation(localStorage.getItem(`admin_location_${currentUser.uid}`) || '');
                    setJoinDate(localStorage.getItem(`admin_joinDate_${currentUser.uid}`) || new Date().toISOString().split('T')[0]);
                    setMessage({ type: 'info', text: 'ℹ️ Form telah direset' });
                  }}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl font-medium text-gray-300 hover:text-white transition-all duration-200"
                >
                  Reset Form
                </button>
                
                <button
                  onClick={handleUpdateAdminProfile}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed rounded-xl font-bold text-white transition-all duration-200 shadow-lg shadow-red-500/20 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>Simpan Perubahan Admin</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-8 border-t border-gray-800 pt-6 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-1">Admin Dashboard v1.0</h4>
                <p className="text-xs text-gray-400">
                  Data real dari <code className="text-amber-400">localStorage</code> • 
                  Last sync: {systemStats.lastUpdated || 'Loading...'}
                </p>
              </div>
              <div className="text-sm text-gray-400">
                User ID: <span className="font-mono text-gray-300">
                  {currentUser?.uid?.substring(0, 10)}...
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {realUsers.length} users • {systemStats.storageUsed} storage
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;