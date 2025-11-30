import { useState, useEffect } from 'react';
import { WatchlistItem, Movie } from '../App';
import { MovieCard } from './MovieCard';
import { Bookmark, Check, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface WatchlistPageProps {
  watchlist: WatchlistItem[];
  darkMode: boolean;
  imageBaseUrl: string;
  apiKey: string;
  onToggleWatchlist: (movieId: number) => void;
  onToggleWatched: (movieId: number) => void;
  onMovieClick: (movie: Movie) => void;
}

export function WatchlistPage({
  watchlist,
  darkMode,
  imageBaseUrl,
  apiKey,
  onToggleWatchlist,
  onToggleWatched,
  onMovieClick,
}: WatchlistPageProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'watched' | 'unwatched'>('all');

  useEffect(() => {
    fetchWatchlistMovies();
  }, [watchlist]);

  const fetchWatchlistMovies = async () => {
    if (watchlist.length === 0) {
      setMovies([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const moviePromises = watchlist.map(async (item) => {
        try {
          // Try movie endpoint first
          const movieResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${item.movieId}?api_key=${apiKey}`
          );
          
          if (movieResponse.ok) {
            const movieData = await movieResponse.json();
            return { ...movieData, media_type: 'movie' };
          }
          
          // If movie fails, try TV endpoint
          const tvResponse = await fetch(
            `https://api.themoviedb.org/3/tv/${item.movieId}?api_key=${apiKey}`
          );
          
          if (tvResponse.ok) {
            const tvData = await tvResponse.json();
            return { ...tvData, media_type: 'tv' };
          }
          
          return null;
        } catch (error) {
          console.error(`Error fetching item ${item.movieId}:`, error);
          return null;
        }
      });

      const fetchedMovies = await Promise.all(moviePromises);
      setMovies(fetchedMovies.filter(m => m && m.id) as Movie[]);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const isWatched = (movieId: number) => {
    return watchlist.find(item => item.movieId === movieId)?.watched || false;
  };

  const filteredMovies = movies.filter(movie => {
    if (filter === 'watched') return isWatched(movie.id);
    if (filter === 'unwatched') return !isWatched(movie.id);
    return true;
  });

  const watchedCount = watchlist.filter(w => w.watched).length;
  const unwatchedCount = watchlist.length - watchedCount;
  const progressPercentage = watchlist.length > 0 ? (watchedCount / watchlist.length) * 100 : 0;

  // Additional stats
  const ratedItems = watchlist.filter(w => w.rating);
  const averageRating = ratedItems.length > 0 
    ? (ratedItems.reduce((sum, w) => sum + (w.rating || 0), 0) / ratedItems.length).toFixed(1)
    : '0';
  
  const thisMonthWatched = watchlist.filter(w => {
    if (!w.watchedDate) return false;
    const watchedDate = new Date(w.watchedDate);
    const now = new Date();
    return watchedDate.getMonth() === now.getMonth() && watchedDate.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="px-6 py-8">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={`mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          📌 İzleme Listem
        </h1>

        {watchlist.length > 0 && (
          <div className={`p-6 rounded-2xl backdrop-blur-xl ${
            darkMode
              ? 'bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20'
              : 'bg-gradient-to-br from-blue-500/10 to-purple-600/10 border border-blue-500/20'
          }`}>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className={`text-3xl mb-1 ${
                  darkMode ? 'text-cyan-400' : 'text-blue-600'
                }`}>
                  {watchlist.length}
                </div>
                <div className={`text-sm ${
                  darkMode ? 'text-white/60' : 'text-slate-600'
                }`}>
                  Toplam
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl text-green-500 mb-1">
                  {watchedCount}
                </div>
                <div className={`text-sm ${
                  darkMode ? 'text-white/60' : 'text-slate-600'
                }`}>
                  İzlendi
                </div>
              </div>
              
              <div className="text-center">
                <div className={`text-3xl mb-1 ${
                  darkMode ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  {unwatchedCount}
                </div>
                <div className={`text-sm ${
                  darkMode ? 'text-white/60' : 'text-slate-600'
                }`}>
                  Bekliyor
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className={`text-sm ${
                  darkMode ? 'text-white/80' : 'text-slate-700'
                }`}>
                  İlerleme
                </span>
                <span className={`text-sm ${
                  darkMode ? 'text-cyan-400' : 'text-blue-600'
                }`}>
                  {progressPercentage.toFixed(0)}%
                </span>
              </div>
              <div className={`h-3 rounded-full overflow-hidden ${
                darkMode ? 'bg-white/10' : 'bg-slate-900/10'
              }`}>
                <motion.div
                  className={`h-full rounded-full ${
                    darkMode
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Additional Mini Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3 rounded-xl ${
                darkMode ? 'bg-white/5' : 'bg-slate-900/5'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">⭐</span>
                  <div>
                    <div className={`text-lg ${
                      darkMode ? 'text-yellow-400' : 'text-yellow-600'
                    }`}>
                      {averageRating}
                    </div>
                    <div className={`text-xs ${
                      darkMode ? 'text-white/50' : 'text-slate-500'
                    }`}>
                      Ort. Puan
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`p-3 rounded-xl ${
                darkMode ? 'bg-white/5' : 'bg-slate-900/5'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">📅</span>
                  <div>
                    <div className={`text-lg ${
                      darkMode ? 'text-orange-400' : 'text-orange-600'
                    }`}>
                      {thisMonthWatched}
                    </div>
                    <div className={`text-xs ${
                      darkMode ? 'text-white/50' : 'text-slate-500'
                    }`}>
                      Bu Ay
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Filter Buttons */}
      {watchlist.length > 0 && (
        <motion.div
          className="flex gap-3 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <FilterButton
            active={filter === 'all'}
            onClick={() => setFilter('all')}
            label="Tümü"
            count={watchlist.length}
            darkMode={darkMode}
            icon={<Bookmark className="w-4 h-4" />}
          />
          <FilterButton
            active={filter === 'unwatched'}
            onClick={() => setFilter('unwatched')}
            label="İzlenecekler"
            count={unwatchedCount}
            darkMode={darkMode}
            icon={<TrendingUp className="w-4 h-4" />}
          />
          <FilterButton
            active={filter === 'watched'}
            onClick={() => setFilter('watched')}
            label="İzlenenler"
            count={watchedCount}
            darkMode={darkMode}
            icon={<Check className="w-4 h-4" />}
          />
        </motion.div>
      )}

      {/* Movies Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <motion.div
            className={`w-16 h-16 border-4 rounded-full ${
              darkMode ? 'border-cyan-500/30 border-t-cyan-500' : 'border-blue-500/30 border-t-blue-500'
            }`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      ) : filteredMovies.length > 0 ? (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {filteredMovies.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <MovieCard
                movie={movie}
                imageBaseUrl={imageBaseUrl}
                darkMode={darkMode}
                isInWatchlist={true}
                isWatched={isWatched(movie.id)}
                onToggleWatchlist={onToggleWatchlist}
                onToggleWatched={onToggleWatched}
                onClick={() => onMovieClick(movie)}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="text-center py-20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
            darkMode
              ? 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20'
              : 'bg-gradient-to-br from-blue-500/20 to-purple-600/20'
          }`}>
            <Bookmark className={`w-12 h-12 ${
              darkMode ? 'text-cyan-400' : 'text-blue-600'
            }`} />
          </div>
          <h3 className={`mb-2 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            {filter === 'watched' ? 'Henüz hiçbir şey izlemediniz' : 
             filter === 'unwatched' ? 'İzlenecek bir şey yok' :
             'Listeniz boş'}
          </h3>
          <p className={darkMode ? 'text-white/60' : 'text-slate-600'}>
            {filter === 'all' 
              ? 'Film ve dizilere göz atın ve izleme listenize ekleyin!'
              : 'Farklı bir filtre deneyin'}
          </p>
        </motion.div>
      )}
    </div>
  );
}

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  darkMode: boolean;
  icon: React.ReactNode;
}

function FilterButton({ active, onClick, label, count, darkMode, icon }: FilterButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-3 rounded-full transition-all ${
        active
          ? darkMode
            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30'
          : darkMode
          ? 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          : 'bg-slate-900/5 text-slate-600 hover:bg-slate-900/10 hover:text-slate-900'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
      <span>{label}</span>
      <span className={`px-2 py-0.5 rounded-full text-xs ${
        active
          ? darkMode
            ? 'bg-white/20'
            : 'bg-white/30'
          : darkMode
          ? 'bg-white/10'
          : 'bg-slate-900/10'
      }`}>
        {count}
      </span>
    </motion.button>
  );
}