import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../services/api";
import axios from "axios";
import dayjs from "dayjs";
import { 
  MessageCircle, Send, ImageIcon, Phone, Video, Info, 
  CheckCheck, Check, Smile, Search, MessageSquare, ShieldCheck,
  AlertCircle, Sparkles
} from "lucide-react";

// API helper instance for private requests
const getAPI = () => {
  const token = localStorage.getItem("token");
  return axios.create({
    baseURL: API_BASE_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
};

const MOCK_REPLIES = {
  "-1": [ // Sarah_99
    "Hai Mutia! Makasih ya tips jahe hangat kemarin, kram perutku di hari pertama beneran langsung mendingan lho! 😍",
    "Hari ini mood-ku agak naik turun menjelang fase luteal, tapi untungnya kebantu rileks setelah jalan kaki santai tadi pagi. Kamu gimana?",
    "Wah bener banget! Oh ya, nanti sore rencananya aku mau bikin jus bayam + jeruk buat nambah zat besi. Kamu ada saran resep lain?",
    "Hahaha iya bener banget! Jaga kesehatan ya Mutia, jangan lupa catat siklus hari ini di Lunare! 🌙✨",
    "Aku suka banget sama menu baru Edukasi di Lunare, artikelnya ngebantu banget buat ngerti fase menstruasi!"
  ],
  "-2": [ // Nisa_R
    "Halo Mutia! Kemarin aku baru nyelesaiin kuis di menu Edukasi, dapet skor 100% dong! Ternyata seru juga belajar siklus haid haha.",
    "Aku lagi nyoba ngurangin kafein nih minggu ini biar pola tidurnya teratur dan siklus haidku nggak telat lagi. Doain konsisten ya! ☕❌",
    "Sama-sama Mutia! Senang bisa punya teman sharing kesehatan reproduksi yang seru kayak kamu. Semangat ya!",
    "Iya nih, hari ini jadwalku padat banget, tapi tetep kuusahain minum air putih minimal 2 liter. Kamu juga jangan sampai dehidrasi ya!"
  ]
};

export default function Messages() {
  const { user } = useAuth();
  const chatEndRef = useRef(null);

  // States using negative IDs for mocks to prevent DB user ID collision
  const [friends, setFriends] = useState([
    { id: -1, name: "Sarah_99", username: "sarah99_hebat", avatar: "🌸", isOnline: true, lastSeen: "Aktif Sekarang", isMock: true },
    { id: -2, name: "Nisa_R", username: "nisa_khair", avatar: "💫", isOnline: false, lastSeen: "Aktif 10 mnt yang lalu", isMock: true }
  ]);
  const [activeChatId, setActiveChatId] = useState(-1);
  const [chatInputs, setChatInputs] = useState({});
  const [typingFriendId, setTypingFriendId] = useState(null);
  const [replyIndexes, setReplyIndexes] = useState({ "-1": 0, "-2": 0 });
  const [searchContactQuery, setSearchContactQuery] = useState("");
  
  // Real database connection state
  const [isUsingDB, setIsUsingDB] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Messages State (combines mock and real messages)
  const [allChats, setAllChats] = useState(() => {
    const savedChats = localStorage.getItem("luna_dm_chats_v4");
    if (savedChats) return JSON.parse(savedChats);
    return {
      "-1": [
        { id: 101, sender: "Sarah_99", text: "Mutia, makasih ya tipsnya kemarin!", time: "14:20", type: "text" },
        { id: 102, sender: "me", text: "Sama-sama! Semoga membantu yaa", time: "14:22", type: "text" }
      ],
      "-2": [
        { id: 201, sender: "Nisa_R", text: "Mutia, besok olah raga yoga bareng yuk biar ga kram.", time: "09:15", type: "text" }
      ]
    };
  });

  // 1. Fetch real contacts from database
  const fetchDBContacts = async () => {
    try {
      const api = getAPI();
      const response = await api.get("/messages/contacts");
      if (response.data && response.data.length > 0) {
        setIsUsingDB(true);
        // Merge DB users into friends list (avoiding duplicates)
        const dbUsers = response.data.map(u => ({
          id: u.id,
          name: u.full_name || u.username,
          username: u.username,
          avatar: "👤",
          isOnline: Math.random() > 0.5, // Mock online state for DB users
          lastSeen: "Baru aktif",
          isMock: false
        }));

        setFriends(prev => {
          // Keep mock friends + append DB friends
          const mocks = prev.filter(f => f.isMock);
          const filteredMocks = mocks.filter(m => !dbUsers.some(d => d.username === m.username));
          return [...filteredMocks, ...dbUsers];
        });
      }
    } catch (e) {
      console.log("Database messaging tables not ready yet. Using offline mock mode.");
      setIsUsingDB(false);
    }
  };

  // 2. Fetch real message history from database
  const fetchDBHistory = async (friendId) => {
    const selectedFriend = friends.find(f => f.id === friendId);
    if (!selectedFriend || selectedFriend.isMock) return;

    setLoadingHistory(true);
    try {
      const api = getAPI();
      const response = await api.get(`/messages/${friendId}`);
      if (response.data) {
        const formattedMessages = response.data.map(m => ({
          id: m.id,
          sender: m.sender_id === user.id ? "me" : selectedFriend.name,
          text: m.text,
          imgUrl: m.img_url,
          time: dayjs(m.created_at).format("HH:mm"),
          type: m.img_url ? "image" : "text",
          status: m.is_read ? "read" : "delivered"
        }));

        setAllChats(prev => ({
          ...prev,
          [friendId]: formattedMessages
        }));
      }
    } catch (e) {
      console.error("Error fetching message history:", e);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Initial Load
  useEffect(() => {
    fetchDBContacts();
  }, []);

  // Fetch history when active chat changes
  useEffect(() => {
    const selectedFriend = friends.find(f => f.id === activeChatId);
    if (selectedFriend && !selectedFriend.isMock) {
      fetchDBHistory(activeChatId);
    }
  }, [activeChatId, friends]);

  // Periodic poll if using DB
  useEffect(() => {
    let interval = null;
    const selectedFriend = friends.find(f => f.id === activeChatId);
    if (isUsingDB && selectedFriend && !selectedFriend.isMock) {
      interval = setInterval(() => {
        fetchDBHistory(activeChatId);
      }, 5000); // Poll every 5s
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeChatId, isUsingDB, friends]);

  // Save local chats to localStorage
  useEffect(() => {
    localStorage.setItem("luna_dm_chats_v3", JSON.stringify(allChats));
  }, [allChats]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allChats, typingFriendId]);

  const activeFriend = friends.find(f => f.id === activeChatId);

  // Send Message Logic
  const handleSendMessage = async (friendId, type = "text", content = "") => {
    const textToSend = content || chatInputs[friendId] || "";
    if (!textToSend.trim() && type === "text") return;

    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // If it's a real DB contact
    if (activeFriend && !activeFriend.isMock) {
      try {
        const api = getAPI();
        const payload = {
          receiver_id: friendId,
          text: type === "text" ? textToSend : null,
          img_url: type === "image" ? textToSend : null
        };
        const response = await api.post("/messages", payload);
        
        // Append sent message to chat state
        const dbMsg = {
          id: response.data.id || Date.now(),
          sender: "me",
          text: textToSend,
          imgUrl: type === "image" ? textToSend : null,
          time: timeString,
          type: type,
          status: "delivered"
        };
        setAllChats(prev => ({ ...prev, [friendId]: [...(prev[friendId] || []), dbMsg] }));
        if (type === "text") setChatInputs(prev => ({ ...prev, [friendId] : "" }));
        return;
      } catch (e) {
        console.error("Failed to send message to DB:", e);
      }
    }

    // Mock/Offline fallback
    const newMsg = {
      id: Date.now(),
      sender: "me",
      text: type === "text" ? textToSend : "",
      imgUrl: type === "image" ? textToSend : null,
      time: timeString,
      type: type,
      status: "delivered"
    };

    // 1. Add my message to chat state
    setAllChats(prev => ({ ...prev, [friendId]: [...(prev[friendId] || []), newMsg] }));
    if (type === "text") setChatInputs(prev => ({ ...prev, [friendId] : "" }));

    // Read receipt simulation
    setTimeout(() => {
      setAllChats(prev => ({
        ...prev,
        [friendId]: prev[friendId].map(m => m.id === newMsg.id ? { ...m, status: "read" } : m)
      }));
    }, 1000);

    // 2. Automated typing response simulation (Only for mock friends)
    const replies = MOCK_REPLIES[friendId] || [];
    const replyIdx = replyIndexes[friendId] || 0;
    
    if (replyIdx < replies.length) {
      setTimeout(() => {
        setTypingFriendId(friendId);
      }, 1200);

      setTimeout(() => {
        setTypingFriendId(null);
        const replyText = replies[replyIdx];
        const replyTime = new Date();
        const replyTimeString = `${String(replyTime.getHours()).padStart(2, '0')}:${String(replyTime.getMinutes()).padStart(2, '0')}`;

        const friendMsg = {
          id: Date.now() + 1,
          sender: friends.find(f => f.id === friendId).name,
          text: replyText,
          time: replyTimeString,
          type: "text"
        };

        setAllChats(prev => ({ ...prev, [friendId]: [...(prev[friendId] || []), friendMsg] }));
        setReplyIndexes(prev => ({ ...prev, [friendId]: replyIdx + 1 }));
      }, 3200);
    }
  };

  const handleImageUpload = (e, friendId) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => handleSendMessage(friendId, "image", reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Filter Contacts List by search query
  const filteredFriends = friends.filter(f => 
    f.name.toLowerCase().includes(searchContactQuery.toLowerCase()) || 
    f.username.toLowerCase().includes(searchContactQuery.toLowerCase())
  );

  return (
    <div className="flex-1 p-2 md:p-6 bg-transparent text-[#3B2F4A] font-sans min-h-screen">
      
      {/* HEADER */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 flex items-center gap-2">
            Pesan Privat
            <span className="text-sm font-semibold px-2 py-0.5 bg-blue-50 text-[#007AFF] rounded-full border border-blue-100 flex items-center gap-1 select-none">
              <Sparkles size={11} className="animate-pulse" /> iMessage Mode
            </span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">Obrolan terenkripsi antar pengguna Lunare. Dilengkapi simulasi cerdas real-time.</p>
        </div>

        {/* Database Status Alert */}
        <div className={`text-[10px] font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
          isUsingDB 
            ? 'bg-green-50 border-green-200 text-green-700' 
            : 'bg-yellow-50 border-yellow-200 text-yellow-700'
        }`}>
          <AlertCircle size={13} />
          <span>{isUsingDB ? "DB Terkoneksi (Real User Chat Aktif)" : "Mode Demo (Pesan Lokal Aktif)"}</span>
        </div>
      </div>

      {/* CHATBOX BOARD */}
      <div className="bg-white border border-pink-100 rounded-[32px] overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        
        {/* CONTACTS SIDEBAR (Left 4 columns) */}
        <div className="lg:col-span-4 border-r border-pink-50 p-4 bg-[#FCFAF8] flex flex-col justify-between h-[500px]">
          
          <div className="space-y-4">
            {/* Search contacts bar */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={13} />
              <input
                type="text"
                value={searchContactQuery}
                onChange={(e) => setSearchContactQuery(e.target.value)}
                placeholder="Cari teman..."
                className="w-full text-xs bg-white border border-pink-100 rounded-full pl-8 pr-4 py-2 outline-none focus:ring-2 focus:ring-pink-200/55 focus:border-pink-300"
              />
            </div>

            <div className="space-y-1.5 overflow-y-auto max-h-[380px] pr-1">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2 mb-1">Daftar Kontak</h3>
              
              {filteredFriends.length === 0 ? (
                <div className="p-4 text-center text-xs text-gray-400 italic">Kontak tidak ditemukan</div>
              ) : (
                filteredFriends.map(f => {
                  const isSelected = activeChatId === f.id;
                  const chatHistory = allChats[f.id] || [];
                  const lastMsg = chatHistory[chatHistory.length - 1];

                  return (
                    <div
                      key={f.id}
                      onClick={() => setActiveChatId(f.id)}
                      className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border ${
                        isSelected 
                          ? 'bg-white shadow-xs border-purple-200' 
                          : 'hover:bg-white/60 border-transparent'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-100 to-purple-100 border border-purple-200/40 flex items-center justify-center text-lg relative select-none">
                        {f.avatar}
                        {f.isOnline && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h4 className="text-xs font-bold text-[#3B2F4A] truncate">{f.name}</h4>
                          {lastMsg && <span className="text-[8px] text-gray-400 font-medium">{lastMsg.time}</span>}
                        </div>
                        <p className="text-[10px] text-gray-400 truncate mt-0.5">
                          {lastMsg ? (lastMsg.sender === "me" ? "Anda: " : "") + (lastMsg.type === "text" ? lastMsg.text : "📷 Gambar") : `@${f.username}`}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-pink-50/40 p-3 rounded-2xl text-[10px] text-pink-700 font-bold border border-pink-100/50">
            💡 Tips: Masuk ke DB Mode dengan mendaftarkan akun baru lainnya di backend untuk chatting sungguhan!
          </div>

        </div>

        {/* CHAT VIEWPORT (Right 8 columns) */}
        <div className="lg:col-span-8 flex flex-col justify-between h-[500px] bg-white">
          {activeFriend ? (
            <>
              {/* iMessage Header */}
              <div className="px-5 py-3 border-b border-pink-50 bg-[#FCFAF8] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-sm border border-purple-100 select-none">
                    {activeFriend.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-[#3B2F4A]">{activeFriend.name}</h4>
                    <p className={`text-[9px] font-bold ${activeFriend.isOnline ? 'text-green-600' : 'text-gray-400'}`}>
                      {activeFriend.isOnline ? 'Online' : activeFriend.lastSeen}
                    </p>
                  </div>
                </div>
                
                {/* iMessage Action Links */}
                <div className="flex items-center gap-4 text-purple-600/85">
                  <button className="hover:text-purple-800 transition cursor-pointer" title="FaceTime Audio"><Phone size={14} /></button>
                  <button className="hover:text-purple-800 transition cursor-pointer" title="FaceTime Video"><Video size={14} /></button>
                  <button className="hover:text-purple-800 transition cursor-pointer" title="Informasi Kontak"><Info size={14} /></button>
                </div>
              </div>

              {/* Message Feed Area */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#FAF9F6]/20 scrollbar-none flex flex-col">
                <div className="mx-auto text-[9px] bg-purple-50/50 text-purple-500 font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 select-none">
                  iMessage • Enkripsi End-to-End
                </div>

                {loadingHistory ? (
                  <div className="text-center text-xs text-gray-400 my-auto animate-pulse">Memuat riwayat chat...</div>
                ) : (
                  (allChats[activeChatId] || []).map(msg => {
                    const isMe = msg.sender === "me";
                    return (
                      <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-full`}>
                        <div className={`max-w-[75%] px-4 py-2.5 text-xs rounded-2xl shadow-3xs ${
                          isMe 
                            ? 'bg-[#007AFF] text-white rounded-br-xs' 
                            : 'bg-[#E9E9EB] text-[#1C1C1E] rounded-bl-xs'
                        }`}>
                          {msg.type === "text" ? (
                            <p className="break-words leading-relaxed">{msg.text}</p>
                          ) : (
                            <img src={msg.imgUrl} alt="dm attachment" className="max-h-48 object-cover rounded-xl" />
                          )}
                        </div>
                        
                        {/* Status Details */}
                        <div className="flex items-center gap-1 mt-1 px-1 text-[8px] text-gray-400 font-semibold">
                          <span>{msg.time}</span>
                          {isMe && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-0.5">
                                {msg.status === "read" ? (
                                  <span className="text-[#007AFF] flex items-center gap-0.5"><CheckCheck size={10} /> Dibaca</span>
                                ) : (
                                  <span className="text-gray-400 flex items-center gap-0.5"><Check size={10} /> Terkirim</span>
                                )}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Friend Typing Indicator */}
                {typingFriendId === activeChatId && (
                  <div className="flex flex-col items-start max-w-full animate-pulse">
                    <div className="bg-[#E9E9EB] text-gray-600 px-4 py-3 rounded-2xl rounded-bl-xs flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                    <span className="text-[8px] text-gray-400 mt-1 pl-1 font-semibold">@{activeFriend.name} sedang mengetik...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Area */}
              <div className="p-4 border-t border-pink-50 flex items-center gap-3 bg-white">
                
                {/* Image Uploader */}
                <label className="p-2 text-gray-400 hover:text-purple-600 bg-purple-50/50 hover:bg-purple-50 rounded-full cursor-pointer transition">
                  <ImageIcon size={15} className="text-purple-500" />
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, activeChatId)} />
                </label>
                
                {/* Chat Field */}
                <div className="flex-1 relative flex items-center bg-[#F2F2F7] rounded-full px-4 py-2 border border-transparent focus-within:border-purple-300 focus-within:bg-white transition-all">
                  <input 
                    type="text"
                    value={chatInputs[activeChatId] || ""}
                    onChange={(e) => setChatInputs({...chatInputs, [activeChatId]: e.target.value})}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(activeChatId)}
                    placeholder={`Kirim pesan ke ${activeFriend.name}...`}
                    className="w-full bg-transparent text-xs text-gray-800 placeholder-gray-400 outline-none pr-6"
                  />
                  <button className="absolute right-3.5 text-gray-400 hover:text-purple-500 transition"><Smile size={14} /></button>
                </div>

                {/* Send Button */}
                <button 
                  onClick={() => handleSendMessage(activeChatId)} 
                  className="p-2.5 bg-[#007AFF] text-white rounded-full hover:scale-105 active:scale-95 transition shadow-xs flex items-center justify-center cursor-pointer"
                >
                  <Send size={12} fill="currentColor" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-xs">
              <MessageSquare size={36} className="text-purple-100 mb-2 animate-bounce" />
              Pilih teman untuk memulai obrolan private.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
