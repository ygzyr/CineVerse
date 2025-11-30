import { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onSearch: (query: string) => void;
  darkMode: boolean;
}

export function SearchBar({ onSearch, darkMode }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <motion.div
        animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Film, dizi ara..."
          className={`w-72 px-5 py-3 pl-12 rounded-full transition-all backdrop-blur-sm ${
            darkMode
              ? 'bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-cyan-500 focus:bg-white/10'
              : 'bg-slate-900/5 border border-slate-900/10 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-slate-900/10'
          } focus:outline-none`}
        />
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
          isFocused
            ? darkMode ? 'text-cyan-400' : 'text-blue-600'
            : darkMode ? 'text-white/40' : 'text-slate-400'
        }`} />
      </motion.div>
      
      {/* Glow on focus */}
      {isFocused && (
        <motion.div
          className={`absolute inset-0 rounded-full pointer-events-none ${
            darkMode
              ? 'shadow-[0_0_20px_rgba(34,211,238,0.3)]'
              : 'shadow-[0_0_20px_rgba(59,130,246,0.3)]'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </form>
  );
}