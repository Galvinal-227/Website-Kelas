import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { 
  Code, 
  Users, 
  BookOpen, 
  Award, 
  Monitor, 
  Rocket, 
  Target, 
  Brain,
  Globe,
  Heart,
  Mail,
  Phone,
  Instagram,
  Sparkles,
  ChevronRight,
  Zap,
  Cpu,
  GitBranch,
  Cloud,
  Database,
  Terminal,
  Palette,
  Server,
  Camera
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const teacherPhotos = {
  buPuspita: '/Bupuspita.png',
  pakAndrianto: '/Pakandri.png',
  pakEko: '/Pakeko.png',
  pakYoga: '/Pakyoga.png',
};

const teacherInitials = {
  buPuspita: 'PS',
  pakAndrianto: 'AR',
  pakEko: 'ES',
  pakYoga: 'YA'
};

const FloatingCodeParticles = () => {
  const particles = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const symbols = ['{}', '<>', '()', '[]', '//', '/*', '*/', '=>', '&&', '||', ';', ':', '.', ',', '+', '-', '*', '/', '%', '=', '!=', '=='];
    const colors = ['#f97316', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa'];
    
    particles.current = [];
    
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute pointer-events-none font-mono font-bold';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.color = colors[Math.floor(Math.random() * colors.length)];
      particle.style.fontSize = Math.random() * 12 + 8 + 'px';
      particle.style.opacity = Math.random() * 0.4 + 0.1;
      particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      particle.style.textShadow = '0 0 10px currentColor';
      containerRef.current.appendChild(particle);
      particles.current.push(particle);
      
      // Animate each particle
      gsap.to(particle, {
        y: Math.random() * 100 - 50,
        x: Math.random() * 100 - 50,
        rotation: Math.random() * 360,
        duration: Math.random() * 10 + 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 3
      });
    }
    
    return () => {
      particles.current.forEach(p => p.remove());
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none" />;
};

// Animated Counter Component
const AnimatedCounter = ({ value, suffix = '' }) => {
  const controls = useAnimation();
  const ref = useRef();
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const numValue = parseInt(value);
      controls.start({
        scale: [1, 1.2, 1],
        transition: { duration: 0.5 }
      });
      
      // Animate counting
      const counter = ref.current.querySelector('.counter');
      let start = 0;
      const end = numValue;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          counter.textContent = end + suffix;
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(start) + suffix;
        }
      }, 16);
    }
  }, [isInView, value, suffix, controls]);

  return (
    <motion.div ref={ref} animate={controls} className="relative">
      <span className="counter text-3xl md:text-4xl font-bold text-white mb-2 block">
        0{suffix}
      </span>
    </motion.div>
  );
};

