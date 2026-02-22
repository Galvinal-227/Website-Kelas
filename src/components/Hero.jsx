import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { Users, Code, Award, Clock, Sparkles, ChevronDown, BookOpen } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const textRef = useRef(null);
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const floatingElementsRef = useRef([]);

  useEffect(() => {
    // Particles creation
    const particles = [];
    const colors = ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'];
    
    for (let i = 0; i < 50; i++) { 
      const particle = document.createElement('div');
      particle.className = 'absolute rounded-full pointer-events-none';
      particle.style.width = Math.random() * 4 + 1 + 'px';
      particle.style.height = particle.style.width;
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.opacity = Math.random() * 0.4 + 0.1;
      containerRef.current.appendChild(particle);
      particles.push(particle);
    }
    particlesRef.current = particles;

    // Floating elements (icons, shapes)
    const floatingElements = [];
    const shapes = ['triangle', 'circle', 'square', 'hexagon', 'diamond', 'star', 'pentagon', 'octagon', 'heart', 'arrow', 'cross', 'plus'];
    
    for (let i = 0; i < 12; i++) {
      const element = document.createElement('div');
      element.className = 'absolute pointer-events-none opacity-20';
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
        element.style.borderRadius = shapes[Math.floor(Math.random() * shapes.length)] === 'circle' ? '50%' : '4px';
      }
      
      containerRef.current.appendChild(element);
      floatingElements.push(element);
    }
    floatingElementsRef.current = floatingElements;

    // Main text animation
    const tl = gsap.timeline();
    tl.fromTo(textRef.current.children,
      { 
        y: 50, 
        opacity: 0,
        filter: 'blur(10px)'
      },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out"
      }
    );

    // Floating elements animation
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

    // Particles animation
    particles.forEach((particle, i) => {
      gsap.to(particle, {
        x: () => Math.random() * 100 - 50,
        y: () => Math.random() * 100 - 50,
        duration: Math.random() * 6 + 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 3
      });
    });

    // Stats animation
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
      const target = stat.textContent;
      const isNumber = !isNaN(parseInt(target));
      
      if (isNumber) {
        gsap.fromTo(stat,
          { textContent: 0 },
          {
            textContent: target,
            duration: 2.5,
            ease: "power2.out",
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: stat,
              start: "top 85%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });

    // Stats container animation
    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) {
      gsap.fromTo(statsContainer,
        {
          y: 60,
          opacity: 0,
          scale: 0.9
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          delay: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: statsContainer,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }


    // Title glow animation
    const title = document.querySelector('.glow-title');
    if (title) {
      gsap.to(title, {
        textShadow: [
          '0 0 15px rgba(249, 115, 22, 0.3)',
          '0 0 25px rgba(249, 115, 22, 0.5)',
          '0 0 35px rgba(249, 115, 22, 0.7)',
          '0 0 25px rgba(249, 115, 22, 0.5)',
          '0 0 15px rgba(249, 115, 22, 0.3)'
        ],
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }

    // Scroll indicator animation
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      gsap.to(scrollIndicator, {
        y: 10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }

    return () => {
      particles.forEach(particle => particle?.parentNode?.removeChild(particle));
      floatingElements.forEach(element => element?.parentNode?.removeChild(element));
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 via-black to-gray-900" 
      ref={containerRef}
      style={{ cursor: 'default' }}
    >
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
    
      {/* Animated Rings */}
      <div className="absolute w-96 h-96 border-2 border-orange-500/20 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-border-spin"></div>
      <div className="absolute w-[420px] h-[420px] border border-orange-400/10 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-border-spin" style={{ animationDelay: '1.5s' }}></div>
      
      <div className="container relative z-10 px-4">
        <div ref={textRef} className="text-center">
          {/* Sparkles Icon */}
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="inline-block mb-6"
          >
            <div className="relative">
              <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-orange-400 mx-auto" />
              <div className="absolute inset-0 bg-orange-400/20 blur-xl rounded-full"></div>
            </div>
          </motion.div>
          
          {/* Main Title */}
          <motion.h1            
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 md:mb-6 relative"
          >
            <span className="gradient-text">
              XI PPLG 1
            </span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.h2 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-3 md:mb-4 text-white relative inline-block"
          >
            <span className="flex items-center justify-center gap-2">
              <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-orange-400" />
              SMKN 2 Nganjuk
              <Code className="w-6 h-6 md:w-8 md:h-8 text-orange-400" />
            </span>
            {/* Floating dots */}
            <span className="absolute -top-2 -right-3 w-3 h-3 bg-orange-400 rounded-full animate-ping"></span>
            <span className="absolute -bottom-2 -left-3 w-2.5 h-2.5 bg-orange-300 rounded-full animate-ping animation-delay-300"></span>
          </motion.h2>
          
          {/* Description */}
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            <span className="bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent font-medium">
              Pengembangan Perangkat Lunak dan Gim
            </span>
            <br />
            <span className="text-lg md:text-xl text-white">
              Membangun masa depan dengan kode dan kreativitas
            </span>
          </motion.p>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
          background-size: 400% 400%;
        }
        
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(249, 115, 22, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(249, 115, 22, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        
        @keyframes border-spin {
          0% {
            border-color: rgba(249, 115, 22, 0.1);
            transform: translate(-50%, -50%) rotate(0deg);
          }
          100% {
            border-color: rgba(249, 115, 22, 0.3);
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        
        .animate-border-spin {
          animation: border-spin 20s linear infinite;
        }
        
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        
        .glow-title {
          text-shadow: 0 0 20px rgba(249, 115, 22, 0.3);
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .gradient-text {
          background: linear-gradient(90deg, #f97316, #fb923c, #fdba74, #fb923c, #f97316);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient-shift 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;