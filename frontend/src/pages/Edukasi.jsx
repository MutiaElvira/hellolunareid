import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  BookOpen, Search, Heart, Bookmark, Clock, Award, CheckCircle, 
  ExternalLink, ShieldCheck, RefreshCw, Sparkles, TrendingUp, SlidersHorizontal
} from 'lucide-react';

const ARTICLE_POOL = [
  {
    id: 1,
    title: "Memahami Fase Siklus Menstruasi dan Dampaknya pada Mood Swings",
    category: "Kesehatan Reproduksi",
    duration: "5 Menit Baca",
    source: "Halodoc / Ditinjau oleh Tim Medis",
    medicalReviewer: "dr. Verury Verona Handayani",
    summary: "Kenapa kita bisa tiba-tiba sensitif atau menangis tanpa sebab sebelum haid? Yuk kenali peran hormon Estrogen dan Progesteron di tiap fasenya.",
    content: "Siklus menstruasi rata-rata berlangsung selama 28 hari dan terbagi menjadi 4 fase utama: Menstruasi, Folikuler, Ovulasi, dan Luteal. Berdasarkan data medis, pada fase Luteal (seminggu sebelum haid), kadar hormon progesteron akan meningkat lalu terjun drastis jika tidak ada pembuahan. Penurunan tajam inilah yang mengganggu kestabilan zat kimia di otak (serotonin), sehingga memicu gejala PMS, kecemasan, hingga mood swings yang ekstrem.",
    likes: 142,
    hasLiked: false,
    hasBookmarked: false,
    isRead: false,
    quiz: {
      question: "Hormon apa yang mengalami penurunan drastis menjelang fase menstruasi dan sering mengganggu neurotransmiter otak?",
      options: ["Estrogen & Progesteron", "Testosteron", "Melatonin", "Kortisol"],
      correctAnswer: 0
    }
  },
  {
    id: 2,
    title: "Benefits of Ginger and Warm Compresses for Dysmenorrhea Relief",
    category: "Evidence-Based Tips",
    duration: "4 Menit Baca",
    source: "Healthline Medical Network / WebMD",
    medicalReviewer: "Dr. Debra Rose Wilson, PhD, MSN",
    summary: "Redakan nyeri haid hari pertama berdasarkan studi klinis menggunakan jahe hangat dan terapi termal (kompres panas) di area perut.",
    content: "Kram perut (dismenore) terjadi akibat pelepasan zat prostaglandin yang memicu otot rahim berkontraksi. Studi klinis yang dipublikasikan di Healthline menunjukkan bahwa jahe memiliki efek anti-inflamasi alami yang bekerja menghambat jalur siklooksigenase (COX), mirip seperti cara kerja obat pereda nyeri. Ditambah dengan kompres air hangat bersuhu sekitar 40°C pada perut bagian bawah, sirkulasi darah akan meningkat dan otot polos rahim akan rileks secara signifikan.",
    likes: 215,
    hasLiked: false,
    hasBookmarked: false,
    isRead: false,
    quiz: {
      question: "Senyawa kimia dalam tubuh yang memicu kontraksi dinding rahim hingga menimbulkan rasa kram adalah...",
      options: ["Hemoglobin", "Prostaglandin", "Oksitosin", "Endorfin"],
      correctAnswer: 1
    }
  },
  {
    id: 3,
    title: "Pentingnya Nutrisi dan Zat Besi Selama Menstruasi",
    category: "Nutrisi & Gaya Hidup",
    duration: "6 Menit Baca",
    source: "Harvard T.H. Chan School of Public Health",
    medicalReviewer: "dr. Fadhli Rizal Makarim",
    summary: "Tubuh kehilangan zat besi secara berkala akibat pendarahan. Kenali makanan penting yang wajib dikonsumsi untuk mencegah lemas.",
    content: "Selama siklus menstruasi, tubuh kehilangan darah yang mengandung zat besi. Kehilangan zat besi secara berkala ini jika tidak diimbangi dengan asupan nutrisi yang baik dapat menyebabkan kelelahan ekstrem, anemia, dan penurunan kekebalan tubuh. Mengonsumsi sayuran berdaun hijau gelap, daging merah rendah lemak, dan makanan tinggi Vitamin C untuk membantu penyerapan zat besi secara optimal sangat disarankan oleh para ahli gizi medis.",
    likes: 98,
    hasLiked: false,
    hasBookmarked: false,
    isRead: false,
    quiz: {
      question: "Vitamin apa yang paling optimal membantu penyerapan zat besi dalam tubuh kita?",
      options: ["Vitamin C", "Vitamin D", "Vitamin B12", "Vitamin E"],
      correctAnswer: 0
    }
  },
  {
    id: 4,
    title: "Hubungan Antara Pola Tidur Terganggu dan Siklus Haid Tidak Teratur",
    category: "Nutrisi & Gaya Hidup",
    duration: "5 Menit Baca",
    source: "Sleep Foundation / Alodokter",
    medicalReviewer: "dr. Pittara",
    summary: "Tidur larut malam ternyata berisiko mengganggu kestabilan ovulasi. Simak penjelasan korelasi stres kortisol di sini.",
    content: "Kurang tidur secara konsisten memicu kelenjar adrenal melepaskan hormon kortisol (hormon stres). Hormon kortisol yang terlalu tinggi menghambat sekresi hormon GnRH (Gonadotropin-Releasing Hormone) dari hipotalamus. Padahal, GnRH bertanggung jawab mengatur pelepasan estrogen dan progesteron. Akibatnya, ovulasi bisa tertunda atau bahkan terhenti, menyebabkan siklus menstruasi menjadi tidak teratur.",
    likes: 187,
    hasLiked: false,
    hasBookmarked: false,
    isRead: false,
    quiz: {
      question: "Hormon stres apa yang melonjak saat kurang tidur dan menghambat kestabilan GnRH?",
      options: ["Kortisol", "Melatonin", "Adrenalin", "Progesteron"],
      correctAnswer: 0
    }
  },
  {
    id: 5,
    title: "Panduan Olahraga Ringan Saat Menstruasi Untuk Meredakan Nyeri",
    category: "Evidence-Based Tips",
    duration: "3 Menit Baca",
    source: "WebMD Health / Medical News Today",
    medicalReviewer: "dr. Andreas Wilson",
    summary: "Jangan mager saat haid! Olahraga dengan intensitas rendah seperti yoga justru membantu melancarkan sirkulasi darah rahim.",
    content: "Melakukan olahraga intensitas rendah seperti berjalan santai, peregangan ringan, atau yoga saat menstruasi dapat merangsang otak untuk melepaskan hormon endorfin. Endorfin adalah zat pereda nyeri alami tubuh yang sekaligus mampu meningkatkan suasana hati. Olahraga ini juga meregangkan otot-otot di sekitar panggul dan perut bagian bawah, sehingga rasa sakit akibat kram rahim dapat berkurang.",
    likes: 154,
    hasLiked: false,
    hasBookmarked: false,
    isRead: false,
    quiz: {
      question: "Hormon bahagia apa yang diproduksi tubuh saat berolahraga ringan dan bertindak sebagai pereda nyeri alami?",
      options: ["Endorfin", "Serotonin", "Oksitosin", "Dopamin"],
      correctAnswer: 0
    }
  },
  {
    id: 6,
    title: "Mengenal Gejala Awal PCOS (Polycystic Ovary Syndrome) Pada Wanita",
    category: "Kesehatan Reproduksi",
    duration: "7 Menit Baca",
    source: "Mayo Clinic Medical Articles",
    medicalReviewer: "dr. Riza Marlina",
    summary: "Mengenal ketidakseimbangan hormon yang memicu kista kecil pada indung telur dan bagaimana penanganan medis awalnya.",
    content: "PCOS (Polycystic Ovary Syndrome) terjadi ketika indung telur memproduksi hormon androgen (hormon pria) secara berlebihan. Hal ini menghambat pematangan sel telur dan pelepasan folikel. Gejala awalnya meliputi menstruasi tidak teratur (kurang dari 9 kali setahun), pertumbuhan rambut halus berlebih di area wajah/dada (hirsutisme), dan munculnya jerawat parah akibat kulit memproduksi sebum berlebih.",
    likes: 233,
    hasLiked: false,
    hasBookmarked: false,
    isRead: false,
    quiz: {
      question: "Ketidakseimbangan hormon apa yang menjadi pemicu utama terbentuknya kista kecil pada indung telur penderita PCOS?",
      options: ["Androgen Berlebih", "Kekurangan Estrogen", "Prolaktin Berlebih", "Kortisol Berlebih"],
      correctAnswer: 0
    }
  }
];

