import { useState, useEffect } from 'react';
import { Search, Menu, X, ChevronDown, Moon, Sun, Film, Tv, Bookmark, TrendingUp, Shuffle, Calendar, FolderHeart, Heart, User, Palette, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type MainTab = 'home' | 'movies' | 'tv' | 'watchlist' | 'search' | 'genre' | 'discover' | 'upcoming' | 'collections' | 'actor' | 'swipe';
type ThemeColor = 'cyan' | 'purple' | 'green' | 'red' | 'orange';

interface ModernHeaderProps {
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
  onSearch: (query: string) => void;
  watchlistCount: number;
  unwatchedCount: number;
}

export function ModernHeader({ 
  activeTab, 
  setActiveTab, 
  darkMode, 
  setDarkMode,
  themeColor,
  setThemeColor,
  onSearch,
  watchlistCount,
  unwatchedCount
}: ModernHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setSearchOpen(false);
    }
  };

  const themeColors = {
    cyan: { from: 'from-cyan-500', to: 'to-blue-600', glow: 'shadow-cyan-500/50' },
    purple: { from: 'from-purple-500', to: 'to-pink-600', glow: 'shadow-purple-500/50' },
    green: { from: 'from-green-500', to: 'to-emerald-600', glow: 'shadow-green-500/50' },
    red: { from: 'from-red-500', to: 'to-rose-600', glow: 'shadow-red-500/50' },
    orange: { from: 'from-orange-500', to: 'to-amber-600', glow: 'shadow-orange-500/50' }
  };

  const currentTheme = themeColors[themeColor];

  const navItems = [
    { id: 'home' as MainTab, icon: <TrendingUp className="w-5 h-5" />, label: 'Ana Sayfa' },
    { id: 'discover' as MainTab, icon: <Shuffle className="w-5 h-5" />, label: 'Keşfet' },
    { id: 'watchlist' as MainTab, icon: <Bookmark className="w-5 h-5" />, label: 'Listem', badge: unwatchedCount },
    { id: 'swipe' as MainTab, icon: <Heart className="w-5 h-5" />, label: 'Swipe' },
  ];

  const moreItems = [
    { id: 'movies' as MainTab, icon: <Film className="w-5 h-5" />, label: 'Filmler' },
    { id: 'tv' as MainTab, icon: <Tv className="w-5 h-5" />, label: 'Diziler' },
    { id: 'upcoming' as MainTab, icon: <Calendar className="w-5 h-5" />, label: 'Yaklaşanlar' },
    { id: 'collections' as MainTab, icon: <FolderHeart className="w-5 h-5" />, label: 'Koleksiyonlar' },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? darkMode 
            ? 'bg-slate-950/95 backdrop-blur-2xl shadow-2xl shadow-black/50' 
            : 'bg-white/95 backdrop-blur-2xl shadow-xl'
          : darkMode
            ? 'bg-slate-950/70 backdrop-blur-xl'
            : 'bg-white/70 backdrop-blur-xl'
      }`}>
        <div className="max-w-[1920px] mx-auto">
          {/* Top Bar */}
          <div className={`flex items-center justify-between px-6 transition-all duration-500 ${
            scrolled ? 'py-3' : 'py-5'
          }`}>
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setActiveTab('home');
                setMobileMenuOpen(false);
              }}
            >
              <div className={`relative ${scrolled ? 'w-10 h-10' : 'w-12 h-12'} transition-all duration-500`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${currentTheme.from} ${currentTheme.to} rounded-2xl flex items-center justify-center shadow-lg ${currentTheme.glow} animate-pulse`}>
                  <Play className={`${scrolled ? 'w-5 h-5' : 'w-6 h-6'} text-white transition-all duration-500`} fill="white" />
                </div>
              </div>
              <div>
                <h1 className={`bg-gradient-to-r ${currentTheme.from} ${currentTheme.to} bg-clip-text text-transparent transition-all duration-500 ${
                  scrolled ? 'text-xl' : 'text-2xl'
                }`}>
                  CineVerse
                </h1>
                <p className={`text-xs ${darkMode ? 'text-white/40' : 'text-slate-500'} -mt-1`}>
                  {watchlistCount} film izleniyor
                </p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {navItems.map(item => (
                <NavButton
                  key={item.id}
                  active={activeTab === item.id}
                  onClick={() => setActiveTab(item.id)}
                  icon={item.icon}
                  label={item.label}
                  darkMode={darkMode}
                  badge={item.badge}
                  themeFrom={currentTheme.from}
                  themeTo={currentTheme.to}
                  themeGlow={currentTheme.glow}
                />
              ))}

              {/* More Dropdown */}
              <div className="relative">
                <motion.button
                  onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                    moreItems.some(item => item.id === activeTab)
                      ? darkMode
                        ? `bg-gradient-to-r ${currentTheme.from} ${currentTheme.to} text-white shadow-lg ${currentTheme.glow}`
                        : `bg-gradient-to-r ${currentTheme.from} ${currentTheme.to} text-white shadow-lg ${currentTheme.glow}`
                      : darkMode
                      ? 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                      : 'bg-slate-900/5 text-slate-600 hover:bg-slate-900/10 hover:text-slate-900'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Menu className="w-5 h-5" />
                  <span className="text-sm">Daha Fazla</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${moreMenuOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {moreMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute top-full mt-2 right-0 w-56 rounded-2xl overflow-hidden shadow-2xl border backdrop-blur-xl ${
                        darkMode 
                          ? 'bg-slate-900/95 border-white/10' 
                          : 'bg-white/95 border-slate-200'
                      }`}
                    >
                      {moreItems.map(item => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setMoreMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-5 py-3.5 transition-all ${
                            activeTab === item.id
                              ? darkMode
                                ? `bg-gradient-to-r ${currentTheme.from} ${currentTheme.to} text-white`
                                : `bg-gradient-to-r ${currentTheme.from} ${currentTheme.to} text-white`
                              : darkMode
                              ? 'text-white/70 hover:bg-white/5 hover:text-white'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="hidden md:block relative">
                <AnimatePresence>
                  {searchOpen ? (
                    <motion.form
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 280, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleSearchSubmit}
                      className="flex items-center"
                    >
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Film veya dizi ara..."
                        autoFocus
                        className={`w-full px-4 py-2.5 rounded-xl border transition-all ${
                          darkMode
                            ? 'bg-white/10 border-white/20 text-white placeholder-white/40 focus:bg-white/15 focus:border-white/30'
                            : 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-500 focus:bg-white focus:border-slate-300'
                        } outline-none`}
                      />
                      <button
                        type="button"
                        onClick={() => setSearchOpen(false)}
                        className={`absolute right-3 ${darkMode ? 'text-white/60 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.form>
                  ) : (
                    <motion.button
                      onClick={() => setSearchOpen(true)}
                      className={`p-2.5 rounded-xl transition-all ${
                        darkMode
                          ? 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Search className="w-5 h-5" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Theme Color Picker */}
              <div className="hidden md:block relative">
                <motion.button
                  onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                  className={`p-2.5 rounded-xl transition-all ${
                    darkMode
                      ? 'bg-white/5 hover:bg-white/10'
                      : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Palette className={`w-5 h-5 ${darkMode ? 'text-white/70' : 'text-slate-600'}`} />
                </motion.button>

                <AnimatePresence>
                  {themeMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className={`absolute top-full mt-2 right-0 p-3 rounded-2xl shadow-2xl border backdrop-blur-xl ${
                        darkMode ? 'bg-slate-900/95 border-white/10' : 'bg-white/95 border-slate-200'
                      }`}
                    >
                      <p className={`text-xs mb-2 px-1 ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>Tema Rengi</p>
                      <div className="flex gap-2">
                        {(Object.keys(themeColors) as ThemeColor[]).map(color => (
                          <button
                            key={color}
                            onClick={() => {
                              setThemeColor(color);
                              setThemeMenuOpen(false);
                            }}
                            className={`w-8 h-8 rounded-full bg-gradient-to-br ${themeColors[color].from} ${themeColors[color].to} ${
                              themeColor === color ? 'ring-2 ring-offset-2 ring-white' : ''
                            } transition-all hover:scale-110`}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Theme Toggle */}
              <motion.button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2.5 rounded-xl transition-all ${
                  darkMode
                    ? `bg-gradient-to-r ${currentTheme.from} ${currentTheme.to} text-white ${currentTheme.glow}`
                    : 'bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg'
                }`}
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                  {darkMode ? (
                    <motion.div
                      key="moon"
                      initial={{ rotate: -180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 180, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Moon className="w-5 h-5" fill="currentColor" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 180, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Sun className="w-5 h-5" fill="currentColor" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* User Avatar */}
              <div className={`hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br ${currentTheme.from} ${currentTheme.to} ${currentTheme.glow}`}>
                <User className="w-5 h-5 text-white" />
              </div>

              {/* Mobile Menu Toggle */}
              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden p-2.5 rounded-xl ${
                  darkMode
                    ? 'bg-white/5 hover:bg-white/10 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>

          {/* Border gradient */}
          <div className={`h-px bg-gradient-to-r ${currentTheme.from} ${currentTheme.to} opacity-20`} />
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className={`absolute inset-0 ${darkMode ? 'bg-black/80' : 'bg-black/50'} backdrop-blur-sm`} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`absolute top-0 right-0 bottom-0 w-80 ${
                darkMode ? 'bg-slate-900' : 'bg-white'
              } shadow-2xl overflow-y-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 space-y-6">
                {/* Search in mobile */}
                <div>
                  <form onSubmit={handleSearchSubmit}>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Film veya dizi ara..."
                      className={`w-full px-4 py-3 rounded-xl border ${
                        darkMode
                          ? 'bg-white/10 border-white/20 text-white placeholder-white/40'
                          : 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-500'
                      } outline-none`}
                    />
                  </form>
                </div>

                {/* Nav Items */}
                <div className="space-y-2">
                  <p className={`text-xs px-2 mb-3 ${darkMode ? 'text-white/40' : 'text-slate-400'}`}>ANA MENÜ</p>
                  {[...navItems, ...moreItems].map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${
                        activeTab === item.id
                          ? darkMode
                            ? `bg-gradient-to-r ${currentTheme.from} ${currentTheme.to} text-white ${currentTheme.glow}`
                            : `bg-gradient-to-r ${currentTheme.from} ${currentTheme.to} text-white ${currentTheme.glow}`
                          : darkMode
                          ? 'text-white/70 hover:bg-white/5 hover:text-white'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className={`ml-auto px-2 py-0.5 rounded-full text-xs ${
                          darkMode ? 'bg-white/20' : 'bg-slate-900/20'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Theme Colors */}
                <div>
                  <p className={`text-xs px-2 mb-3 ${darkMode ? 'text-white/40' : 'text-slate-400'}`}>TEMA RENGİ</p>
                  <div className="flex gap-3 px-2">
                    {(Object.keys(themeColors) as ThemeColor[]).map(color => (
                      <button
                        key={color}
                        onClick={() => setThemeColor(color)}
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${themeColors[color].from} ${themeColors[color].to} ${
                          themeColor === color ? 'ring-4 ring-offset-2 ring-white/50' : ''
                        } transition-all hover:scale-110`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className={scrolled ? 'h-16' : 'h-20'} />
    </>
  );
}

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  darkMode: boolean;
  badge?: number;
  themeFrom: string;
  themeTo: string;
  themeGlow: string;
}

function NavButton({ active, onClick, icon, label, darkMode, badge, themeFrom, themeTo, themeGlow }: NavButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
        active
          ? darkMode
            ? `bg-gradient-to-r ${themeFrom} ${themeTo} text-white shadow-lg ${themeGlow}`
            : `bg-gradient-to-r ${themeFrom} ${themeTo} text-white shadow-lg ${themeGlow}`
          : darkMode
          ? 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
          : 'bg-slate-900/5 text-slate-600 hover:bg-slate-900/10 hover:text-slate-900'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
      <span className="text-sm">{label}</span>
      
      {badge !== undefined && badge > 0 && (
        <motion.span
          className={`absolute -top-1 -right-1 min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center text-xs ${
            darkMode
              ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg shadow-pink-500/50'
              : 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/50'
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        >
          {badge}
        </motion.span>
      )}
    </motion.button>
  );
}
