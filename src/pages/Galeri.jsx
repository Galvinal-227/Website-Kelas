import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Heart, MessageCircle, Send, Settings, X, Loader, User, 
  Trash2, Check, AlertCircle, Camera,
  ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX,
  Image as ImageIcon, Video, Upload, MoreVertical,
  Bookmark, Share2, Grid, Film, MapPin,
  Plus, Eye, Clock, Users, Reply, Edit,
  Download, ExternalLink, Link, MoreHorizontal,
  Save, Share, BookmarkPlus, BookmarkCheck,
  Music, Filter, TrendingUp,
  ThumbsUp, Star, EyeOff, Lock, Globe,
  Maximize2, Minus, CheckCircle,
  FileText, File, HardDrive
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ADMIN_PASSWORD = 'pplg1admin';
const MAX_FILE_SIZE = 100 * 1024 * 1024; 
const MAX_REELS_SIZE = 50 * 1024 * 1024; 

const Galeri = () => {
  const galleryRef = useRef(null);
  const reelsRef = useRef(null);
  const gridFileInputRef = useRef(null);
  const reelsFileInputRef = useRef(null);
  const reelVideoRefs = useRef({});
  
  const [showGridUploadModal, setShowGridUploadModal] = useState(false);
  const [showReelsUploadModal, setShowReelsUploadModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(null);
  const [showReelViewer, setShowReelViewer] = useState(null);
  const [showShareModal, setShowShareModal] = useState(null);
  const [showPostDetail, setShowPostDetail] = useState(null);
  
  const [newComment, setNewComment] = useState('');
  const [uploadingGrid, setUploadingGrid] = useState(false);
  const [uploadingReels, setUploadingReels] = useState(false);
  const [reelPlaying, setReelPlaying] = useState({});
  const [reelVolume, setReelVolume] = useState({});
  const [activeTab, setActiveTab] = useState('grid');
  const [replyingTo, setReplyingTo] = useState(null);
  const [editCommentId, setEditCommentId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [savedPosts, setSavedPosts] = useState(() => {
    const saved = localStorage.getItem('saved_posts');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [gridUploadData, setGridUploadData] = useState({ 
    caption: '',
    type: 'image',
    file: null,
    preview: null,
    fileSize: 0
  });
  
  const [reelsUploadData, setReelsUploadData] = useState({ 
    caption: '',
    description: '',
    type: 'video',
    file: null,
    preview: null,
    fileSize: 0,
    music: 'Original Sound - XI PPLG 1',
    duration: 0
  });

  const [gridPosts, setGridPosts] = useState(() => {
    const savedPosts = localStorage.getItem('galeri_posts');
    if (savedPosts) {
      const parsed = JSON.parse(savedPosts);
      return parsed.map(post => ({
        ...post,
        liked: localStorage.getItem(`post_liked_${post.id}`) === 'true',
        saved: localStorage.getItem(`post_saved_${post.id}`) === 'true',
        pinned: localStorage.getItem(`post_pinned_${post.id}`) === 'true',
        comments: post.comments || []
      }));
    }
    return [];
  });

  const [reels, setReels] = useState(() => {
    const savedReels = localStorage.getItem('reels_posts');
    if (savedReels) {
      const parsed = JSON.parse(savedReels);
      return parsed.map(reel => ({
        ...reel,
        liked: localStorage.getItem(`reel_liked_${reel.id}`) === 'true',
        saved: localStorage.getItem(`reel_saved_${reel.id}`) === 'true',
        comments: reel.comments || []
      }));
    }
    return [];
  });

  useEffect(() => {
    const adminStatus = localStorage.getItem('admin_logged_in');
    if (adminStatus === 'true') {
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    if (galleryRef.current) {
      const items = galleryRef.current.querySelectorAll('.post-item');
      
      items.forEach((item, index) => {
        gsap.fromTo(item,
          {
            y: 50,
            opacity: 0,
            scale: 0.9
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            delay: index * 0.1,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [gridPosts, activeTab]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const saveGridPostsToLocalStorage = () => {
    localStorage.setItem('galeri_posts', JSON.stringify(gridPosts));
  };

  const saveReelsToLocalStorage = () => {
    localStorage.setItem('reels_posts', JSON.stringify(reels));
  };

  const saveSavedPostsToLocalStorage = () => {
    localStorage.setItem('saved_posts', JSON.stringify(savedPosts));
  };

  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = type === 'reels' ? MAX_REELS_SIZE : MAX_FILE_SIZE;
    
    if (file.size > maxSize) {
      alert(`File terlalu besar! Maksimal ${formatFileSize(maxSize)}.`);
      return;
    }

    const fileType = file.type.split('/')[0];
    if (fileType === 'image' || fileType === 'video') {
      const fileURL = URL.createObjectURL(file);
      
      if (type === 'grid') {
        setGridUploadData({
          ...gridUploadData, 
          type: fileType, 
          file: file, 
          preview: fileURL,
          fileSize: file.size
        });
      } else if (type === 'reels') {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = function() {
          setReelsUploadData({
            ...reelsUploadData,
            type: fileType,
            file: file,
            preview: fileURL,
            fileSize: file.size,
            duration: Math.round(video.duration)
          });
        };
        video.src = fileURL;
      }
    } else {
      alert('Hanya file gambar (JPG, PNG, WebP) atau video (MP4, WebM) yang diperbolehkan!');
    }
  };

  const handleAdminLogin = () => {
    const passwordInput = prompt('Masukkan password admin:');
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem('admin_logged_in', 'true');
      alert('Login admin berhasil!');
    } else if (passwordInput !== null) {
      alert('Password admin salah!');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('admin_logged_in');
    alert('Logout berhasil!');
  };

  const handleGridPostLike = (postId) => {
    setGridPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const newLiked = !post.liked;
        localStorage.setItem(`post_liked_${postId}`, newLiked.toString());
        
        return {
          ...post,
          liked: newLiked
        };
      }
      return post;
    }));
    saveGridPostsToLocalStorage();
  };

  const handleReelLike = (reelId) => {
    setReels(prev => prev.map(reel => {
      if (reel.id === reelId) {
        const newLiked = !reel.liked;
        localStorage.setItem(`reel_liked_${reelId}`, newLiked.toString());
        
        return {
          ...reel,
          liked: newLiked
        };
      }
      return reel;
    }));
    saveReelsToLocalStorage();
  };

  const handleSavePost = (postId, type = 'grid') => {
    if (type === 'grid') {
      setGridPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const newSaved = !post.saved;
          localStorage.setItem(`post_saved_${postId}`, newSaved.toString());
          
          if (newSaved) {
            setSavedPosts(prev => [...prev, { ...post, saved: true, source: 'grid' }]);
          } else {
            setSavedPosts(prev => prev.filter(p => !(p.id === postId && p.source === 'grid')));
          }
          
          return { ...post, saved: newSaved };
        }
        return post;
      }));
    } else if (type === 'reels') {
      setReels(prev => prev.map(reel => {
        if (reel.id === postId) {
          const newSaved = !reel.saved;
          localStorage.setItem(`reel_saved_${postId}`, newSaved.toString());
          
          if (newSaved) {
            setSavedPosts(prev => [...prev, { ...reel, saved: true, source: 'reels' }]);
          } else {
            setSavedPosts(prev => prev.filter(p => !(p.id === postId && p.source === 'reels')));
          }
          
          return { ...reel, saved: newSaved };
        }
        return reel;
      }));
    }
    
    saveSavedPostsToLocalStorage();
  };

  const handleSharePost = (postId, type = 'grid') => {
    let post;
    
    if (type === 'grid') {
      post = gridPosts.find(p => p.id === postId);
    } else if (type === 'reels') {
      post = reels.find(p => p.id === postId);
    }
    
    setShowShareModal({ post, type });
  };

  const handleUploadGridPost = async () => {
    if (!gridUploadData.file) {
      alert('Pilih file foto/video terlebih dahulu!');
      return;
    }

    setUploadingGrid(true);

    try {
      const base64Data = await fileToBase64(gridUploadData.file);
      
      const newGridPost = {
        id: `grid_post_${Date.now()}`,
        caption: gridUploadData.caption || `Foto kenangan kelas XI PPLG 1`,
        username: 'xi_pplg1.smkn2nganjuk',
        date: new Date().toLocaleDateString('id-ID', { 
          day: 'numeric', 
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        }),
        comments: [],
        liked: false,
        saved: false,
        type: gridUploadData.type,
        fileName: gridUploadData.file.name,
        fileSize: formatFileSize(gridUploadData.fileSize),
        mediaData: base64Data,
        isGridContent: true,
        category: 'kegiatan'
      };

      setGridPosts(prev => [newGridPost, ...prev]);
      setGridUploadData({ caption: '', type: 'image', file: null, preview: null, fileSize: 0 });
      setUploadingGrid(false);
      setShowGridUploadModal(false);
      saveGridPostsToLocalStorage();
      
      alert('Postingan berhasil diupload ke Galeri Utama!');
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Terjadi kesalahan saat upload file.');
      setUploadingGrid(false);
    }
  };

  const handleUploadReels = async () => {
    if (!reelsUploadData.file) {
      alert('Pilih file video terlebih dahulu!');
      return;
    }

    if (reelsUploadData.type !== 'video') {
      alert('Reels hanya bisa diupload dengan format video!');
      return;
    }

    setUploadingReels(true);

    try {
      const base64Data = await fileToBase64(reelsUploadData.file);
      
      const newReel = {
        id: `reel_${Date.now()}`,
        caption: reelsUploadData.caption || 'Reels XI PPLG 1',
        description: reelsUploadData.description || 'Kreativitas siswa PPLG 1',
        username: 'xi_pplg1.smkn2nganjuk',
        date: new Date().toLocaleDateString('id-ID', { 
          day: 'numeric', 
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        }),
        comments: [],
        liked: false,
        saved: false,
        type: 'video',
        fileName: reelsUploadData.file.name,
        fileSize: formatFileSize(reelsUploadData.fileSize),
        mediaData: base64Data,
        music: reelsUploadData.music,
        duration: reelsUploadData.duration,
        isReelsContent: true,
        category: 'reels'
      };

      setReels(prev => [newReel, ...prev]);
      setReelsUploadData({ 
        caption: '', 
        description: '',
        type: 'video', 
        file: null, 
        preview: null, 
        fileSize: 0,
        music: 'Original Sound - XI PPLG 1',
        duration: 0
      });
      setUploadingReels(false);
      setShowReelsUploadModal(false);
      saveReelsToLocalStorage();
      
      alert('Reels berhasil diupload!');
    } catch (error) {
      console.error('Error uploading reels:', error);
      alert('Terjadi kesalahan saat upload reels.');
      setUploadingReels(false);
    }
  };

  const handleAddComment = (postId, commentText, parentId = null, isEdit = false, commentId = null, type = 'grid') => {
    if (!commentText.trim()) return;

    const commentAuthor = isAdmin ? 'Admin XI PPLG 1' : 'Pengunjung';
    const commentUsername = isAdmin ? 'admin' : 'visitor';

    const newCommentData = {
      id: commentId || `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: commentText,
      author: commentAuthor,
      username: commentUsername,
      date: new Date().toLocaleTimeString('id-ID', { 
        hour: '2-digit',
        minute: '2-digit'
      }),
      isAdmin: isAdmin,
      replies: [],
      parentId: parentId
    };

    if (type === 'grid') {
      if (isEdit) {
        setGridPosts(prev => prev.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                comments: post.comments?.map(comment => 
                  comment.id === commentId 
                    ? { ...comment, text: commentText, edited: true }
                    : comment
                ) || []
              }
            : post
        ));
        setEditCommentId(null);
      } else if (parentId) {
        setGridPosts(prev => prev.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                comments: post.comments?.map(comment => {
                  if (comment.id === parentId) {
                    return {
                      ...comment,
                      replies: [...(comment.replies || []), newCommentData]
                    };
                  }
                  return comment;
                }) || []
              }
            : post
        ));
        setReplyingTo(null);
      } else {
        setGridPosts(prev => prev.map(post => 
          post.id === postId 
            ? { ...post, comments: [...(post.comments || []), newCommentData] }
            : post
        ));
      }
      saveGridPostsToLocalStorage();
    } else if (type === 'reels') {
      if (isEdit) {
        setReels(prev => prev.map(reel => 
          reel.id === postId 
            ? { 
                ...reel, 
                comments: reel.comments?.map(comment => 
                  comment.id === commentId 
                    ? { ...comment, text: commentText, edited: true }
                    : comment
                ) || []
              }
            : reel
        ));
        setEditCommentId(null);
      } else if (parentId) {
        setReels(prev => prev.map(reel => 
          reel.id === postId 
            ? { 
                ...reel, 
                comments: reel.comments?.map(comment => {
                  if (comment.id === parentId) {
                    return {
                      ...comment,
                      replies: [...(comment.replies || []), newCommentData]
                    };
                  }
                  return comment;
                }) || []
              }
            : reel
        ));
        setReplyingTo(null);
      } else {
        setReels(prev => prev.map(reel => 
          reel.id === postId 
            ? { ...reel, comments: [...(reel.comments || []), newCommentData] }
            : reel
        ));
      }
      saveReelsToLocalStorage();
    }
    
    setNewComment('');
  };

  const handleDeleteComment = (postId, commentId, type = 'grid') => {
    if (!isAdmin && !window.confirm('Hapus komentar ini?')) return;
    
    if (type === 'grid') {
      setGridPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              comments: post.comments?.filter(comment => comment.id !== commentId) || []
            }
          : post
      ));
      saveGridPostsToLocalStorage();
    } else if (type === 'reels') {
      setReels(prev => prev.map(reel => 
        reel.id === postId 
          ? { 
              ...reel, 
              comments: reel.comments?.filter(comment => comment.id !== commentId) || []
            }
          : reel
      ));
      saveReelsToLocalStorage();
    }
  };

  const handleDeleteGridPost = (postId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus postingan dari galeri?')) {
      const updatedPosts = gridPosts.filter(post => post.id !== postId);
      setGridPosts(updatedPosts);
      saveGridPostsToLocalStorage();
      
      setSavedPosts(prev => prev.filter(p => !(p.id === postId && p.source === 'grid')));
      saveSavedPostsToLocalStorage();
    }
  };

  const handleDeleteReel = (reelId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus reel ini?')) {
      const updatedReels = reels.filter(reel => reel.id !== reelId);
      setReels(updatedReels);
      saveReelsToLocalStorage();
      
      setSavedPosts(prev => prev.filter(p => !(p.id === reelId && p.source === 'reels')));
      saveSavedPostsToLocalStorage();
    }
  };

  const handleReelView = (reelIndex) => {
    const reel = reels[reelIndex];
    if (reel) {
      setShowReelViewer(reelIndex);
      setReelPlaying({ [reel.id]: true });
      
      if (!localStorage.getItem(`reel_viewed_${reel.id}_${new Date().toDateString()}`)) {
        localStorage.setItem(`reel_viewed_${reel.id}_${new Date().toDateString()}`, 'true');
      }
    }
  };

  const toggleReelPlay = (reelId) => {
    const videoElement = reelVideoRefs.current[reelId];
    if (videoElement) {
      if (reelPlaying[reelId]) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
      setReelPlaying(prev => ({ ...prev, [reelId]: !prev[reelId] }));
    }
  };

  const toggleReelVolume = (reelId) => {
    const videoElement = reelVideoRefs.current[reelId];
    if (videoElement) {
      videoElement.muted = !videoElement.muted;
      setReelVolume(prev => ({ ...prev, [reelId]: !videoElement.muted }));
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Link berhasil disalin!');
    });
  };

  const downloadMedia = (mediaData, filename) => {
    const link = document.createElement('a');
    link.href = mediaData;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderNavbar = () => (
    <div className="container mx-auto px-4 py-10"> 
      <div className="flex items-center justify-between mt-4"> 
        <div className="flex items-center gap-3 pt-5"> 
          {/* Bagian foto profil dihapus */}
        </div>
        <div className="flex items-center gap-2 pb-1">
          {isAdmin ? (
            <>
              <span className="text-sm text-green-400 hidden sm:inline">Admin Mode</span>
              <button
                onClick={handleAdminLogout}
                className="px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-sm transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleAdminLogin}
              className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>Login Admin</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderProfileInfo = () => (
    <div className="max-w-4xl mx-auto mb-12">
      <div className="flex items-center gap-8 mb-8">
        <div className="relative">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden">
              <img 
                src="/ppig.jpg" 
                alt="Logo PPLG 1"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%232d1b69'/%3E%3Ctext x='50%25' y='45%25' text-anchor='middle' dy='.3em' font-family='Arial, sans-serif' font-size='24' fill='white'%3EPPLG%3C/t%3E%3Ctext x='50%25' y='70%25' text-anchor='middle' dy='.3em' font-family='Arial, sans-serif' font-size='16' fill='white'%3E1%3C/t%3E%3C/svg%3E";
                }}
              />
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-2xl font-bold">ElevoneClass</h2>
            {isAdmin && (
              <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs rounded-full font-bold">
                ADMIN
              </span>
            )}
          </div>
          
          <div className="text-gray-300">
            <p className="font-medium">XI PPLG 1 • SMKN 2 Nganjuk</p>
            <p className="text-gray-400 text-sm">Akun resmi kelas XI PPLG 1 - Pengembangan Perangkat Lunak dan Gim</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-blue-400 text-sm flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                SMKN 2 Nganjuk, Jawa Timur
              </span>
              <span className="text-pink-400 text-sm">#PPLG1Jaya</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabs = () => (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="flex justify-center border-b border-gray-800">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('grid')}
            className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-all ${
              activeTab === 'grid'
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Grid className="w-4 h-4 inline mr-2" />
            Galeri Utama
          </button>
          
          <button
            onClick={() => setActiveTab('reels')}
            className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-all ${
              activeTab === 'reels'
                ? 'bg-gradient-to-r from-pink-500/20 to-orange-500/20 text-white border-b-2 border-pink-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Film className="w-4 h-4 inline mr-2" />
            Reels
          </button>
          
          <button
            onClick={() => setActiveTab('tagged')}
            className={`px-6 py-3 font-medium text-sm rounded-t-lg transition-all ${
              activeTab === 'tagged'
                ? 'bg-gradient-to-r from-green-500/20 to-teal-500/20 text-white border-b-2 border-green-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4 inline mr-2" />
            Tersimpan
          </button>
        </div>
      </div>
    </div>
  );

  const renderAdminControls = () => {
    if (!isAdmin) return null;
    
    if (activeTab === 'grid') {
      return (
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-400" />
                  Kontrol Admin - Galeri Utama
                </h3>
                <p className="text-gray-400 text-sm">Upload konten ke grid galeri utama (maks. {formatFileSize(MAX_FILE_SIZE)})</p>
              </div>
              <button
                onClick={() => setShowGridUploadModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-medium flex items-center gap-2 transition-all"
              >
                <Upload className="w-4 h-4" />
                Upload ke Galeri
              </button>
            </div>
          </div>
        </div>
      );
    } else if (activeTab === 'reels') {
      return (
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Film className="w-5 h-5 text-pink-400" />
                  Kontrol Admin - Reels
                </h3>
                <p className="text-gray-400 text-sm">Upload video reels (maks. {formatFileSize(MAX_REELS_SIZE)})</p>
              </div>
              <button
                onClick={() => setShowReelsUploadModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700 rounded-lg font-medium flex items-center gap-2 transition-all"
              >
                <Video className="w-4 h-4" />
                Upload Reels
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };

  const renderGalleryGrid = () => (
    <div ref={galleryRef} className="max-w-7xl mx-auto">
      {activeTab === 'grid' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridPosts.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-bold mb-2">Galeri Kosong</h3>
                <p className="text-gray-400 mb-6">Belum ada postingan di galeri utama</p>
                {isAdmin && (
                  <button
                    onClick={() => setShowGridUploadModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Upload Postingan Pertama
                  </button>
                )}
              </div>
            ) : (
              gridPosts.map((post) => (
                <div
                  key={post.id}
                  className="post-item bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500">
                        <img 
                          src="/ppig.jpg" 
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-bold">{post.username}</div>
                        <div className="text-xs text-gray-400">{post.date}</div>
                      </div>
                    </div>
                    
                    {isAdmin && (
                      <div className="flex items-center gap-2">
                        {post.pinned && (
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                            Disematkan
                          </span>
                        )}
                        <button
                          onClick={() => handleDeleteGridPost(post.id)}
                          className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
                          title="Hapus postingan"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div 
                    className="relative cursor-pointer aspect-square bg-gray-900"
                    onClick={() => setShowPostDetail({ post, type: 'grid' })}
                  >
                    {post.type === 'video' ? (
                      <video
                        src={post.mediaData}
                        className="w-full h-full object-cover"
                        playsInline
                        muted
                      />
                    ) : (
                      <img
                        src={post.mediaData}
                        alt={post.caption}
                        className="w-full h-full object-cover"
                      />
                    )}
                    
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                      <Eye className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleGridPostLike(post.id)}
                          className={`flex items-center gap-2 transition-colors ${
                            post.liked ? 'text-pink-500' : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${post.liked ? 'fill-current' : ''}`} />
                        </button>
                        
                        <button
                          onClick={() => setShowCommentModal({ id: post.id, type: 'grid' })}
                          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                        >
                          <MessageCircle className="w-5 h-5" />
                        </button>
                        
                        <button 
                          onClick={() => handleSharePost(post.id, 'grid')}
                          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSavePost(post.id, 'grid')}
                          className={`transition-colors ${
                            post.saved ? 'text-yellow-500' : 'text-gray-400 hover:text-white'
                          }`}
                          title={post.saved ? "Disimpan" : "Simpan"}
                        >
                          {post.saved ? (
                            <BookmarkCheck className="w-5 h-5 fill-current" />
                          ) : (
                            <Bookmark className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <span className="font-bold">{post.username}</span>
                      <span className="ml-2">{post.caption}</span>
                    </div>
                    
                    {post.comments && post.comments.length > 0 && (
                      <div className="mt-2">
                        <button
                          onClick={() => setShowCommentModal({ id: post.id, type: 'grid' })}
                          className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                          Lihat komentar...
                        </button>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500 mt-2 flex items-center justify-between">
                      <span>{post.uploaded || 'Baru saja'}</span>
                      <span className="flex items-center gap-1">
                        <HardDrive className="w-3 h-3" />
                        {post.fileSize}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {activeTab === 'reels' && (
        <div ref={reelsRef} className="space-y-6">
          {reels.length === 0 ? (
            <div className="text-center py-16">
              <Film className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-xl font-bold mb-2">Belum ada Reels</h3>
              <p className="text-gray-400 mb-6">Upload video reels pertama Anda</p>
              {isAdmin && (
                <button
                  onClick={() => setShowReelsUploadModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-pink-600 to-orange-600 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Upload Reels Pertama
                </button>
              )}
            </div>
          ) : (
            reels.map((reel) => (
              <div
                key={reel.id}
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden border border-gray-700"
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-500">
                      <img 
                        src="/ppig.jpg" 
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold">{reel.username}</div>
                      <div className="text-xs text-gray-400">{reel.date}</div>
                    </div>
                  </div>
                  
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteReel(reel.id)}
                      className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors"
                      title="Hapus reel"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  )}
                </div>
                
                <div className="relative">
                  <div 
                    className="relative aspect-[9/16] max-h-[600px] mx-auto bg-black cursor-pointer"
                    onClick={() => handleReelView(reels.indexOf(reel))}
                  >
                    <video
                      ref={el => reelVideoRefs.current[reel.id] = el}
                      src={reel.mediaData}
                      className="w-full h-full object-contain"
                      playsInline
                      muted
                    />
                    
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 opacity-0 hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleReelPlay(reel.id);
                        }}
                        className="p-3 bg-black/50 rounded-full"
                      >
                        {reelPlaying[reel.id] ? (
                          <Pause className="w-6 h-6" />
                        ) : (
                          <Play className="w-6 h-6" />
                        )}
                      </button>
                    </div>
                    
                    <div className="absolute top-4 right-4">
                      <div className="flex flex-col items-center gap-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReelLike(reel.id);
                          }}
                          className={`flex flex-col items-center ${
                            reel.liked ? 'text-pink-500' : 'text-white hover:text-gray-300'
                          }`}
                        >
                          <Heart className={`w-6 h-6 ${reel.liked ? 'fill-current' : ''}`} />
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowCommentModal({ id: reel.id, type: 'reels' });
                          }}
                          className="flex flex-col items-center text-white hover:text-gray-300"
                        >
                          <MessageCircle className="w-6 h-6" />
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSharePost(reel.id, 'reels');
                          }}
                          className="flex flex-col items-center text-white hover:text-gray-300"
                        >
                          <Share2 className="w-6 h-6" />
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSavePost(reel.id, 'reels');
                          }}
                          className={`flex flex-col items-center ${
                            reel.saved ? 'text-yellow-500' : 'text-white hover:text-gray-300'
                          }`}
                        >
                          {reel.saved ? (
                            <BookmarkCheck className="w-6 h-6 fill-current" />
                          ) : (
                            <Bookmark className="w-6 h-6" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-4 left-4">
                      <div className="flex items-center gap-2 text-white">
                        <Music className="w-4 h-4" />
                        <span className="text-sm">{reel.music}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-bold">{reel.caption}</div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-2">{reel.description}</p>
                  
                  <div className="text-xs text-gray-500 flex items-center justify-between mt-2">
                    <span>{reel.duration ? `${reel.duration} detik` : 'Video'}</span>
                    <span className="flex items-center gap-1">
                      <HardDrive className="w-3 h-3" />
                      {reel.fileSize}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'tagged' && (
        <div className="space-y-6">
          {savedPosts.length === 0 ? (
            <div className="text-center py-16">
              <Bookmark className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-xl font-bold mb-2">Belum ada postingan tersimpan</h3>
              <p className="text-gray-400">Simpan postingan favorit Anda untuk dilihat nanti</p>
            </div>
          ) : (
            savedPosts.map((post) => (
              <div
                key={post.id}
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden border border-gray-700"
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500">
                      <img 
                        src="/ppig.jpg" 
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold">{post.username}</div>
                      <div className="text-xs text-gray-400">
                        {post.date} • {post.source === 'grid' ? 'Galeri' : 'Reels'}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleSavePost(post.id, post.source)}
                    className="text-yellow-500"
                    title="Hapus dari tersimpan"
                  >
                    <BookmarkCheck className="w-5 h-5 fill-current" />
                  </button>
                </div>
                
                <div 
                  className="relative cursor-pointer aspect-square bg-gray-900"
                  onClick={() => {
                    if (post.source === 'grid') {
                      setShowPostDetail({ post, type: post.source });
                    } else if (post.source === 'reels') {
                      const reelIndex = reels.findIndex(r => r.id === post.id);
                      if (reelIndex !== -1) handleReelView(reelIndex);
                    }
                  }}
                >
                  {post.type === 'video' ? (
                    <video
                      src={post.mediaData}
                      className="w-full h-full object-cover"
                      playsInline
                      muted
                    />
                  ) : (
                    <img
                      src={post.mediaData}
                      alt={post.caption}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                
                <div className="p-4">
                  <div className="text-sm mb-2">
                    <span className="font-bold">{post.username}</span>
                    <span className="ml-2">{post.caption}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Heart className={`w-3 h-3 ${post.liked ? 'fill-pink-500 text-pink-500' : ''}`} />
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                      </div>
                    </div>
                    <span className="flex items-center gap-1">
                      <HardDrive className="w-3 h-3" />
                      {post.fileSize}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );

  const renderGridUploadModal = () => (
    showGridUploadModal && (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl max-w-md w-full border border-gray-700 max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold">Upload ke Galeri Utama</h3>
                <p className="text-sm text-gray-400">
                  Postingan akan muncul di grid galeri utama<br />
                  Maksimal {formatFileSize(MAX_FILE_SIZE)}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowGridUploadModal(false);
                  setGridUploadData({ caption: '', type: 'image', file: null, preview: null, fileSize: 0 });
                }}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {gridUploadData.preview ? (
              <div className="mb-6">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-800">
                  {gridUploadData.type === 'video' ? (
                    <video
                      src={gridUploadData.preview}
                      className="w-full h-full object-cover"
                      controls
                    />
                  ) : (
                    <img
                      src={gridUploadData.preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="mt-2 text-sm text-gray-400 text-center">
                  {gridUploadData.file?.name} • {gridUploadData.type} • {formatFileSize(gridUploadData.fileSize)}
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <div 
                  onClick={() => gridFileInputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-gray-700 flex flex-col items-center justify-center p-8 cursor-pointer hover:border-gray-600 transition-colors"
                >
                  <Upload className="w-12 h-12 text-gray-600 mb-4" />
                  <p className="text-gray-400 text-center mb-2">
                    Upload foto/video untuk Galeri Utama
                  </p>
                  <p className="text-xs text-gray-500 text-center">
                    Maksimal {formatFileSize(MAX_FILE_SIZE)}<br />
                    JPG, PNG, WebP, MP4, WebM
                  </p>
                </div>
              </div>
            )}
            
            <input
              ref={gridFileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={(e) => handleFileSelect(e, 'grid')}
              className="hidden"
            />
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Caption</label>
              <textarea
                value={gridUploadData.caption}
                onChange={(e) => setGridUploadData({...gridUploadData, caption: e.target.value})}
                placeholder="Tulis caption untuk postingan galeri..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>
            
            <button
              onClick={handleUploadGridPost}
              disabled={uploadingGrid || !gridUploadData.file}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploadingGrid ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload ke Galeri Utama
                </>
              )}
            </button>
            
            <div className="mt-4 text-xs text-gray-500 text-center">
              Postingan akan muncul di grid galeri utama dan bisa dikomentari oleh semua pengunjung
            </div>
          </div>
        </div>
      </div>
    )
  );

  const renderReelsUploadModal = () => (
    showReelsUploadModal && (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl max-w-md w-full border border-gray-700 max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold">Upload Reels</h3>
                <p className="text-sm text-gray-400">
                  Upload video pendek untuk Reels<br />
                  Maksimal {formatFileSize(MAX_REELS_SIZE)}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowReelsUploadModal(false);
                  setReelsUploadData({ 
                    caption: '', 
                    description: '',
                    type: 'video', 
                    file: null, 
                    preview: null, 
                    fileSize: 0,
                    music: 'Original Sound - XI PPLG 1',
                    duration: 0
                  });
                }}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {reelsUploadData.preview ? (
              <div className="mb-6">
                <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-gray-800">
                  <video
                    src={reelsUploadData.preview}
                    className="w-full h-full object-contain"
                    controls
                  />
                </div>
                <div className="mt-2 text-sm text-gray-400 text-center">
                  {reelsUploadData.file?.name} • Video • {formatFileSize(reelsUploadData.fileSize)}
                  {reelsUploadData.duration > 0 && ` • ${reelsUploadData.duration} detik`}
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <div 
                  onClick={() => reelsFileInputRef.current?.click()}
                  className="aspect-[9/16] rounded-xl border-2 border-dashed border-gray-700 flex flex-col items-center justify-center p-8 cursor-pointer hover:border-gray-600 transition-colors"
                >
                  <Video className="w-12 h-12 text-gray-600 mb-4" />
                  <p className="text-gray-400 text-center mb-2">
                    Upload video untuk Reels
                  </p>
                  <p className="text-xs text-gray-500 text-center">
                    Maksimal {formatFileSize(MAX_REELS_SIZE)}<br />
                    Format video: MP4, WebM
                  </p>
                </div>
              </div>
            )}
            
            <input
              ref={reelsFileInputRef}
              type="file"
              accept="video/*"
              onChange={(e) => handleFileSelect(e, 'reels')}
              className="hidden"
            />
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Judul / Caption</label>
              <input
                type="text"
                value={reelsUploadData.caption}
                onChange={(e) => setReelsUploadData({...reelsUploadData, caption: e.target.value})}
                placeholder="Judul reel yang menarik..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Deskripsi</label>
              <textarea
                value={reelsUploadData.description}
                onChange={(e) => setReelsUploadData({...reelsUploadData, description: e.target.value})}
                placeholder="Tambahkan deskripsi..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                rows="2"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Musik / Sound</label>
              <input
                type="text"
                value={reelsUploadData.music}
                onChange={(e) => setReelsUploadData({...reelsUploadData, music: e.target.value})}
                placeholder="Nama musik atau sound..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            
            <button
              onClick={handleUploadReels}
              disabled={uploadingReels || !reelsUploadData.file}
              className="w-full py-3 bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploadingReels ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Video className="w-5 h-5" />
                  Upload Reels
                </>
              )}
            </button>
            
            <div className="mt-4 text-xs text-gray-500 text-center">
              Reels akan muncul di tab Reels dan bisa dikomentari oleh semua pengunjung
            </div>
          </div>
        </div>
      </div>
    )
  );

  const renderCommentModal = () => (
    showCommentModal && (
      <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-gray-700">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Komentar
              </h3>
              <button
                onClick={() => {
                  setShowCommentModal(null);
                  setReplyingTo(null);
                  setEditCommentId(null);
                  setNewComment('');
                }}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            {(() => {
              let post;
              if (showCommentModal.type === 'grid') {
                post = gridPosts.find(p => p.id === showCommentModal.id);
              } else if (showCommentModal.type === 'reels') {
                post = reels.find(p => p.id === showCommentModal.id);
              }
              
              if (!post) return null;
              
              return (
                <>
                  <div className="mb-6 p-4 bg-gray-800/50 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img 
                          src="/ppig.jpg" 
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-bold">{post.username}</div>
                        <div className="text-sm text-gray-400">{post.date}</div>
                      </div>
                    </div>
                    <p className="text-gray-300">{post.caption}</p>
                  </div>
                  
                  <div className="space-y-6">
                    {post.comments?.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Belum ada komentar</p>
                        <p className="text-sm mt-1">Jadilah yang pertama berkomentar!</p>
                      </div>
                    ) : (
                      post.comments?.map((comment) => (
                        <div key={comment.id} className="space-y-4">
                          <div className={`p-4 rounded-xl ${
                            comment.isAdmin ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-gray-800/50'
                          }`}>
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  comment.isAdmin 
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                                    : 'bg-gray-700'
                                }`}>
                                  <User className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                  <div className="font-bold flex items-center gap-2">
                                    {comment.author}
                                    {comment.isAdmin && (
                                      <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                                        ADMIN
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {comment.date}
                                    {comment.edited && <span className="ml-2 text-gray-500">(diedit)</span>}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {(isAdmin || comment.username === 'visitor') && (
                                  <>
                                    <button
                                      onClick={() => {
                                        setEditCommentId(comment.id);
                                        setNewComment(comment.text);
                                      }}
                                      className="p-1 hover:bg-gray-700 rounded"
                                      title="Edit komentar"
                                    >
                                      <Edit className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteComment(post.id, comment.id, showCommentModal.type)}
                                      className="p-1 hover:bg-gray-700 rounded"
                                      title="Hapus komentar"
                                    >
                                      <Trash2 className="w-3 h-3 text-red-400" />
                                    </button>
                                  </>
                                )}
                                {isAdmin && !comment.parentId && (
                                  <button
                                    onClick={() => setReplyingTo(comment.id)}
                                    className="p-1 hover:bg-gray-700 rounded"
                                    title="Balas komentar"
                                  >
                                    <Reply className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-gray-300 ml-10">{comment.text}</div>
                          </div>
                          
                          {replyingTo === comment.id && (
                            <div className="ml-8">
                              <div className="flex items-center gap-2 mb-2">
                                <Reply className="w-4 h-4 text-blue-400 rotate-180" />
                                <span className="text-sm text-blue-400">Membalas {comment.author}</span>
                              </div>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={newComment}
                                  onChange={(e) => setNewComment(e.target.value)}
                                  placeholder="Tulis balasan..."
                                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                      e.preventDefault();
                                      handleAddComment(post.id, newComment, comment.id, false, null, showCommentModal.type);
                                    }
                                  }}
                                />
                                <button
                                  onClick={() => handleAddComment(post.id, newComment, comment.id, false, null, showCommentModal.type)}
                                  disabled={!newComment.trim()}
                                  className="px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                  <Send className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          )}
                          
                          {comment.replies?.map((reply) => (
                            <div key={reply.id} className="ml-8">
                              <div className="p-3 rounded-xl bg-gray-800/30">
                                <div className="flex items-start justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                      reply.isAdmin 
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                                        : 'bg-gray-700'
                                    }`}>
                                      <User className="w-3 h-3 text-white" />
                                    </div>
                                    <div>
                                      <div className="font-bold text-sm flex items-center gap-1">
                                        {reply.author}
                                        {reply.isAdmin && (
                                          <span className="px-1.5 py-0.5 bg-blue-500 text-white text-[10px] rounded-full">
                                            ADMIN
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-xs text-gray-400">{reply.date}</div>
                                    </div>
                                  </div>
                                  
                                  {(isAdmin || reply.username === 'visitor') && (
                                    <button
                                      onClick={() => handleDeleteComment(post.id, reply.id, showCommentModal.type)}
                                      className="p-1 hover:bg-gray-700 rounded"
                                      title="Hapus balasan"
                                    >
                                      <Trash2 className="w-3 h-3 text-red-400" />
                                    </button>
                                  )}
                                </div>
                                <div className="text-sm text-gray-300 ml-8">{reply.text}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))
                    )}
                  </div>
                </>
              );
            })()}
          </div>
          
          <div className="p-6 border-t border-gray-800">
            {editCommentId ? (
              <div className="mb-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Edit className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-yellow-400">Mengedit komentar</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Edit komentar..."
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <button
                    onClick={() => handleAddComment(showCommentModal.id, newComment, null, true, editCommentId, showCommentModal.type)}
                    disabled={!newComment.trim()}
                    className="px-4 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setEditCommentId(null);
                      setNewComment('');
                    }}
                    className="px-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={replyingTo ? "Tulis balasan..." : "Tulis komentar..."}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment(showCommentModal.id, newComment, replyingTo, false, null, showCommentModal.type);
                    }
                  }}
                />
                <button
                  onClick={() => handleAddComment(showCommentModal.id, newComment, replyingTo, false, null, showCommentModal.type)}
                  disabled={!newComment.trim()}
                  className="px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            )}
            
            <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
              <AlertCircle className="w-3 h-3" />
              {isAdmin 
                ? 'Anda sebagai admin dapat menghapus dan membalas semua komentar'
                : 'Semua pengunjung bisa berkomentar. Admin dapat menghapus komentar yang tidak pantas.'
              }
            </div>
          </div>
        </div>
      </div>
    )
  );

  const renderReelViewer = () => (
    showReelViewer !== null && reels[showReelViewer] && (
      <div className="fixed inset-0 bg-black z-50">
        <button
          onClick={() => setShowReelViewer(null)}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="h-full flex items-center justify-center">
          <div className="relative aspect-[9/16] max-h-[90vh] w-full max-w-md mx-auto">
            <video
              ref={el => reelVideoRefs.current[reels[showReelViewer].id] = el}
              src={reels[showReelViewer].mediaData}
              className="w-full h-full object-contain"
              autoPlay
              muted={!reelVolume[reels[showReelViewer].id]}
              playsInline
              loop
              onPlay={() => setReelPlaying(prev => ({ ...prev, [reels[showReelViewer].id]: true }))}
              onPause={() => setReelPlaying(prev => ({ ...prev, [reels[showReelViewer].id]: false }))}
            />
            
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4">
              <button
                onClick={() => toggleReelPlay(reels[showReelViewer].id)}
                className="p-3 bg-black/50 rounded-full"
              >
                {reelPlaying[reels[showReelViewer].id] ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>
              <button
                onClick={() => toggleReelVolume(reels[showReelViewer].id)}
                className="p-3 bg-black/50 rounded-full"
              >
                {reelVolume[reels[showReelViewer].id] ? (
                  <Volume2 className="w-6 h-6" />
                ) : (
                  <VolumeX className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
                  <img 
                    src="/ppig.jpg" 
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-bold">{reels[showReelViewer].username}</div>
                  <div className="text-sm text-gray-300">{reels[showReelViewer].date}</div>
                </div>
              </div>
              
              <h3 className="text-lg font-bold mb-2">{reels[showReelViewer].caption}</h3>
              <p className="text-gray-300 mb-4">{reels[showReelViewer].description}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Music className="w-4 h-4" />
                  <span>{reels[showReelViewer].music}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{reels[showReelViewer].duration} detik</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => handleReelLike(reels[showReelViewer].id)}
                className={`flex flex-col items-center ${
                  reels[showReelViewer].liked ? 'text-pink-500' : 'text-white'
                }`}
              >
                <Heart className={`w-8 h-8 ${reels[showReelViewer].liked ? 'fill-current' : ''}`} />
              </button>
              
              <button
                onClick={() => {
                  setShowReelViewer(null);
                  setShowCommentModal({ id: reels[showReelViewer].id, type: 'reels' });
                }}
                className="flex flex-col items-center text-white"
              >
                <MessageCircle className="w-8 h-8" />
              </button>
              
              <button
                onClick={() => handleSharePost(reels[showReelViewer].id, 'reels')}
                className="flex flex-col items-center text-white"
              >
                <Share2 className="w-8 h-8" />
              </button>
              
              <button
                onClick={() => handleSavePost(reels[showReelViewer].id, 'reels')}
                className={`flex flex-col items-center ${
                  reels[showReelViewer].saved ? 'text-yellow-500' : 'text-white'
                }`}
              >
                {reels[showReelViewer].saved ? (
                  <BookmarkCheck className="w-8 h-8 fill-current" />
                ) : (
                  <Bookmark className="w-8 h-8" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  const renderShareModal = () => (
    showShareModal && (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl max-w-md w-full border border-gray-700">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Bagikan</h3>
              <button
                onClick={() => setShowShareModal(null)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    const shareUrl = `${window.location.origin}/galeri?post=${showShareModal.post.id}`;
                    copyToClipboard(shareUrl);
                  }}
                  className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
                >
                  <Link className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium">Salin Link</span>
                </button>
                
                <button
                  onClick={() => downloadMedia(showShareModal.post.mediaData, showShareModal.post.fileName)}
                  className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
                >
                  <Download className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium">Download</span>
                </button>
                
                {navigator.share && (
                  <button
                    onClick={() => {
                      navigator.share({
                        title: showShareModal.post.caption,
                        text: `Lihat postingan dari ${showShareModal.post.username}`,
                        url: window.location.href,
                      });
                    }}
                    className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
                  >
                    <Share className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Share</span>
                  </button>
                )}
              </div>
              
              <div className="p-4 bg-gray-800/50 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    {showShareModal.post.type === 'video' ? (
                      <video
                        src={showShareModal.post.mediaData}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={showShareModal.post.mediaData}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold">{showShareModal.post.username}</div>
                    <p className="text-sm text-gray-300 line-clamp-2">{showShareModal.post.caption}</p>
                    <div className="text-xs text-gray-400 mt-1">
                      {showShareModal.post.fileSize}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );

  const renderPostDetail = () => (
    showPostDetail && (
      <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row border border-gray-700">
          <div className="md:w-2/3 bg-black">
            {showPostDetail.post.type === 'video' ? (
              <video
                src={showPostDetail.post.mediaData}
                className="w-full h-full object-contain max-h-[70vh]"
                controls
                autoPlay
              />
            ) : (
              <img
                src={showPostDetail.post.mediaData}
                alt={showPostDetail.post.caption}
                className="w-full h-full object-contain max-h-[70vh]"
              />
            )}
          </div>
          
          <div className="md:w-1/3 flex flex-col border-t md:border-t-0 md:border-l border-gray-800">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500">
                  <img 
                    src="/ppig.jpg" 
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-bold">{showPostDetail.post.username}</div>
                  <div className="text-xs text-gray-400">{showPostDetail.post.date}</div>
                </div>
              </div>
              <button
                onClick={() => setShowPostDetail(null)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <div className="mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <img 
                      src="/ppig.jpg" 
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-bold">{showPostDetail.post.username}</div>
                    <p className="text-gray-300">{showPostDetail.post.caption}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {showPostDetail.post.comments?.slice(0, 10).map((comment) => (
                  <div key={comment.id} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      comment.isAdmin 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                        : 'bg-gray-700'
                    }`}>
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-sm flex items-center gap-1">
                        {comment.author}
                        {comment.isAdmin && (
                          <span className="px-1.5 py-0.5 bg-blue-500 text-white text-[10px] rounded-full">
                            ADMIN
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-300">{comment.text}</p>
                      <div className="text-xs text-gray-400 mt-1">{comment.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      if (showPostDetail.type === 'grid') {
                        handleGridPostLike(showPostDetail.post.id);
                      }
                    }}
                    className={`flex items-center gap-2 ${
                      showPostDetail.post.liked ? 'text-pink-500' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${showPostDetail.post.liked ? 'fill-current' : ''}`} />
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowPostDetail(null);
                      setShowCommentModal({ id: showPostDetail.post.id, type: showPostDetail.type });
                    }}
                    className="flex items-center gap-2 text-gray-400 hover:text-white"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => handleSharePost(showPostDetail.post.id, showPostDetail.type)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
                
                <button
                  onClick={() => handleSavePost(showPostDetail.post.id, showPostDetail.type)}
                  className={`${showPostDetail.post.saved ? 'text-yellow-500' : 'text-gray-400 hover:text-white'}`}
                >
                  {showPostDetail.post.saved ? (
                    <BookmarkCheck className="w-5 h-5 fill-current" />
                  ) : (
                    <Bookmark className="w-5 h-5" />
                  )}
                </button>
              </div>
              
              <div className="text-xs text-gray-500 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-3 h-3" />
                  <span>{showPostDetail.post.fileSize}</span>
                </div>
                <span>{showPostDetail.post.uploaded || 'Baru saja'}</span>
              </div>
              
              {isAdmin && (
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <button
                    onClick={() => {
                      handleDeleteGridPost(showPostDetail.post.id);
                      setShowPostDetail(null);
                    }}
                    className="w-full py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Hapus Postingan
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      {renderNavbar()}
      
      <div className="pt-16 pb-24">
        <div className="container mx-auto px-4 pt-12">
          {renderProfileInfo()}
          {renderTabs()}
          {renderAdminControls()}
          {renderGalleryGrid()}
        </div>
      </div>

      {/* Modals */}
      {renderGridUploadModal()}
      {renderReelsUploadModal()}
      {renderCommentModal()}
      {renderReelViewer()}
      {renderShareModal()}
      {renderPostDetail()}
    </div>
  );
};

export default Galeri;