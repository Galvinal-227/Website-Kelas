import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, Trash, Send, X, Bot, 
  Minimize2, Maximize2, Smile, Mic, MicOff,
  Loader2, Brain, User, Sparkles,
  ChevronUp, ChevronDown, Maximize, Minimize,
  Book, GraduationCap, Lightbulb, Zap,
  Cpu, Wifi, WifiOff, RefreshCw,
  Settings, CheckCircle, Info
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Chatbot = () => {
  // Gunakan user dari AuthContext
  const { currentUser } = useAuth();
  
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Halo! 👋 Saya **ElevoneAI**",
      sender: 'ai',
      timestamp: new Date(),
      username: 'ElevoneAI'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messageId, setMessageId] = useState(2);
  const [apiStatus, setApiStatus] = useState('idle');
  const [selectedModel, setSelectedModel] = useState('gpt-5-nano');
  const [userDisplayName, setUserDisplayName] = useState('User');
  
  // Refs
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatWindowRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const recognitionRef = useRef(null);

  // Available models dari Puter.ai
  const availableModels = [
    { id: 'gpt-5-nano', name: 'GPT-5 Nano', desc: 'Cepat & Ringan' },
    { id: 'gpt-4', name: 'GPT-4', desc: 'Powerful' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', desc: 'Seimbang' },
    { id: 'gemini-2.5-flash', stream: true , name: 'Gemini 2.5 Flash', desc: 'Cepat & Akurat' },
    { id: 'o3-mini', stream: true , name: 'O3 Mini', desc: 'Ringan & Efisien' },
    { id: 'deepseek-v3.2', stream: true, name: 'DeepSeek v3.2', desc: 'Cepat & Akurat' },
    { id: 'deepseek-reasoner', stream: true, name: 'DeepSeek Reasoner', desc: 'Analitis & Logis' },
    { id: 'claude-sonnet-4.5', stream: true, name: 'Claude Sonnet 4.5', desc: 'Cerdas & Logis' },
    { id: 'grok-4-fast', stream: true, name: 'Grok 4 Fast', desc: 'Cepat & Akurat' }
  ];

  // Fungsi untuk mendapatkan nama yang akan ditampilkan
  const getDisplayName = () => {
    if (!currentUser) return 'Pengguna';
    
    // Prioritaskan displayName, lalu email, lalu fallback
    if (currentUser.displayName && currentUser.displayName.trim() !== '') {
      return currentUser.displayName;
    }
    if (currentUser.email) {
      return currentUser.email.split('@')[0];
    }
    return 'Pengguna';
  };

  // System prompt dengan nama pengguna
  const getSystemPrompt = () => {
    const displayName = getDisplayName();
    return `Kamu adalah ElevoneAI, asisten AI pembelajaran yang ramah dan helpful.

ATURAN UTAMA:
1. Gunakan Bahasa Indonesia yang santai, sopan, dan mudah dipahami.
2. Selalu jawab pertanyaan dari ${displayName} dengan sikap positif dan mendukung.
3. Berikan jawaban yang informatif, praktis, dan langsung ke inti masalah.
4. Gunakan contoh konkret dari kehidupan sehari-hari agar mudah dipahami.
5. Gunakan format jawaban yang rapi dan enak dibaca:
   - Paragraf pendek dan jelas
   - Bullet point jika perlu
   - **Bold** untuk poin penting
6. Tambahkan emoji secukupnya agar terasa hidup dan ramah 😊
7. Batasi jawaban maksimal 400 kata.
8. Jangan menyebutkan istilah teknis seperti “sebagai AI” atau “model bahasa”.
9. Gunakan nama pengguna ${displayName} saat menyapa atau merujuk user.
10. Jika pertanyaan kurang jelas, minta klarifikasi dengan cara santai dan singkat.
11. Jika user bingung atau kesulitan, beri arahan bertahap dan tawarkan bantuan tambahan.
12. Jika ${displayName} meminta dibuatkan gambar:
    - Tanyakan detail penting bila belum jelas (gaya, objek, warna, sudut pandang).
    - Buat deskripsi gambar yang jelas, detail, dan sesuai permintaan.
    - Langsung buat gambar tanpa penjelasan teknis tambahan `
};


  // Update userDisplayName saat user berubah
  useEffect(() => {
    console.log('Chatbot - currentUser:', currentUser);
    
    if (currentUser) {
      if (currentUser.displayName && currentUser.displayName.trim() !== '') {
        setUserDisplayName(currentUser.displayName);
        console.log('Set display name to:', currentUser.displayName);
      } else if (currentUser.email) {
        const emailName = currentUser.email.split('@')[0];
        setUserDisplayName(emailName);
        console.log('Set display name from email:', emailName);
      } else {
        setUserDisplayName('Pengguna');
        console.log('Set display name to default');
      }
    } else {
      setUserDisplayName('User');
      console.log('No user, set to User');
    }
  }, [currentUser]);

  // Load Puter.ai script on component mount
  useEffect(() => {
    loadPuterScript();
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'id-ID';

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        setInputMessage(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  }, []);

  // Handle click outside emoji picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load Puter.ai script
  const loadPuterScript = () => {
    return new Promise((resolve) => {
      if (window.puter) {
        console.log('Puter.ai sudah loaded');
        setApiStatus('ready');
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://js.puter.com/v2/';
      script.async = true;
      
      script.onload = () => {
        console.log('Puter.ai script loaded successfully');
        setApiStatus('ready');
        resolve();
      };
      
      script.onerror = () => {
        console.error('❌ Failed to load Puter.ai script');
        setApiStatus('error');
        resolve();
      };
      
      document.head.appendChild(script);
    });
  };

  const simulateTyping = async (text, callback) => {
    setIsTyping(true);
    let displayedText = "";
    
    const speed = text.length > 300 ? 10 : 20;
    
    for (let i = 0; i < text.length; i++) {
      displayedText += text[i];
      callback(displayedText);
      await new Promise(resolve => setTimeout(resolve, speed));
    }
    setIsTyping(false);
  };

  const addSystemNotification = (text) => {
    const notificationId = messageId;
    setMessageId(prev => prev + 1);
    
    const notificationMessage = {
      id: notificationId,
      text: text,
      sender: 'system',
      timestamp: new Date(),
      type: 'notification'
    };
    
    setMessages(prev => [...prev, notificationMessage]);
    
    setTimeout(() => {
      setMessages(prev => prev.filter(msg => msg.id !== notificationId));
    }, 5000);
  };

  const sendToAI = async (message) => {
    console.log(`Menggunakan Puter.ai dengan model: ${selectedModel}`);
    
    if (!window.puter) {
      console.log('Puter.ai belum loaded, mencoba load...');
      await loadPuterScript();
      
      if (!window.puter) {
        console.log('Gagal load Puter.ai');
        return getMockResponse(message);
      }
    }
    
    try {
      setApiStatus('loading');
      const fullPrompt = `${getSystemPrompt()}\n\nPertanyaan user: ${message}\n\nJawab dalam Bahasa Indonesia:`;
      
      console.log('Mengirim ke Puter.ai...');
      
      const response = await window.puter.ai.chat(fullPrompt, {
        model: selectedModel,
        stream: false  
      });
      
      console.log('Puter.ai response:', response);
      setApiStatus('ready');
      
      let aiText = '';
      
      if (typeof response === 'string') {
        aiText = response;
      } else if (response && response.message && response.message.content) {
        aiText = response.message.content;
      } else if (response && response.content) {
        aiText = response.content;
      } else if (response && response.text) {
        aiText = response.text;
      } else if (response && response.choices && response.choices[0] && response.choices[0].message) {
        aiText = response.choices[0].message.content;
      } else {
        console.log('Format response tidak dikenal:', response);
        aiText = getMockResponse(message);
      }
      
      return aiText || getMockResponse(message);
      
    } catch (error) {
      console.error('Error Puter.ai:', error);
      setApiStatus('error');
      
      // Fallback ke mock response
      return getMockResponse(message);
    }
  };

  // Mock response fallback dengan nama pengguna
  const getMockResponse = (message) => {
    const displayName = getDisplayName();
    const mockResponses = [
      `Hai **${displayName}**! 👋 Terima kasih atas pertanyaannya: **"${message}"**\n\nSebagai ElevoneAI, saya siap membantu pembelajaran Anda! 🎓\n\n**Tips belajar hari ini:**\n• Fokus 25 menit, istirahat 5 menit (Pomodoro)\n• Buat catatan dengan warna berbeda\n• Ajarkan ke teman untuk memahami lebih dalam\n• Review sebelum tidur untuk memori kuat\n\nMau belajar topik spesifik apa? 😊`,
      
      `Pertanyaan menarik dari **${displayName}**! **"${message.substring(0, 50)}..."**\n\n🎯 **Strategi belajar efektif:**\n1. **Active Recall:** Tes diri tanpa lihat catatan\n2. **Spaced Repetition:** Review berkala\n3. **Interleaving:** Campur beberapa materi\n4. **Elaboration:** Hubungkan dengan pengetahuan lain\n\nIngin penjelasan detail tentang salah satunya? 📚`,
      
      `Wah, topik yang bagus **${displayName}**! **"${message}"**\n\n💡 **Fakta menarik tentang otak dan belajar:**\n• Otak lebih mudah mengingat informasi visual\n• Musik klasik bisa meningkatkan konsentrasi\n• Olahraga ringan meningkatkan aliran darah ke otak\n• Tidur yang cukup penting untuk konsolidasi memori\n\nAda pertanyaan lain tentang belajar efektif? 🧠`,
      
      `Terima kasih sudah bertanya **${displayName}**! 🙏\n\nTentang **"${message}"**, berikut poin penting:\n\n✨ **Kunci sukses belajar:**\n✅ Konsistensi > durasi panjang\n✅ Pahami konsep, bukan hafalan\n✅ Praktek langsung lebih efektif\n✅ Evaluasi progress rutin\n\nButuh contoh konkrit atau studi kasus? 🔍`,
      
      `ElevoneAI di sini **${displayName}**! 🤖\n\n**"${message}"** adalah topik yang penting untuk dipelajari.\n\n📖 **Saran sumber belajar:**\n• Video edukasi di YouTube\n• Buku teks dengan contoh soal\n• Forum discusi online\n• Aplikasi belajar interaktif\n• Tutor/guru untuk bimbingan\n\nMau rekomendasi spesifik? 🎯`
    ];
    
    return mockResponses[Math.floor(Math.random() * mockResponses.length)];
  };

  // Main function untuk mengirim pesan
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage;
    setInputMessage('');
    setShowEmojiPicker(false);
    
    // Stop listening jika sedang aktif
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    
    // Debug: cek user display name
    console.log('Sending message with display name:', userDisplayName);
    console.log('Current user:', currentUser);
    const userMessageObj = {
      id: messageId,
      text: userMessage,
      sender: 'user', 
      timestamp: new Date(),
      username: userDisplayName
    };
    
    console.log('User message object:', userMessageObj);
    
    setMessageId(prev => prev + 1);
    setMessages(prev => [...prev, userMessageObj]);
    setIsLoading(true);

    try {
      const aiResponse = await sendToAI(userMessage);
      
      const aiMessageObj = {
        id: messageId + 1,
        text: "",
        sender: 'ai',
        timestamp: new Date(),
        username: 'ElevoneAI'
      };
      
      setMessageId(prev => prev + 2);
      setMessages(prev => [...prev, aiMessageObj]);
      
      // Simulasi typing effect
      simulateTyping(aiResponse, (typedText) => {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          newMessages[lastIndex] = {
            ...aiMessageObj,
            text: typedText
          };
          return newMessages;
        });
      });

    } catch (error) {
      console.error('Error:', error);
      
      let errorMessage = "**Maaf, terjadi kesalahan!**\n\n";
      errorMessage += "Sistem AI sedang mengalami gangguan sementara.\n";
      errorMessage += "Silakan coba lagi dalam beberapa saat.\n\n";
      errorMessage += "**Tips:**\n• Refresh halaman\n• Cek koneksi internet\n• Gunakan model AI lain jika tersedia\n\n";

      const errorMessageObj = {
        id: messageId + 1,
        text: errorMessage,
        sender: 'ai',
        timestamp: new Date(),
        username: 'ElevoneAI'
      };
      
      setMessageId(prev => prev + 2);
      setMessages(prev => [...prev, errorMessageObj]);
      
      simulateTyping(errorMessage, (typedText) => {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          newMessages[lastIndex] = {
            ...errorMessageObj,
            text: typedText
          };
          return newMessages;
        });
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat
  const clearChat = () => {
    if (window.confirm("Yakin mau mulai percakapan baru?")) {
      setMessages([{
        id: 1,
        text: "Halo! 👋 Saya **ElevoneAI**",
        sender: 'ai',
        timestamp: new Date(),
        username: 'ElevoneAI'
      }]);
      setMessageId(2);
    }
  };

  // Toggle voice input
  const toggleListening = () => {
    if (!recognitionRef.current) {
      addSystemNotification("Browser tidak mendukung voice recognition. Gunakan Chrome atau Edge terbaru.");
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          recognitionRef.current.start();
          setIsListening(true);
        })
        .catch(() => {
          addSystemNotification("Izin mikrofon diperlukan untuk voice input.");
        });
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      setIsMinimized(false);
    }
  };

  const changeModel = (modelId) => {
    const oldModelName = availableModels.find(m => m.id === selectedModel)?.name || selectedModel;
    const newModel = availableModels.find(m => m.id === modelId);
    const newModelName = newModel?.name || modelId;
    
    setSelectedModel(modelId);
    
    addSystemNotification(`**Diubah** ke ${newModelName}`);
    
    // Log ke console
    console.log(`Model AI diubah dari ${oldModelName} ke ${newModelName}`);
  };

  const testPuterAI = async () => {
    console.log('Testing Puter.ai connection...');
    
    if (!window.puter) {
      await loadPuterScript();
    }
    
    if (window.puter) {
      try {
        addSystemNotification("**Sedang menguji koneksi Puter.ai...**");
        
        const response = await window.puter.ai.chat('Halo, test koneksi. Jawab singkat dalam Bahasa Indonesia.', {
          model: selectedModel,
          stream: false
        });
        
        console.log('Test response:', response);
        
        let responseText = '';
        
        if (typeof response === 'string') {
          responseText = response;
        } else if (response && response.message && response.message.content) {
          responseText = response.message.content;
        } else if (response && response.content) {
          responseText = response.content;
        } else if (response && response.text) {
          responseText = response.text;
        } else if (response && response.choices && response.choices[0] && response.choices[0].message) {
          responseText = response.choices[0].message.content;
        } else {
          responseText = JSON.stringify(response).substring(0, 100) + '...';
        }
        
        addSystemNotification(`**Test Koneksi BERHASIL!**\n\nAI Response: "${responseText.substring(0, 100)}..."`);
      } catch (error) {
        console.error('Test failed:', error);
        addSystemNotification(`**Test Koneksi GAGAL**\n\nError: ${error.message}`);
      }
    } else {
      addSystemNotification("Puter.ai tidak terload. Coba refresh halaman.");
    }
  };

  const reloadPuterScript = () => {
    console.log('Reloading Puter.ai script...');
    setApiStatus('loading');
    addSystemNotification("**Sedang me-reload Puter.ai script...**");
    
    const existingScript = document.querySelector('script[src="https://js.puter.com/v2/"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    window.puter = undefined;
    
    setTimeout(() => {
      loadPuterScript().then(() => {
        addSystemNotification("**Puter.ai script berhasil di-reload!**");
      });
    }, 500);
  };

  const onEmojiClick = (emojiData) => {
    setInputMessage(prev => prev + emojiData.emoji);
    inputRef.current.focus();
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessageContent = (message) => {
    if (message.type === 'notification') {
      return (
        <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/20 border border-blue-700/30 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-300">
              {renderTextWithMarkdown(message.text)}
            </div>
          </div>
          <div className="text-xs text-blue-400/70 text-right mt-2">
            {formatTime(message.timestamp)}
          </div>
        </div>
      );
    }
    
    return renderTextWithMarkdown(message.text);
  };

  const renderTextWithMarkdown = (text) => {
    const lines = text.split('\n');
    
    return lines.map((line, lineIndex) => {
      if (line.trim() === '') {
        return <br key={lineIndex} />;
      }
      
      let processedLine = line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      const boldMatches = [...line.matchAll(boldRegex)];
      
      if (boldMatches.length > 0) {
        let elements = [];
        let lastIndex = 0;
        
        boldMatches.forEach((match, matchIndex) => {
          if (match.index > lastIndex) {
            elements.push(
              <span key={`${lineIndex}-${matchIndex}-before`}>
                {processedLine.substring(lastIndex, match.index)}
              </span>
            );
          }
          
          elements.push(
            <strong key={`${lineIndex}-${matchIndex}-bold`} className="font-bold text-white">
              {match[1]}
            </strong>
          );
          
          lastIndex = match.index + match[0].length;
        });
        
        if (lastIndex < processedLine.length) {
          elements.push(
            <span key={`${lineIndex}-after`}>
              {processedLine.substring(lastIndex)}
            </span>
          );
        }
        
        return <p key={lineIndex} className="mb-2 text-gray-100">{elements}</p>;
      }
      
      if (line.startsWith('- ') || line.startsWith('• ') || line.startsWith('* ')) {
        return (
          <div key={lineIndex} className="flex items-start mb-1 ml-2">
            <span className="mr-2 mt-1 text-gray-400">•</span>
            <span className="text-gray-100">{line.substring(2)}</span>
          </div>
        );
      }
      
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={lineIndex} className="flex items-start mb-1 ml-2">
            <span className="mr-2 font-medium text-gray-300">{line.match(/^\d+/)[0]}.</span>
            <span className="text-gray-100">{line.substring(line.indexOf('. ') + 2)}</span>
          </div>
        );
      }
      
      return <p key={lineIndex} className="mb-2 text-gray-100">{line}</p>;
    });
  };

  const getWindowDimensions = () => {
    if (isFullscreen) {
      return {
        width: 'calc(100vw - 40px)',
        height: 'calc(100vh - 40px)',
        left: '20px',
        top: '20px'
      };
    }
    
    if (isMinimized) {
      return {
        width: '320px',
        height: 'auto',
        left: `${window.innerWidth - 340}px`,
        top: '20px'
      };
    }
    
    return {
      width: '450px',
      height: '650px',
      left: `${window.innerWidth - 470}px`,
      top: '20px'
    };
  };

  const windowDimensions = getWindowDimensions();

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-2xl hover:shadow-purple-500/30 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Brain className="w-6 h-6" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatWindowRef}
            className="fixed z-50 bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-700 rounded-xl shadow-2xl flex flex-col"
            style={{
              width: windowDimensions.width,
              height: windowDimensions.height,
              left: windowDimensions.left,
              top: windowDimensions.top,
            }}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              transition: {
                type: "spring",
                stiffness: 200,
                damping: 25
              }
            }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-t-xl flex justify-between items-center border-b border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                  <Bot className="text-white w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold gradient-text">ElevoneAI</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Cpu className="w-3 h-3 text-green-400" />
                    <span className="text-xs text-gray-300">
                      {availableModels.find(m => m.id === selectedModel)?.name || 'GPT-5 Nano'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={toggleFullscreen}
                  className="p-2 hover:bg-gray-700 rounded-lg transition"
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? <Minimize className="w-4 h-4 text-white" /> : <Maximize className="w-4 h-4 text-white" />}
                </button>
                {!isFullscreen && (
                  <button 
                    onClick={() => setIsMinimized(!isMinimized)} 
                    className="p-2 hover:bg-gray-700 rounded-lg transition"
                    title={isMinimized ? "Maximize" : "Minimize"}
                  >
                    {isMinimized ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4 text-white" />}
                  </button>
                )}
                <button 
                  onClick={clearChat} 
                  className="p-2 hover:bg-gray-700 rounded-lg transition"
                  title="Bersihkan chat"
                >
                  <Trash className="w-4 h-4 text-white" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-2 hover:bg-red-500/20 rounded-lg transition"
                  title="Tutup"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-900 to-gray-950">
                  <AnimatePresence>
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        className={`flex ${msg.sender === 'system' ? 'justify-center' : 
                                  msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {msg.sender === 'system' ? (
                          <div className="w-full max-w-[85%]">
                            {renderMessageContent(msg)}
                          </div>
                        ) : (
                          <div 
                            className={`max-w-[85%] rounded-xl p-4 ${msg.sender === 'user' ? 
                              'bg-gradient-to-r from-gray-800 to-gray-900 text-white' : 
                              'bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100 border border-gray-700'}`}
                          >
                            {/* Sender Icon */}
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${msg.sender === 'user' ? 'bg-gradient-to-r from-yellow-500 to-orange-600' : 'bg-gradient-to-r from-yellow-500 to-orange-600'}`}>
                                {msg.sender === 'user' ? 
                                  <User className="w-3 h-3 text-white" /> : 
                                  <Bot className="w-3 h-3 text-white" />
                                }
                              </div>
                              <span className="text-xs font-medium">
                                {msg.sender === 'user' ? userDisplayName : 'ElevoneAI'}
                              </span>
                            </div>
                            
                            {/* Message Content */}
                            <div className="whitespace-pre-wrap break-words">
                              {renderMessageContent(msg)}
                            </div>
                            
                            {/* Message Footer */}
                            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-700/50">
                              <div className="text-xs text-gray-400">
                                {formatTime(msg.timestamp)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {msg.sender === 'ai' ? 'AI Assistant' : 'Anda'}
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {/* Typing Indicator */}
                  {(isLoading || isTyping) && (
                    <motion.div 
                      className="flex justify-start"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700 max-w-[85%]">
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1">
                            <motion.div 
                              className="w-2 h-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full"
                              animate={{ y: [0, -4, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity }}
                            />
                            <motion.div 
                              className="w-2 h-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full"
                              animate={{ y: [0, -4, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                            />
                            <motion.div 
                              className="w-2 h-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full"
                              animate={{ y: [0, -4, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                            />
                          </div>
                          <div className="text-sm text-gray-300">
                            {apiStatus === 'loading' ? 'Tunggu...' : 'Mengetik...'}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-gray-800 p-4 bg-gradient-to-t from-gray-900 to-gray-950">
                  {showEmojiPicker && (
                    <div ref={emojiPickerRef} className="absolute bottom-20 right-4 z-50">
                      <EmojiPicker onEmojiClick={onEmojiClick} theme="dark" />
                    </div>
                  )}
                  
                  {/* Model Selector */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">AI Model:</span>
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1 ${apiStatus === 'ready' ? 'text-green-400' : apiStatus === 'error' ? 'text-red-400' : 'text-yellow-400'}`}>
                          {apiStatus === 'ready' ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                          <span className="text-xs">
                            {apiStatus === 'ready' ? 'Connected' : 
                             apiStatus === 'loading' ? 'Connecting...' : 
                             apiStatus === 'error' ? 'Disconnected' : 'Idle'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {availableModels.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => changeModel(model.id)}
                          className={`px-2 py-1 rounded text-xs transition ${selectedModel === model.id ? 
                            'gradient-text font-medium' : 
                            'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                          title={model.desc}
                        >
                          {model.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <form onSubmit={sendMessage} className="flex flex-col gap-3">
                    <div className="flex gap-2 w-full">
                      {/* Emoji Button */}
                      <button 
                        type="button" 
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
                        className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-lg hover:bg-gray-700 transition-all"
                        title="Emoji"
                      >
                        <Smile className="w-5 h-5 text-gray-400" />
                      </button>
                      
                      {/* Voice Input Button */}
                      <button 
                        type="button" 
                        onClick={toggleListening} 
                        className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg transition-all ${isListening ? 
                          'bg-gradient-to-r from-red-600 to-red-700 text-white animate-pulse' : 
                          'bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 text-gray-400 hover:bg-gray-700'}`}
                        title="Voice Input"
                      >
                        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      </button>
                      
                      {/* Input Field */}
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder={isListening ? "Bicaralah..." : `Ketik pesan Anda...`}
                        className="flex-1 min-w-0 h-12 bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-lg px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        disabled={isLoading}
                      />
                      
                      {/* Send Button */}
                      <motion.button 
                        type="submit" 
                        className="flex-shrink-0 bg-gradient-to-r from-yellow-500 to-orange-600 text-white w-12 h-12 flex items-center justify-center rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isLoading || !inputMessage.trim()}
                        title="Kirim"
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </motion.button>
                    </div>
                  
                    {/* Voice Status Indicator */}
                    {isListening && (
                      <div className="mt-1 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                          </div>
                          <span className="text-xs text-red-400 font-medium">
                            Mendengarkan... Klik tombol mikrofon untuk berhenti.
                          </span>
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;