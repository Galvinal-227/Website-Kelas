import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import StudentCard from '../components/StudentCard';
import StudentModal from '../components/StudentModal';
import { 
  Search, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  RefreshCw,
  Filter,
  Grid,
  List,
  Eye,
  Wifi,
  WifiOff,
  Bell,
  AlertCircle,
  Shield,
  Crown,
  BookOpen,
  Award,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Star,
  Target,
  Heart,
  Briefcase,
  Globe,
  MessageSquare,
  Sparkles,
  Zap,
  TrendingUp,
  UserCheck,
  ChevronUp,
  Camera,
  Edit,
  Upload
} from 'lucide-react';

function Anggota() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState('');
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHoveringTeacher, setIsHoveringTeacher] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [homeroomTeacher, setHomeroomTeacher] = useState(null);
  const [loadingTeacher, setLoadingTeacher] = useState(true);

  // Animation Variants
  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { 
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.07,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100,
        damping: 12,
        mass: 0.5
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      scale: 1.05,
      y: -8,
      boxShadow: "0 20px 40px -15px rgba(249, 115, 22, 0.3)",
      transition: { 
        type: "spring", 
        stiffness: 400,
        damping: 15
      }
    },
    tap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  const teacherCardVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 80,
        damping: 15,
        delay: 0.3
      }
    },
    hover: {
      scale: 1.02,
      y: -3,
      transition: { 
        type: "spring", 
        stiffness: 300,
        damping: 20
      }
    }
  };

  const notificationVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 200,
        damping: 20
      }
    },
    exit: { 
      x: -100, 
      opacity: 0,
      transition: { 
        duration: 0.3 
      }
    }
  };

  // Load data guru dari localStorage
  const loadHomeroomTeacher = useCallback(() => {
    try {
      const savedTeacher = localStorage.getItem('xi_pplg1_homeroom_teacher');
      if (savedTeacher) {
        setHomeroomTeacher(JSON.parse(savedTeacher));
      } else {
        // Data default jika belum ada
        const defaultTeacher = {
          id: 'teacher-001',
          name: 'Mohamad Baedowi, S.Pd.I',
          nickname: 'Pak Bae',
          role: 'Wali Kelas XI PPLG 1',
          avatar: '/image.png',
          subjects: ['Pendidikan Agama dan Budi Pekerti'],
          education: 'S.Pd.I',
          motto: 'Mendidik dengan hati, menginspirasi dengan tindakan',
          interests: ['Pendidikan Agama Islam', 'Pengembangan Karakter Siswa', 'Teknologi Pendidikan'],
          specialization: 'Pendidikan Agama Islam',
          mottoDetail: 'Berdedikasi untuk menciptakan lingkungan belajar yang inklusif dan inspiratif bagi semua siswa.',
          social: {
            email: 'baedowi@smkn2nganjuk.sch.id',
            phone: '+62 812-3456-7890',
          },
        };
        setHomeroomTeacher(defaultTeacher);
        localStorage.setItem('xi_pplg1_homeroom_teacher', JSON.stringify(defaultTeacher));
      }
    } catch (error) {
      console.error('Error loading teacher data:', error);
    } finally {
      setLoadingTeacher(false);
    }
  }, []);

  const loadData = useCallback((showNotification = false) => {
    setLoading(true);
    try {
      const savedData = localStorage.getItem('xi_pplg1_students_data');
      if (savedData) {
        const data = JSON.parse(savedData);
        setStudents(data);
        setLastUpdate(Date.now());
        
        if (showNotification) {
          const notification = {
            id: Date.now(),
            message: 'Data berhasil direfresh',
            timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            type: 'success'
          };
          setNotifications(prev => [notification, ...prev.slice(0, 3)]);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      if (showNotification) {
        const notification = {
          id: Date.now(),
          message: 'Gagal memuat data',
          timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          type: 'error'
        };
        setNotifications(prev => [notification, ...prev.slice(0, 3)]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load on component mount
  useEffect(() => {
    loadHomeroomTeacher();
    loadData();
    
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadData, loadHomeroomTeacher]);

  // Listen for changes from other tabs/windows
  useEffect(() => {
    const handleDataChange = (event) => {
      console.log('Data changed event received:', event.type);
      
      // Check if teacher data changed
      if (event.detail && event.detail.type === 'teacher') {
        loadHomeroomTeacher();
        const notification = {
          id: Date.now(),
          message: 'Data wali kelas diperbarui',
          timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          type: 'info'
        };
        setNotifications(prev => [notification, ...prev.slice(0, 3)]);
      } else {
        loadData(true);
      }
    };

    const handleStorageChange = (event) => {
      if (event.key === 'xi_pplg1_homeroom_teacher') {
        loadHomeroomTeacher();
        const notification = {
          id: Date.now(),
          message: 'Data wali kelas diperbarui',
          timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          type: 'info'
        };
        setNotifications(prev => [notification, ...prev.slice(0, 3)]);
      } else if (event.key === 'xi_pplg1_students_data') {
        loadData(true);
      }
    };

    window.addEventListener('studentsDataChanged', handleDataChange);
    window.addEventListener('teacherDataChanged', handleDataChange);
    window.addEventListener('storage', handleStorageChange);

    // Handle online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('studentsDataChanged', handleDataChange);
      window.removeEventListener('teacherDataChanged', handleDataChange);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [loadData, loadHomeroomTeacher]);

  const handleViewProfile = (student) => {
    setSelectedStudent({...student, isTeacher: false});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedStudent(null);
    }, 300);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefresh = () => {
    loadHomeroomTeacher();
    loadData(true);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.nickname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.interests || []).some(interest => 
        interest?.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      (student.skills || []).some(skill => 
        skill?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesInterest = !selectedInterest || 
      (student.interests || []).some(interest => 
        interest?.toLowerCase().includes(selectedInterest.toLowerCase())
      );

    return matchesSearch && matchesInterest;
  });

  const uniqueInterests = [...new Set(students.flatMap(s => s.interests || []))];
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedInterest('');
    setCurrentPage(1);
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (loadingTeacher) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Memuat data wali kelas...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 md:p-6"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      {/* Floating Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 hover:scale-110 active:scale-95"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronUp className="w-6 h-6 rotate-270" />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div 
          className="mb-8"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="flex-1">
              <motion.div 
                className="inline-flex items-center gap-3 mb-4"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="p-2 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-xl">
                  <Users className="w-6 h-6 text-orange-400" />
                </div>
                <span className="text-sm font-medium text-orange-300 bg-orange-900/30 px-3 py-1 rounded-full">
                  XI PPLG 1
                </span>
              </motion.div>
              
              <motion.h1 
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
              >
                Anggota Kelas XI PPLG 1
              </motion.h1>
              
              <motion.div 
                className="flex flex-wrap items-center gap-4 mt-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-900/30 to-orange-800/20 rounded-lg border border-orange-800/50">
                    <Users className="w-4 h-4 text-orange-400" />
                    <span className="text-orange-300 font-medium">{students.length + 1} Anggota</span>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${isOnline ? 'bg-green-900/20 border-green-800/50' : 'bg-red-900/20 border-red-800/50'}`}>
                    {isOnline ? (
                      <Wifi className="w-4 h-4 text-green-400" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-red-400" />
                    )}
                    <span className={`text-sm font-medium ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
                      {isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  SMKN 2 Nganjuk • Tahun Ajaran 2024/2025
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {/* Notifications */}
              <motion.div className="relative" whileHover={{ scale: 1.05 }}>
                <motion.button
                  onClick={() => setNotifications([])}
                  className="p-3 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-orange-500/50 text-gray-300 hover:text-orange-400 transition-all duration-300 relative group"
                  title="Notifikasi"
                  whileTap={{ scale: 0.95 }}
                >
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <motion.span 
                      className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      {notifications.length}
                    </motion.span>
                  )}
                </motion.button>
                
                <AnimatePresence>
                  {notifications.length > 0 && (
                    <motion.div 
                      className="absolute right-0 mt-2 w-72 bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 rounded-xl shadow-2xl z-50 backdrop-blur-xl"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    >
                      <div className="p-1 max-h-64 overflow-y-auto">
                        <div className="p-3 border-b border-gray-800">
                          <h4 className="text-white font-semibold flex items-center gap-2">
                            <Bell className="w-4 h-4" />
                            Notifikasi Terbaru
                          </h4>
                        </div>
                        <AnimatePresence>
                          {notifications.map((notif, index) => (
                            <motion.div 
                              key={notif.id} 
                              className="p-3 border-b border-gray-800/50 last:border-b-0 hover:bg-gray-800/30 transition-colors cursor-pointer"
                              variants={notificationVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ x: 5 }}
                            >
                              <div className="flex items-start gap-3">
                                <div className="mt-1">
                                  <Sparkles className="w-4 h-4 text-orange-400" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm text-gray-200">{notif.message}</p>
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-gray-400">{notif.timestamp}</span>
                                    <span className="text-xs px-2 py-1 bg-orange-900/30 text-orange-400 rounded-full">
                                      Update
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              
              <motion.button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-xl text-gray-300 hover:text-white hover:border-orange-500/50 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh data"
                whileHover={!loading ? { scale: 1.05 } : {}}
                whileTap={!loading ? { scale: 0.95 } : {}}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                <span className="text-sm font-medium">{loading ? 'Loading...' : 'Refresh'}</span>
              </motion.button>
              
              <div className="text-xs text-gray-500 hidden lg:block">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                  <span>Update: {new Date(lastUpdate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Profil Walikelas */}
        {homeroomTeacher && (
          <motion.div 
            className="mb-10"
            variants={teacherCardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            onMouseEnter={() => setIsHoveringTeacher(true)}
            onMouseLeave={() => setIsHoveringTeacher(false)}
          >
            <motion.div 
              className="relative overflow-hidden rounded-2xl backdrop-blur-sm"
              animate={{
                boxShadow: isHoveringTeacher 
                  ? "0 25px 80px -15px rgba(249, 115, 22, 0.4)" 
                  : "0 10px 40px -10px rgba(249, 115, 22, 0.2)"
              }}
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 via-black/40 to-rose-400/10"></div>
              
              {/* Animated border effect */}
              <motion.div 
                className="absolute inset-0 rounded-2xl border border-rose-500/50 pointer-events-none"
                animate={{
                  borderWidth: isHoveringTeacher ? "2px" : "1px",
                  borderColor: isHoveringTeacher ? "rgba(249, 115, 22, 0.4)" : "rgba(249, 115, 22, 0.2)"
                }}
              />
              
              <div className="relative p-6 md:p-8">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
                  {/* Avatar Section */}
                  <motion.div 
                    className="relative group"
                    animate={{
                      scale: isHoveringTeacher ? 1.05 : 1,
                      transition: { type: "spring", stiffness: 300 }
                    }}
                  >
                    <div className="relative">
                      {/* Glow effect */}
                      <motion.div 
                        className="absolute -inset-4 bg-gradient-to-r from-orange-500/50 to-rose-500/50 rounded-full blur-xl"
                        animate={{
                          opacity: isHoveringTeacher ? 0.6 : 0.3,
                          scale: isHoveringTeacher ? 1.1 : 1
                        }}
                      />
                      
                      {/* Avatar */}
                      <motion.div 
                        className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-orange-500/50 bg-gradient-to-br from-orange-900 to-black shadow-2xl group-hover:border-orange-400 transition-all duration-300"
                        whileHover={{ 
                          rotate: [0, 5, -5, 0],
                          transition: { duration: 0.5 }
                        }}
                      >
                        {homeroomTeacher.avatar ? (
                          <img 
                            src={homeroomTeacher.avatar} 
                            alt={homeroomTeacher.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              e.target.src = '/image.png';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-900/30 to-black flex items-center justify-center">
                            <div className="text-3xl font-bold text-orange-400">
                              {homeroomTeacher.name?.charAt(0) || 'G'}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                  
                  {/* Info Section */}
                  <div className="flex-1">
                    <div className="mb-6">
                      <motion.div 
                        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div>
                          <motion.h2 
                            className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3"
                            animate={{
                              color: isHoveringTeacher ? "#" : "#ffffff"
                            }}
                          >
                            {homeroomTeacher.name}
                            <span className="text-base font-normal text-orange-300">({homeroomTeacher.nickname})</span>
                          </motion.h2>
                          
                          <motion.div 
                            className="flex flex-wrap items-center gap-2 mb-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                          >
                            <motion.span 
                              className="px-3 py-1.5 bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-300 text-sm font-semibold rounded-lg border border-orange-500/30"
                              whileHover={{ scale: 1.05 }}
                            >
                              {homeroomTeacher.role}
                            </motion.span>
                            <motion.span 
                              className="px-2.5 py-1 bg-orange-500/10 text-orange-300 text-xs rounded-lg flex items-center gap-1 border border-orange-500/20"
                              whileHover={{ scale: 1.05 }}
                            >
                              <BookOpen className="w-3 h-3" />
                              {homeroomTeacher.experience || '10 tahun'} Pengalaman
                            </motion.span>
                          </motion.div>
                        </div>
                      </motion.div>
                      
                      {/* Quote */}
                      <motion.div 
                        className="mb-6 p-4 bg-gradient-to-r from-rose-500/10 to-transparent rounded-xl border-l-4 border-rose-600"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                      >
                        <div className="flex items-start gap-3">
                          <motion.div
                            animate={{ 
                              rotate: isHoveringTeacher ? [0, 10, -10, 0] : 0 
                            }}
                            transition={{ 
                              rotate: { 
                                duration: 0.5,
                                ease: "easeInOut" 
                              }
                            }}
                          >
                            <MessageSquare className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                          </motion.div>
                          <div>
                            <p className="text-white italic text-lg">"{homeroomTeacher.motto}"</p>
                            <p className="text-rose-600 text-sm mt-2">{homeroomTeacher.mottoDetail}</p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                    
                    {/* Contact & Details Grid */}
                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.div className="space-y-3" variants={itemVariants}>
                        <motion.div 
                          className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-900/40 to-gray-800/20 rounded-lg border border-gray-800/50 hover:border-orange-500/30 transition-all duration-300 cursor-pointer"
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="p-2 bg-orange-500/10 rounded-lg">
                            <Mail className="w-4 h-4 text-orange-400 flex-shrink-0" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-gray-400">Email</div>
                            <div className="text-orange-200 text-sm font-medium truncate">{homeroomTeacher.email}</div>
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-900/40 to-gray-800/20 rounded-lg border border-gray-800/50 hover:border-yellow-500/30 transition-all duration-300 cursor-pointer"
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="p-2 bg-yellow-500/10 rounded-lg">
                            <Award className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-gray-400">Pendidikan</div>
                            <div className="text-yellow-200 text-sm font-medium">{homeroomTeacher.education}</div>
                          </div>
                        </motion.div>
                      </motion.div>
                      
                      <motion.div className="space-y-3" variants={itemVariants}>
                        <motion.div 
                          className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-900/40 to-gray-800/20 rounded-lg border border-gray-800/50 hover:border-orange-500/30 transition-all duration-300 cursor-pointer"
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="p-2 bg-orange-500/10 rounded-lg">
                            <Phone className="w-4 h-4 text-orange-400 flex-shrink-0" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-gray-400">Telepon</div>
                            <div className="text-orange-200 text-sm font-medium">{homeroomTeacher.phone}</div>
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-900/40 to-gray-800/20 rounded-lg border border-gray-800/50 hover:border-yellow-500/30 transition-all duration-300 cursor-pointer"
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="p-2 bg-yellow-500/10 rounded-lg">
                            <Calendar className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-gray-400">Bergabung</div>
                            <div className="text-yellow-200 text-sm font-medium">Sejak {homeroomTeacher.joined}</div>
                          </div>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                    
                    {/* Subjects & Interests */}
                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.9 }}
                    >
                      <div>
                        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-orange-400" />
                          Mata Pelajaran
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {homeroomTeacher.subjects.map((subject, idx) => (
                            <motion.span 
                              key={idx} 
                              className="px-3 py-1.5 bg-gradient-to-r from-orange-500/10 to-orange-600/10 text-orange-300 text-sm rounded-lg border border-orange-500/30 hover:border-orange-400 transition-colors"
                              whileHover={{ scale: 1.1, y: -2 }}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 1 + idx * 0.1 }}
                            >
                              {subject}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                          <Star className="w-4 h-4 text-rose-500" />
                          Bidang Minat
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {homeroomTeacher.interests.map((interest, idx) => (
                            <motion.span 
                              key={idx} 
                              className="px-3 py-1.5 bg-gradient-to-r from-pink-500/10 to-rose-600/10 text-white text-sm rounded-lg border border-rose-500 hover:border-rose-600 transition-colors"
                              whileHover={{ scale: 1.1, y: -2 }}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 1.1 + idx * 0.1 }}
                            >
                              {interest}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Search and Controls */}
        <motion.div 
          className="mb-8"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1">
              <motion.div className="relative group">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-transparent rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{ opacity: 0 }}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5 z-10" />
                <motion.input
                  type="text"
                  placeholder="Cari anggota berdasarkan nama, nickname, minat, atau skill..."
                  className="relative w-full pl-12 pr-10 py-3.5 bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-xl text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  whileFocus={{ scale: 1.02 }}
                />
                {searchTerm && (
                  <motion.button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white p-1"
                    whileHover={{ scale: 1.2, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ✕
                  </motion.button>
                )}
              </motion.div>
            </div>
            
            {/* Controls */}
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3.5 bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-xl text-white hover:text-white hover:border-orange-500/50 transition-all duration-300 group"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Filter className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span className="font-medium">Filters</span>
              </motion.button>
              
              <motion.button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-3.5 bg-gradient-to-r from-gray-800/50 to-gray-900 border border-gray-700 rounded-xl text-white hover:text-white hover:border-orange-500 transition-all duration-300 group"
                title={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                {viewMode === 'grid' ? 
                  <List className="w-5 h-5 group-hover:scale-110 transition-transform" /> : 
                  <Grid className="w-5 h-5 group-hover:scale-110 transition-transform" />
                }
              </motion.button>
              
              <motion.select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-4 py-3.5 bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-black appearance-none bg-no-repeat bg-right pr-10"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"%239ca3af\"%3E%3Cpath stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M19 9l-7 7-7-7\"%3E%3C/path%3E%3C/svg%3E")' }}
                whileFocus={{ scale: 1.02 }}
              >
                <option value="12" className="text-gray-100 bg-gray-900">12 per halaman</option>
                <option value="24" className="text-gray-100 bg-gray-900">24 per halaman</option>
                <option value="36" className="text-gray-100 bg-gray-900">36 per halaman</option>
                <option value="48" className="text-gray-100 bg-gray-900">48 per halaman</option>
              </motion.select>
            </motion.div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                className="mt-4 p-5 bg-gradient-to-br from-gray-900/60 to-gray-950/40 rounded-xl border border-gray-700/50 backdrop-blur-sm"
                initial={{ height: 0, opacity: 0, y: -10 }}
                animate={{ height: "auto", opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -10 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Filter className="w-5 h-5 text-orange-400" />
                    Filter Anggota
                  </h3>
                  <motion.button
                    onClick={handleResetFilters}
                    className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1"
                    whileHover={{ scale: 1.1, x: 2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <RefreshCw className="w-3 h-3" />
                    Reset semua
                  </motion.button>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm text-white mb-2">Filter berdasarkan minat</label>
                    <motion.select
                      value={selectedInterest}
                      onChange={(e) => {
                        setSelectedInterest(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full px-4 py-2.5 bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent"
                      whileFocus={{ scale: 1.02 }}
                    >
                      <option value="">Semua Minat</option>
                      {uniqueInterests.map((interest, idx) => (
                        <option key={idx} value={interest}>
                          {interest}
                        </option>
                      ))}
                    </motion.select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-white mb-2">Status</label>
                    <div className="flex gap-2">
                      <motion.button
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-lg text-gray-300 hover:text-white hover:border-green-500/50 text-sm transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Aktif
                      </motion.button>
                      <motion.button
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-lg text-gray-300 hover:text-white hover:border-blue-500/50 text-sm transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Prestasi
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Info */}
        <motion.div 
          className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex-1">
            <div className="text-gray-300/80 text-sm">
              Menampilkan <span className="text-white font-semibold">{indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredStudents.length)}</span> dari <span className="text-orange-400 font-semibold">{filteredStudents.length}</span> anggota
              {searchTerm && (
                <span className="ml-2">
                  untuk "<span className="text-white">{searchTerm}</span>"
                </span>
              )}
              {selectedInterest && (
                <span className="ml-2">
                  dengan minat "<span className="text-white">{selectedInterest}</span>"
                </span>
              )}
            </div>
          </div>
          
          <motion.div 
            className="flex items-center gap-2 text-xs text-gray-500"
            animate={{ 
              opacity: [0.5, 1, 0.5] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity 
            }}
          >
            <Zap className="w-3 h-3" />
            <span>Update: {new Date(lastUpdate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </motion.div>
        </motion.div>

        {/* Student Grid/List View */}
        {viewMode === 'grid' ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key="grid-view"
          >
            {currentStudents.map((student, index) => (
              <motion.div
                key={`${student.id}-${lastUpdate}`}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
                custom={index}
                transition={{ delay: index * 0.03 }}
              >
                <StudentCard
                  student={student}
                  index={index}
                  onViewProfile={handleViewProfile}
                  lastUpdate={lastUpdate}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* List View */
          <motion.div 
            className="space-y-3 mb-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key="list-view"
          >
            {currentStudents.map((student, index) => (
              <motion.div
                key={`${student.id}-${lastUpdate}`}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ 
                  scale: 1.02,
                  x: 10,
                  backgroundColor: "rgba(249, 115, 22, 0.05)"
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ delay: index * 0.03 }}
                className="bg-gradient-to-r from-gray-900/30 to-gray-800/20 rounded-xl p-4 border border-gray-800/50 hover:border-orange-500/30 transition-all duration-300 cursor-pointer group backdrop-blur-sm"
                onClick={() => handleViewProfile(student)}
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-orange-500/30 group-hover:border-orange-400 transition-colors duration-300">
                        {student.avatar ? (
                          <img 
                            src={student.avatar} 
                            alt={student.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-900/30 to-black flex items-center justify-center">
                            <div className="text-xl font-bold text-orange-400">
                              {student.name?.charAt(0) || '?'}
                            </div>
                          </div>
                        )}
                      </div>
                      {student.achievement && (
                        <motion.div 
                          className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg"
                          animate={{ 
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.2, 1]
                          }}
                          transition={{ 
                            rotate: { 
                              duration: 2, 
                              repeat: Infinity 
                            },
                            scale: { 
                              duration: 2, 
                              repeat: Infinity 
                            }
                          }}
                        >
                          <Star className="w-2.5 h-2.5 text-white" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-base font-semibold text-white group-hover:text-orange-300 transition-colors truncate">
                          {student.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-1 bg-gradient-to-r from-orange-900/40 to-orange-800/30 text-orange-300 text-xs rounded-lg">
                            {student.nickname}
                          </span>
                          {student.achievement && (
                            <span className="px-2 py-1 bg-gradient-to-r from-yellow-900/30 to-amber-800/20 text-yellow-300 text-xs rounded-lg flex items-center gap-1">
                              <AlertCircle className="w-2.5 h-2.5" />
                              Achievement
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">ID: {student.id}</div>
                        <motion.button 
                          className="mt-1 text-gray-500 hover:text-orange-400 opacity-0 group-hover:opacity-100 transition-all duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewProfile(student);
                          }}
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                    
                    {/* Skills/Interests */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(student.interests || []).slice(0, 3).map((interest, idx) => (
                        <motion.span 
                          key={idx} 
                          className="px-2 py-1 bg-gradient-to-r from-gray-800/40 to-gray-900/30 text-gray-300 text-xs rounded-lg border border-gray-700/50 group-hover:border-orange-500/30 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1 * idx }}
                        >
                          {interest}
                        </motion.span>
                      ))}
                      {(student.interests || []).length > 3 && (
                        <span className="px-2 py-1 bg-gradient-to-r from-gray-800 to-gray-900 text-gray-400 text-xs rounded-lg">
                          +{(student.interests || []).length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        <AnimatePresence>
          {filteredStudents.length === 0 && (
            <motion.div 
              className="text-center py-16 border-2 border-dashed border-gray-800/50 rounded-2xl bg-gradient-to-b from-gray-900/20 to-transparent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <motion.div 
                className="w-28 h-28 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-800/20 to-gray-900/10 flex items-center justify-center"
                animate={{ 
                  rotate: [0, 360]
                }}
                transition={{ 
                  rotate: { 
                    duration: 20, 
                    repeat: Infinity,
                    ease: "linear" 
                  }
                }}
              >
                <Search className="w-14 h-14 text-gray-700/50" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-200 mb-3">Tidak ada data yang ditemukan</h3>
              <p className="text-gray-400 max-w-md mx-auto mb-6">
                {searchTerm || selectedInterest 
                  ? `Tidak ada anggota yang cocok dengan pencarian "${searchTerm}"${selectedInterest ? ` dan minat "${selectedInterest}"` : ''}.` 
                  : 'Belum ada data anggota yang tersedia.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.button
                  onClick={handleResetFilters}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ 
                    scale: 1.05,
                    y: -2
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Reset Pencarian
                </motion.button>
                <motion.button
                  onClick={handleRefresh}
                  className="px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 font-semibold rounded-xl hover:from-gray-700 hover:to-gray-800 hover:text-white transition-all duration-300 border border-gray-700/50"
                  whileHover={{ 
                    scale: 1.05,
                    y: -2
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Refresh Data
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {filteredStudents.length > 0 && (
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-center gap-6 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-gray-300/80 text-sm">
              Halaman <span className="text-white font-semibold">{currentPage}</span> dari <span className="text-orange-400 font-semibold">{totalPages}</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`p-2.5 rounded-xl transition-all ${
                  currentPage === 1
                    ? 'bg-gradient-to-r from-gray-900/30 to-gray-800/20 text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-gray-800/50 to-gray-900/30 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-orange-900/30 hover:to-orange-800/20 hover:border hover:border-orange-500/30 hover:scale-105'
                }`}
                whileHover={currentPage !== 1 ? { scale: 1.1 } : {}}
                whileTap={currentPage !== 1 ? { scale: 0.9 } : {}}
              >
                <ChevronLeft size={20} />
              </motion.button>
              
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
                  <motion.button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3.5 py-1.5 rounded-lg transition-all ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white scale-105 shadow-lg'
                        : 'bg-gradient-to-r from-gray-800/50 to-gray-900/30 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-700/50 hover:to-gray-800/30 hover:scale-105'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {pageNum}
                  </motion.button>
                );
              })}
              
              <motion.button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`p-2.5 rounded-xl transition-all ${
                  currentPage === totalPages
                    ? 'bg-gradient-to-r from-gray-900/30 to-gray-800/20 text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-gray-800/50 to-gray-900/30 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-orange-900/30 hover:to-orange-800/20 hover:border hover:border-orange-500/30 hover:scale-105'
                }`}
                whileHover={currentPage !== totalPages ? { scale: 1.1 } : {}}
                whileTap={currentPage !== totalPages ? { scale: 0.9 } : {}}
              >
                <ChevronRight size={20} />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div 
          className="mt-12 pt-8 border-t border-gray-800/50 text-center text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-4">
            <div className="flex items-center gap-4">
              <motion.div 
                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-gray-800/30 to-gray-900/20 rounded-lg border border-gray-700/50"
                whileHover={{ scale: 1.05 }}
              >
                <Shield className="w-3.5 h-3.5 text-orange-400" />
                <Link 
                    to="/admin" 
                    className="text-orange-400 hover:text-orange-300 transition-colors font-medium text-xs"
                  >
                    Admin Panel
                  </Link>
              </motion.div>
              <div className="flex items-center gap-2">
                <UserCheck className="w-3.5 h-3.5 text-green-400" />
                <span className="text-xs text-green-400">Live Sync Aktif</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500">Sistem v2.1.0</span>
              <motion.div 
                className="flex items-center gap-2"
                animate={{ 
                  opacity: [0.7, 1, 0.7] 
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity 
                }}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs">Data diperbarui otomatis</span>
              </motion.div>
            </div>
          </div>
          
          <p className="mt-4 text-gray-500">
            © {new Date().getFullYear()} XI PPLG 1 - SMKN 2 Nganjuk | 2024/2025
          </p>
        </motion.div>
      </div>

      {/* Render Student Modal */}
      <StudentModal
        student={selectedStudent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </motion.div>
  );
}

export default Anggota;