
const LOCAL_STORAGE_KEY = 'xi_pplg1_students_data';


const initialStudents = [
  { 
    id: 1, 
    name: "Ahmad Rofii Saputra", 
    nickname: "S01", 
    portfolioUrl: "https://ahmad-rizki.vercel.app",
    interests: ['Web Development', 'UI/UX Design', 'JavaScript'],
    skills: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'PHP'],
    favoriteProject: "Sistem Informasi Sekolah",
    achievement: "Juara 1 Lomba Web Design Tingkat Kabupaten",
    avatar: "/avatars/avatar1.jpg",
    contact: {
      email: "ahmad.rofi@example.com",
      phone: "081234567890",
      address: "Nganjuk, Jawa Timur"
    }
  },
  { 
    id: 2, 
    name: "Aliva Nuzuliani", 
    nickname: "S02", 
    portfolioUrl: "https://budi-santoso.vercel.app",
    interests: ['Web Development', 'Mobile Development', 'Database'],
    skills: ['JavaScript', 'React', 'Vue.js', 'MySQL', 'Laravel'],
    favoriteProject: "Aplikasi E-commerce",
    achievement: "Finalis Hackathon Web Development",
    avatar: "/avatars/avatar2.jpg",
    contact: {
      email: "aliva.nuzuliani@example.com",
      phone: "081234567891",
      address: "Nganjuk, Jawa Timur"
    }
  },
  { 
    id: 3, 
    name: "Citra Dewi", 
    nickname: "S03", 
    portfolioUrl: "https://citra-dewi.vercel.app",
    interests: ['Web Development', 'UI/UX Design', 'Frontend'],
    skills: ['HTML/CSS', 'JavaScript', 'React', 'Tailwind CSS', 'Figma'],
    favoriteProject: "Portfolio Website Interaktif",
    achievement: "Best UI/UX Design Award",
    avatar: "/avatars/avatar3.jpg",
    contact: {
      email: "citra.dewi@example.com",
      phone: "081234567892",
      address: "Nganjuk, Jawa Timur"
    }
  },
  { 
    id: 4, 
    name: "Andi Wahyu Saputra", 
    nickname: "S04", 
    portfolioUrl: "https://Andi-portfolio.vercel.app",
    interests: ['Web Development', 'Backend', 'API Development'],
    skills: ['Node.js', 'Express', 'MongoDB', 'Python', 'Django'],
    favoriteProject: "REST API untuk Aplikasi Mobile",
    achievement: "Juara 3 Backend Competition",
    avatar: "/avatars/avatar4.jpg",
    contact: {
      email: "andi.wahyu@example.com",
      phone: "081234567893",
      address: "Nganjuk, Jawa Timur"
    }
  },
  { 
    id: 5, 
    name: "Eka Putri", 
    nickname: "S05", 
    portfolioUrl: "https://eka-putri.vercel.app",
    interests: ['Web Development', 'Full Stack', 'Cloud Computing'],
    skills: ['React', 'Node.js', 'MongoDB', 'AWS', 'Docker'],
    favoriteProject: "Cloud-based Task Management App",
    achievement: "Cloud Developer Certification",
    avatar: "/avatars/avatar5.jpg",
    contact: {
      email: "eka.putri@example.com",
      phone: "081234567894",
      address: "Nganjuk, Jawa Timur"
    }
  },
  { 
    id: 6, 
    name: "Fajar Nugroho", 
    nickname: "S06", 
    portfolioUrl: "https://fajar-nugroho.vercel.app",
    interests: ['Web Development', 'E-commerce', 'Payment Gateway'],
    skills: ['PHP', 'Laravel', 'MySQL', 'JavaScript', 'Stripe API'],
    favoriteProject: "Platform E-commerce UMKM",
    achievement: "Best E-commerce Solution",
    avatar: "/avatars/avatar6.jpg",
    contact: {
      email: "fajar.nugroho@example.com",
      phone: "081234567895",
      address: "Nganjuk, Jawa Timur"
    }
  },
  { 
    id: 7, 
    name: "Gita Maharani", 
    nickname: "S07", 
    portfolioUrl: "https://gita-maharani.vercel.app",
    interests: ['Web Development', 'Progressive Web Apps', 'Performance'],
    skills: ['JavaScript', 'React', 'PWA', 'Webpack', 'Lighthouse'],
    favoriteProject: "PWA untuk Toko Online",
    achievement: "PWA Performance Excellence",
    avatar: "/avatars/avatar7.jpg",
    contact: {
      email: "gita.maharani@example.com",
      phone: "081234567896",
      address: "Nganjuk, Jawa Timur"
    }
  },
  { 
    id: 8, 
    name: "Hendra Wijaya", 
    nickname: "S08", 
    portfolioUrl: "https://hendra-wijaya.vercel.app",
    interests: ['Web Development', 'CMS', 'WordPress'],
    skills: ['PHP', 'WordPress', 'CSS', 'JavaScript', 'WooCommerce'],
    favoriteProject: "Custom WordPress Theme",
    achievement: "WordPress Developer Expert",
    avatar: "/avatars/avatar8.jpg",
    contact: {
      email: "hendra.wijaya@example.com",
      phone: "081234567897",
      address: "Nganjuk, Jawa Timur"
    }
  },
  { 
    id: 9, 
    name: "Indah Permata", 
    nickname: "S09", 
    portfolioUrl: "https://indah-permata.vercel.app",
    interests: ['UI/UX Design', 'User Research', 'Prototyping'],
    skills: ['Figma', 'Adobe XD', 'User Testing', 'Wireframing', 'Design System'],
    favoriteProject: "Redesign Aplikasi Banking",
    achievement: "Best UX Research Award",
    avatar: "/avatars/avatar9.jpg",
    contact: {
      email: "indah.permata@example.com",
      phone: "081234567898",
      address: "Nganjuk, Jawa Timur"
    }
  },
  { 
    id: 10, 
    name: "Joko Susilo", 
    nickname: "S10", 
    portfolioUrl: "https://joko-susilo.vercel.app",
    interests: ['UI/UX Design', 'Mobile Design', 'Design Thinking'],
    skills: ['Figma', 'Adobe Illustrator', 'Prototyping', 'Usability Testing'],
    favoriteProject: "Mobile App Design untuk Startup",
    achievement: "Top 10 UI Design Competition",
    avatar: "/avatars/avatar10.jpg",
    contact: {
      email: "joko.susilo@example.com",
      phone: "081234567899",
      address: "Nganjuk, Jawa Timur"
    }
  },
  { 
    id: 11, 
    name: "Kartika Sari", 
    nickname: "S11", 
    portfolioUrl: "https://kartika-sari.vercel.app",
    interests: ['UI/UX Design', 'Graphic Design', 'Branding'],
    skills: ['Adobe Photoshop', 'Illustrator', 'Figma', 'Typography', 'Color Theory'],
    favoriteProject: "Brand Identity untuk Cafe",
    achievement: "Graphic Design Excellence",
    avatar: "/avatars/avatar11.jpg",
    contact: {
      email: "kartika.sari@example.com",
      phone: "081234567800",
      address: "Nganjuk, Jawa Timur"
    }
  },
  { 
    id: 12, 
    name: "Lukman Hakim", 
    nickname: "S12", 
    portfolioUrl: "https://lukman-hakim.vercel.app",
    interests: ['UI/UX Design', 'Interaction Design', 'Animation'],
    skills: ['Figma', 'After Effects', 'Lottie', 'Micro-interactions'],
    favoriteProject: "Animated UI Components Library",
    achievement: "Best Interaction Design",
    avatar: "/avatars/avatar12.jpg",
    contact: {
      email: "lukman.hakim@example.com",
      phone: "081234567801",
      address: "Nganjuk, Jawa Timur"
    }
  },
  { 
    id: 13, 
    name: "Maya Indah", 
    nickname: "S13", 
    portfolioUrl: "https://maya-indah.vercel.app",
    interests: ['UI/UX Design', 'Accessibility', 'Inclusive Design'],
    skills: ['WCAG Guidelines', 'Figma', 'User Testing', 'Accessibility Audits'],
    favoriteProject: "Accessible Government Website",
    achievement: "Accessibility Champion Award",
    avatar: "/avatars/avatar13.jpg",
    contact: {
      email: "maya.indah@example.com",
      phone: "081234567802",
      address: "Nganjuk, Jawa Timur"
    }
  },
  { 
    id: 14, 
    name: "Nanda Putra", 
    nickname: "S14", 
    portfolioUrl: "https://nanda-putra.vercel.app",
    interests: ['UI/UX Design', 'Design Systems', 'Component Libraries'],
    skills: ['Figma', 'Storybook', 'Design Tokens', 'Component Architecture'],
    favoriteProject: "Enterprise Design System",
    achievement: "Design System Implementation Award",
    avatar: "/avatars/avatar14.jpg",
    contact: {
      email: "nanda.putra@example.com",
      phone: "081234567803",
      address: "Nganjuk, Jawa Timur"
    }
  },
  { 
    id: 15, 
    name: "Olivia Tan", 
    nickname: "S15", 
    portfolioUrl: "https://olivia-tan.vercel.app",
    interests: ['UI/UX Design', 'Product Design', 'User Journey'],
    skills: ['Figma', 'User Research', 'Journey Mapping', 'Product Strategy'],
    favoriteProject: "SaaS Product Redesign",
    achievement: "Product Design Excellence",
    avatar: "/avatars/avatar15.jpg",
    contact: {
      email: "olivia.tan@example.com",
      phone: "081234567804",
      address: "Nganjuk, Jawa Timur"
    }
  },
  { 
    id: 16, 
    name: "Putra Aditya", 
    nickname: "S16", 
    portfolioUrl: "https://putra-aditya.vercel.app",
    interests: ['UI/UX Design', 'Motion Design', 'Prototyping'],
    skills: ['Figma', 'Principle', 'After Effects', 'Prototyping Tools'],
    favoriteProject: "Interactive Prototype for Fintech App",
    achievement: "Motion Design Innovation",
    avatar: "/avatars/avatar16.jpg",
    contact: {
      email: "putra.aditya@example.com",
      phone: "081234567805",
      address: "Nganjuk, Jawa Timur"
    }
  },
  { 
    id: 17, 
    name: "Rafi Akbar", 
    nickname: "S17", 
    portfolioUrl: "https://rafi-akbar.vercel.app",
    interests: ['Game Development', 'Unity', '2D Games'],
    skills: ['Unity', 'C#', 'Photoshop', 'Game Design', 'Animation'],
    favoriteProject: "2D Platformer Game",
    achievement: "Best Game Design - Game Jam",
    avatar: "/avatars/avatar17.jpg",
    contact: {
      email: "rafi.akbar@example.com",
      phone: "081234567806",
      address: "Nganjuk, Jawa Timur"
    }
  },
  { 
    id: 18, 
    name: "Sari Dewi", 
    nickname: "S18", 
    portfolioUrl: "https://sari-dewi.vercel.app",
    interests: ['Game Development', 'Character Design', 'Storytelling'],
    skills: ['Unity', 'Blender', 'Character Animation', 'Narrative Design'],
    favoriteProject: "Adventure Game with Rich Story",
    achievement: "Best Narrative Design",
    avatar: "/avatars/avatar18.jpg",
    contact: {
      email: "sari.dewi@example.com",
      phone: "081234567807",
      address: "Nganjuk, Jawa Timur"
    }
  },
  { 
    id: 19, 
    name: "Tegar Wibowo", 
    nickname: "S19", 
    portfolioUrl: "https://tegar-wibowo.vercel.app",
    interests: ['Game Development', 'Mobile Games', 'Game Mechanics'],
    skills: ['Unity', 'C#', 'Mobile Optimization', 'Game Physics'],
    favoriteProject: "Hyper-casual Mobile Game",
    achievement: "1 Million Downloads - Play Store",
    avatar: "/avatars/avatar19.jpg",
    contact: {
      email: "tegar.wibowo@example.com",
      phone: "081234567808",
      address: "Nganjuk, Jawa Timur"
    }
  },
  { 
    id: 20, 
    name: "Umar Faruq", 
    nickname: "S20", 
    portfolioUrl: "https://umar-faruq.vercel.app",
    interests: ['Game Development', '3D Games', 'Unreal Engine'],
    skills: ['Unreal Engine', 'C++', 'Blender', '3D Modeling'],
    favoriteProject: "3D First Person Shooter",
    achievement: "Best 3D Game - Competition",
    avatar: "/avatars/avatar20.jpg",
    contact: {
      email: "umar.faruq@example.com",
      phone: "081234567809",
      address: "Nganjuk, Jawa Timur"
    }
  },
  { 
    id: 21, 
    name: "Vina Septyani", 
    nickname: "S21", 
    portfolioUrl: "https://vina-septyani.vercel.app",
    interests: ['Game Development', 'Puzzle Games', 'Level Design'],
    skills: ['Unity', 'C#', 'Level Design', 'Puzzle Mechanics'],
    favoriteProject: "Educational Puzzle Game",
    achievement: "Educational Game Award",
    avatar: "/avatars/avatar21.jpg",
    contact: {
      email: "vina.septyani@example.com",
      phone: "081234567810",
      address: "Nganjuk, Jawa Timur"
    }
  },
  { 
    id: 22, 
    name: "Wahyu Pratama", 
    nickname: "S22", 
    portfolioUrl: "https://wahyu-pratama.vercel.app",
    interests: ['Game Development', 'Multiplayer Games', 'Networking'],
    skills: ['Unity', 'Photon', 'C#', 'Multiplayer Architecture'],
    favoriteProject: "Online Multiplayer Battle Game",
    achievement: "Best Multiplayer Implementation",
    avatar: "/avatars/avatar22.jpg",
    contact: {
      email: "wahyu.pratama@example.com",
      phone: "081234567811",
      address: "Nganjuk, Jawa Timur"
    }
  },
  { 
    id: 23, 
    name: "Xena Aurelia", 
    nickname: "S23", 
    portfolioUrl: "https://galvin-portfolio.vercel.app",
    interests: ['Game Development', 'VR Games', 'Immersive Design'],
    skills: ['Unity', 'VR Development', 'C#', '3D Interaction'],
    favoriteProject: "VR Educational Experience",
    achievement: "VR Innovation Award",
    avatar: "/avatars/avatar23.jpg",
    contact: {
      email: "xena.aurelia@example.com",
      phone: "081234567812",
      address: "Nganjuk, Jawa Timur"
    }
  },
  { 
    id: 24, 
    name: "Yoga Maulana", 
    nickname: "S24", 
    portfolioUrl: "https://yoga-maulana.vercel.app",
    interests: ['Game Development', 'Game AI', 'Procedural Generation'],
    skills: ['Unity', 'C#', 'AI Algorithms', 'Procedural Content'],
    favoriteProject: "Roguelike with Procedural Dungeons",
    achievement: "Best AI Implementation",
    avatar: "/avatars/avatar24.jpg",
    contact: {
      email: "yoga.maulana@example.com",
      phone: "081234567813",
      address: "Nganjuk, Jawa Timur"
    }
  },
  { 
    id: 25, 
    name: "Zaki Fahmi", 
    nickname: "S25", 
    portfolioUrl: "https://zaki-fahmi.vercel.app",
    interests: ['Mobile Development', 'Flutter', 'Cross-platform'],
    skills: ['Flutter', 'Dart', 'Firebase', 'REST API', 'State Management'],
    favoriteProject: "Cross-platform E-commerce App",
    achievement: "Flutter Developer Certification",
    avatar: "/avatars/avatar25.jpg",
    contact: {
      email: "zaki.fahmi@example.com",
      phone: "081234567814",
      address: "Nganjuk, Jawa Timur"
    }
  },
  { 
    id: 26, 
    name: "Galvin Alfito Dinova", 
    nickname: "S26", 
    portfolioUrl: "https://galvin-portfolio.vercel.app",
    interests: ['WEB DEVELOPER'],
    skills: ['React JS', 'JavaScript', 'CSS', 'HTML', 'GSAP', 'NEXT.JS', 'TAILWINDCSS', 'VITE'],
    favoriteProject: "Weather Dashboard",
    achievement: "GALCALBU",
    avatar: "/avatars/avatar26.jpg",
    contact: {
      email: "galvin.alfito@example.com",
      phone: "081234567815",
      address: "Nganjuk, Jawa Timur"
    }
  },
  { 
    id: 27, 
    name: "Bayu Kurniawan", 
    nickname: "S27", 
    portfolioUrl: "https://bayu-kurniawan.vercel.app",
    interests: ['Mobile Development', 'Android', 'Kotlin'],
    skills: ['Kotlin', 'Android SDK', 'Jetpack Compose', 'Room DB'],
    favoriteProject: "Offline-first Notes App",
    achievement: "Google Play Editor's Choice",
    avatar: "/avatars/avatar27.jpg",
    contact: {
      email: "bayu.kurniawan@example.com",
      phone: "081234567816",
      address: "Nganjuk, Jawa Timur"
    }
  },
  { 
    id: 28, 
    name: "Cici Amelia", 
    nickname: "S28", 
    portfolioUrl: "https://cici-amelia.vercel.app",
    interests: ['Mobile Development', 'SwiftUI', 'iOS Apps'],
    skills: ['Swift', 'SwiftUI', 'Core Data', 'Combine', 'iOS SDK'],
    favoriteProject: "Social Media App for Artists",
    achievement: "Apple Design Award Nominee",
    avatar: "/avatars/avatar28.jpg",
    contact: {
      email: "cici.amelia@example.com",
      phone: "081234567817",
      address: "Nganjuk, Jawa Timur"
    }
  },
  { 
    id: 29, 
    name: "Doni Setiawan", 
    nickname: "S29", 
    portfolioUrl: "https://doni-setiawan.vercel.app",
    interests: ['Mobile Development', 'Hybrid Apps', 'PWA'],
    skills: ['Ionic', 'Capacitor', 'Angular', 'PWA', 'Service Workers'],
    favoriteProject: "PWA for News Portal",
    achievement: "Best PWA Implementation",
    avatar: "/avatars/avatar29.jpg",
    contact: {
      email: "doni.setiawan@example.com",
      phone: "081234567818",
      address: "Nganjuk, Jawa Timur"
    }
  },
  { 
    id: 30, 
    name: "Eva Nurmalasari", 
    nickname: "S30", 
    portfolioUrl: "https://eva-nurmalasari.vercel.app",
    interests: ['Mobile Development', 'Mobile Games', 'AR Apps'],
    skills: ['Unity', 'ARKit', 'ARCore', 'C#', 'Mobile AR'],
    favoriteProject: "AR Shopping Experience App",
    achievement: "AR Innovation Award",
    avatar: "/avatars/avatar30.jpg",
    contact: {
      email: "eva.nurmalasari@example.com",
      phone: "081234567819",
      address: "Nganjuk, Jawa Timur"
    }
  },
  { 
    id: 31, 
    name: "Fadli Ramadhan", 
    nickname: "S31", 
    portfolioUrl: "https://fadli-ramadhan.vercel.app",
    interests: ['Mobile Development', 'IoT Apps', 'Bluetooth'],
    skills: ['React Native', 'Bluetooth LE', 'IoT Protocols', 'Native Modules'],
    favoriteProject: "IoT Home Automation Controller",
    achievement: "IoT Solution Innovation",
    avatar: "/avatars/avatar31.jpg",
    contact: {
      email: "fadli.ramadhan@example.com",
      phone: "081234567820",
      address: "Nganjuk, Jawa Timur"
    }
  },
  { 
    id: 32, 
    name: "Gina Septyani", 
    nickname: "S32", 
    portfolioUrl: "https://gina-septyani.vercel.app",
    interests: ['Mobile Development', 'Mobile Banking', 'Security'],
    skills: ['Flutter', 'Biometric Auth', 'Encryption', 'Mobile Security'],
    favoriteProject: "Secure Banking App",
    achievement: "Mobile Security Excellence",
    avatar: "/avatars/avatar32.jpg",
    contact: {
      email: "gina.septyani@example.com",
      phone: "081234567821",
      address: "Nganjuk, Jawa Timur"
    }
  }
];

export const loadStudentsData = () => {
  if (typeof window === 'undefined') {
    return initialStudents;
  }

  try {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (Array.isArray(parsedData) && parsedData.length > 0) {
        console.log('Data loaded from localStorage:', parsedData.length, 'students');
        return parsedData;
      }
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }

  console.log('Using initial data:', initialStudents.length, 'students');
  return initialStudents;
};

const students = loadStudentsData();

export const classInfo = {
  name: "XI PPLG 1",
  school: "SMKN 2 Nganjuk",
  location: "Nganjuk, Kramat",
  major: "Pengembangan Perangkat Lunak dan Gim (PPLG)",
  totalStudents: 32,
  year: "2024/2025",
  motto: "Code, Create, Innovate"
};

export default students;