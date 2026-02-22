import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, Phone, MapPin, User, MessageSquare, Send, 
  CheckCircle, AlertCircle, Instagram, Twitter, 
  MessageCircle, Paperclip, Loader, Home,
  ChevronDown, ChevronUp, Globe, ExternalLink
} from 'lucide-react';
import emailjs from '@emailjs/browser';
import { motion, AnimatePresence } from 'framer-motion';

emailjs.init("HOWiXGN-zDmo063ZS"); 

const Kontak = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [attachment, setAttachment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [showMap, setShowMap] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const formRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) { 
        alert('File terlalu besar! Maksimal 100MB.');
        return;
      }
      setAttachment(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus('error');
      setSubmitMessage('Harap isi semua field yang wajib diisi!');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject || `Pesan dari ${formData.name}`,
        message: formData.message,
        to_name: 'XI PPLG 1',
        reply_to: formData.email,
        date: new Date().toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        time: new Date().toLocaleTimeString('id-ID')
      };

      const result = await emailjs.send(
        'service_njv03cr',
        'template_jk6dacb',
        templateParams
      );

      if (result.status === 200) {
        setSubmitStatus('success');
        setSubmitMessage('Pesan berhasil dikirim! Kami akan membalas segera.');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        setAttachment(null);
      } else {
        throw new Error('Gagal mengirim email');
      }
    } catch (error) {
      console.error('EmailJS Error:', error);
      setSubmitStatus('error');
      setSubmitMessage('Gagal mengirim pesan. Silakan coba lagi nanti.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setSubmitStatus(null);
        setSubmitMessage('');
      }, 5000);
    }
  };

  const socialMedia = [
    {
      name: 'Instagram PPLG 1 SMKN 2 Nganjuk',
      icon: <Instagram className="w-5 h-5" />,
      url: 'https://www.instagram.com/elevoneclass_/',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
  ];

  const faqs = [
    {
      question: 'Bagaimana cara bergabung dengan kelas XI PPLG 1?',
      answer: 'Siswa yang ingin bergabung harus melalui proses seleksi penerimaan peserta didik baru (PPDB) di SMKN 2 Nganjuk. Informasi lengkap bisa dilihat di website resmi sekolah.'
    },
    {
      question: 'Apa saja jurusan yang ada di SMKN 2 Nganjuk?',
      answer: 'SMKN 2 Nganjuk memiliki beberapa jurusan: PPLG (Pengembangan Perangkat Lunak dan Gim), TKJ (Teknik Komputer dan Jaringan), AKL (Akuntansi dan Keuangan Lembaga), MP (Managemen Perkantoran), BDP (Bisnis Daring dan Pemasaran), dan TKKR (Tata Kecantikan Kulit dan Rambut).'
    },
    {
      question: 'Apa saja kegiatan ekstrakurikuler yang tersedia?',
      answer: 'Kami memiliki berbagai ekstrakurikuler: Pramuka, Paskibra, Olahraga (Futsal, Basket, Voli), Seni (Tari, Musik, Teater), Majelis Talim, Boardcasting dan masih banyak lagi...'
    },
    {
      question: 'Bagaimana prosedur magang untuk siswa PPLG?',
      answer: 'Siswa kelas XI PPLG akan melaksanakan Praktik Kerja Lapangan (PKL) di semester 5 / Kelas 12 Semester 1, Kurang lebih selama 6 bulan di beberapa tempat yang diminati beberapa anak atau instansi pemerintah yang bekerja sama dengan sekolah.'
    },
    {
      question: 'Apakah ada komunitas alumni?',
      answer: 'Ya, kami memiliki komunitas alumni XI PPLG yang aktif di berbagai platform. Alumni sering memberikan sharing session dan mentoring untuk adik-adik kelas.'
    },
    {
      question: 'Apa saja prestasi yang pernah diraih XI PPLG 1?',
      answer: 'XI PPLG 1 telah meraih berbagai prestasi di tingkat Sekolah, Event Sekolah ada beberapa pertandingan, dan masih banyak lagi.'
    },
    {
      question: 'Bagaimana sistem pembelajaran di kelas PPLG?',
      answer: 'Pembelajaran menggunakan sistem blok (4 jam pelajaran per pertemuan) dengan kombinasi teori dan praktik. Menggunakan project-based learning untuk mengasah kemampuan teknis siswa. dan Juga Diberi Beberapa Project Untuk Dipecahkan / Diselesaikan Secara Individu Maupun Kelompok.'
    },
    {
      question: 'Apa saja fasilitas yang tersedia untuk siswa PPLG?',
      answer: 'Kami memiliki lab komputer terbaru dengan spesifikasi tinggi, akses internet cepat, perangkat jaringan, dan berbagai software development tools yang lengkap.'
    }
  ];

  const toggleFaq = (index) => {
    if (openFaqIndex === index) {
      setOpenFaqIndex(null);
    } else {
      setOpenFaqIndex(index);
    }
  };

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const scaleIn = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.5 }
  };

  const slideIn = {
    initial: { x: -30, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.5 }
  };

  const buttonHover = {
    whileHover: { scale: 1.05, transition: { duration: 0.2 } },
    whileTap: { scale: 0.95 }
  };

  const inputFocus = {
    whileFocus: { scale: 1.02, transition: { duration: 0.2 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pt-16 min-h-screen bg-gradient-to-b from-black to-gray-900 overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-500/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -30, 30, -20, 20, -10, 10, 0],
              opacity: [0.2, 0.5, 0.8, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-3"
      >
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <MessageSquare className="w-6 h-6 text-orange-500" />
            </motion.div>
            <h1 className="text-xl font-bold text-white">Kontak Kami</h1>
          </motion.div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header with floating animation */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            y: [0, -10, 0]
          }}
          transition={{ 
            duration: 0.6,
            y: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          className="text-center mb-12"
          ref={headerRef}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Hubungi Kami
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Jangan ragu untuk menghubungi XI PPLG 1 - SMKN 2 Nganjuk. Kami siap membantu dan merespon setiap pertanyaan Anda.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Contact Form with floating animation */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={scaleIn}
            className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-800 relative overflow-hidden group"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            
            <motion.div 
              className="flex items-center gap-3 mb-6 relative z-10"
              variants={slideIn}
            >
              <motion.div 
                className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Send className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-white">Kirim Pesan</h2>
                <p className="text-gray-400 text-sm">Isi form berikut untuk mengirim pesan</p>
              </div>
            </motion.div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div variants={fadeInUp}>
                  <label className="block text-gray-400 text-sm mb-2">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      Nama Lengkap *
                    </span>
                  </label>
                  <motion.input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="Masukkan nama lengkap"
                    required
                    whileFocus={{
                      scale: 1.02,
                      boxShadow: "0 0 0 2px rgba(249, 115, 22, 0.5)"
                    }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <label className="block text-gray-400 text-sm mb-2">
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      Email 
                    </span>
                  </label>
                  <motion.input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    placeholder="email@contoh.com"
                    required
                    whileFocus={{
                      scale: 1.02,
                      boxShadow: "0 0 0 2px rgba(249, 115, 22, 0.5)"
                    }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.div>
              </div>

              <motion.div variants={fadeInUp}>
                <label className="block text-gray-400 text-sm mb-2">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    Subjek
                  </span>
                </label>
                <motion.input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  placeholder="Subjek pesan (opsional)"
                  whileFocus={{
                    scale: 1.02,
                    boxShadow: "0 0 0 2px rgba(249, 115, 22, 0.5)"
                  }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>

              <motion.div variants={fadeInUp}>
                <label className="block text-gray-400 text-sm mb-2">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    Pesan *
                  </span>
                </label>
                <motion.textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500 resize-none"
                  placeholder="Tulis pesan Anda di sini..."
                  required
                  whileFocus={{
                    scale: 1.02,
                    boxShadow: "0 0 0 2px rgba(249, 115, 22, 0.5)"
                  }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>

              <motion.div variants={fadeInUp}>
                <label className="block text-gray-400 text-sm mb-2">
                  <span className="flex items-center gap-1">
                    <Paperclip className="w-4 h-4" />
                    Lampiran (Opsional)
                  </span>
                  <span className="text-gray-500 text-xs">Maksimal 100MB</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <motion.label
                    htmlFor="file-upload"
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-orange-500 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Pilih File
                  </motion.label>
                  {attachment && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-gray-400 text-sm"
                    >
                      {attachment.name} ({(attachment.size / 1024).toFixed(2)} KB)
                    </motion.span>
                  )}
                </div>
              </motion.div>

              {/* Submit Status with animation */}
              <AnimatePresence>
                {submitStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`p-4 rounded-lg ${submitStatus === 'success' ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}
                  >
                    <div className="flex items-center gap-2">
                      {submitStatus === 'success' ? (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.5 }}
                        >
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </motion.div>
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                      <p className={submitStatus === 'success' ? 'text-green-400' : 'text-red-400'}>
                        {submitMessage}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                animate={{
                  background: isSubmitting 
                    ? ["linear-gradient(to right, #f97316, #ea580c)"]
                    : ["linear-gradient(to right, #f97316, #ea580c)"]
                }}
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader className="w-5 h-5" />
                    </motion.div>
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Kirim Pesan
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Social Media & FAQ */}
          <div className="space-y-8">
            {/* Social Media Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-800"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Media Sosial</h2>
              <div className="space-y-4">
                {socialMedia.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors group relative overflow-hidden"
                    whileHover={{ x: 5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-pink-500/10 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    
                    <div className="flex items-center gap-3 relative z-10">
                      <motion.div 
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${social.color}`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        {social.icon}
                      </motion.div>
                      <div>
                        <h3 className="text-white font-medium">{social.name}</h3>
                        <p className="text-gray-400 text-sm">{social.followers}</p>
                      </div>
                    </div>
                    <motion.div 
                      className="text-gray-400 group-hover:text-orange-500 transition-colors relative z-10"
                      whileHover={{ x: 3 }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </motion.div>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* FAQ Accordion */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-800"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Pertanyaan Umum (FAQ)</h2>
                <motion.span 
                  className="text-gray-400 text-sm"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Klik untuk melihat jawaban
                </motion.span>
              </div>
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border border-gray-800 rounded-lg overflow-hidden"
                  >
                    <motion.button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-4 py-3 bg-gray-800/50 hover:bg-gray-800/70 transition-colors flex items-center justify-between text-left"
                      whileHover={{ backgroundColor: 'rgba(31, 41, 55, 0.7)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-white font-medium">{faq.question}</span>
                      <motion.div
                        animate={{ rotate: openFaqIndex === index ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      </motion.div>
                    </motion.button>
                    
                    <AnimatePresence>
                      {openFaqIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 py-3 border-t border-gray-800">
                            <motion.p 
                              initial={{ y: -10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.1 }}
                              className="text-gray-400 text-sm leading-relaxed"
                            >
                              {faq.answer}
                            </motion.p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-gray-800 mb-12 relative overflow-hidden"
        >
          {/* Map background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '20px 20px'
            }} />
          </div>

          <div className="flex items-center justify-between mb-6 relative z-10">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div 
                className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center"
                animate={{ 
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 0 0 0 rgba(59, 130, 246, 0)',
                    '0 0 0 10px rgba(59, 130, 246, 0.1)',
                    '0 0 0 0 rgba(59, 130, 246, 0)'
                  ]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity 
                }}
              >
                <MapPin className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-white">Lokasi</h2>
                <p className="text-gray-400 text-sm">SMKN 2 Nganjuk, Jawa Timur</p>
              </div>
            </motion.div>
            
            <motion.button
              onClick={toggleMap}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showMap ? 'Sembunyikan Peta' : 'Tampilkan Peta'}
              <motion.div
                animate={{ rotate: showMap ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </motion.button>
          </div>

          <AnimatePresence>
            {showMap && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10"
              >
                {/* Google Maps Embed */}
                <motion.div 
                  className="bg-gray-800 rounded-xl overflow-hidden h-64 md:h-80 mb-4"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.9494771793456!2d111.91120877600314!3d-7.611463492393212!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e784ba254f12d3b%3A0xf884a1373d9024e7!2sSMK%20Negeri%202%20Nganjuk!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="SMKN 2 Nganjuk Location"
                  />
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div 
                    className="space-y-4"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-white font-bold text-lg">Informasi Lokasi</h3>
                    <ul className="space-y-2 text-gray-400">
                      <li className="flex items-start gap-2">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <MapPin className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        </motion.div>
                        <span>
                          <strong className="text-white">Alamat Lengkap:</strong><br />
                          JL. LAWU NO. 3 KRAMAT, Kramat, Kec. Nganjuk, Kab. Nganjuk, Jawa Timur 64419
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Phone className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong className="text-white">Telepon Sekolah:</strong><br />
                          (0358) 321803
                        </span>
                      </li>
                      <li className="flex items-start gap-2 group">
                        <a 
                          href="https://smekdadev.id" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-start gap-2 group/link"
                        >
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Globe className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0 group-hover/link:text-blue-300 transition-colors" />
                          </motion.div>
                          <span>
                            <strong className="text-white">Website Resmi Prodi Gim:</strong><br />
                            <span className="text-blue-400 group-hover/link:text-blue-300 transition-colors inline-flex items-center gap-1">
                              smekdadev.id
                              <motion.div
                                animate={{ x: [0, 3, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                <ExternalLink className="w-3 h-3" />
                              </motion.div>
                            </span>
                          </span>
                        </a>
                      </li>
                    </ul>
                  </motion.div>
                </div>

                <motion.div 
                  className="mt-6 flex justify-center"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.a
                    href="https://maps.app.goo.gl/2y2bYaghCT5QrBf88"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity relative overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Button shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    
                    <MapPin className="w-5 h-5" />
                    Buka di Google Maps
                  </motion.a>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* School Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">SMKN 2 Nganjuk</h3>
          <p className="text-gray-400 max-w-3xl mx-auto mb-6">
            Sekolah Menengah Kejuruan Negeri 2 Nganjuk adalah salah satu SMK favorit di Jawa Timur 
            yang berfokus pada pengembangan kompetensi siswa di bidang teknologi, bisnis, dan administrasi. 
            Kami berkomitmen untuk menghasilkan lulusan yang siap kerja dan berdaya saing global.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Terakreditasi A', 'SMK Blud', 'Sekolah Adiwiyata', 'SMK Unggulan'].map((badge, index) => (
              <motion.span
                key={index}
                className="px-4 py-2 rounded-lg text-sm"
                style={{
                  background: `linear-gradient(45deg, 
                    ${index === 0 ? '#3b82f6' : 
                      index === 1 ? '#10b981' : 
                      index === 2 ? '#8b5cf6' : '#f97316'
                    }20`,
                  color: index === 0 ? '#60a5fa' : 
                         index === 1 ? '#34d399' : 
                         index === 2 ? '#a78bfa' : '#fb923c'
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.1,
                  y: -3,
                  transition: { duration: 0.2 }
                }}
              >
                {badge}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Kontak;