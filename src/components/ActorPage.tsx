import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Film } from 'lucide-react';
import { MovieCard } from './MovieCard';
import type { Movie } from '../App';

interface ActorPageProps {
  darkMode: boolean;
  imageBaseUrl: string;
  apiKey: string;
  onMovieClick: (movie: Movie) => void;
  actor: { id: number; name: string } | null;
}

interface ActorDetails {
  id: number;
  name: string;
  profile_path: string;
  biography: string;
  birthday: string;
  place_of_birth: string;
  known_for_department: string;
}

export function ActorPage({ darkMode, imageBaseUrl, apiKey, onMovieClick, actor }: ActorPageProps) {
  const [actorDetails, setActorDetails] = useState<ActorDetails | null>(null);
  const [actorMovies, setActorMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (actor) {
      fetchActorData();
    }
  }, [actor]);

  const fetchActorData = async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const [details, credits] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/person/${actor.id}?api_key=${apiKey}&language=tr-TR`).then(r => r.json()),
        fetch(`https://api.themoviedb.org/3/person/${actor.id}/movie_credits?api_key=${apiKey}&language=tr-TR`).then(r => r.json()),
      ]);

      setActorDetails(details);
      setActorMovies((credits.cast || []).filter((m: Movie) => m.poster_path).slice(0, 20));
    } catch (error) {
      console.error('Error fetching actor data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!actor) {
    return (
      <div className="max-w-6xl mx-auto text-center py-20">
        <User className={`w-20 h-20 mx-auto mb-4 ${darkMode ? 'text-white/20' : 'text-slate-300'}`} />
        <p className={darkMode ? 'text-white/60' : 'text-slate-600'}>
          Oyuncu seçilmedi
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
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

  if (!actorDetails) {
    return (
      <div className="max-w-6xl mx-auto text-center py-20">
        <User className={`w-20 h-20 mx-auto mb-4 ${darkMode ? 'text-white/20' : 'text-slate-300'}`} />
        <p className={darkMode ? 'text-white/60' : 'text-slate-600'}>
          Oyuncu bilgisi bulunamadı
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Actor Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-8 rounded-3xl mb-12 ${
          darkMode
            ? 'bg-white/5 border border-white/10'
            : 'bg-white border border-slate-200'
        }`}
      >
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Image */}
          {actorDetails.profile_path ? (
            <motion.img
              src={`${imageBaseUrl}${actorDetails.profile_path}`}
              alt={actorDetails.name}
              className="w-64 h-96 object-cover rounded-2xl shadow-2xl mx-auto md:mx-0"
              whileHover={{ scale: 1.05 }}
            />
          ) : (
            <div className={`w-64 h-96 rounded-2xl flex items-center justify-center mx-auto md:mx-0 ${
              darkMode ? 'bg-white/10' : 'bg-slate-100'
            }`}>
              <User className={`w-32 h-32 ${darkMode ? 'text-white/40' : 'text-slate-400'}`} />
            </div>
          )}

          {/* Actor Info */}
          <div className="flex-1">
            <h1 className={`mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {actorDetails.name}
            </h1>

            {actorDetails.known_for_department && (
              <div className={`inline-block px-4 py-2 rounded-full mb-4 ${
                darkMode
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400'
                  : 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-600'
              }`}>
                {actorDetails.known_for_department}
              </div>
            )}

            <div className={`space-y-3 mb-6 ${darkMode ? 'text-white/80' : 'text-slate-700'}`}>
              {actorDetails.birthday && (
                <div>
                  <span className={darkMode ? 'text-white/60' : 'text-slate-600'}>Doğum Tarihi: </span>
                  {new Date(actorDetails.birthday).toLocaleDateString('tr-TR')}
                  {actorDetails.birthday && (
                    <span className={darkMode ? 'text-white/60' : 'text-slate-600'}>
                      {' '}({new Date().getFullYear() - new Date(actorDetails.birthday).getFullYear()} yaşında)
                    </span>
                  )}
                </div>
              )}
              {actorDetails.place_of_birth && (
                <div>
                  <span className={darkMode ? 'text-white/60' : 'text-slate-600'}>Doğum Yeri: </span>
                  {actorDetails.place_of_birth}
                </div>
              )}
            </div>

            {actorDetails.biography && (
              <div>
                <h3 className={`mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Biyografi
                </h3>
                <p className={`line-clamp-6 ${darkMode ? 'text-white/80' : 'text-slate-700'}`}>
                  {actorDetails.biography}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Movies */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Film className={`w-6 h-6 ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`} />
          <h2 className={darkMode ? 'text-white' : 'text-slate-900'}>
            Filmleri ({actorMovies.length})
          </h2>
        </div>

        {actorMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {actorMovies.map(movie => (
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
        ) : (
          <div className="text-center py-20">
            <Film className={`w-20 h-20 mx-auto mb-4 ${darkMode ? 'text-white/20' : 'text-slate-300'}`} />
            <p className={darkMode ? 'text-white/60' : 'text-slate-600'}>
              Film bulunamadı
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
