import { useState } from 'react';
import { motion } from 'motion/react';
import { Shuffle, Heart, X, Sparkles } from 'lucide-react';
import type { Movie } from '../App';

interface DiscoverPageProps {
  darkMode: boolean;
  imageBaseUrl: string;
  apiKey: string;
  onMovieClick: (movie: Movie) => void;
}

export function DiscoverPage({ darkMode, imageBaseUrl, apiKey, onMovieClick }: DiscoverPageProps) {
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState<string>('');

  const moods = [
    { emoji: '😂', label: 'Komedi', genre: 35 },
    { emoji: '💥', label: 'Aksiyon', genre: 28 },
    { emoji: '❤️', label: 'Romantik', genre: 10749 },
    { emoji: '😱', label: 'Korku', genre: 27 },
    { emoji: '🎭', label: 'Drama', genre: 18 },
    { emoji: '🔮', label: 'Bilim Kurgu', genre: 878 },
    { emoji: '🕵️', label: 'Gizem', genre: 9648 },
    { emoji: '🎬', label: 'Macera', genre: 12 },
  ];

  const getRandomMovie = async (genreId?: number) => {
    setLoading(true);
    try {
      const page = Math.floor(Math.random() * 5) + 1;
      const url = genreId
        ? `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&page=${page}&sort_by=vote_average.desc&vote_count.gte=100`
        : `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`;
      
      const response = await fetch(url);
      const data = await response.json();
      const movies = (data.results || []).filter((m: Movie) => m.poster_path && m.backdrop_path);
      
      if (movies.length > 0) {
        const randomIndex = Math.floor(Math.random() * movies.length);
        setCurrentMovie(movies[randomIndex]);
      }
    } catch (error) {
      console.error('Error fetching random movie:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMoodSelect = (genreId: number, moodLabel: string) => {
    setMood(moodLabel);
    getRandomMovie(genreId);
  };

  return (
    <div className="max-w-6xl mx-auto">
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
          <Shuffle className="w-6 h-6 text-cyan-400" />
          <h1 className={darkMode ? 'text-white' : 'text-slate-900'}>
            Ne İzlesem?
          </h1>
        </motion.div>
        <p className={`mb-8 ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>
          Ruh haline göre film önerisi al
        </p>

        {/* Mood Selection */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {moods.map((m) => (
            <motion.button
              key={m.genre}
              onClick={() => handleMoodSelect(m.genre, m.label)}
              className={`p-6 rounded-2xl transition-all ${
                mood === m.label
                  ? darkMode
                    ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
                    : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                  : darkMode
                  ? 'bg-white/5 hover:bg-white/10'
                  : 'bg-slate-900/5 hover:bg-slate-900/10'
              }`}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-4xl mb-2">{m.emoji}</div>
              <div className={mood === m.label ? 'text-white' : darkMode ? 'text-white' : 'text-slate-900'}>
                {m.label}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Random Movie Display */}
      {loading && (
        <div className="flex justify-center py-20">
          <motion.div
            className={`w-16 h-16 border-4 rounded-full ${
              darkMode ? 'border-cyan-500/30 border-t-cyan-500' : 'border-blue-500/30 border-t-blue-500'
            }`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      )}

      {!loading && currentMovie && (
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`relative rounded-3xl overflow-hidden ${
            darkMode
              ? 'bg-white/5 border border-white/10'
              : 'bg-white border border-slate-200'
          }`}
        >
          {/* Backdrop */}
          <div className="relative h-96 overflow-hidden">
            <img
              src={`${imageBaseUrl}${currentMovie.backdrop_path}`}
              alt={currentMovie.title || currentMovie.name}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 ${
              darkMode
                ? 'bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent'
                : 'bg-gradient-to-t from-white via-white/50 to-transparent'
            }`} />
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="flex items-start gap-6">
              {/* Poster */}
              <motion.img
                src={`${imageBaseUrl}${currentMovie.poster_path}`}
                alt={currentMovie.title || currentMovie.name}
                className="w-48 rounded-2xl shadow-2xl"
                whileHover={{ scale: 1.05 }}
              />

              {/* Details */}
              <div className="flex-1">
                <h2 className={`mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {currentMovie.title || currentMovie.name}
                </h2>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-5 h-5 text-yellow-500" fill="currentColor" />
                    <span className={darkMode ? 'text-white' : 'text-slate-900'}>
                      {currentMovie.vote_average?.toFixed(1)}/10
                    </span>
                  </div>
                  {currentMovie.release_date && (
                    <span className={darkMode ? 'text-white/60' : 'text-slate-600'}>
                      {new Date(currentMovie.release_date).getFullYear()}
                    </span>
                  )}
                </div>

                <p className={`mb-6 line-clamp-4 ${darkMode ? 'text-white/80' : 'text-slate-700'}`}>
                  {currentMovie.overview}
                </p>

                {/* Actions */}
                <div className="flex gap-4">
                  <motion.button
                    onClick={() => onMovieClick(currentMovie)}
                    className={`flex-1 px-6 py-3 rounded-full transition-all ${
                      darkMode
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Detayları Gör
                  </motion.button>

                  <motion.button
                    onClick={() => getRandomMovie(mood ? moods.find(m => m.label === mood)?.genre : undefined)}
                    className={`px-6 py-3 rounded-full transition-all ${
                      darkMode
                        ? 'bg-white/10 hover:bg-white/20 text-white'
                        : 'bg-slate-900/10 hover:bg-slate-900/20 text-slate-900'
                    }`}
                    whileHover={{ scale: 1.05, rotate: 180 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Shuffle className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {!loading && !currentMovie && (
        <div className="text-center py-20">
          <Shuffle className={`w-20 h-20 mx-auto mb-4 ${darkMode ? 'text-white/20' : 'text-slate-300'}`} />
          <p className={darkMode ? 'text-white/60' : 'text-slate-600'}>
            Bir ruh hali seç ve film keşfetmeye başla!
          </p>
        </div>
      )}
    </div>
  );
}
