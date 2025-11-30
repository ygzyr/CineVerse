import { useState, useEffect } from 'react';
import { Heart, X, Info, RotateCcw, Film, Tv } from 'lucide-react';
import { Movie } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion, useMotionValue, useTransform, PanInfo } from 'motion/react';

interface SwipePageProps {
  darkMode: boolean;
  apiKey: string;
  onMovieClick: (movie: Movie) => void;
  imageBaseUrl: string;
}

export function SwipePage({ darkMode, apiKey, onMovieClick, imageBaseUrl }: SwipePageProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [likedMovies, setLikedMovies] = useState<number[]>([]);
  const [passedMovies, setPassedMovies] = useState<number[]>([]);
  const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie');

  // Motion values - must be declared before any conditional returns
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-20, 0, 20]);
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0, 1, 1, 1, 0]);
  const passOpacity = useTransform(x, [-300, -100, 0], [1, 0.5, 0]);
  const likeOpacity = useTransform(x, [0, 100, 300], [0, 0.5, 1]);

  useEffect(() => {
    fetchMovies();
  }, [mediaType]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const randomPage = Math.floor(Math.random() * 5) + 1;
      // Daha kaliteli filmler/diziler için filtreleme
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/${mediaType}?api_key=${apiKey}&sort_by=popularity.desc&page=${randomPage}&vote_count.gte=500&vote_average.gte=7&with_original_language=en`
      );
      const data = await response.json();
      // Hem poster hem de backdrop olan, iyi görselli yapımları seç
      const filteredResults = data.results.filter((m: Movie) => m.poster_path && m.backdrop_path);
      setMovies(filteredResults);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (Math.abs(offset) > 100 || Math.abs(velocity) > 500) {
      if (offset > 0) {
        handleLike();
      } else {
        handlePass();
      }
    }
  };

  const handleLike = () => {
    const currentMovie = movies[currentIndex];
    if (currentMovie) {
      setLikedMovies([...likedMovies, currentMovie.id]);
      moveToNext();
    }
  };

  const handlePass = () => {
    const currentMovie = movies[currentIndex];
    if (currentMovie) {
      setPassedMovies([...passedMovies, currentMovie.id]);
      moveToNext();
    }
  };

  const moveToNext = () => {
    if (currentIndex < movies.length - 1) {
      setCurrentIndex(currentIndex + 1);
      x.set(0); // Reset the drag position
    } else {
      fetchMovies();
    }
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      const prevMovie = movies[currentIndex - 1];
      setLikedMovies(likedMovies.filter(id => id !== prevMovie.id));
      setPassedMovies(passedMovies.filter(id => id !== prevMovie.id));
    }
  };

  const currentMovie = movies[currentIndex];

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <motion.div
          className={`w-16 h-16 border-4 rounded-full ${
            darkMode ? 'border-cyan-500/30 border-t-cyan-500' : 'border-blue-500/30 border-t-blue-500'
          }`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  // No movies state
  if (!currentMovie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6">
        <p className={`mb-6 text-center ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>
          Tüm kartlar görüntülendi!
        </p>
        <button
          onClick={fetchMovies}
          className={`px-8 py-4 rounded-2xl transition-all ${
            darkMode
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50'
          }`}
        >
          Yeni Kartlar Yükle
        </button>
      </div>
    );
  }

  const title = currentMovie.title || currentMovie.name || 'Untitled';
  const year = currentMovie.release_date?.split('-')[0] || currentMovie.first_air_date?.split('-')[0] || '';

  return (
    <div className="px-6 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header with Media Type Toggle */}
        <div className="text-center mb-8">
          <h2 className={`mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Tinder Tarzı Keşfet
          </h2>
          
          {/* Media Type Toggle */}
          <div className={`inline-flex rounded-2xl p-1 mb-4 ${
            darkMode ? 'bg-white/10' : 'bg-slate-200'
          }`}>
            <button
              onClick={() => {
                setMediaType('movie');
                setLikedMovies([]);
                setPassedMovies([]);
              }}
              className={`px-8 py-3 rounded-xl transition-all flex items-center gap-2 ${
                mediaType === 'movie'
                  ? darkMode
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                  : darkMode
                  ? 'text-white/60 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Film className="w-5 h-5" />
              <span>Filmler</span>
            </button>
            <button
              onClick={() => {
                setMediaType('tv');
                setLikedMovies([]);
                setPassedMovies([]);
              }}
              className={`px-8 py-3 rounded-xl transition-all flex items-center gap-2 ${
                mediaType === 'tv'
                  ? darkMode
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                  : darkMode
                  ? 'text-white/60 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Tv className="w-5 h-5" />
              <span>Diziler</span>
            </button>
          </div>
          
          <p className={darkMode ? 'text-white/60' : 'text-slate-600'}>
            Beğen veya geç - Kaliteli {mediaType === 'movie' ? 'filmler' : 'diziler'}!
          </p>
        </div>

        {/* Card Stack */}
        <div className="relative h-[600px] mb-8">
          {/* Next card (preview) */}
          {movies[currentIndex + 1] && (
            <div
              className={`absolute inset-0 rounded-3xl overflow-hidden shadow-2xl transform scale-95 ${
                darkMode ? 'bg-slate-800' : 'bg-white'
              }`}
              style={{ zIndex: 1 }}
            >
              <ImageWithFallback
                src={`${imageBaseUrl}${movies[currentIndex + 1].poster_path}`}
                alt={movies[currentIndex + 1].title || movies[currentIndex + 1].name || ''}
                className="w-full h-full object-cover opacity-50"
              />
            </div>
          )}

          {/* Current card */}
          <motion.div
            key={currentIndex}
            className={`absolute inset-0 rounded-3xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing border-4 ${
              darkMode ? 'bg-slate-800 border-cyan-500/20' : 'bg-white border-blue-500/20'
            }`}
            style={{
              x,
              rotate,
              opacity,
              zIndex: 2,
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            whileTap={{ scale: 1.05 }}
          >
            <ImageWithFallback
              src={`${imageBaseUrl}${currentMovie.poster_path}`}
              alt={title}
              className="w-full h-full object-cover"
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            
            {/* Movie info */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h3 className="mb-2 drop-shadow-lg">{title}</h3>
              <div className="flex items-center gap-4 mb-3">
                {year && (
                  <span className="text-white/90">{year}</span>
                )}
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-white/90">{currentMovie.vote_average?.toFixed(1)}</span>
                </div>
              </div>
              <p className="text-white/80 line-clamp-3 text-sm leading-relaxed">
                {currentMovie.overview}
              </p>
            </div>

            {/* Swipe indicators */}
            <motion.div
              className="absolute top-8 right-8 text-red-500 border-4 border-red-500 rounded-2xl px-8 py-4 rotate-12"
              style={{ opacity: passOpacity }}
            >
              <span className="text-4xl font-bold">GEÇÇ</span>
            </motion.div>
            <motion.div
              className="absolute top-8 left-8 text-green-500 border-4 border-green-500 rounded-2xl px-8 py-4 -rotate-12"
              style={{ opacity: likeOpacity }}
            >
              <span className="text-4xl font-bold">BEĞENDİM</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-6">
          <motion.button
            onClick={handlePass}
            className={`p-6 rounded-full shadow-xl transition-all ${
              darkMode
                ? 'bg-gradient-to-br from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700'
                : 'bg-gradient-to-br from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700'
            } text-white`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-8 h-8" />
          </motion.button>

          <motion.button
            onClick={handleUndo}
            disabled={currentIndex === 0}
            className={`p-4 rounded-full shadow-xl transition-all ${
              darkMode
                ? 'bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-30'
                : 'bg-slate-300 hover:bg-slate-400 disabled:bg-slate-200 disabled:opacity-30'
            } text-white`}
            whileHover={{ scale: currentIndex > 0 ? 1.1 : 1 }}
            whileTap={{ scale: currentIndex > 0 ? 0.9 : 1 }}
          >
            <RotateCcw className="w-6 h-6" />
          </motion.button>

          <motion.button
            onClick={() => onMovieClick(currentMovie)}
            className={`p-4 rounded-full shadow-xl transition-all ${
              darkMode
                ? 'bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700'
                : 'bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
            } text-white`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Info className="w-6 h-6" />
          </motion.button>

          <motion.button
            onClick={handleLike}
            className={`p-6 rounded-full shadow-xl transition-all ${
              darkMode
                ? 'bg-gradient-to-br from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600'
                : 'bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
            } text-white`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart className="w-8 h-8" />
          </motion.button>
        </div>

        {/* Stats */}
        <div className="mt-8 flex justify-center gap-8">
          <div className="text-center">
            <p className={`text-2xl mb-1 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              {likedMovies.length}
            </p>
            <p className={`text-sm ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>Beğenilen</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl mb-1 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
              {passedMovies.length}
            </p>
            <p className={`text-sm ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>Geçilen</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl mb-1 ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
              {movies.length - currentIndex}
            </p>
            <p className={`text-sm ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>Kalan</p>
          </div>
        </div>
      </div>
    </div>
  );
}