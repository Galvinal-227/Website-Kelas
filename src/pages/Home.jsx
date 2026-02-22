import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import ParallaxBackground from '../components/ParallaxBackground';
import { 
  Users, 
  Sparkles, 
  CheckCircle,
  School, 
  Code,
  Target,
  Award,
  UserCheck,
  Brain,
  Palette,
  Database,
  Gamepad2,
  Zap,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const statsRef = useRef(null);
  const headerRef = useRef(null);
  const visionRef = useRef(null);
  const achievementsRef = useRef(null);
  const footerRef = useRef(null);
  const floatingElementsRef = useRef([]);

  useEffect(() => {
    // Floating elements
    const floatingElements = [];
    const container = document.querySelector('.floating-container');
    
    if (container) {
      // Particles creation
      const colors = ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'];
      
      for (let i = 0; i < 30; i++) { 
        const particle = document.createElement('div');
        particle.className = 'absolute rounded-full pointer-events-none';
        particle.style.width = Math.random() * 4 + 1 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.opacity = Math.random() * 0.4 + 0.1;
        particle.style.zIndex = '0';
        container.appendChild(particle);
        floatingElements.push(particle);
      }

      // Floating shapes and icons
      const shapes = ['triangle', 'circle', 'square', 'hexagon', 'diamond', 'star', 'pentagon', 'octagon', 'heart', 'arrow', 'cross', 'plus'];
      
      for (let i = 0; i < 12; i++) {
        const element = document.createElement('div');
        element.className = 'absolute pointer-events-none opacity-15';
        element.style.left = Math.random() * 100 + '%';
        element.style.top = Math.random() * 100 + '%';
        
        if (Math.random() > 0.5) {
          // Icon element
          const icon = document.createElement('div');
          icon.innerHTML = Math.random() > 0.5 ? '〈〉' : '{}';
          icon.className = 'text-orange-400 text-xl font-bold';
          element.appendChild(icon);
        } else {
          // Shape element
          element.style.width = Math.random() * 30 + 10 + 'px';
          element.style.height = element.style.width;
          element.style.border = '2px solid rgba(249, 115, 22, 0.3)';
          const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
          element.style.borderRadius = shapeType === 'circle' ? '50%' : '4px';
        }
        
        container.appendChild(element);
        floatingElements.push(element);
      }
      
      floatingElementsRef.current = floatingElements;

      // Animasi particles
      floatingElements.forEach((element, i) => {
        gsap.to(element, {
          y: Math.random() * 80 - 40,
          x: Math.random() * 60 - 30,
          rotation: Math.random() * 360,
          duration: Math.random() * 8 + 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: Math.random() * 2
        });
      });
    }

    // Animasi header
    if (headerRef.current) {
      const headerItems = Array.from(headerRef.current.children);
      gsap.fromTo(headerItems,
        {
          y: 50,
          opacity: 0,
          scale: 0.8,
          rotationX: -20
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationX: 0,
          duration: 1,
          stagger: 0.15,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Animasi stats
    if (statsRef.current) {
      const counter = statsRef.current.querySelector('.stat-number');
      const statCard = statsRef.current.querySelector('.stat-card');
      
      gsap.fromTo(statCard,
        {
          y: 100,
          opacity: 0,
          scale: 0.9,
          rotationY: 20
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );
      
      if (counter) {
        const target = 32;
        const obj = { value: 0 };
        
        gsap.to(obj, {
          value: target,
          duration: 2.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: counter,
            start: "top 85%",
            toggleActions: "play none none reverse"
          },
          onUpdate: () => {
            counter.textContent = Math.floor(obj.value);
          },
          onComplete: () => {
            gsap.to(counter, {
              scale: 1.1,
              duration: 0.3,
              yoyo: true,
              repeat: 1,
              ease: "elastic.out(1, 0.5)"
            });
          }
        });
      }
    }

    // Animasi vision
    if (visionRef.current) {
      const visionText = visionRef.current.querySelector('.vision-text');
      if (visionText) {
        gsap.fromTo(visionText,
          {
            opacity: 0,
            y: 30,
            scale: 0.95
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.5,
            scrollTrigger: {
              trigger: visionText,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    }

    // Animasi achievements
    if (achievementsRef.current) {
      const items = achievementsRef.current.querySelectorAll('.achievement-item');
      
      gsap.fromTo(items,
        {
          x: -50,
          opacity: 0,
          scale: 0.8
        },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: achievementsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Animasi footer
    if (footerRef.current) {
      const footerElements = footerRef.current.querySelectorAll('.footer-element');
      
      gsap.fromTo(footerElements,
        {
          y: 30,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    return () => {
      floatingElementsRef.current.forEach(el => {
        if (el && el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
        damping: 12
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    },
    hover: {
      scale: 1.1,
      rotate: 10,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  // Data untuk cards
  const techStack = [
    { icon: <Palette className="w-6 h-6" />, title: "Design", tech: "Corel Draw, Canva, Adobe Ilustrator", color: "from-blue-500 to-cyan-400" },
    { icon: <Database className="w-6 h-6" />, title: "Backend", tech: "Laravel, PHP, MySQL", color: "from-green-500 to-emerald-400" },
    { icon: <Gamepad2 className="w-6 h-6" />, title: "Game Dev", tech: "Unity, C#, Construct 3", color: "from-purple-500 to-pink-400" }
  ];

  const teachers = [
    { name: "Bu Puspita Sari, S.kom", role: "Ketua Kaprodi", expertise: "Database, Excel, Word", experience: "8 Tahun" },
    { name: "Pak Andrianto R.K, S.Kom", role: "Guru Prodi", expertise: "UI/UX & Graphic Design", experience: "10 Tahun" },
    { name: "Pak Eko Suhartoyo, S.Kom", role: "Guru Prodi", expertise: "Game Development", experience: "6 Tahun" },
    { name: "Pak Yoga Adi Nugraha, S.Kom", role: "Guru Prodi", expertise: "Laravel, PHP Native dan Unity", experience: "5 Tahun" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-black text-white overflow-hidden flex flex-col"
    >
      {/* Floating elements background - SAMA SEPERTI DI HERO.JS */}
      <div className="floating-container fixed inset-0 pointer-events-none z-0 overflow-hidden"></div>
      
      <ParallaxBackground />
      
      {/* Hero Section */}
      <div className="flex-1">
        <Hero />
      </div>
      
      {/* Info Section */}
      <section className="section bg-gradient-to-b from-gray-950 via-black to-gray-950 flex-1">
        <div className="container relative z-10 py-8">
          <motion.div 
            ref={headerRef}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-12"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center justify-center gap-4 mb-6">
              <motion.div 
                variants={iconVariants}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center shadow-lg"
              >
                <Users className="w-7 h-7 text-white" />
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold">
                <span className="bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 bg-clip-text text-transparent">
                  TENTANG KELAS
                </span>
              </h2>
              <motion.div 
                variants={iconVariants}
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center shadow-lg"
              >
                <Sparkles className="w-7 h-7 text-white" />
              </motion.div>
            </motion.div>
            
            <motion.p variants={itemVariants} className="text-xl text-gray-300 max-w-2xl mx-auto font-medium mb-8">
              Kelas <span className="gradient-text font-bold">XI PPLG 1</span> SMKN 2 Nganjuk
            </motion.p>
            
            {/* Stats Bar */}
            <motion.div 
              ref={statsRef}
              variants={containerVariants}
              className="flex flex-wrap justify-center items-center gap-8 p-6 bg-black/50 rounded-xl border-2 border-orange-500/30 max-w-2xl mx-auto backdrop-blur-sm stat-card mb-12"
            >
              {[
                { value: "32", label: "Siswa", icon: <Users className="w-4 h-4" /> },
                { value: "XI", label: "Kelas", icon: <School className="w-4 h-4" /> },
                { value: "PPLG", label: "Jurusan", icon: <Code className="w-4 h-4" /> }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center group relative"
                >
                  <div className="flex items-center justify-center gap-2 mb-1 icon-container">
                    <div className="text-orange-400 opacity-80">{stat.icon}</div>
                    <div className="text-3xl font-bold text-orange-400 stat-number">{stat.value}</div>
                  </div>
                  <div className="text-gray-400 text-xs uppercase tracking-widest">{stat.label}</div>
                  <div className="absolute inset-0 bg-orange-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </motion.div>
              ))}
            </motion.div>
          
          {/* Tech Stack Section */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              <motion.h3 
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                className="text-3xl font-bold mb-4"
              >
                <span className="bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent">
                  Teknologi yang Dipelajari
                </span>
              </motion.h3>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Menguasai teknologi terkini untuk menjadi developer yang kompeten
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {techStack.map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 hover:border-orange-500/50 transition-all duration-300 group h-full"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${tech.color} shadow-lg`}>
                      {tech.icon}
                    </div>
                    <h4 className="text-xl font-bold text-white">{tech.title}</h4>
                  </div>
                  <p className="text-gray-300">{tech.tech}</p>
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Zap className="w-4 h-4" />
                      <span>Sedang dipelajari</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Informasi Kelas */}
          <div className="bg-black/50 rounded-2xl border-2 border-orange-500/30 p-8 max-w-6xl mx-auto backdrop-blur-sm mb-12">
            <motion.h3 
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold text-white mb-6 text-center"
            >
              Visi Kelas
            </motion.h3>
            
            <motion.div 
              ref={visionRef}
              className="vision-text"
            >
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-gray-300 text-lg text-center leading-relaxed mb-8 italic px-4"
              >
                "Menciptakan lingkungan belajar yang kolaboratif dan inovatif untuk mengembangkan 
                talenta digital masa depan dalam bidang Pengembangan Perangkat Lunak dan Gim."
              </motion.p>
            </motion.div>
            
            <motion.div 
              ref={achievementsRef}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
            >
              <motion.div 
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-orange-500/50 transition-colors duration-300 h-full"
              >
                <h4 className="text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Fokus Pembelajaran
                </h4>
                <ul className="space-y-3">
                  {['Pemrograman Web & Mobile', 'Database Management', 'UI/UX Design', 'Game Development'].map((item, index) => (
                    <motion.li 
                      key={index}
                      className="achievement-item flex items-center gap-3 text-gray-300"
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <motion.div 
                        className="w-2 h-2 rounded-full bg-orange-500"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                      ></motion.div>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div 
                initial={{ x: 30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-orange-500/50 transition-colors duration-300 h-full"
              >
                <h4 className="text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Pencapaian
                </h4>
                <ul className="space-y-3">
                  {[
                    'Laravel, Database, UI/UX Design, Basic Unity',
                    '100% Kehadiran Aktif',
                    'Kolaborasi Tim yang Solid'
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      className="achievement-item flex items-center gap-3 text-gray-300"
                      initial={{ x: 20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <motion.div 
                        className="w-2 h-2 rounded-full bg-green-500"
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: index * 0.1 }}
                      ></motion.div>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          </div>

          {/* Teachers Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              <motion.div 
                initial={{ y: 20 }}
                whileInView={{ y: 0 }}
                className="inline-flex items-center gap-3 mb-4"
              >
                <UserCheck className="w-8 h-8 text-orange-400" />
                <h3 className="text-3xl font-bold">
                  <span className="bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent">
                    Pengajar Kami
                  </span>
                </h3>
              </motion.div>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Didampingi oleh pengajar berpengalaman di bidangnya
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teachers.map((teacher, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-xl p-6 text-center hover:border-orange-500/50 transition-all duration-300 h-full"
                >
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white text-2xl font-bold">
                    {teacher.name.split(' ')[1].charAt(0)}
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">{teacher.name}</h4>
                  <p className="text-orange-400 font-medium mb-3">{teacher.role}</p>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-center justify-center gap-2">
                      <Brain className="w-4 h-4" />
                      <span>{teacher.expertise}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Award className="w-4 h-4" />
                      <span>{teacher.experience} Pengalaman</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
        </div>
      </section>
    </motion.div>
  );
}

export default Home;