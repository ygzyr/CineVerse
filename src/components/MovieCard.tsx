import { Star, Bookmark, Check } from 'lucide-react';
import { Movie } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'framer-motion';

interface MovieCardProps {
  movie: Movie;
  imageBaseUrl: string;
  darkMode: boolean;
  isInWatchlist: boolean;
  isWatched: boolean;
  onToggleWatchlist: (movieId: number) => void;
  onToggleWatched: (movieId: number) => void;
  onClick: () => void;
}

export function MovieCard({
  movie,
  imageBaseUrl,
  darkMode,
  isInWatchlist,
  isWatched,
  onToggleWatchlist,
  onToggleWatched,
  onClick,
}: MovieCardProps) {
  const title = movie.title || movie.name || 'Untitled';
  const posterUrl = movie.poster_path
    ? `${imageBaseUrl}${movie.poster_path}`
    : 'https://via.placeholder.com/500x750/1f2937/ffffff?text=No+Image';
  
  const rating = movie.vote_average || 0;

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWatchlist(movie.id);
  };

  const handleWatchedClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWatched(movie.id);
  };

  return (
    <motion.div
      onClick={onClick}
      className="group relative cursor-pointer rounded-xl overflow-hidden"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {/* Poster */}
      <div className="aspect-[2/3] overflow-hidden relative">
        <ImageWithFallback
          src={posterUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
      </div>

      {/* Hover Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white mb-3 line-clamp-2">{title}</h3>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Star className={`w-5 h-5 ${
                darkMode ? 'text-cyan-400' : 'text-blue-500'
              }`} fill="currentColor" />
              <span className={darkMode ? 'text-cyan-400' : 'text-blue-500'}>
                {rating.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isInWatchlist && (
              <motion.button
                onClick={handleWatchedClick}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                  isWatched
                    ? darkMode
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-black shadow-lg shadow-green-500/50'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                    : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Check className="w-4 h-4" />
                <span className="text-xs">{isWatched ? '✓' : 'İzle'}</span>
              </motion.button>
            )}
            
            <motion.button
              onClick={handleWatchlistClick}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                isInWatchlist
                  ? darkMode
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bookmark className="w-4 h-4" fill={isInWatchlist ? 'currentColor' : 'none'} />
              <span className="text-xs">{isInWatchlist ? '✓' : '+'}</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Rating Badge - Always visible */}
      <div className={`absolute top-3 left-3 backdrop-blur-md px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 shadow-lg ${
        darkMode ? 'bg-black/80 text-white' : 'bg-white/90 text-slate-900'
      }`}>
        <Star className={`w-4 h-4 ${
          darkMode ? 'text-cyan-400' : 'text-blue-500'
        }`} fill="currentColor" />
        <span>{rating.toFixed(1)}</span>
      </div>

      {/* Watched Badge */}
      {isWatched && (
        <motion.div
          className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 shadow-lg ${
            darkMode
              ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-black shadow-green-500/50'
              : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/30'
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        >
          <Check className="w-4 h-4" />
        </motion.div>
      )}

      {/* Watchlist indicator */}
      {isInWatchlist && !isWatched && (
        <motion.div
          className={`absolute top-3 right-3 p-2 rounded-full shadow-lg ${
            darkMode
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-500/50'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-blue-500/30'
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        >
          <Bookmark className="w-4 h-4 text-white" fill="white" />
        </motion.div>
      )}

      {/* Glow effect on hover */}
      <div 
        className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
          darkMode
            ? 'shadow-[0_0_30px_rgba(34,211,238,0.4),0_0_60px_rgba(59,130,246,0.2)]'
            : 'shadow-[0_0_30px_rgba(59,130,246,0.4),0_0_60px_rgba(168,85,247,0.2)]'
        }`}
      />
    </motion.div>
  );
}