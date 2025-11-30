import { useEffect, useState } from 'react';
import { X, Star, Calendar, Bookmark, Check, Film, Play, User } from 'lucide-react';
import { Movie } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';

interface MovieDetailsProps {
  movie: Movie;
  imageBaseUrl: string;
  darkMode: boolean;
  isInWatchlist: boolean;
  isWatched: boolean;
  onToggleWatchlist: (movieId: number) => void;
  onToggleWatched: (movieId: number) => void;
  onClose: () => void;
  apiKey: string;
  onGenreClick: (genreId: number, genreName: string) => void;
  onActorClick?: (actorId: number, actorName: string) => void;
}

interface MovieDetailData {
  genres: { id: number; name: string }[];
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  status: string;
  tagline: string;
  credits?: {
    cast: { id: number; name: string; character: string; profile_path: string }[];
  };
  videos?: {
    results: { key: string; type: string; site: string; name: string }[];
  };
  similar?: {
    results: Movie[];
  };
}

export function MovieDetails({
  movie,
  imageBaseUrl,
  darkMode,
  isInWatchlist,
  isWatched,
  onToggleWatchlist,
  onToggleWatched,
  onClose,
  apiKey,
  onGenreClick,
  onActorClick,
}: MovieDetailsProps) {
  const [details, setDetails] = useState<MovieDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  const title = movie.title || movie.name || 'Untitled';
  const mediaType = movie.media_type || (movie.title ? 'movie' : 'tv');
  const releaseDate = movie.release_date || movie.first_air_date || '';
  const rating = movie.vote_average || 0;

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, []);

  useEffect(() => {
    fetchDetails();
  }, [movie.id]);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/${mediaType}/${movie.id}?api_key=${apiKey}&append_to_response=credits,videos,similar`
      );
      const data = await response.json();
      setDetails(data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  const backdropUrl = movie.backdrop_path
    ? `${imageBaseUrl}${movie.backdrop_path}`
    : movie.poster_path
    ? `${imageBaseUrl}${movie.poster_path}`
    : 'https://via.placeholder.com/1280x720/1f2937/ffffff?text=No+Image';

  const trailer = details?.videos?.results.find(v => v.type === 'Trailer') || details?.videos?.results[0];
  const hasTrailer = !!trailer;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl border overflow-hidden ${
          darkMode
            ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-cyan-500/20'
            : 'bg-gradient-to-b from-white to-slate-50 border-blue-500/20'
        }`}
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="overflow-y-auto overflow-x-hidden max-h-[90vh] custom-scrollbar">
          <motion.button
            onClick={onClose}
            className={`absolute top-4 right-4 z-20 p-2 rounded-full transition-all duration-300 backdrop-blur-md shadow-xl ${
              darkMode
                ? 'bg-black/60 hover:bg-red-500 text-white border border-white/20'
                : 'bg-white/60 hover:bg-red-500 text-slate-900 hover:text-white border border-slate-300'
            }`}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5" />
          </motion.button>

          <div className="relative h-56 md:h-80 overflow-hidden">
            {hasTrailer ? (
              <div className="relative w-full h-full overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailer.key}`}
                  title="Movie Trailer Background"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.77vh] h-[56.25vw] min-w-full min-h-full"
                  style={{ pointerEvents: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
                <div className={`absolute inset-0 bg-gradient-to-t pointer-events-none ${
                  darkMode
                    ? 'from-slate-950 via-slate-950/60 to-transparent'
                    : 'from-slate-50 via-slate-50/60 to-transparent'
                }`} />
                <div className={`absolute inset-0 bg-gradient-to-tr opacity-30 pointer-events-none ${
                  darkMode
                    ? 'from-cyan-900/50 via-transparent to-blue-900/50'
                    : 'from-blue-200/50 via-transparent to-purple-200/50'
                }`} />
              </div>
            ) : (
              <>
                <ImageWithFallback
                  src={backdropUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${
                  darkMode
                    ? 'from-slate-950 via-slate-950/60 to-transparent'
                    : 'from-slate-50 via-slate-50/60 to-transparent'
                }`} />
                <div className={`absolute inset-0 bg-gradient-to-tr opacity-30 ${
                  darkMode
                    ? 'from-cyan-900/50 via-transparent to-blue-900/50'
                    : 'from-blue-200/50 via-transparent to-purple-200/50'
                }`} />
              </>
            )}
          </div>

          <div className="relative px-6 md:px-10 pb-10 -mt-20 md:-mt-24">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              <motion.div
                className="flex-shrink-0"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className={`w-40 h-60 rounded-xl overflow-hidden shadow-2xl border-4 transition-all duration-300 hover:scale-105 ${
                  darkMode
                    ? 'border-black/50 hover:border-cyan-500/50'
                    : 'border-white/50 hover:border-blue-500/50'
                }`}>
                  <ImageWithFallback
                    src={
                      movie.poster_path
                        ? `${imageBaseUrl}${movie.poster_path}`
                        : 'https://via.placeholder.com/500x750/1f2937/ffffff?text=No+Image'
                    }
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              <motion.div
                className="flex-1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className={`mb-3 ${
                  darkMode
                    ? 'text-white bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent'
                    : 'text-slate-900'
                }`}>
                  {title}
                </h2>
                
                {details?.tagline && (
                  <p className={`italic mb-6 text-lg ${
                    darkMode ? 'text-cyan-400' : 'text-blue-600'
                  }`}>
                    {details.tagline}
                  </p>
                )}

                <div className="flex flex-wrap gap-4 mb-6">
                  <motion.div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg ${
                      darkMode
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-black shadow-green-500/30'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/30'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Star className="w-5 h-5" fill="currentColor" />
                    <span>{rating.toFixed(1)}/10</span>
                  </motion.div>
                  
                  {releaseDate && (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm ${
                      darkMode ? 'bg-white/10 text-white/80' : 'bg-slate-900/10 text-slate-700'
                    }`}>
                      <Calendar className="w-5 h-5" />
                      <span>{new Date(releaseDate).getFullYear()}</span>
                    </div>
                  )}

                  {details?.runtime && (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm ${
                      darkMode ? 'bg-white/10 text-white/80' : 'bg-slate-900/10 text-slate-700'
                    }`}>
                      <Film className="w-5 h-5" />
                      <span>{details.runtime} dk</span>
                    </div>
                  )}

                  {details?.number_of_seasons && (
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm ${
                      darkMode ? 'bg-white/10 text-white/80' : 'bg-slate-900/10 text-slate-700'
                    }`}>
                      <Film className="w-5 h-5" />
                      <span>{details.number_of_seasons} Sezon</span>
                    </div>
                  )}
                </div>

                {details?.genres && details.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {details.genres.map((genre, index) => (
                      <motion.span
                        key={genre.id}
                        className={`px-4 py-2 rounded-full backdrop-blur-sm transition-all cursor-pointer ${
                          darkMode
                            ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-300 hover:from-cyan-500/30 hover:to-blue-600/30'
                            : 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-500/30 text-blue-700 hover:from-blue-500/30 hover:to-purple-600/30'
                        }`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => onGenreClick(genre.id, genre.name)}
                      >
                        {genre.name}
                      </motion.span>
                    ))}
                  </div>
                )}

                <div className="flex gap-3 mb-8">
                  <motion.button
                    onClick={() => onToggleWatchlist(movie.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 shadow-lg ${
                      isInWatchlist
                        ? darkMode
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/50'
                          : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-blue-500/50'
                        : darkMode
                        ? 'bg-white/10 text-white hover:bg-white/20'
                        : 'bg-slate-900/10 text-slate-900 hover:bg-slate-900/20'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Bookmark className="w-5 h-5" fill={isInWatchlist ? 'currentColor' : 'none'} />
                    <span>{isInWatchlist ? 'Listede' : 'Listeye Ekle'}</span>
                  </motion.button>

                  {isInWatchlist && (
                    <motion.button
                      onClick={() => onToggleWatched(movie.id)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 shadow-lg ${
                        isWatched
                          ? darkMode
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-black shadow-green-500/50'
                            : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/50'
                          : darkMode
                          ? 'bg-white/10 text-white hover:bg-white/20'
                          : 'bg-slate-900/10 text-slate-900 hover:bg-slate-900/20'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 'auto', opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                    >
                      <Check className="w-5 h-5" />
                      <span>{isWatched ? 'İzlendi ✓' : 'İzlendi İşaretle'}</span>
                    </motion.button>
                  )}
                </div>

                <div className="mb-8">
                  <h3 className={darkMode ? 'text-white mb-3' : 'text-slate-900 mb-3'}>Özet</h3>
                  <p className={darkMode ? 'text-white/70 leading-relaxed' : 'text-slate-700 leading-relaxed'}>
                    {movie.overview || 'Açıklama mevcut değil.'}
                  </p>
                </div>

                {details?.credits?.cast && details.credits.cast.length > 0 && (
                  <div className="mb-8">
                    <h3 className={`mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Oyuncular</h3>
                    <div className="flex gap-4 overflow-x-auto pb-4">
                      {details.credits.cast.slice(0, 10).map((actor, index) => (
                        <motion.div
                          key={actor.id}
                          className={`flex-shrink-0 w-28 text-center group ${onActorClick ? 'cursor-pointer' : ''}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + index * 0.05 }}
                          onClick={() => onActorClick && onActorClick(actor.id, actor.name)}
                        >
                          <div className={`w-28 h-28 rounded-full overflow-hidden mb-3 border-2 transition-all shadow-lg group-hover:scale-110 ${
                            darkMode
                              ? 'bg-gradient-to-br from-cyan-900/50 to-blue-900/50 border-white/10 group-hover:border-cyan-500/50'
                              : 'bg-gradient-to-br from-blue-200/50 to-purple-200/50 border-slate-300 group-hover:border-blue-500/50'
                          }`}>
                            {actor.profile_path ? (
                              <ImageWithFallback
                                src={`${imageBaseUrl}${actor.profile_path}`}
                                alt={actor.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className={`w-full h-full flex items-center justify-center ${
                                darkMode ? 'text-white/30' : 'text-slate-400'
                              }`}>
                                <User className="w-10 h-10" />
                              </div>
                            )}
                          </div>
                          <p className={`text-sm mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            {actor.name}
                          </p>
                          <p className={`text-xs line-clamp-2 ${darkMode ? 'text-white/40' : 'text-slate-500'}`}>
                            {actor.character}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {details?.similar?.results && details.similar.results.filter((m: Movie) => m.poster_path).length > 0 && (
                  <div>
                    <h3 className={`mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Benzer Filmler</h3>
                    <div className="flex gap-4 overflow-x-auto pb-4">
                      {details.similar.results.filter((m: Movie) => m.poster_path).slice(0, 10).map((similar, index) => (
                        <motion.div
                          key={similar.id}
                          className="flex-shrink-0 w-32 group cursor-pointer"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6 + index * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className={`w-32 h-48 rounded-xl overflow-hidden mb-2 border-2 shadow-lg transition-all ${
                            darkMode
                              ? 'border-white/10 group-hover:border-cyan-500/50'
                              : 'border-slate-200 group-hover:border-blue-500/50'
                          }`}>
                            <ImageWithFallback
                              src={`${imageBaseUrl}${similar.poster_path}`}
                              alt={similar.title || similar.name || ''}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className={`text-sm line-clamp-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            {similar.title || similar.name}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className={`w-3 h-3 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} fill="currentColor" />
                            <span className={`text-xs ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>
                              {similar.vote_average?.toFixed(1)}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}