export default function Edukasi() {
  // Load initial active articles (first 3) to simulate a dynamic list that can expand/refresh
  const [articles, setArticles] = useState(() => {
    const savedArticles = localStorage.getItem('luna_edu_articles_v2');
    if (savedArticles) {
      return JSON.parse(savedArticles);
    }
    // Start with a subset to make "refresh" visible, then user can fetch/get more
    return ARTICLE_POOL.slice(0, 3);
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizScore, setQuizScore] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoSync, setAutoSync] = useState(false);
  const [newArticleNotification, setNewArticleNotification] = useState(false);

  // Save to localstorage
  useEffect(() => {
    localStorage.setItem('luna_edu_articles_v2', JSON.stringify(articles));
  }, [articles]);

  // Real-time auto-refresh simulation using notification
  useEffect(() => {
    let interval = null;
    if (autoSync) {
      interval = setInterval(() => {
        // If we haven't loaded all articles, simulate a new article notification
        if (articles.length < ARTICLE_POOL.length) {
          setNewArticleNotification(true);
        }
      }, 15000); // Check every 15 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoSync, articles.length]);

  // Refresh function - fetches new articles or shuffles current ones
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setNewArticleNotification(false);
    
    setTimeout(() => {
      setArticles(prevArticles => {
        // Add one more article from the pool if available, otherwise shuffle
        if (prevArticles.length < ARTICLE_POOL.length) {
          const nextIndex = prevArticles.length;
          const updated = [...prevArticles, ARTICLE_POOL[nextIndex]];
          // Shuffle them so the feed looks fresh
          return updated.sort(() => Math.random() - 0.5);
        } else {
          // Just shuffle existing ones to look refreshed
          return [...prevArticles].sort(() => Math.random() - 0.5);
        }
      });
      setIsRefreshing(false);
    }, 1200); // 1.2s loading state
  }, []);

  // Accept notification new article
  const acceptNewArticle = () => {
    setNewArticleNotification(false);
    handleRefresh();
  };

  const handleLike = (id, e) => {
    e.stopPropagation();
    setArticles(prev => prev.map(art => art.id === id ? {
      ...art,
      likes: art.hasLiked ? art.likes - 1 : art.likes + 1,
      hasLiked: !art.hasLiked
    } : art));
    // If selected article is liked, update its state too
    if (selectedArticle && selectedArticle.id === id) {
      setSelectedArticle(prev => ({
        ...prev,
        likes: prev.hasLiked ? prev.likes - 1 : prev.likes + 1,
        hasLiked: !prev.hasLiked
      }));
    }
  };

  const handleBookmark = (id, e) => {
    e.stopPropagation();
    setArticles(prev => prev.map(art => art.id === id ? {
      ...art,
      hasBookmarked: !art.hasBookmarked
    } : art));
    // If selected article is bookmarked, update its state too
    if (selectedArticle && selectedArticle.id === id) {
      setSelectedArticle(prev => ({
        ...prev,
        hasBookmarked: !prev.hasBookmarked
      }));
    }
  };

  // Mark article as read
  const handleMarkAsRead = (id) => {
    setArticles(prev => prev.map(art => art.id === id ? {
      ...art,
      isRead: true
    } : art));
    if (selectedArticle && selectedArticle.id === id) {
      setSelectedArticle(prev => ({
        ...prev,
        isRead: true
      }));
    }
  };

  const handleQuizAnswer = (articleId, optionIndex) => {
    setQuizAnswers(prev => ({ ...prev, [articleId]: optionIndex }));
    const isCorrect = articles.find(a => a.id === articleId).quiz.correctAnswer === optionIndex;
    setQuizScore(prev => ({ ...prev, [articleId]: isCorrect }));
  };

  // Filter logic
  const filteredArticles = useMemo(() => {
    return articles.filter(art => {
      const matchesCategory = 
        selectedCategory === "Semua" || 
        (selectedCategory === "Tersimpan" && art.hasBookmarked) ||
        art.category === selectedCategory;
      const matchesSearch = 
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.source.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  // Reading Stats
  const stats = useMemo(() => {
    const total = articles.length;
    const read = articles.filter(a => a.isRead).length;
    const bookmarked = articles.filter(a => a.hasBookmarked).length;
    
    // Quiz Score
    const totalQuizzes = Object.keys(quizAnswers).length;
    const correctAnswers = Object.values(quizScore).filter(Boolean).length;
    const accuracy = totalQuizzes > 0 ? Math.round((correctAnswers / totalQuizzes) * 100) : 0;

    // Wellness Badge
    let badge = "Wellness Beginner 🌸";
    if (read >= 5 && accuracy >= 80) badge = "Cycle Master 👑";
    else if (read >= 3 && accuracy >= 50) badge = "Healthy Explorer 🩺";
    else if (read >= 1) badge = "Edu Learner 📚";

    return {
      readProgress: total > 0 ? Math.round((read / total) * 100) : 0,
      totalRead: read,
      totalCount: total,
      accuracy,
      correctAnswers,
      totalQuizzes,
      badge,
      bookmarked
    };
  }, [articles, quizAnswers, quizScore]);

  return (
    <div className="flex-1 p-2 md:p-6 bg-transparent text-[#3B2F4A] font-sans">
      
      {/* REAL-TIME NOTIFICATION BANNER */}
      {newArticleNotification && (
        <div className="mb-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white px-4 py-3 rounded-2xl shadow-md flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="animate-pulse" />
            <span className="text-xs font-semibold">Artikel Medis Baru Dirilis! Sinkronkan sekarang untuk membaca.</span>
          </div>
          <button 
            onClick={acceptNewArticle}
            className="bg-white text-purple-600 px-3 py-1 rounded-xl text-[10px] font-bold shadow-xs hover:bg-purple-50 transition"
          >
            Update Live
          </button>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              LunaEdu Verified
            </h1>
            <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${autoSync ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${autoSync ? 'bg-green-500 animate-ping' : 'bg-gray-400'}`}></span>
              {autoSync ? "Live Sync Active" : "Offline Mode"}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Pusat literasi siklus wanita & informasi reproduksi kredibel yang ditinjau oleh pakar medis internasional.
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* AUTO-REFRESH TOGGLE */}
          <button 
            onClick={() => setAutoSync(!autoSync)}
            className={`flex items-center gap-1.5 text-[11px] font-semibold px-3 py-2 rounded-xl border transition ${
              autoSync 
                ? 'bg-purple-50 border-purple-200 text-purple-600' 
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Sparkles size={13} className={autoSync ? 'text-purple-500 animate-pulse' : 'text-gray-400'} />
            <span>{autoSync ? "Auto-Sync On" : "Auto-Sync Off"}</span>
          </button>

          {/* MANUAL REFRESH BUTTON */}
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-pink-300 text-xs px-3 py-2 rounded-xl text-[#3B2F4A] hover:bg-pink-50/20 font-semibold transition disabled:opacity-50"
          >
            <RefreshCw size={13} className={`text-pink-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? "Mengupdate..." : "Refresh Feed"}</span>
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white p-4 rounded-3xl shadow-xs border border-purple-100/50 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {["Semua", "Kesehatan Reproduksi", "Evidence-Based Tips", "Nutrisi & Gaya Hidup", "Tersimpan"].map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-4 py-2 rounded-full whitespace-nowrap font-medium transition ${
                  isActive 
                    ? 'bg-gradient-to-r from-pink-300 to-purple-300 text-white shadow-sm'
                    : 'bg-purple-50/50 text-[#3B2F4A] hover:bg-purple-50'
                }`}
              >
                {cat} {cat === "Tersimpan" && stats.bookmarked > 0 && `(${stats.bookmarked})`}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-2.5 text-gray-400" size={14} />
          <input 
            type="text"
            placeholder="Cari topik, gejala, atau sumber..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-[#FAF8F6] border border-gray-200 rounded-full pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300/30 focus:border-pink-300"
          />
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: LIST ARTICLES */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Skeleton Loaders during refresh */}
          {isRefreshing ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="bg-white p-5 rounded-3xl border border-purple-50 shadow-xs animate-pulse space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded-full w-24"></div>
                  <div className="h-4 bg-gray-200 rounded-full w-12"></div>
                </div>
                <div className="h-5 bg-gray-200 rounded-lg w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded-md w-1/3"></div>
                <div className="space-y-1.5">
                  <div className="h-3 bg-gray-200 rounded-md w-full"></div>
                  <div className="h-3 bg-gray-200 rounded-md w-5/6"></div>
                </div>
              </div>
            ))
          ) : filteredArticles.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-purple-50 text-center text-gray-400">
              <BookOpen size={36} className="mx-auto mb-3 text-purple-200" />
              <p className="text-sm font-semibold">Tidak ada artikel yang cocok</p>
              <p className="text-xs text-gray-400 mt-1">Coba gunakan kata kunci lain atau ubah kategori filter.</p>
            </div>
          ) : (
            filteredArticles.map((art) => {
              const isSelected = selectedArticle?.id === art.id;
              return (
                <div 
                  key={art.id} 
                  onClick={() => setSelectedArticle(art)}
                  className={`bg-white p-5 rounded-3xl border transition-all cursor-pointer shadow-xs hover:shadow-md hover:border-pink-300/40 ${
                    isSelected ? 'border-purple-300 ring-2 ring-purple-300/20' : 'border-purple-100/40'
                  }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex gap-1.5 items-center">
                      <span className="text-[9px] bg-purple-50 text-purple-600 font-bold px-2.5 py-0.5 rounded-full">
                        {art.category}
                      </span>
                      {art.isRead && (
                        <span className="text-[9px] bg-green-50 text-green-600 font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <CheckCircle size={8} /> Selesai Baca
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Clock size={10} /> {art.duration}
                    </span>
                  </div>
                  
                  <h3 className="text-base font-bold text-[#3B2F4A] mb-2 hover:text-purple-600 transition-colors">
                    {art.title}
                  </h3>
                  
                  {/* MEDICAL VERIFIED BADGE */}
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-semibold mb-3 bg-emerald-50/50 w-fit px-2.5 py-1 rounded-lg border border-emerald-100/50">
                    <ShieldCheck size={12} className="text-emerald-500" />
                    <span>Sumber: {art.source}</span>
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">
                    {art.summary}
                  </p>

                  <div className="flex justify-between items-center pt-3 border-t border-purple-50/60 text-gray-400 text-xs font-semibold">
                    <div className="flex gap-4">
                      <button 
                        onClick={(e) => handleLike(art.id, e)} 
                        className={`flex items-center gap-1 transition-colors ${art.hasLiked ? 'text-rose-500' : 'hover:text-rose-500'}`}
                      >
                        <Heart size={14} fill={art.hasLiked ? "currentColor" : "none"} />
                        <span>{art.likes} Suka</span>
                      </button>
                      <button 
                        onClick={(e) => handleBookmark(art.id, e)} 
                        className={`flex items-center gap-1 transition-colors ${art.hasBookmarked ? 'text-purple-500' : 'hover:text-purple-500'}`}
                      >
                        <Bookmark size={14} fill={art.hasBookmarked ? "currentColor" : "none"} />
                        <span>{art.hasBookmarked ? "Tersimpan" : "Simpan"}</span>
                      </button>
                    </div>
                    
                    <span className="text-purple-400 text-[10px] hover:underline font-bold">
                      Baca Selengkapnya &rarr;
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT COLUMN: STATS DASHBOARD & SELECTED ARTICLE */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* LUNAEDU PROGRESS DASHBOARD (MULTIFUNGSI STATS CARD) */}
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-5 rounded-3xl border border-purple-100/40 shadow-xs">
            <h3 className="text-xs font-extrabold text-[#3B2F4A] tracking-wider uppercase mb-3 flex items-center gap-1">
              <Award size={14} className="text-pink-500" /> Dashboard Literasi Luna
            </h3>
            
            <div className="space-y-4">
              
              {/* Badge Wellness */}
              <div className="bg-white p-3 rounded-2xl border border-purple-100 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-gray-400 block">Pencapaian Edukasi</span>
                  <span className="text-xs font-bold text-purple-700">{stats.badge}</span>
                </div>
                <div className="bg-gradient-to-r from-pink-200 to-purple-200 p-2 rounded-full text-white shadow-xs">
                  <Sparkles size={16} />
                </div>
              </div>

              {/* Progress bar baca */}
              <div>
                <div className="flex justify-between items-center text-[10px] mb-1 font-semibold">
                  <span>Membaca Artikel</span>
                  <span className="text-purple-600">{stats.totalRead} / {stats.totalCount} Selesai</span>
                </div>
                <div className="w-full bg-purple-100/40 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-pink-400 to-purple-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${stats.readProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Skor Kuis */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-white/80 p-3 rounded-2xl border border-purple-100/50 text-center">
                  <span className="text-[9px] text-gray-400 block font-medium">Benar Kuis</span>
                  <span className="text-sm font-extrabold text-emerald-600">{stats.correctAnswers} / {stats.totalQuizzes}</span>
                </div>
                <div className="bg-white/80 p-3 rounded-2xl border border-purple-100/50 text-center">
                  <span className="text-[9px] text-gray-400 block font-medium">Akurasi Jawaban</span>
                  <span className="text-sm font-extrabold text-pink-500">{stats.accuracy}%</span>
                </div>
              </div>
              
            </div>
          </div>

          {/* DETAIL ARTICLE VIEW */}
          {selectedArticle ? (
            <div className="bg-white p-5 rounded-3xl border border-purple-100/40 shadow-xs space-y-4 sticky top-4">
              <div>
                <span className="text-[9px] text-pink-500 font-extrabold tracking-wider uppercase">{selectedArticle.category}</span>
                <h2 className="text-lg font-bold text-[#3B2F4A] mt-1 leading-snug">{selectedArticle.title}</h2>
                
                {/* MEDICAL REVIEWED CARD */}
                <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-gray-500 space-y-1">
                  <div className="flex items-center gap-1 font-bold text-[#3B2F4A]">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span>Ditinjau oleh Tim Medis:</span>
                  </div>
                  <p className="italic text-emerald-700 font-semibold pl-4.5">{selectedArticle.medicalReviewer}</p>
                  <p className="text-[9px] text-gray-400 flex items-center gap-1 pl-4.5 pt-0.5">
                    <ExternalLink size={10} /> Referensi: {selectedArticle.source}
                  </p>
                </div>
              </div>
              
              {/* CONTENT WRAPPER */}
              <div className="text-xs text-gray-600 leading-relaxed bg-purple-50/10 p-4 rounded-2xl border border-purple-50/40 max-h-60 overflow-y-auto">
                {selectedArticle.content}
              </div>

              {/* ACTION: MARK AS READ */}
              {!selectedArticle.isRead ? (
                <button
                  onClick={() => handleMarkAsRead(selectedArticle.id)}
                  className="w-full bg-[#E8B4D3] hover:bg-[#d99ac1] text-white py-2.5 rounded-xl font-bold text-xs shadow-xs hover:scale-101 active:scale-99 transition"
                >
                  Tandai Selesai Dibaca ✓
                </button>
              ) : (
                <div className="w-full bg-green-50 text-green-700 text-center py-2.5 rounded-xl font-bold text-xs border border-green-200">
                  Selesai Dibaca ✓
                </div>
              )}

              {/* MINI QUIZ SECTION */}
              <div className="border-t border-purple-50 pt-4 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#3B2F4A]">
                  <Award size={14} className="text-pink-500 animate-bounce" />
                  <h4>Luna Cerdas Mini-Quiz 💡</h4>
                </div>
                <p className="text-xs text-gray-600 font-semibold leading-normal">{selectedArticle.quiz.question}</p>
                
                <div className="space-y-2">
                  {selectedArticle.quiz.options.map((opt, idx) => {
                    const isAnswered = quizAnswers[selectedArticle.id] !== undefined;
                    const isSelected = quizAnswers[selectedArticle.id] === idx;
                    const isCorrectOption = selectedArticle.quiz.correctAnswer === idx;
                    
                    let buttonClass = 'bg-[#FAF8F6] border-gray-200 hover:bg-pink-50/30';
                    if (isAnswered) {
                      if (isSelected) {
                        buttonClass = quizScore[selectedArticle.id]
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold'
                          : 'bg-rose-50 border-rose-400 text-rose-800 font-bold';
                      } else if (isCorrectOption) {
                        // Highlight the correct answer if the user got it wrong
                        buttonClass = 'bg-emerald-50/50 border-emerald-300 text-emerald-700 font-semibold';
                      } else {
                        buttonClass = 'bg-gray-50 border-gray-100 text-gray-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isAnswered}
                        onClick={() => handleQuizAnswer(selectedArticle.id, idx)}
                        className={`w-full text-left text-xs px-3.5 py-2.5 rounded-xl border transition-all ${buttonClass}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* FEEDBACK RESPONSIVE */}
                {quizAnswers[selectedArticle.id] !== undefined && (
                  <div className={`flex items-center gap-1.5 p-3 rounded-xl text-xs font-bold ${
                    quizScore[selectedArticle.id] ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                  }`}>
                    <CheckCircle size={14} className={quizScore[selectedArticle.id] ? 'text-emerald-500' : 'text-rose-500'} />
                    <span>
                      {quizScore[selectedArticle.id] 
                        ? "Hebat! Jawabanmu tepat sekali." 
                        : `Kurang tepat. Jawabannya: ${selectedArticle.quiz.options[selectedArticle.quiz.correctAnswer]}`
                      }
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-3xl border border-purple-50 text-center text-xs text-gray-400 italic shadow-xs">
              <BookOpen size={24} className="mx-auto mb-2 text-purple-200" />
              Pilih salah satu artikel di sebelah kiri untuk membaca ulasan medis & menguji pemahaman Anda.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
