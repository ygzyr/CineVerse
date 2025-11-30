import { Play, Info, Bookmark, Star } from 'lucide-react';
import { Movie } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';

interface HeroBannerProps {
  movie: Movie;
  imageBaseUrl: string;
  darkMode: boolean;
  isInWatchlist: boolean;
  onToggleWatchlist: (movieId: number) => void;
  onPlayClick: () => void;
}

export function HeroBanner({
  movie,
  imageBaseUrl,
  darkMode,
  isInWatchlist,
  onToggleWatchlist,
  onPlayClick,
}: HeroBannerProps) {
  const title = movie.title || movie.name || 'Untitled';
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : `${imageBaseUrl}${movie.poster_path}`;

  return (
    <div className="relative h-[70vh] md:h-[80vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={backdropUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        
        {/* Gradient Overlays */}
        <div className={`absolute inset-0 bg-gradient-to-t ${
          darkMode
            ? 'from-slate-950 via-slate-950/70 to-transparent'
            : 'from-slate-50 via-slate-50/70 to-transparent'
        }`} />
        <div className={`absolute inset-0 bg-gradient-to-r ${
          darkMode
            ? 'from-slate-950 via-transparent to-transparent'
            : 'from-slate-50 via-transparent to-transparent'
        }`} />
        
        {/* Colorful gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br opacity-30 ${
          darkMode
            ? 'from-cyan-900/50 via-transparent to-purple-900/50'
            : 'from-blue-200/50 via-transparent to-purple-200/50'
        }`} />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-end md:items-center">
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 pb-12 md:pb-0 w-full">
          <motion.div
            className="max-w-2xl space-y-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className={`px-4 py-2 rounded-full backdrop-blur-md ${
                darkMode
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30'
                  : 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30'
              }`}>
                <span className={`text-sm ${
                  darkMode ? 'text-cyan-300' : 'text-blue-700'
                }`}>
                  ⚡ Bugünün Öne Çıkanı
                </span>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              className={`text-5xl md:text-7xl drop-shadow-2xl ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {title}
            </motion.h1>

            {/* Meta */}
            <motion.div
              className="flex items-center gap-4 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                darkMode
                  ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-black'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
              }`}>
                <Star className="w-4 h-4" fill="currentColor" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
              
              {(movie.release_date || movie.first_air_date) && (
                <span className={darkMode ? 'text-white/80' : 'text-slate-700'}>
                  {new Date(movie.release_date || movie.first_air_date!).getFullYear()}
                </span>
              )}
            </motion.div>

            {/* Overview */}
            <motion.p
              className={`text-lg max-w-xl line-clamp-3 ${
                darkMode ? 'text-white/80' : 'text-slate-700'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              {movie.overview}
            </motion.p>

            {/* Buttons */}
            <motion.div
              className="flex gap-3 pt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <motion.button
                onClick={onPlayClick}
                className={`flex items-center gap-2 px-8 py-4 rounded-xl transition-all shadow-lg ${
                  darkMode
                    ? 'bg-white text-black hover:bg-white/90 shadow-white/20'
                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/30'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-6 h-6" fill="currentColor" />
                <span>Detaylar</span>
              </motion.button>

              <motion.button
                onClick={() => onToggleWatchlist(movie.id)}
                className={`flex items-center gap-2 px-8 py-4 rounded-xl backdrop-blur-md transition-all shadow-lg ${
                  isInWatchlist
                    ? darkMode
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/30'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-blue-500/30'
                    : darkMode
                    ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    : 'bg-slate-900/10 text-slate-900 hover:bg-slate-900/20 border border-slate-900/20'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bookmark className="w-6 h-6" fill={isInWatchlist ? 'currentColor' : 'none'} />
                <span>{isInWatchlist ? 'Listede' : 'Listeye Ekle'}</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Fade to content */}
      <div className={`absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t pointer-events-none ${
        darkMode ? 'from-slate-950' : 'from-slate-50'
      }`} />
    </div>
  );
}
