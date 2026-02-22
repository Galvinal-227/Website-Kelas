// pages/Help.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HelpCircle,
  Shield,
  User,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  AlertCircle,
  ChevronRight,
  FileText,
  MessageCircle,
  Settings,
  ExternalLink,
  Copy,
  Check,
  Clock,
  Calendar,
  Award,
  School,
  ChevronLeft,
  Info,
  Smartphone,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from 'lucide-react';

const Help = () => {
  const [copied, setCopied] = useState(false);
  const [adminData, setAdminData] = useState({
    displayName: 'Administrator XI PPLG 1',
    email: 'admin@gmail.com',
    bio: `ولا تقرّبوا الرَّحْى إِنَّهُ كَانَ فَاحِشَةً وَسَاءَ سَبِيلًا
Janganlah kamu mendekati zina.
Sesungguhnya (zina) itu adalah perbuatan keji dan izin terhadap`,
    phone: '085647527381',
    location: 'SMKN 2 NGANJUK'
  });

  // Load data dari localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('adminHelpData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setAdminData(parsed);
      } catch (e) {
        console.error('Error parsing admin data:', e);
      }
    }
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqItems = [
    {
      question: 'Apa itu XI PPLG 1?',
      answer: 'XI PPLG 1 adalah kelas 11 jurusan Pengembangan Perangkat Lunak dan Gim di SMKN 2 Nganjuk. Kelas ini terdiri dari siswa-siswi yang berfokus pada pembelajaran pemrograman, pengembangan aplikasi, dan teknologi informasi.'
    },
    {
      question: 'Bagaimana cara bergabung?',
      answer: 'Anda dapat mendaftar melalui halaman Sign Up dengan menggunakan email aktif. Setelah mendaftar, Anda perlu menunggu persetujuan dari admin untuk dapat mengakses fitur-fitur kelas.'
    },
    {
      question: 'Apa saja fitur yang tersedia?',
      answer: 'Fitur yang tersedia meliputi informasi anggota kelas, galeri foto kegiatan, kontak pengurus, dan diskusi kelas. Anda juga dapat melihat pengumuman penting di halaman utama.'
    },
    {
      question: 'Bagaimana cara menghubungi admin?',
      answer: 'Anda dapat menghubungi admin melalui email atau nomor telepon yang tersedia di halaman ini. Admin biasanya merespon dalam waktu 1x24 jam.'
    }
  ];

  const guidelines = [
    'Gunakan bahasa yang sopan dan santun dalam berkomunikasi',
    'Hormati sesama anggota kelas',
    'Jaga kerahasiaan data pribadi',
    'Laporkan masalah kepada admin jika menemukan kendala',
    'Ikuti aturan dan tata tertib yang berlaku',
    'Dilarang menyebarkan konten yang tidak pantas',
    'Gunakan fitur dengan bijak dan tanggung jawab'
  ];

  const contactMethods = [
    {
      icon: <Mail size={20} />,
      label: 'Email',
      value: adminData.email,
      color: 'text-red-400',
      bg: 'bg-red-900/20',
      border: 'border-red-800'
    },
    {
      icon: <Phone size={20} />,
      label: 'Telepon',
      value: adminData.phone,
      color: 'text-green-400',
      bg: 'bg-green-900/20',
      border: 'border-green-800'
    },
    {
      icon: <MapPin size={20} />,
      label: 'Lokasi',
      value: adminData.location,
      color: 'text-blue-400',
      bg: 'bg-blue-900/20',
      border: 'border-blue-800'
    }
  ];

  const socialMedia = [
    { icon: <Facebook size={18} />, name: 'Facebook', url: '#' },
    { icon: <Twitter size={18} />, name: 'Twitter', url: '#' },
    { icon: <Instagram size={18} />, name: 'Instagram', url: '#' },
    { icon: <Youtube size={18} />, name: 'YouTube', url: '#' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 pt-20 pb-10">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => window.history.back()}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-orange-400"
            >
              <ChevronLeft size={20} />
            </button>
            <HelpCircle className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              Pusat Bantuan
            </h1>
          </div>
          <p className="text-gray-400 ml-14">
            Informasi kontak admin dan panduan penggunaan website kelas XI PPLG 1
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Admin Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Admin Profile Card */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700/30 overflow-hidden sticky top-24">
              <div className="p-6 text-center border-b border-gray-700/30">
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 
                    flex items-center justify-center text-3xl font-bold text-white mx-auto
                    border-4 border-gray-800 shadow-xl">
                    {adminData.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-red-600 to-orange-600 
                    border-2 border-gray-900 flex items-center justify-center">
                    <Shield size={12} className="text-white" />
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-white mb-1">{adminData.displayName}</h2>
                <div className="flex items-center justify-center gap-1 mb-3">
                  <Shield size={14} className="text-orange-500" />
                  <span className="text-xs px-2 py-1 bg-gradient-to-r from-red-600/20 to-orange-600/20 
                    text-orange-300 rounded-full border border-orange-500/30">
                    Administrator
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="p-4 space-y-3">
                {contactMethods.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 rounded-xl border bg-gray-800/30 hover:bg-gray-800/50 transition-colors cursor-pointer group"
                    onClick={() => copyToClipboard(item.value)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center ${item.color}`}>
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">{item.label}</p>
                        <p className="text-sm text-white">{item.value}</p>
                      </div>
                    </div>
                    <div className="text-gray-500 group-hover:text-orange-400">
                      {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Media */}
              <div className="p-4 border-t border-gray-700/30">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Media Sosial</h4>
                <div className="flex justify-center gap-4">
                  {socialMedia.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      className="w-10 h-10 rounded-full bg-gray-800 hover:bg-orange-600/20 flex items-center justify-center text-gray-400 hover:text-orange-400 transition-all duration-200 border border-gray-700 hover:border-orange-500/50"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - FAQ & Guidelines */}
          <div className="lg:col-span-2 space-y-6">
            {/* Admin Bio */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700/30 overflow-hidden">
              <div className="p-6 border-b border-gray-700/30">
                <div className="flex items-center gap-2">
                  <Info size={20} className="text-orange-500" />
                  <h3 className="text-lg font-semibold text-orange-400">Tentang Admin</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                  {adminData.bio}
                </p>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700/30 overflow-hidden">
              <div className="p-6 border-b border-gray-700/30">
                <div className="flex items-center gap-2">
                  <HelpCircle size={20} className="text-orange-500" />
                  <h3 className="text-lg font-semibold text-orange-400">Pertanyaan Umum (FAQ)</h3>
                </div>
              </div>
              
              <div className="divide-y divide-gray-800">
                {faqItems.map((item, index) => (
                  <div key={index} className="p-6 hover:bg-gray-800/20 transition-colors">
                    <h4 className="font-semibold text-white mb-2 flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">Q:</span>
                      {item.question}
                    </h4>
                    <p className="text-gray-400 text-sm pl-6 leading-relaxed">
                      <span className="text-orange-500 mr-2">A:</span>
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700/30 overflow-hidden">
              <div className="p-6 border-b border-gray-700/30">
                <div className="flex items-center gap-2">
                  <BookOpen size={20} className="text-orange-500" />
                  <h3 className="text-lg font-semibold text-orange-400">Panduan Penggunaan</h3>
                </div>
              </div>
              
              <div className="p-6">
                <ul className="space-y-3">
                  {guidelines.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-orange-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                      </div>
                      <span className="text-gray-300 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-gradient-to-br from-orange-600/20 to-amber-600/20 rounded-2xl border border-orange-500/30 overflow-hidden">
              <div className="p-6 text-center">
                <AlertCircle size={32} className="text-orange-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Butuh Bantuan Lebih Lanjut?</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Hubungi admin melalui email atau telepon yang tersedia. Kami akan merespon secepatnya.
                </p>
                <div className="flex justify-center gap-3">
                  <a
                    href={`mailto:${adminData.email}`}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-white font-medium text-sm transition-colors inline-flex items-center gap-2"
                  >
                    <Mail size={16} />
                    Email Admin
                  </a>
                  <a
                    href={`https://wa.me/${adminData.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium text-sm transition-colors inline-flex items-center gap-2"
                  >
                    <MessageCircle size={16} />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-xs text-gray-500 border-t border-gray-800 pt-6">
          <p>© 2024 Kelas XI PPLG 1 - SMKN 2 Nganjuk. All rights reserved.</p>
          <p className="mt-1">Last updated: {new Date().toLocaleDateString('id-ID')}</p>
        </div>
      </div>
    </div>
  );
};

export default Help;