import { motion, AnimatePresence } from 'motion/react';
import { Palette, Grid, List } from 'lucide-react';
import { useState } from 'react';
import type { ThemeColor, ViewMode } from '../App';

interface ThemeSelectorProps {
  darkMode: boolean;
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export function ThemeSelector({ darkMode, themeColor, setThemeColor, viewMode, setViewMode }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const colors: { name: ThemeColor; gradient: string; label: string }[] = [
    { name: 'cyan', gradient: 'from-cyan-500 to-blue-600', label: 'Cyan' },
    { name: 'purple', gradient: 'from-purple-500 to-pink-600', label: 'Mor' },
    { name: 'green', gradient: 'from-green-500 to-emerald-600', label: 'Yeşil' },
    { name: 'red', gradient: 'from-red-500 to-orange-600', label: 'Kırmızı' },
    { name: 'orange', gradient: 'from-orange-500 to-yellow-600', label: 'Turuncu' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`absolute bottom-16 right-0 p-4 rounded-2xl backdrop-blur-xl border shadow-2xl w-64 ${
              darkMode
                ? 'bg-slate-900/90 border-white/10'
                : 'bg-white/90 border-slate-200'
            }`}
          >
            <h3 className={`mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Tema Rengi
            </h3>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {colors.map((color) => (
                <motion.button
                  key={color.name}
                  onClick={() => setThemeColor(color.name)}
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${color.gradient} ${
                    themeColor === color.name ? 'ring-4 ring-white/50' : ''
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title={color.label}
                />
              ))}
            </div>

            <h3 className={`mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Görünüm
            </h3>
            <div className="flex gap-2">
              <motion.button
                onClick={() => setViewMode('grid')}
                className={`flex-1 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                  viewMode === 'grid'
                    ? darkMode
                      ? 'bg-cyan-500/20 text-cyan-400 border-2 border-cyan-500'
                      : 'bg-blue-500/20 text-blue-600 border-2 border-blue-500'
                    : darkMode
                    ? 'bg-white/5 text-white/60 hover:bg-white/10'
                    : 'bg-slate-900/5 text-slate-600 hover:bg-slate-900/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Grid className="w-4 h-4" />
                <span>Grid</span>
              </motion.button>
              <motion.button
                onClick={() => setViewMode('list')}
                className={`flex-1 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                  viewMode === 'list'
                    ? darkMode
                      ? 'bg-cyan-500/20 text-cyan-400 border-2 border-cyan-500'
                      : 'bg-blue-500/20 text-blue-600 border-2 border-blue-500'
                    : darkMode
                    ? 'bg-white/5 text-white/60 hover:bg-white/10'
                    : 'bg-slate-900/5 text-slate-600 hover:bg-slate-900/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <List className="w-4 h-4" />
                <span>Liste</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center ${
          darkMode
            ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-cyan-500/50'
            : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-blue-500/30'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Palette className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
