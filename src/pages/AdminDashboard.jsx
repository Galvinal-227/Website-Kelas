import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, Trash2, Edit2, Plus, Users, Shield, Upload, X,
  Eye, EyeOff, LogOut, ArrowLeft, Search, Download,
  ChevronLeft, ChevronRight, RefreshCw, Bell, Database,
  CheckCircle, AlertCircle, User, Camera, Check, Home,
  BookOpen, Award, Mail, Phone, Calendar, MessageSquare,
  UserPlus, Users as UsersIcon, Settings, UserCheck, Zap,
  Grid, List, Filter, Crown
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

// Storage Keys
const STUDENTS_STORAGE_KEY = 'xi_pplg1_students_data';
const TEACHER_STORAGE_KEY = 'xi_pplg1_homeroom_teacher';
const ADMIN_STORAGE_KEY = 'admin_auth';

function AdminDashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const teacherFileInputRef = useRef(null);
  
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
  });
  
  // Active Tab State
  const [activeTab, setActiveTab] = useState('students'); // 'students', 'teacher', 'settings'
  
  // Load Students Data
  const loadStudentsData = useCallback(() => {
    const savedData = localStorage.getItem(STUDENTS_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          return parsedData;
        }
      } catch (error) {
        console.error('Error loading students data:', error);
      }
    }
    return [
      { 
        id: 1, 
        name: "Ahmad Rofii Saputra", 
        nickname: "S01", 
        portfolioUrl: "https://ahmad-rizki.vercel.app",
        interests: ['Web Development', 'UI/UX Design', 'JavaScript'],
        skills: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'PHP'],
        avatar: null
      }
    ];
  }, []);

  // Load Teacher Data
  const loadTeacherData = useCallback(() => {
    const savedData = localStorage.getItem(TEACHER_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        return parsedData;
      } catch (error) {
        console.error('Error loading teacher data:', error);
      }
    }
    // Default teacher data
    return {
      id: 'teacher-001',
      name: 'Mohamad Baedowi, S.Pd.I',
      nickname: 'Pak Bae',
      role: 'Wali Kelas XI PPLG 1',
      avatar: '/image.png',
      subjects: ['Pendidikan Agama dan Budi Pekerti'],
      education: 'S.Pd.I',
      motto: 'Mendidik dengan hati, menginspirasi dengan tindakan',
      email: 'baedowi@smkn2nganjuk.sch.id',
      phone: '+62 812-3456-7890',
      joined: '2015',
      experience: '10 tahun',
      interests: ['Pendidikan Agama Islam', 'Pengembangan Karakter Siswa', 'Teknologi Pendidikan'],
      specialization: 'Pendidikan Agama Islam',
      mottoDetail: 'Berdedikasi untuk menciptakan lingkungan belajar yang inklusif dan inspiratif bagi semua siswa.',
    };
  }, []);

  // Main States
  const [students, setStudents] = useState(loadStudentsData());
  const [homeroomTeacher, setHomeroomTeacher] = useState(loadTeacherData());
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState(Date.now());
  const [notifications, setNotifications] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const [syncStatus, setSyncStatus] = useState('synced');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  
  // Teacher Form State
  const [teacherFormData, setTeacherFormData] = useState(loadTeacherData());
  const [isEditingTeacher, setIsEditingTeacher] = useState(false);
  const [teacherAvatarPreview, setTeacherAvatarPreview] = useState('');
  
  // Form Data for Students
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    nickname: '',
    avatar: null,
    interests: [],
    skills: [],
    portfolioUrl: ''
  });

  // Admin Credentials
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'pplg1admin'
  };

  // ===============================
  // NOTIFICATION FUNCTIONS
  // ===============================
  const addNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      type
    };
    
    setNotifications(prev => [notification, ...prev.slice(0, 5)]);
  };

  const getNotificationMessage = (action, details) => {
    switch(action) {
      case 'add': return `"${details.name}" ditambahkan`;
      case 'edit': return `"${details.name}" diperbarui`;
      case 'delete': return `ID ${details.id} dihapus`;
      case 'reset': return 'Data direset';
      case 'import': return 'Data diimport';
      case 'export': return 'Data diexport';
      case 'save': return 'Data disimpan';
      case 'photo_upload': return `Foto "${details.name}" diupdate`;
      case 'teacher_update': return `Data wali kelas diperbarui`;
      case 'teacher_photo_update': return `Foto wali kelas diperbarui`;
      default: return 'Data diperbarui';
    }
  };

  const broadcastChanges = useCallback((action, details = {}) => {
    try {
      const event = new CustomEvent('studentsDataChanged', {
        detail: {
          action,
          timestamp: Date.now(),
          data: students,
          ...details
        }
      });
      window.dispatchEvent(event);
      
      // Broadcast teacher changes
      if (action.includes('teacher')) {
        const teacherEvent = new CustomEvent('teacherDataChanged', {
          detail: {
            action,
            timestamp: Date.now(),
            data: homeroomTeacher,
            ...details
          }
        });
        window.dispatchEvent(teacherEvent);
      }
      
      const message = getNotificationMessage(action, details);
      addNotification(message, 'success');
      setSyncStatus('synced');
      
    } catch (error) {
      console.error('Broadcast error:', error);
      setSyncStatus('error');
    }
  }, [students, homeroomTeacher]);

  // ===============================
  // STUDENT MANAGEMENT FUNCTIONS
  // ===============================
  const handleAddNew = () => {
    const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
    
    setFormData({
      id: newId,
      name: '',
      nickname: '',
      avatar: null,
      interests: [],
      skills: [],
      portfolioUrl: ''
    });
    
    setIsAdding(true);
    setEditingId(null);
    setActiveTab('students');
  };

  const handleEdit = (student) => {
    setFormData({
      id: student.id,
      name: student.name || '',
      nickname: student.nickname || '',
      avatar: student.avatar || null,
      interests: student.interests || [],
      skills: student.skills || [],
      portfolioUrl: student.portfolioUrl || ''
    });
    
    setEditingId(student.id);
    setIsAdding(false);
    setActiveTab('students');
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      id: '',
      name: '',
      nickname: '',
      avatar: null,
      interests: [],
      skills: [],
      portfolioUrl: ''
    });
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Nama harus diisi!');
      return;
    }

    if (isAdding) {
      // Add new student
      const newStudent = {
        id: formData.id,
        name: formData.name.trim(),
        nickname: formData.nickname.trim(),
        avatar: formData.avatar,
        interests: formData.interests.filter(i => i.trim() !== ''),
        skills: formData.skills.filter(s => s.trim() !== ''),
        portfolioUrl: formData.portfolioUrl.trim()
      };
      
      setStudents(prev => {
        const updated = [...prev, newStudent];
        setHasChanges(true);
        broadcastChanges('add', { name: formData.name.trim(), id: formData.id });
        return updated;
      });
      
      addNotification(`${formData.name.trim()} berhasil ditambahkan`, 'success');
      
    } else if (editingId) {
      // Edit existing student
      setStudents(prev => {
        const updated = prev.map(student => 
          student.id === editingId ? {
            ...student,
            name: formData.name.trim(),
            nickname: formData.nickname.trim(),
            avatar: formData.avatar,
            interests: formData.interests.filter(i => i.trim() !== ''),
            skills: formData.skills.filter(s => s.trim() !== ''),
            portfolioUrl: formData.portfolioUrl.trim()
          } : student
        );
        setHasChanges(true);
        broadcastChanges('edit', { name: formData.name.trim(), id: editingId });
        return updated;
      });
      
      addNotification(`${formData.name.trim()} berhasil diperbarui`, 'success');
    }
    
    handleCancel();
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus data ini?')) {
      setStudents(prev => {
        const studentToDelete = prev.find(s => s.id === id);
        const updated = prev.filter(student => student.id !== id);
        setHasChanges(true);
        broadcastChanges('delete', { id, name: studentToDelete?.name || 'Unknown' });
        return updated;
      });
      addNotification(`Data ID ${id} berhasil dihapus`, 'warning');
    }
  };

  // ===============================
  // TEACHER MANAGEMENT FUNCTIONS
  // ===============================
  const handleEditTeacher = () => {
    setTeacherFormData(homeroomTeacher);
    setTeacherAvatarPreview(homeroomTeacher.avatar || '');
    setIsEditingTeacher(true);
    setActiveTab('teacher');
  };

  const handleCancelTeacher = () => {
    setIsEditingTeacher(false);
    setTeacherFormData(homeroomTeacher);
    setTeacherAvatarPreview(homeroomTeacher.avatar || '');
  };

  const handleSaveTeacher = () => {
    if (!teacherFormData.name || !teacherFormData.role) {
      alert('Nama dan peran wajib diisi');
      return;
    }

    const updatedTeacher = {
      ...teacherFormData,
      updatedAt: new Date().toISOString()
    };

    setHomeroomTeacher(updatedTeacher);
    localStorage.setItem(TEACHER_STORAGE_KEY, JSON.stringify(updatedTeacher));
    setIsEditingTeacher(false);
    setHasChanges(true);
    
    // Broadcast teacher update
    broadcastChanges('teacher_update', { name: teacherFormData.name });
    addNotification('Data wali kelas berhasil disimpan', 'success');
  };

  const handleTeacherInputChange = (e) => {
    const { name, value } = e.target;
    setTeacherFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTeacherArrayChange = (field, index, value) => {
    setTeacherFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addTeacherArrayItem = (field) => {
    setTeacherFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), '']
    }));
  };

  const removeTeacherArrayItem = (field, index) => {
    setTeacherFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleTeacherAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar!');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB!');
      return;
    }

    setUploadingPhoto(true);
    
    try {
      const compressedImage = await compressImage(file);
      setTeacherFormData(prev => ({
        ...prev,
        avatar: compressedImage
      }));
      setTeacherAvatarPreview(compressedImage);
      setHasChanges(true);
      
      addNotification('Foto wali kelas berhasil diupload', 'success');
    } catch (error) {
      console.error('Error uploading teacher photo:', error);
      alert('Gagal mengupload foto. Silakan coba lagi.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleResetTeacher = () => {
    const defaultTeacher = loadTeacherData();
    setTeacherFormData(defaultTeacher);
    setTeacherAvatarPreview(defaultTeacher.avatar || '');
    addNotification('Data wali kelas direset ke default', 'info');
  };

  const exportTeacherData = () => {
    const dataStr = JSON.stringify(homeroomTeacher, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wali-kelas-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    addNotification('Data wali kelas berhasil diexport', 'success');
  };

  // ===============================
  // UTILITY FUNCTIONS
  // ===============================
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;

          if (width > height && width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          } else if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedBase64);
        };
        
        img.onerror = () => {
          resolve(event.target.result);
        };
      };
      
      reader.onerror = () => {
        const reader2 = new FileReader();
        reader2.readAsDataURL(file);
        reader2.onload = (e) => resolve(e.target.result);
      };
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar!');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB!');
      return;
    }

    setUploadingPhoto(true);
    
    try {
      const compressedImage = await compressImage(file);
      setFormData(prev => ({
        ...prev,
        avatar: compressedImage
      }));
      setHasChanges(true);
      
      addNotification('Foto berhasil diupload', 'success');
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Gagal mengupload foto. Silakan coba lagi.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({
      ...prev,
      avatar: null
    }));
    setHasChanges(true);
    addNotification('Foto berhasil dihapus', 'info');
  };

  const handleAddInterest = () => {
    setFormData(prev => ({
      ...prev,
      interests: [...prev.interests, '']
    }));
  };

  const handleUpdateInterest = (index, value) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.map((interest, i) => 
        i === index ? value : interest
      )
    }));
  };

  const handleRemoveInterest = (index) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index)
    }));
  };

  const handleAddSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }));
  };

  const handleUpdateSkill = (index, value) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => 
        i === index ? value : skill
      )
    }));
  };

  const handleRemoveSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // ===============================
  // LOGIN/LOGOUT FUNCTIONS
  // ===============================
  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.username === ADMIN_CREDENTIALS.username && 
        loginData.password === ADMIN_CREDENTIALS.password) {
      
      localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
      setIsAuthenticated(true);
      addNotification('Login berhasil!', 'success');
      
    } else {
      alert('Username atau password salah!');
    }
  };

  const handleLogout = () => {
    if (hasChanges) {
      const confirmLogout = window.confirm(
        'Ada perubahan yang belum disimpan. Yakin logout?\nData sudah auto-save.'
      );
      if (!confirmLogout) return;
    }
    
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    setIsAuthenticated(false);
    setLoginData({ username: '', password: '' });
    addNotification('Logout berhasil', 'info');
    navigate('/anggota');
  };

  // ===============================
  // DATA PROCESSING
  // ===============================
  const filteredStudents = students.filter(student => {
    const searchLower = searchTerm.toLowerCase();
    return (
      student.name.toLowerCase().includes(searchLower) ||
      (student.nickname && student.nickname.toLowerCase().includes(searchLower)) ||
      (student.interests && student.interests.some(interest => 
        interest.toLowerCase().includes(searchLower)
      )) ||
      (student.skills && student.skills.some(skill => 
        skill.toLowerCase().includes(searchLower)
      ))
    );
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortConfig.key === 'id') {
      return sortConfig.direction === 'asc' ? a.id - b.id : b.id - a.id;
    } else if (sortConfig.key === 'name') {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (nameA > nameB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    }
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = sortedStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // ===============================
  // AVATAR COMPONENT
  // ===============================
  const AvatarDisplay = ({ student, size = 'medium', isTeacher = false }) => {
    const sizeClass = size === 'small' ? 'w-8 h-8' : size === 'large' ? 'w-20 h-20' : 'w-10 h-10';
    const avatarSrc = isTeacher ? (student.avatar || '/image.png') : student.avatar;
    
    if (avatarSrc && (avatarSrc.startsWith('data:image') || avatarSrc.startsWith('/'))) {
      return (
        <div className={`${sizeClass} rounded-full overflow-hidden ${isTeacher ? 'border-2 border-orange-400' : 'border border-orange-500/30'}`}>
          <img 
            src={avatarSrc} 
            alt={student.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = `
                <div class="w-full h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                  <span class="text-white font-bold ${size === 'small' ? 'text-sm' : size === 'large' ? 'text-3xl' : 'text-base'}">
                    ${student.name?.charAt(0) || '?'}
                  </span>
                </div>
              `;
            }}
          />
        </div>
      );
    }
    
    return (
      <div className={`${sizeClass} rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center ${isTeacher ? 'border-2 border-orange-400' : ''}`}>
        <span className={`text-white font-bold ${size === 'small' ? 'text-sm' : size === 'large' ? 'text-3xl' : 'text-base'}`}>
          {student.name?.charAt(0) || '?'}
        </span>
      </div>
    );
  };

  // ===============================
  // USE EFFECTS
  // ===============================
  useEffect(() => {
    if (students.length > 0 && isAuthenticated) {
      try {
        localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
        setLastSaved(Date.now());
        setHasChanges(false);
      } catch (error) {
        console.error('Save error:', error);
        setSyncStatus('error');
      }
    }
  }, [students, isAuthenticated]);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus('syncing');
      setTimeout(() => setSyncStatus('synced'), 1000);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('offline');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // ===============================
  // LOGIN FORM (If not authenticated)
  // ===============================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border-2 border-orange-500/30 p-8 shadow-xl">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Admin Panel
              </h1>
              <p className="text-gray-400">XI PPLG 1 - SMKN 2 Nganjuk</p>
              <p className="text-orange-400 text-sm mt-2 font-medium">Code, Create, Innovate</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">Username</label>
                <input
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Masukkan username"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12"
                    placeholder="Masukkan password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
              >
                Masuk ke Admin Panel
              </button>

              <div className="flex gap-4">
                <Link
                  to="/anggota"
                  className="flex-1 flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors py-2"
                >
                  <ArrowLeft size={18} />
                  Kembali ke Anggota
                </Link>
                
                <Link
                  to="/home"
                  className="flex-1 flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors py-2"
                >
                  <Home size={18} />
                  Ke Home
                </Link>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-800">
              <p className="text-sm text-gray-500 text-center">
                Login hanya untuk admin kelas XI PPLG 1<br />
                Username: admin | Password: pplg1admin
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ===============================
  // MAIN ADMIN DASHBOARD
  // ===============================
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400">Kelola data anggota kelas XI PPLG 1</p>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${hasChanges ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
                <span className="text-xs text-gray-500">
                  {hasChanges ? 'Perubahan belum disimpan' : 'Semua perubahan tersimpan'}
                </span>
                <span className="text-xs text-gray-600">•</span>
                <span className="text-xs text-gray-500">
                  {new Date(lastSaved).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Sync Status */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 rounded-lg">
              {syncStatus === 'synced' ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : syncStatus === 'syncing' ? (
                <RefreshCw className="w-4 h-4 text-yellow-400 animate-spin" />
              ) : syncStatus === 'error' ? (
                <AlertCircle className="w-4 h-4 text-red-400" />
              ) : (
                <Database className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-sm text-gray-300">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifications([])}
                className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 transition-colors hover:text-orange-400 relative"
                title="Notifikasi"
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {notifications.length > 0 && (
                  <motion.div 
                    className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="p-2 max-h-64 overflow-y-auto">
                      {notifications.map(notif => (
                        <div key={notif.id} className="p-3 border-b border-gray-800 last:border-b-0">
                          <div className="flex justify-between items-start">
                            <div className={`text-sm ${
                              notif.type === 'success' ? 'text-green-400' :
                              notif.type === 'error' ? 'text-red-400' :
                              notif.type === 'warning' ? 'text-yellow-400' : 'text-blue-400'
                            }`}>
                              {notif.message}
                            </div>
                            <div className="text-xs text-gray-500">{notif.timestamp}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-800/50 mb-8">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-6 py-3 font-medium text-sm transition-all duration-300 relative ${activeTab === 'students' ? 'text-orange-400' : 'text-gray-400 hover:text-white'}`}
          >
            <span className="flex items-center gap-2">
              <Users size={18} />
              Anggota Kelas
            </span>
            {activeTab === 'students' && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600"
                layoutId="activeTab"
              />
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('teacher')}
            className={`px-6 py-3 font-medium text-sm transition-all duration-300 relative ${activeTab === 'teacher' ? 'text-orange-400' : 'text-gray-400 hover:text-white'}`}
          >
            <span className="flex items-center gap-2">
              <Crown size={18} />
              Wali Kelas
            </span>
            {activeTab === 'teacher' && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600"
                layoutId="activeTab"
              />
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 font-medium text-sm transition-all duration-300 relative ${activeTab === 'settings' ? 'text-orange-400' : 'text-gray-400 hover:text-white'}`}
          >
            <span className="flex items-center gap-2">
              <Settings size={18} />
              Pengaturan
            </span>
            {activeTab === 'settings' && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600"
                layoutId="activeTab"
              />
            )}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border-2 border-orange-500/30 p-4">
            <div className="text-2xl font-bold text-orange-400 mb-1">{students.length}</div>
            <div className="text-gray-400 text-sm">Total Anggota</div>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border-2 border-orange-500/30 p-4">
            <div className="text-2xl font-bold text-orange-400 mb-1">
              {students.filter(s => s.avatar && s.avatar.startsWith('data:image')).length}
            </div>
            <div className="text-gray-400 text-sm">Anggota dengan Foto</div>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border-2 border-orange-500/30 p-4">
            <div className="text-2xl font-bold text-orange-400 mb-1">
              {new Set(students.flatMap(s => s.skills || [])).size}
            </div>
            <div className="text-gray-400 text-sm">Skill Unik</div>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border-2 border-orange-500/30 p-4">
            <div className="text-2xl font-bold text-orange-400 mb-1">
              {new Set(students.flatMap(s => s.interests || [])).size}
            </div>
            <div className="text-gray-400 text-sm">Minat Unik</div>
          </div>
        </div>

        {/* STUDENTS TAB CONTENT */}
        {activeTab === 'students' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-6">
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2"
              >
                <Plus size={18} />
                Tambah Anggota Baru
              </button>
              
              <button
                onClick={() => {
                  setStudents(loadStudentsData());
                  addNotification('Data direfresh', 'info');
                }}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Refresh Data
              </button>
              
              <button
                onClick={() => {
                  const dataStr = JSON.stringify(students, null, 2);
                  const dataBlob = new Blob([dataStr], { type: 'application/json' });
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `students_data_${new Date().toISOString().split('T')[0]}.json`;
                  link.click();
                  URL.revokeObjectURL(url);
                  addNotification('Data berhasil diexport', 'success');
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2"
              >
                <Download size={18} />
                Export Data
              </button>
              
              <label className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center gap-2 cursor-pointer">
                <Upload size={18} />
                Import Data
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onload = (event) => {
                      try {
                        const importedData = JSON.parse(event.target.result);
                        if (Array.isArray(importedData)) {
                          if (window.confirm(`Import ${importedData.length} data?`)) {
                            setStudents(importedData);
                            setCurrentPage(1);
                            setHasChanges(true);
                            addNotification(`${importedData.length} data diimport`, 'success');
                          }
                        } else {
                          alert('Format file invalid!');
                        }
                      } catch (error) {
                        alert(`Error: ${error.message}`);
                      }
                    };
                    reader.readAsText(file);
                    e.target.value = '';
                  }}
                  className="hidden"
                />
              </label>
            </div>

            {/* Search dan Controls */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Cari anggota berdasarkan nama, nickname, minat, atau skill..."
                      className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="10">10 per halaman</option>
                    <option value="20">20 per halaman</option>
                    <option value="50">50 per halaman</option>
                    <option value="100">100 per halaman</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Form Tambah/Edit */}
            {(isAdding || editingId) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-8 bg-gradient-to-br from-gray-900 to-black rounded-2xl border-2 border-orange-500/30 p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">
                    {isAdding ? 'Tambah Anggota Baru' : 'Edit Data Anggota'}
                  </h3>
                  <button
                    onClick={handleCancel}
                    className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Bagian Foto */}
                  <div className="md:col-span-2">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-4 bg-gray-800/30 rounded-xl">
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                          {formData.avatar ? (
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-500/30">
                              <img 
                                src={formData.avatar} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.parentElement.innerHTML = `
                                    <div class="w-full h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                                      <span class="text-white font-bold text-2xl">${formData.name?.charAt(0) || '?'}</span>
                                    </div>
                                  `;
                                }}
                              />
                            </div>
                          ) : (
                            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center border-4 border-orange-500/30">
                              <User className="w-16 h-16 text-white/70" />
                            </div>
                          )}
                          {formData.avatar && (
                            <button
                              onClick={handleRemovePhoto}
                              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                              title="Hapus foto"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <p className="text-sm text-gray-400 mb-2">Foto Profil</p>
                          <div className="flex gap-2">
                            <label className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 cursor-pointer text-sm">
                              <Camera size={14} />
                              {uploadingPhoto ? 'Mengupload...' : 'Upload Foto'}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                                ref={fileInputRef}
                                disabled={uploadingPhoto}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white mb-3">Panduan Upload Foto</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span>Gunakan foto wajah yang jelas dan terang</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span>Format: JPG, PNG, JPEG</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span>Ukuran maksimal: 5MB</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span>Foto akan otomatis dikompres</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span>Foto akan ditampilkan sebagai lingkaran</span>
                          </li>
                        </ul>
                        {uploadingPhoto && (
                          <div className="mt-4 p-3 bg-blue-500/10 rounded-lg">
                            <p className="text-sm text-blue-400 flex items-center gap-2">
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              Sedang mengupload dan mengompres foto...
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Informasi Dasar */}
                  <div>
                    <label className="block text-gray-300 mb-2">ID</label>
                    <input
                      type="text"
                      value={formData.id}
                      disabled
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Nama Lengkap *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Nickname/Panggilan</label>
                    <input
                      type="text"
                      value={formData.nickname}
                      onChange={(e) => setFormData({...formData, nickname: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Portfolio URL</label>
                    <input
                      type="url"
                      value={formData.portfolioUrl}
                      onChange={(e) => setFormData({...formData, portfolioUrl: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="https://..."
                    />
                  </div>
                  
                  {/* Interests */}
                  <div className="md:col-span-2">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-gray-300">Minat (Interests)</label>
                      <button
                        type="button"
                        onClick={handleAddInterest}
                        className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1"
                      >
                        <Plus size={14} />
                        Tambah Minat
                      </button>
                    </div>
                    <div className="space-y-2">
                      {formData.interests.map((interest, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={interest}
                            onChange={(e) => handleUpdateInterest(index, e.target.value)}
                            className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Minat (contoh: Web Development)"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveInterest(index)}
                            className="px-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                            title="Hapus minat"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                      {formData.interests.length === 0 && (
                        <div className="text-center py-4 border border-dashed border-gray-700 rounded-lg">
                          <p className="text-gray-500">Belum ada minat yang ditambahkan</p>
                          <button
                            type="button"
                            onClick={handleAddInterest}
                            className="mt-2 text-orange-400 hover:text-orange-300 text-sm"
                          >
                            + Tambah minat pertama
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="md:col-span-2">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-gray-300">Skills (Kemampuan)</label>
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1"
                      >
                        <Plus size={14} />
                        Tambah Skill
                      </button>
                    </div>
                    <div className="space-y-2">
                      {formData.skills.map((skill, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={skill}
                            onChange={(e) => handleUpdateSkill(index, e.target.value)}
                            className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Skill (contoh: React, JavaScript)"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(index)}
                            className="px-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                            title="Hapus skill"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                      {formData.skills.length === 0 && (
                        <div className="text-center py-4 border border-dashed border-gray-700 rounded-lg">
                          <p className="text-gray-500">Belum ada skill yang ditambahkan</p>
                          <button
                            type="button"
                            onClick={handleAddSkill}
                            className="mt-2 text-orange-400 hover:text-orange-300 text-sm"
                          >
                            + Tambah skill pertama
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-all duration-300"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={uploadingPhoto}
                    className={`px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2 ${uploadingPhoto ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Save size={18} />
                    {isAdding ? 'Tambah Anggota' : 'Simpan Perubahan'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Tabel Data */}
            <div className="overflow-x-auto rounded-2xl border-2 border-gray-800 mb-6">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-900 to-gray-800">
                    <th 
                      className="py-4 px-6 text-left text-gray-300 font-semibold cursor-pointer hover:bg-gray-800/50"
                      onClick={() => handleSort('id')}
                    >
                      <div className="flex items-center gap-2">
                        ID
                        {sortConfig.key === 'id' && (
                          <span className="text-orange-400">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th 
                      className="py-4 px-6 text-left text-gray-300 font-semibold cursor-pointer hover:bg-gray-800/50"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-2">
                        Nama & Foto
                        {sortConfig.key === 'name' && (
                          <span className="text-orange-400">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left text-gray-300 font-semibold">Nickname</th>
                    <th className="py-4 px-6 text-left text-gray-300 font-semibold">Minat</th>
                    <th className="py-4 px-6 text-left text-gray-300 font-semibold">Skills</th>
                    <th className="py-4 px-6 text-left text-gray-300 font-semibold">Portfolio</th>
                    <th className="py-4 px-6 text-left text-gray-300 font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {currentStudents.map((student) => (
                    <tr key={student.id} className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <AvatarDisplay student={student} size="small" />
                          <span className="text-gray-400 font-mono font-medium">{student.id}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <AvatarDisplay student={student} size="medium" />
                          <div>
                            <div className="text-white font-medium">{student.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-lg">
                          {student.nickname}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {(student.interests || []).slice(0, 2).map((interest, idx) => (
                            <span key={idx} className="px-2 py-1 bg-orange-500/10 text-orange-400 text-xs rounded">
                              {interest}
                            </span>
                          ))}
                          {(student.interests || []).length > 2 && (
                            <span className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded">
                              +{(student.interests || []).length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {(student.skills || []).slice(0, 2).map((skill, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded">
                              {skill}
                            </span>
                          ))}
                          {(student.skills || []).length > 2 && (
                            <span className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded">
                              +{(student.skills || []).length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {student.portfolioUrl ? (
                          <a 
                            href={student.portfolioUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded hover:bg-green-500/20 transition-colors max-w-[150px] truncate inline-block"
                            title={student.portfolioUrl}
                          >
                            {student.portfolioUrl.replace(/^https?:\/\//, '')}
                          </a>
                        ) : (
                          <span className="text-gray-500 text-sm">-</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(student)}
                            className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                            title="Edit data"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                            title="Hapus data"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-gray-800 rounded-2xl">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-300 mb-4">Tidak ada data yang ditemukan</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  Tidak ada anggota yang cocok dengan pencarian "{searchTerm}". 
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
                >
                  Reset Pencarian
                </button>
              </div>
            )}

            {/* Pagination */}
            {filteredStudents.length > 0 && (
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
                <div className="text-gray-400 text-sm">
                  Menampilkan {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredStudents.length)} dari {filteredStudents.length} anggota
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg ${
                      currentPage === 1
                        ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 rounded-lg ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                            : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg ${
                      currentPage === totalPages
                        ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* TEACHER TAB CONTENT */}
        {activeTab === 'teacher' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Teacher Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Kelola Data Wali Kelas</h2>
                <p className="text-gray-400">Update informasi dan foto wali kelas XI PPLG 1</p>
              </div>
              
              <div className="flex gap-4 mt-4 md:mt-0">
                {!isEditingTeacher ? (
                  <button
                    onClick={handleEditTeacher}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2"
                  >
                    <Edit2 size={18} />
                    Edit Data Wali Kelas
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancelTeacher}
                      className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-all duration-300"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSaveTeacher}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center gap-2"
                    >
                      <Save size={18} />
                      Simpan Perubahan
                    </button>
                  </div>
                )}
                
                <button
                  onClick={exportTeacherData}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2"
                >
                  <Download size={18} />
                  Export Data
                </button>
                
                <button
                  onClick={handleResetTeacher}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Teacher Preview/Edit Card */}
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border-2 border-orange-500/30 p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Avatar & Actions */}
                <div className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/20 rounded-xl border border-gray-800/50 p-6 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <Camera className="w-5 h-5 text-orange-400" />
                      Foto Wali Kelas
                    </h3>
                    
                    {/* Avatar Preview */}
                    <div className="relative mb-6">
                      <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-orange-400/50 bg-gradient-to-br from-orange-900/30 to-black">
                        {teacherAvatarPreview || homeroomTeacher.avatar ? (
                          <img 
                            src={teacherAvatarPreview || homeroomTeacher.avatar} 
                            alt="Teacher Avatar" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = `
                                <div class="w-full h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                                  <span class="text-white font-bold text-4xl">
                                    ${homeroomTeacher.name?.charAt(0) || 'G'}
                                  </span>
                                </div>
                              `;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-4xl font-bold text-orange-400">
                              {homeroomTeacher.name?.charAt(0) || 'G'}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {isEditingTeacher && (
                        <motion.label 
                          className="absolute bottom-4 right-4 p-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full cursor-pointer shadow-lg hover:shadow-xl"
                          whileHover={{ scale: 1.1, rotate: 15 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Camera className="w-5 h-5" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleTeacherAvatarChange}
                            className="hidden"
                            ref={teacherFileInputRef}
                          />
                        </motion.label>
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-900/10 to-transparent rounded-xl border border-blue-800/30">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-blue-400">Tips Upload Foto</span>
                      </div>
                      <p className="text-xs text-blue-300">
                        • Gunakan foto formal yang sopan<br/>
                        • Ukuran maksimal: 5MB<br/>
                        • Format: JPG, PNG, WebP<br/>
                        • Foto akan otomatis dikompres
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Form */}
                <div className="lg:col-span-2">
                  {isEditingTeacher ? (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-white mb-4">Edit Data Wali Kelas</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-300 mb-2">Nama Lengkap *</label>
                          <input
                            type="text"
                            name="name"
                            value={teacherFormData.name}
                            onChange={handleTeacherInputChange}
                            disabled={!isEditingTeacher}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white disabled:opacity-60 disabled:cursor-not-allowed"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-300 mb-2">Nama Panggilan</label>
                          <input
                            type="text"
                            name="nickname"
                            value={teacherFormData.nickname}
                            onChange={handleTeacherInputChange}
                            disabled={!isEditingTeacher}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white disabled:opacity-60 disabled:cursor-not-allowed"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-300 mb-2">Peran/Jabatan</label>
                          <input
                            type="text"
                            name="role"
                            value={teacherFormData.role}
                            onChange={handleTeacherInputChange}
                            disabled={!isEditingTeacher}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white disabled:opacity-60 disabled:cursor-not-allowed"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-300 mb-2">Pendidikan</label>
                          <input
                            type="text"
                            name="education"
                            value={teacherFormData.education}
                            onChange={handleTeacherInputChange}
                            disabled={!isEditingTeacher}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white disabled:opacity-60 disabled:cursor-not-allowed"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-300 mb-2">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={teacherFormData.email}
                            onChange={handleTeacherInputChange}
                            disabled={!isEditingTeacher}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white disabled:opacity-60 disabled:cursor-not-allowed"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-300 mb-2">Telepon</label>
                          <input
                            type="tel"
                            name="phone"
                            value={teacherFormData.phone}
                            onChange={handleTeacherInputChange}
                            disabled={!isEditingTeacher}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white disabled:opacity-60 disabled:cursor-not-allowed"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-300 mb-2">Pengalaman</label>
                          <input
                            type="text"
                            name="experience"
                            value={teacherFormData.experience}
                            onChange={handleTeacherInputChange}
                            disabled={!isEditingTeacher}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white disabled:opacity-60 disabled:cursor-not-allowed"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-300 mb-2">Bergabung Sejak</label>
                          <input
                            type="text"
                            name="joined"
                            value={teacherFormData.joined}
                            onChange={handleTeacherInputChange}
                            disabled={!isEditingTeacher}
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white disabled:opacity-60 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>
                      
                      {/* Motto */}
                      <div>
                        <label className="block text-gray-300 mb-2">Motto</label>
                        <input
                          type="text"
                          name="motto"
                          value={teacherFormData.motto}
                          onChange={handleTeacherInputChange}
                          disabled={!isEditingTeacher}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 mb-2">Deskripsi Motto</label>
                        <textarea
                          name="mottoDetail"
                          value={teacherFormData.mottoDetail}
                          onChange={handleTeacherInputChange}
                          disabled={!isEditingTeacher}
                          rows="3"
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white disabled:opacity-60 disabled:cursor-not-allowed resize-none"
                        />
                      </div>
                      
                      {/* Subjects */}
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-white font-semibold flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            Mata Pelajaran
                          </h4>
                          {isEditingTeacher && (
                            <button
                              type="button"
                              onClick={() => addTeacherArrayItem('subjects')}
                              className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1"
                            >
                              <UserPlus className="w-3 h-3" />
                              Tambah
                            </button>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          {(teacherFormData.subjects || []).map((subject, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={subject}
                                onChange={(e) => handleTeacherArrayChange('subjects', index, e.target.value)}
                                disabled={!isEditingTeacher}
                                className="flex-1 px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white disabled:opacity-60 disabled:cursor-not-allowed"
                              />
                              {isEditingTeacher && (
                                <button
                                  type="button"
                                  onClick={() => removeTeacherArrayItem('subjects', index)}
                                  className="px-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                                >
                                  <X size={18} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Interests */}
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-white font-semibold flex items-center gap-2">
                            <Award className="w-4 h-4" />
                            Bidang Minat
                          </h4>
                          {isEditingTeacher && (
                            <button
                              type="button"
                              onClick={() => addTeacherArrayItem('interests')}
                              className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1"
                            >
                              <UserPlus className="w-3 h-3" />
                              Tambah
                            </button>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          {(teacherFormData.interests || []).map((interest, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={interest}
                                onChange={(e) => handleTeacherArrayChange('interests', index, e.target.value)}
                                disabled={!isEditingTeacher}
                                className="flex-1 px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white disabled:opacity-60 disabled:cursor-not-allowed"
                              />
                              {isEditingTeacher && (
                                <button
                                  type="button"
                                  onClick={() => removeTeacherArrayItem('interests', index)}
                                  className="px-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                                >
                                  <X size={18} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-4">Data Wali Kelas Saat Ini</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-gray-800/30 rounded-xl p-4">
                            <div className="text-gray-400 text-sm mb-1">Nama Lengkap</div>
                            <div className="text-white font-medium text-lg">{homeroomTeacher.name}</div>
                          </div>
                          <div className="bg-gray-800/30 rounded-xl p-4">
                            <div className="text-gray-400 text-sm mb-1">Panggilan</div>
                            <div className="text-orange-400 font-medium">{homeroomTeacher.nickname}</div>
                          </div>
                          <div className="bg-gray-800/30 rounded-xl p-4">
                            <div className="text-gray-400 text-sm mb-1">Jabatan</div>
                            <div className="text-white font-medium">{homeroomTeacher.role}</div>
                          </div>
                          <div className="bg-gray-800/30 rounded-xl p-4">
                            <div className="text-gray-400 text-sm mb-1">Pendidikan</div>
                            <div className="text-white font-medium">{homeroomTeacher.education}</div>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-orange-500/10 to-transparent rounded-xl p-4 border-l-4 border-orange-500">
                          <div className="text-gray-400 text-sm mb-2">Motto</div>
                          <div className="text-white italic">"{homeroomTeacher.motto}"</div>
                          <div className="text-gray-400 text-sm mt-2">{homeroomTeacher.mottoDetail}</div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-gray-800/30 rounded-xl p-4">
                            <div className="text-gray-400 text-sm mb-1">Email</div>
                            <div className="text-white font-medium">{homeroomTeacher.email}</div>
                          </div>
                          <div className="bg-gray-800/30 rounded-xl p-4">
                            <div className="text-gray-400 text-sm mb-1">Telepon</div>
                            <div className="text-white font-medium">{homeroomTeacher.phone}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* SETTINGS TAB CONTENT */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border-2 border-orange-500/30 p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-400" />
                  Keamanan
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Password Admin Baru</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white"
                      placeholder="Masukkan password baru"
                    />
                  </div>
                  <button
                    className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
                  >
                    Update Password
                  </button>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border-2 border-orange-500/30 p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Database className="w-5 h-5 text-orange-400" />
                  Data Management
                </h3>
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      if (window.confirm('Hapus semua data termasuk foto? Aksi ini tidak dapat dibatalkan!')) {
                        localStorage.removeItem(STUDENTS_STORAGE_KEY);
                        localStorage.removeItem(TEACHER_STORAGE_KEY);
                        setStudents(loadStudentsData());
                        setHomeroomTeacher(loadTeacherData());
                        setHasChanges(false);
                        addNotification('Semua data berhasil direset', 'warning');
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300"
                  >
                    <Trash2 className="w-4 h-4" />
                    Reset Semua Data
                  </button>
                  
                  <div className="text-xs text-gray-500 mt-4 space-y-1">
                    <p>• Total data siswa: {students.length} anggota</p>
                    <p>• Data wali kelas: {homeroomTeacher ? 'Ada' : 'Tidak ada'}</p>
                    <p>• Storage digunakan: {JSON.stringify(students).length + JSON.stringify(homeroomTeacher).length} bytes</p>
                    <p>• Auto-save aktif: {hasChanges ? 'Ada perubahan belum disimpan' : 'Tersimpan'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="mt-8 bg-gradient-to-br from-gray-900 to-black rounded-2xl border-2 border-orange-500/30 p-6">
              <h3 className="text-xl font-bold text-white mb-6">Aksi Cepat</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/anggota"
                  className="p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-colors flex flex-col items-center justify-center text-center"
                >
                  <UsersIcon className="w-8 h-8 text-orange-400 mb-2" />
                  <div className="text-white font-medium">Lihat Halaman Anggota</div>
                  <div className="text-gray-400 text-sm mt-1">Pratinjau data</div>
                </Link>
                
                <Link
                  to="/home"
                  className="p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-colors flex flex-col items-center justify-center text-center"
                >
                  <Home className="w-8 h-8 text-orange-400 mb-2" />
                  <div className="text-white font-medium">Kembali ke Home</div>
                  <div className="text-gray-400 text-sm mt-1">Halaman utama</div>
                </Link>
                
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-colors flex flex-col items-center justify-center text-center"
                >
                  <ArrowLeft className="w-8 h-8 text-orange-400 mb-2" />
                  <div className="text-white font-medium">Scroll ke Atas</div>
                  <div className="text-gray-400 text-sm mt-1">Navigasi cepat</div>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>Total data: {students.length} anggota | Auto-save aktif | Terakhir diperbarui: {new Date(lastSaved).toLocaleString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
          <p className="mt-1">© {new Date().getFullYear()} XI PPLG 1 - SMKN 2 Nganjuk | Code, Create, Innovate</p>
          <div className="flex justify-center gap-4 mt-4">
            <Link to="/anggota" className="text-orange-400 hover:text-orange-300 transition-colors">
              Anggota
            </Link>
            <Link to="/home" className="text-orange-400 hover:text-orange-300 transition-colors">
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;