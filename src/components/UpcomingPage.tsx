import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Film, Tv } from 'lucide-react';
import { MovieCard } from './MovieCard';
import type { Movie } from '../App';

interface UpcomingPageProps {
  darkMode: boolean;
  imageBaseUrl: string;
  apiKey: string;
  onMovieClick: (movie: Movie) => void;
}

export function UpcomingPage({ darkMode, imageBaseUrl, apiKey, onMovieClick }: UpcomingPageProps) {
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [upcomingTV, setUpcomingTV] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<'movies' | 'tv'>('movies');

  useEffect(() => {
    fetchUpcoming();
  }, [apiKey]);

  const fetchUpcoming = async () => {
    setLoading(true);
    try {
      const [movies, tv] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=tr-TR&region=TR`).then(r => r.json()),
        fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${apiKey}&language=tr-TR`).then(r => r.json()),
      ]);

      setUpcomingMovies((movies.results || []).filter((m: Movie) => m.poster_path));
      setUpcomingTV((tv.results || []).filter((m: Movie) => m.poster_path));
    } catch (error) {
      console.error('Error fetching upcoming:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentList = activeType === 'movies' ? upcomingMovies : upcomingTV;

  // Group by release date
  const groupedByMonth: Record<string, Movie[]> = {};
  currentList.forEach(movie => {
    const date = movie.release_date || movie.first_air_date;
    if (date) {
      const monthYear = new Date(date).toLocaleString('tr-TR', { month: 'long', year: 'numeric' });
      if (!groupedByMonth[monthYear]) {
        groupedByMonth[monthYear] = [];
      }
      groupedByMonth[monthYear].push(movie);
    }
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`inline-flex items-center gap-3 px-6 py-3 rounded-full mb-4 ${
            darkMode
              ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30'
              : 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30'
          }`}
        >
          <Calendar className="w-6 h-6 text-cyan-400" />
          <h1 className={darkMode ? 'text-white' : 'text-slate-900'}>
            Yaklaşan Yapımlar
          </h1>
        </motion.div>
        <p className={`mb-8 ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>
          Vizyona girecek filmler ve diziler
        </p>

        {/* Type Selector */}
        <div className="inline-flex gap-2 p-1 rounded-full bg-white/5">
          <motion.button
            onClick={() => setActiveType('movies')}
            className={`px-6 py-2 rounded-full transition-all ${
              activeType === 'movies'
                ? darkMode
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : darkMode
                ? 'text-white/60 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Film className="w-5 h-5 inline mr-2" />
            Filmler
          </motion.button>
          <motion.button
            onClick={() => setActiveType('tv')}
            className={`px-6 py-2 rounded-full transition-all ${
              activeType === 'tv'
                ? darkMode
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : darkMode
                ? 'text-white/60 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Tv className="w-5 h-5 inline mr-2" />
            Diziler
          </motion.button>
        </div>
      </div>

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
      ) : (
        <div className="space-y-12">
          {Object.entries(groupedByMonth).map(([month, movies], index) => (
            <motion.div
              key={month}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Calendar className={`w-6 h-6 ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`} />
                <h2 className={darkMode ? 'text-white' : 'text-slate-900'}>
                  {month}
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {movies.map(movie => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    imageBaseUrl={imageBaseUrl}
                    darkMode={darkMode}
                    isInWatchlist={false}
                    isWatched={false}
                    onToggleWatchlist={() => {}}
                    onToggleWatched={() => {}}
                    onClick={() => onMovieClick(movie)}
                  />
                ))}
              </div>
            </motion.div>
          ))}

          {Object.keys(groupedByMonth).length === 0 && (
            <div className="text-center py-20">
              <Calendar className={`w-20 h-20 mx-auto mb-4 ${darkMode ? 'text-white/20' : 'text-slate-300'}`} />
              <p className={darkMode ? 'text-white/60' : 'text-slate-600'}>
                Yaklaşan yapım bulunamadı
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
