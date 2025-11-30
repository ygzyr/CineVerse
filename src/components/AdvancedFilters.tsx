import { useState, useEffect } from 'react';
import { X, SlidersHorizontal, Star, Calendar, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface FilterOptions {
  minRating: number;
  maxRating: number;
  yearFrom: number;
  yearTo: number;
  genres: number[];
  sortBy: 'popularity.desc' | 'vote_average.desc' | 'release_date.desc' | 'revenue.desc';
  minVotes: number;
}

interface AdvancedFiltersProps {
  darkMode: boolean;
  apiKey: string;
  onApplyFilters: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
}

interface Genre {
  id: number;
  name: string;
}

const currentYear = new Date().getFullYear();

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Popülerlik', icon: <TrendingUp className="w-4 h-4" /> },
  { value: 'vote_average.desc', label: 'En Yüksek Puan', icon: <Star className="w-4 h-4" /> },
  { value: 'release_date.desc', label: 'En Yeni', icon: <Calendar className="w-4 h-4" /> },
  { value: 'revenue.desc', label: 'Hasılat', icon: <TrendingUp className="w-4 h-4" /> },
];

export function AdvancedFilters({ darkMode, apiKey, onApplyFilters, initialFilters }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [filters, setFilters] = useState<FilterOptions>(
    initialFilters || {
      minRating: 0,
      maxRating: 10,
      yearFrom: 1950,
      yearTo: currentYear,
      genres: [],
      sortBy: 'popularity.desc',
      minVotes: 100,
    }
  );

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=tr`
      );
      const data = await response.json();
      setGenres(data.genres);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const handleApply = () => {
    onApplyFilters(filters);
    setIsOpen(false);
  };

  const handleReset = () => {
    const defaultFilters: FilterOptions = {
      minRating: 0,
      maxRating: 10,
      yearFrom: 1950,
      yearTo: currentYear,
      genres: [],
      sortBy: 'popularity.desc',
      minVotes: 100,
    };
    setFilters(defaultFilters);
    onApplyFilters(defaultFilters);
  };

  const toggleGenre = (genreId: number) => {
    setFilters(prev => ({
      ...prev,
      genres: prev.genres.includes(genreId)
        ? prev.genres.filter(id => id !== genreId)
        : [...prev.genres, genreId],
    }));
  };

  const hasActiveFilters = 
    filters.minRating > 0 ||
    filters.maxRating < 10 ||
    filters.yearFrom > 1950 ||
    filters.yearTo < currentYear ||
    filters.genres.length > 0 ||
    filters.sortBy !== 'popularity.desc' ||
    filters.minVotes > 100;

  return (
    <>
      {/* Filter Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`relative flex items-center gap-2 px-6 py-3 rounded-2xl shadow-lg transition-all ${
          darkMode
            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-cyan-500/30'
            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-blue-500/30'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <SlidersHorizontal className="w-5 h-5" />
        <span>Filtreler</span>
        {hasActiveFilters && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-current" />
        )}
      </motion.button>

      {/* Filter Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className={`relative w-full max-w-3xl max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden border ${
                darkMode
                  ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-cyan-500/20'
                  : 'bg-gradient-to-b from-white to-slate-50 border-blue-500/20'
              }`}
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`sticky top-0 z-10 px-8 py-6 backdrop-blur-md border-b ${
                darkMode ? 'bg-slate-900/90 border-white/10' : 'bg-white/90 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <h2 className={darkMode ? 'text-white' : 'text-slate-900'}>
                    Gelişmiş Filtreler
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className={`p-2 rounded-xl transition-all ${
                      darkMode
                        ? 'hover:bg-white/10 text-white'
                        : 'hover:bg-slate-100 text-slate-900'
                    }`}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(85vh-180px)] px-8 py-6 space-y-8">
                {/* Rating Range */}
                <div>
                  <label className={`block mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    <Star className="w-5 h-5 inline mr-2" />
                    IMDB Puanı: {filters.minRating} - {filters.maxRating}
                  </label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.5"
                        value={filters.minRating}
                        onChange={(e) => setFilters({ ...filters, minRating: parseFloat(e.target.value) })}
                        className="w-full accent-cyan-500"
                      />
                      <p className={`text-sm mt-2 ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>
                        Min: {filters.minRating}
                      </p>
                    </div>
                    <div className="flex-1">
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.5"
                        value={filters.maxRating}
                        onChange={(e) => setFilters({ ...filters, maxRating: parseFloat(e.target.value) })}
                        className="w-full accent-cyan-500"
                      />
                      <p className={`text-sm mt-2 ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>
                        Max: {filters.maxRating}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Year Range */}
                <div>
                  <label className={`block mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    <Calendar className="w-5 h-5 inline mr-2" />
                    Yıl Aralığı: {filters.yearFrom} - {filters.yearTo}
                  </label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        type="range"
                        min="1950"
                        max={currentYear}
                        value={filters.yearFrom}
                        onChange={(e) => setFilters({ ...filters, yearFrom: parseInt(e.target.value) })}
                        className="w-full accent-cyan-500"
                      />
                      <p className={`text-sm mt-2 ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>
                        Başlangıç: {filters.yearFrom}
                      </p>
                    </div>
                    <div className="flex-1">
                      <input
                        type="range"
                        min="1950"
                        max={currentYear}
                        value={filters.yearTo}
                        onChange={(e) => setFilters({ ...filters, yearTo: parseInt(e.target.value) })}
                        className="w-full accent-cyan-500"
                      />
                      <p className={`text-sm mt-2 ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>
                        Bitiş: {filters.yearTo}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Minimum Votes */}
                <div>
                  <label className={`block mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    <TrendingUp className="w-5 h-5 inline mr-2" />
                    Minimum Oy Sayısı: {filters.minVotes}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={filters.minVotes}
                    onChange={(e) => setFilters({ ...filters, minVotes: parseInt(e.target.value) })}
                    className="w-full accent-cyan-500"
                  />
                  <p className={`text-sm mt-2 ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>
                    Daha popüler filmler için oy sayısını artırın
                  </p>
                </div>

                {/* Sort By */}
                <div>
                  <label className={`block mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Sıralama
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setFilters({ ...filters, sortBy: option.value as any })}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                          filters.sortBy === option.value
                            ? darkMode
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                            : darkMode
                            ? 'bg-white/10 text-white hover:bg-white/20'
                            : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                        }`}
                      >
                        {option.icon}
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Genres */}
                <div>
                  <label className={`block mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    Türler {filters.genres.length > 0 && `(${filters.genres.length} seçili)`}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((genre) => (
                      <button
                        key={genre.id}
                        onClick={() => toggleGenre(genre.id)}
                        className={`px-4 py-2 rounded-full transition-all ${
                          filters.genres.includes(genre.id)
                            ? darkMode
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                            : darkMode
                            ? 'bg-white/10 text-white hover:bg-white/20'
                            : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                        }`}
                      >
                        {genre.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className={`sticky bottom-0 px-8 py-6 backdrop-blur-md border-t flex gap-4 ${
                darkMode ? 'bg-slate-900/90 border-white/10' : 'bg-white/90 border-slate-200'
              }`}>
                <button
                  onClick={handleReset}
                  className={`flex-1 px-6 py-3 rounded-xl transition-all ${
                    darkMode
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  Sıfırla
                </button>
                <button
                  onClick={handleApply}
                  className={`flex-1 px-6 py-3 rounded-xl transition-all shadow-lg ${
                    darkMode
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-cyan-500/30'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-blue-500/30'
                  }`}
                >
                  Uygula
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
