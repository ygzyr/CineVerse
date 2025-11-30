import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../App';
import { MovieCard } from './MovieCard';
import { useRef, useState } from 'react';
import { motion } from 'motion/react';

interface HorizontalScrollProps {
  title: string;
  movies: Movie[];
  imageBaseUrl: string;
  darkMode: boolean;
  isInWatchlist: (movieId: number) => boolean;
  isWatched: (movieId: number) => boolean;
  onToggleWatchlist: (movieId: number) => void;
  onToggleWatched: (movieId: number) => void;
  onMovieClick: (movie: Movie) => void;
}

export function HorizontalScroll({
  title,
  movies,
  imageBaseUrl,
  darkMode,
  isInWatchlist,
  isWatched,
  onToggleWatchlist,
  onToggleWatched,
  onMovieClick,
}: HorizontalScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  if (movies.length === 0) return null;

  return (
    <div className="group/section relative">
      {/* Title */}
      <motion.h2
        className={`mb-4 px-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h2>

      {/* Scroll Container */}
      <div className="relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <motion.button
            onClick={() => scroll('left')}
            className={`absolute left-0 top-0 bottom-0 z-10 w-16 flex items-center justify-center backdrop-blur-sm transition-all ${
              darkMode
                ? 'bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent hover:from-slate-950'
                : 'bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent hover:from-slate-50'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className={`p-2 rounded-full ${
              darkMode
                ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
                : 'bg-blue-500/20 text-blue-600 hover:bg-blue-500/30'
            }`}>
              <ChevronLeft className="w-8 h-8" />
            </div>
          </motion.button>
        )}

        {/* Right Arrow */}
        {showRightArrow && (
          <motion.button
            onClick={() => scroll('right')}
            className={`absolute right-0 top-0 bottom-0 z-10 w-16 flex items-center justify-center backdrop-blur-sm transition-all ${
              darkMode
                ? 'bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent hover:from-slate-950'
                : 'bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent hover:from-slate-50'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className={`p-2 rounded-full ${
              darkMode
                ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
                : 'bg-blue-500/20 text-blue-600 hover:bg-blue-500/30'
            }`}>
              <ChevronRight className="w-8 h-8" />
            </div>
          </motion.button>
        )}

        {/* Movies Scroll */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 px-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie, index) => (
            <motion.div
              key={movie.id}
              className="flex-shrink-0 w-[180px] sm:w-[200px] md:w-[220px]"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <MovieCard
                movie={movie}
                imageBaseUrl={imageBaseUrl}
                darkMode={darkMode}
                isInWatchlist={isInWatchlist(movie.id)}
                isWatched={isWatched(movie.id)}
                onToggleWatchlist={onToggleWatchlist}
                onToggleWatched={onToggleWatched}
                onClick={() => onMovieClick(movie)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