// Teacher Avatar Component dengan ukuran diperbesar
const TeacherAvatar = ({ teacher, index }) => {
  const { name, photoKey } = teacher;
  const photoUrl = teacherPhotos[photoKey];
  const initials = teacherInitials[photoKey] || 
    name.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();

  const colors = [
    'bg-gradient-to-br from-orange-500 to-orange-600',
    'bg-gradient-to-br from-blue-500 to-blue-600', 
    'bg-gradient-to-br from-purple-500 to-purple-600',
    'bg-gradient-to-br from-green-500 to-green-600'
  ];

  const glowColors = [
    'shadow-orange-500/40',
    'shadow-blue-500/40',
    'shadow-purple-500/40',
    'shadow-green-500/40'
  ];

  const handleImageError = (e) => {
    console.log(`Gagal memuat foto: ${photoKey}, ${photoUrl}`);
    e.target.style.display = 'none';
    
    const avatarContainer = e.target.closest('.teacher-avatar-container');
    if (avatarContainer) {
      const fallbackDiv = document.createElement('div');
      fallbackDiv.className = `w-full h-full ${colors[index % colors.length]} flex items-center justify-center rounded-full`;
      fallbackDiv.innerHTML = `<span class="text-white text-5xl font-bold">${initials}</span>`;
      avatarContainer.appendChild(fallbackDiv);
    }
  };

  const handleImageLoad = (e) => {
    console.log(`Foto berhasil dimuat: ${photoKey}`);
    e.target.classList.add('object-cover');
  };

  return (
    <motion.div 
      className="relative flex justify-center mb-10"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Container utama untuk avatar - UKURAN DIPERBESAR */}
        {/* Animated glow effect */}
      <div className={`relative w-80 h-80 md:w-96 md:h-96 rounded-full overflow-hidden border-6 border-gray-800 shadow-3xl teacher-avatar-container`}>
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            boxShadow: [
              '0 0 0px rgba(249,115,22,0.2)',
              '0 0 40px rgba(249,115,22,0.4)',
              '0 0 0px rgba(249,115,22,0.2)'
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute inset-0 rounded-full pointer-events-none"
        />
        
        {photoUrl ? (
          <>
            {/* Fallback color jika gambar gagal */}
            <div 
              className={`absolute inset-0 ${colors[index % colors.length]} opacity-0 transition-opacity duration-300`}
              ref={el => {
                if (el) {
                  const img = el.previousSibling;
                  if (img && img.complete && img.naturalHeight === 0) {
                    el.classList.remove('opacity-0');
                    el.classList.add('opacity-100');
                  }
                }
              }}
            >
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-5xl md:text-6xl font-bold">{initials}</span>
              </span>
            </div>
            
            {/* Gambar utama - UKURAN DIPERBESAR */}
            <img 
              src={photoUrl} 
              alt={name}
              className="w-full h-full object-cover rounded-full relative z-10"
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="lazy"
              onLoadStart={() => console.log(`Mulai memuat: ${photoKey}`)}
            />
          </>
        ) : (
          <div className={`w-full h-full ${colors[index % colors.length]} flex items-center justify-center rounded-full`}>
            <span className="text-white text-5xl md:text-6xl font-bold">{initials}</span>
          </div>
        )}
        
        {/* Outer ring animation */}
        <motion.div
          className="absolute inset-0 rounded-full border-3 border-transparent z-20 pointer-events-none"
          animate={{
            borderColor: ['rgba(249,115,22,0)', 'rgba(249,115,22,0.7)', 'rgba(249,115,22,0)'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>
    </motion.div>
  );
};

const AboutClass = () => {
  const sectionRef = useRef();
  const featuresRef = useRef();
  const teachersRef = useRef();
  
  const fadeInUp = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse"
    }
  };

  const floatAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  };

  useEffect(() => {
    // Preload guru images
    Object.values(teacherPhotos).forEach(src => {
      if (src) {
        const img = new Image();
        img.src = src;
        img.onload = () => console.log(`Preloaded: ${src}`);
        img.onerror = () => console.error(`Failed to preload: ${src}`);
      }
    });

    // Animate section borders on scroll
    gsap.fromTo('.section-border',
      {
        width: '0%',
        opacity: 0
      },
      {
        width: '100%',
        opacity: 1,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: true
        }
      }
    );

    // Animate feature cards on scroll
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, i) => {
      gsap.fromTo(card,
        {
          y: 100,
          opacity: 0,
          rotateX: 20
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1,
          delay: i * 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Animate teacher cards
    const teacherCards = document.querySelectorAll('.teacher-card');
    teacherCards.forEach((card, i) => {
      gsap.fromTo(card,
        {
          scale: 0.8,
          opacity: 0,
          rotationY: 90
        },
        {
          scale: 1,
          opacity: 1,
          rotationY: 0,
          duration: 0.8,
          delay: i * 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: teachersRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Animated background gradient
    const bgGradient = document.querySelector('.animated-gradient');
    if (bgGradient) {
      gsap.to(bgGradient, {
        backgroundPosition: '200% 200%',
        duration: 20,
        repeat: -1,
        ease: "linear"
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const features = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "Programming",
      description: "Belajar berbagai bahasa pemrograman modern seperti JavaScript, Python, PHP, dan C#",
      color: "from-blue-500 to-cyan-400",
      delay: 0
    },
    {
      icon: <Monitor className="w-8 h-8" />,
      title: "Game Development",
      description: "Membuat game seru menggunakan construct 3 dan Unity",
      color: "from-purple-500 to-pink-500",
      delay: 0.1
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Database",
      description: "Menguasai database SQL & noSQL untuk aplikasi skala kecil hingga besar",
      color: "from-green-500 to-emerald-400",
      delay: 0.2
    }
  ];

  const achievements = [
    { value: "100", suffix: "%", label: "Kelulusan" },
    { value: "9", suffix: "+", label: "Teknologi Dikuasai" }
  ];

  const teachers = [
    {
      name: "Bu Puspita Sari, S.Kom",
      role: "Ketua Program Studi",
      expertise: "Aplikasi Perkantoran & Basis Data",
      subjects: ["Microsoft Excel", "Microsoft Word", "MySQL"],
      photoKey: "buPuspita"
    },
    {
      name: "Pak Andrianto R.K, M.Kom",
      role: "Guru Produktif",
      expertise: "UI/UX Designer & Graphic Designer",
      subjects: ["CorelDRAW", "Canva", "Adobe Illustrator"],
      photoKey: "pakAndrianto"
    },
    {
      name: "Pak Eko Suhartoyo, S.T.",
      role: "Guru Produktif",
      expertise: "Game Development",
      subjects: ["Construct 3"],
      photoKey: "pakEko"
    },
    {
      name: "Pak Yoga Adi Nugraha, S.T.",
      role: "Guru Produktif",
      expertise: "Web Development, Game Development, dan 3D Modeling",
      subjects: ["PHP", "Laravel", "Unity", "Blender", "C#"],
      photoKey: "pakYoga"
    }
  ];

  return (
    <section 
      id="tentang" 
      className="relative py-16 md:py-24 overflow-hidden"
      ref={sectionRef}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 animated-gradient"></div>
      
      {/* Code Particles */}
      <FloatingCodeParticles />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* Gradient Orbs */}
      <div className="absolute w-[600px] h-[600px] -top-48 -left-48 bg-gradient-to-br from-orange-500/10 via-transparent to-blue-500/5 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute w-[600px] h-[600px] -bottom-48 -right-48 bg-gradient-to-tl from-purple-500/10 via-transparent to-cyan-500/5 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      
      <div className="container relative z-10 mx-auto px-4">
        {/* Header dengan animasi khusus */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="text-center mb-16 relative"
        >
          {/* Animated border */}
          <div className="section-border absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
          
          <motion.div 
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700 mb-4 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-gray-300">Mengenal Lebih Dekat</span>
            <Sparkles className="w-4 h-4 text-orange-500" />
          </motion.div>
          
          <motion.h2 
            variants={fadeInUp}
            className="text-4xl md:text-6xl font-bold mb-6 relative"
          >
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-300 to-orange-500 animate-gradient-x">
                XI PPLG 1
              </span>
              <motion.div
                animate={floatAnimation}
                className="absolute -top-6 -right-8"
              >
                <Zap className="w-8 h-8 text-yellow-400" />
              </motion.div>
            </span>
            <br />
            <span className="text-white">SMKN 2 Nganjuk</span>
          </motion.h2>
          
          <motion.p 
            variants={fadeInUp}
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Kelas Pengembangan Perangkat Lunak dan Gim yang berfokus pada{" "}
            <span className="text-orange-400 font-semibold">inovasi teknologi</span>,{" "}
            <span className="text-blue-400 font-semibold">kreativitas</span>, dan{" "}
            <span className="text-green-400 font-semibold">problem-solving</span>
          </motion.p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left - Description dengan animasi */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.div 
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              className="group relative bg-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-orange-500/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Users className="text-orange-500" />
                <span className="text-white">Profil Kelas Dinamis</span>
              </h3>
              <p className="text-gray-300">
                32 siswa berbakat yang belajar dalam lingkungan{" "}
                <span className="text-orange-400">collaborative coding</span>. Setiap hari adalah{" "}
                <span className="text-blue-400">petualangan baru</span> dalam dunia pemrograman!
              </p>
            </motion.div>

            <motion.div 
              variants={fadeInUp}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Target className="text-orange-500 animate-pulse" />
                <span className="bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
                  Visi & Misi
                </span>
              </h3>
              
              <motion.div
                whileHover={{ x: 10 }}
                className="relative bg-gradient-to-r from-gray-900/50 to-gray-800/30 p-5 rounded-xl border-l-4 border-orange-500 shadow-lg"
              >
                <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-orange-500 rounded-full"></div>
                <h4 className="font-bold text-xl mb-3 text-white flex items-center gap-2">
                  <ChevronRight className="w-5 h-5 text-orange-400" />
                  Visi Kami
                </h4>
                <p className="text-gray-300 pl-7">
                  Menjadi{" "}
                  <span className="text-orange-400 font-semibold">epicenter of innovation</span>{" "}
                  yang melahirkan developer kelas dunia yang siap menghadapi tantangan digital masa depan.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ x: 10 }}
                className="relative bg-gradient-to-r from-gray-900/50 to-gray-800/30 p-5 rounded-xl border-l-4 border-blue-500 shadow-lg"
              >
                <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full"></div>
                <h4 className="font-bold text-xl mb-3 text-white flex items-center gap-2">
                  <ChevronRight className="w-5 h-5 text-blue-400" />
                  Misi Kami
                </h4>
                <ul className="space-y-3 text-gray-300 pl-7">
                  {[
                    "Menguasai stack teknologi terbaru",
                    "Mengembangkan pola pikir computational thinking",
                    "Membangun budaya kolaborasi dan sharing knowledge",
                    "Berkontribusi pada open source project"
                  ].map((item, idx) => (
                    <motion.li 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <span className="text-orange-400">•</span>
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right - Stats dengan animasi counting */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotateY: 180 }}
            whileInView={{ scale: 1, opacity: 1, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-3xl p-8 border border-gray-800 shadow-2xl backdrop-blur-sm">
              {/* Floating elements around stats */}
              <motion.div
                animate={floatAnimation}
                className="absolute -top-3 -left-3"
              >
                <Cpu className="w-8 h-8 text-orange-400 opacity-60" />
              </motion.div>
              <motion.div
                animate={floatAnimation}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-3 -right-3"
              >
                <GitBranch className="w-8 h-8 text-blue-400 opacity-60" />
              </motion.div>
              
              <h4 className="text-2xl font-bold mb-8 text-center text-white">
                <span className="flex items-center justify-center gap-2">
                  <Award className="w-6 h-6 text-yellow-400" />
                  Pencapaian Kelas
                  <Award className="w-6 h-6 text-yellow-400" />
                </span>
              </h4>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      type: "spring",
                      stiffness: 200,
                      delay: index * 0.1 
                    }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="text-center p-5 bg-gradient-to-br from-gray-800/50 to-gray-900/30 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-all duration-300 group"
                  >
                    <div className="relative">
                      <AnimatedCounter value={achievement.value} suffix={achievement.suffix} />
                      <div className="text-sm text-gray-400 group-hover:text-orange-300 transition-colors">
                        {achievement.label}
                      </div>
                      <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/0 via-orange-500/10 to-orange-500/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <h4 className="text-xl font-bold text-white mb-4">Keunggulan Eksklusif</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { text: "Game Development" },
                    { text: "UI / UX Design" },
                    { text: "Database Management" },
                    { text: "Web Development" }
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-2 bg-gray-800/30 px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-all"
                    >
                      <span className="text-orange-400">•</span>
                      <span className="text-sm text-gray-300">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          ref={featuresRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mb-20 relative"
        >
          <div className="text-center mb-12">
            <motion.h3 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Tech Stack &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500">
                Kurikulum
              </span>
            </motion.h3>
            <motion.p 
              variants={fadeInUp}
              className="text-gray-400 max-w-2xl mx-auto text-lg"
            >
              Kami mempelajari teknologi yang digunakan oleh perusahaan tech terkemuka
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                custom={index}
                whileHover={{ 
                  y: -15,
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 300 }
                }}
                className="feature-card group relative bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-2xl p-6 border border-gray-800 hover:border-orange-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-orange-500/10"
              >
                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>
                
                {/* Animated border */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-orange-500/30 transition-all duration-300"></div>
                
                {/* Icon with animation */}
                <motion.div
                  animate={pulseAnimation}
                  className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} mb-5 relative overflow-hidden`}
                >
                  <div className="text-white z-10">
                    {feature.icon}
                  </div>
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </motion.div>
                
                <h4 className="text-xl font-bold mb-3 text-white group-hover:text-orange-300 transition-colors">
                  {feature.title}
                </h4>
                <p className="text-gray-400 mb-4">
                  {feature.description}
                </p>
                
                {/* Hover effect dots */}
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Guru Section - DENGAN FOTO BESAR */}
        <motion.div
          ref={teachersRef}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <motion.h3 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Meet Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
                Tech Mentors
              </span>
            </motion.h3>
            <motion.p 
              variants={fadeInUp}
              className="text-gray-400 max-w-2xl mx-auto text-lg"
            >
              Guru-guru yang tidak hanya mengajar, tetapi juga membimbing karir di industri IT
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teachers.map((teacher, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                custom={index}
                whileHover={{ 
                  y: -10,
                  scale: 1.02 
                }}
                className="teacher-card group relative bg-gradient-to-b from-gray-900/50 to-gray-800/30 rounded-3xl p-6 border border-gray-800 hover:border-orange-500/50 transition-all duration-300 shadow-2xl backdrop-blur-sm"
              >
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Teacher Avatar - FOTO BESAR */}
                <TeacherAvatar teacher={teacher} index={index} />
                
                {/* Info Guru */}
                <div className="text-center mb-6 relative z-10">
                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-orange-300 transition-colors">
                    {teacher.name}
                  </h4>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-full mb-2">
                    <span className="text-orange-400 font-medium text-sm">{teacher.role}</span>
                  </div>
                  <p className="text-gray-400 text-xs mb-4">{teacher.expertise}</p>
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap justify-center gap-2 mb-6 relative z-10">
                  {teacher.subjects.map((subject, i) => (
                    <motion.span
                      key={i}
                      whileHover={{ scale: 1.1 }}
                      className="px-2 py-1 bg-gray-800/50 rounded-full text-xs text-gray-300 hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-orange-600/20 hover:text-orange-300 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-orange-500/10"
                    >
                      {subject}
                    </motion.span>
                  ))}
                </div>

                {/* Status indicator */}
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-400">Available for Mentorship</span>
                </div>

                {/* Hover effect lines */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-orange-500/20 transition-all duration-300 pointer-events-none"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action dengan animasi menarik */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-orange-500/10 rounded-3xl p-8 md:p-12 border border-orange-500/20 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 bg-[url('/api/placeholder/400/400')] opacity-5"></div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -left-20 -bottom-20 w-40 h-40 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full"
            />
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
              <div>
                <motion.h3 
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-2xl md:text-3xl font-bold mb-2 text-white"
                >
                  Ready to <span className="text-orange-400">Code</span> Your Future?
                </motion.h3>
                <p className="text-gray-300">
                  Bergabunglah dengan komunitas developer masa depan!
                </p>
              </div>
              
              <motion.div className="flex flex-col sm:flex-row gap-3">
               <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 30px rgba(249, 115, 22, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open('https://discord.gg/link-komunitas', '_blank')}
                className="px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-semibold rounded-xl hover:from-orange-500 hover:to-orange-400 transition-all duration-300 flex items-center gap-2 group relative overflow-hidden cursor-pointer"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Gabung Komunitas
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -inset-1 bg-orange-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.button>
              </motion.div>
            </div>
            
            {/* Floating icons */}
            <motion.div
              animate={floatAnimation}
              className="absolute top-4 left-4"
            >
              <Terminal className="w-8 h-8 text-orange-400/30" />
            </motion.div>
            <motion.div
              animate={floatAnimation}
              transition={{ delay: 0.3 }}
              className="absolute bottom-4 right-4"
            >
              <Palette className="w-8 h-8 text-blue-400/30" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .animated-gradient {
          background: linear-gradient(
            45deg,
            #000000,
            #0f172a,
            #1e293b,
            #0f172a,
            #000000
          );
          background-size: 400% 400%;
          animation: gradientMove 20s ease infinite;
        }
        
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(249, 115, 22, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(249, 115, 22, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient-x {
          background-size: 200% auto;
          animation: gradient-x 3s linear infinite;
        }
        
        .animation-delay-700 {
          animation-delay: 700ms;
        }

        .glow-hover {
          transition: all 0.3s ease;
        }
        
        .glow-hover:hover {
          box-shadow: 0 0 20px rgba(249, 115, 22, 0.3);
        }
        
        @keyframes subtle-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .animate-subtle-pulse {
          animation: subtle-pulse 2s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default AboutClass;