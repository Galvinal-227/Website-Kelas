import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ExternalLink, 
  Code2, 
  Target, 
  Cpu, 
  Globe, 
  Database, 
  Smartphone,
  Sparkles,
  Award,
  Users,
  Briefcase,
  BookOpen,
  Star,
  Maximize2,
  Minimize2,
  Shield
} from 'lucide-react';

const StudentModal = ({ student, isOpen, onClose }) => {
  const modalRef = useRef(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (showLightbox) {
          setShowLightbox(false);
        } else {
          onClose();
        }
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, showLightbox]);
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        if (showLightbox) {
          setShowLightbox(false);
        } else {
          onClose();
        }
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, showLightbox]);

  if (!student) return null;

  const getInterestIcon = (interest) => {
    const interestLower = interest.toLowerCase();
    if (interestLower.includes('web')) return <Globe className="w-4 h-4" />;
    if (interestLower.includes('mobile')) return <Smartphone className="w-4 h-4" />;
    if (interestLower.includes('ui') || interestLower.includes('design')) return <Sparkles className="w-4 h-4" />;
    if (interestLower.includes('game')) return <Cpu className="w-4 h-4" />;
    if (interestLower.includes('database')) return <Database className="w-4 h-4" />;
    return <Target className="w-4 h-4" />;
  };

  const getSkillIcon = (skill) => {
    const skillLower = skill.toLowerCase();
    if (skillLower.includes('react')) return <Code2 className="w-4 h-4" />;
    if (skillLower.includes('js') || skillLower.includes('javascript')) return <Code2 className="w-4 h-4" />;
    if (skillLower.includes('html') || skillLower.includes('css')) return <Globe className="w-4 h-4" />;
    if (skillLower.includes('php') || skillLower.includes('laravel')) return <Database className="w-4 h-4" />;
    if (skillLower.includes('node')) return <Cpu className="w-4 h-4" />;
    if (skillLower.includes('flutter') || skillLower.includes('kotlin') || skillLower.includes('swift')) return <Smartphone className="w-4 h-4" />;
    if (skillLower.includes('unity') || skillLower.includes('unreal')) return <Cpu className="w-4 h-4" />;
    if (skillLower.includes('figma') || skillLower.includes('adobe')) return <Sparkles className="w-4 h-4" />;
    return <Code2 className="w-4 h-4" />;
  };

  // Fungsi untuk mencegah save gambar
  const preventImageSave = (e) => {
    e.preventDefault();
    return false;
  };

  // Fungsi untuk render avatar/foto
  const renderAvatar = () => {
    if (!student.avatar) {
      return (
        <div 
          className="w-full h-full rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setShowLightbox(true)}
        >
          <span className="text-2xl font-bold text-white">
            {student.name.charAt(0)}
          </span>
        </div>
      );
    }

    // Jika avatar adalah URL gambar
    if (typeof student.avatar === 'string' && 
        (student.avatar.startsWith('http') || 
         student.avatar.startsWith('/') || 
         student.avatar.includes('.') || 
         student.avatar.startsWith('data:image'))) {
      return (
        <div 
          className="relative group"
          onClick={() => setShowLightbox(true)}
        >
          <img 
            src={student.avatar} 
            alt={student.name}
            className="w-full h-full object-cover rounded-full cursor-pointer group-hover:opacity-80 transition-opacity duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              const parent = e.target.parentElement;
              const fallback = document.createElement('div');
              fallback.className = 'w-full h-full rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity';
              fallback.innerHTML = `<span class="text-2xl font-bold text-white">${student.name.charAt(0)}</span>`;
              parent.appendChild(fallback);
            }}
            onLoad={() => setImageLoaded(true)}
          />
          {imageLoaded && (
            <motion.div 
              className="absolute inset-0 rounded-full bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              <motion.div 
                className="p-2 bg-black/50 rounded-full backdrop-blur-sm pointer-events-none"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Maximize2 className="w-4 h-4 text-white" />
              </motion.div>
            </motion.div>
          )}
        </div>
      );
    }

    // Jika avatar adalah SVG string atau komponen React
    if (typeof student.avatar === 'string' && student.avatar.includes('<')) {
      return (
        <div 
          className="w-full h-full rounded-full overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setShowLightbox(true)}
          dangerouslySetInnerHTML={{ __html: student.avatar }} 
        />
      );
    }

    // Jika avatar adalah komponen React
    if (React.isValidElement(student.avatar)) {
      return (
        <div 
          className="w-full h-full rounded-full overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setShowLightbox(true)}
        >
          {student.avatar}
        </div>
      );
    }

    // Fallback ke initial
    return (
      <div 
        className="w-full h-full rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => setShowLightbox(true)}
      >
        <span className="text-2xl font-bold text-white">
          {student.name.charAt(0)}
        </span>
      </div>
    );
  };

  return (
    <>
      {/* Main Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              {/* Modal */}
              <motion.div
                ref={modalRef}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25 }}
                className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border-2 border-orange-500/30 max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-800">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <motion.div 
                        className="relative group"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full blur-xl opacity-50"></div>
                        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 p-1">
                          <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                            {renderAvatar()}
                          </div>
                        </div>
                        {/* Tooltip untuk klik */}
                        <motion.div 
                          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs px-3 py-1 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20"
                          whileHover={{ y: -5 }}
                        >
                          Klik untuk memperbesar
                        </motion.div>
                      </motion.div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{student.name}</h2>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="px-3 py-1 bg-gradient-to-r from-orange-500/10 to-orange-600/10 text-orange-400 text-sm font-medium rounded-full border border-orange-500/20">
                            {student.nickname}
                          </span>
                          <span className="text-gray-400 text-sm">ID: {student.id.toString().padStart(2, '0')}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Left Column */}
                      <div className="space-y-8">
                        {/* Bidang Minat */}
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <Target className="w-5 h-5 text-orange-400" />
                            <h3 className="text-lg font-bold text-white">BIDANG MINAT</h3>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            {student.interests?.map((interest, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700"
                              >
                                {getInterestIcon(interest)}
                                <span className="text-gray-200 font-medium">{interest}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Right Column */}
                      <div className="space-y-8">
                        {/* Keahlian Teknis */}
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <Code2 className="w-5 h-5 text-orange-400" />
                            <h3 className="text-lg font-bold text-white">KEAHLIAN TEKNIS</h3>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {student.skills?.map((skill, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-lg border border-gray-700"
                              >
                                {getSkillIcon(skill)}
                                <span className="text-gray-200 text-sm">{skill}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Portfolio Button */}
                        <div className="mt-6">
                          <a
                            href={student.portfolioUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full"
                          >
                            <button className="w-full group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={!student.portfolioUrl}>
                              <ExternalLink className="w-5 h-5" />
                              <span>LIHAT PORTFOLIO</span>
                              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                                <ExternalLink className="w-3 h-3 text-white" />
                              </div>
                            </button>
                          </a>
                          <p className="text-gray-400 text-sm text-center mt-3">
                            {student.portfolioUrl ? 
                              "Klik untuk melihat karya dan proyek yang telah dikerjakan" : 
                              "Portfolio belum tersedia"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-800 bg-gray-900/30">
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">
                      XI PPLG 1 • SMKN 2 Nganjuk • Tahun Ajaran 2024/2025
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Lightbox Modal - Optimized for 4K */}
      <AnimatePresence>
        {showLightbox && student.avatar && typeof student.avatar === 'string' && 
         (student.avatar.startsWith('http') || student.avatar.startsWith('/') || 
          student.avatar.includes('.') || student.avatar.startsWith('data:image')) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[60] flex items-center justify-center"
            onClick={() => setShowLightbox(false)}
          >

            {/* Image Container - Full 4K Optimization */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative w-full h-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Protective Overlay (minimal untuk menjaga kualitas 4K) */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-10"
                style={{
                  background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)',
                }}
              />

              {/* High Resolution Image */}
              <div 
                className="relative w-full h-full flex items-center justify-center p-2 md:p-4"
                onContextMenu={preventImageSave}
                onDragStart={preventImageSave}
                style={{
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none',
                }}
              >
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="max-w-full max-h-full object-contain"
                  style={{
                    pointerEvents: 'none',
                    WebkitTouchCallout: 'none',
                    imageRendering: 'crisp-edges',
                    WebkitImageRendering: 'crisp-edges',
                  }}
                  onContextMenu={preventImageSave}
                  onDragStart={preventImageSave}
                />
              </div>

              {/* Footer Controls */}
              <motion.div 
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent pt-16 pb-4 px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="max-w-2xl mx-auto text-center">
                  <p className="text-white/90 text-sm mb-3 md:text-base">
                    <span className="inline-flex items-center gap-1">
                          {student.name}
                    </span>
                  </p>
                  
                  <div className="flex items-center justify-center gap-3 mt-2">
                    <motion.button
                      onClick={() => setShowLightbox(false)}
                      className="p-2.5 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all border border-white/20"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Minimize"
                    >
                      <Minimize2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* Fallback Lightbox untuk avatar non-gambar */}
        {showLightbox && (!student.avatar || typeof student.avatar !== 'string' || 
         (!student.avatar.startsWith('http') && !student.avatar.startsWith('/') && 
          !student.avatar.includes('.') && !student.avatar.startsWith('data:image'))) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4"
            onClick={() => setShowLightbox(false)}
          >
            <motion.button
              onClick={() => setShowLightbox(false)}
              className="absolute top-4 right-4 p-3 bg-black/70 rounded-full text-white hover:bg-black/90 transition-colors z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6" />
            </motion.button>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl border-2 border-orange-500/30 p-6 md:p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 p-2 mb-6">
                  <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                    {renderAvatar()}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white text-center mb-2">{student.name}</h3>
                <p className="text-gray-300 text-center mb-6">Foto profil tidak tersedia dalam resolusi tinggi</p>
                <button
                  onClick={() => setShowLightbox(false)}
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all w-full"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StudentModal;