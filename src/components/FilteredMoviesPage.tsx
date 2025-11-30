import { useState, useEffect } from 'react';
import { Movie } from '../App';
import { MovieCard } from './MovieCard';
import { AdvancedFilters, FilterOptions } from './AdvancedFilters';
import { motion } from 'motion/react';

interface FilteredMoviesPageProps {
  darkMode: boolean;
  imageBaseUrl: string;
  apiKey: string;
  onMovieClick: (movie: Movie) => void;
  isInWatchlist: (movieId: number) => boolean;
  isWatched: (movieId: number) => boolean;
  onToggleWatchlist: (movieId: number) => void;
  onToggleWatched: (movieId: number) => void;
  mediaType: 'movie' | 'tv';
}

export function FilteredMoviesPage({
  darkMode,
  imageBaseUrl,
  apiKey,
  onMovieClick,
  isInWatchlist,
  isWatched,
  onToggleWatchlist,
  onToggleWatched,
  mediaType,
}: FilteredMoviesPageProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<FilterOptions | null>(null);

  const fetchFilteredMovies = async (filters: FilterOptions) => {
    setLoading(true);
    setCurrentFilters(filters);
    
    try {
      const genreQuery = filters.genres.length > 0 ? `&with_genres=${filters.genres.join(',')}` : '';
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/${mediaType}?api_key=${apiKey}&sort_by=${filters.sortBy}&vote_average.gte=${filters.minRating}&vote_average.lte=${filters.maxRating}&vote_count.gte=${filters.minVotes}&primary_release_date.gte=${filters.yearFrom}-01-01&primary_release_date.lte=${filters.yearTo}-12-31${genreQuery}&page=1`
      );
      const data = await response.json();
      setMovies((data.results || []).filter((m: Movie) => m.poster_path));
    } catch (error) {
      console.error('Error fetching filtered movies:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Filter Button */}
      <div className="flex items-center justify-between mb-8">
        <h2 className={darkMode ? 'text-white' : 'text-slate-900'}>
          {mediaType === 'movie' ? 'Filmleri Filtrele' : 'Dizileri Filtrele'}
        </h2>
        <AdvancedFilters
          darkMode={darkMode}
          apiKey={apiKey}
          onApplyFilters={fetchFilteredMovies}
          initialFilters={currentFilters || undefined}
        />
      </div>

      {/* Results */}
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
      ) : movies.length > 0 ? (
        <>
          <p className={`mb-6 ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>
            {movies.length} sonuç bulundu
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                imageBaseUrl={imageBaseUrl}
                darkMode={darkMode}
                isInWatchlist={isInWatchlist(movie.id)}
                isWatched={isWatched(movie.id)}
                onToggleWatchlist={onToggleWatchlist}
                onToggleWatched={onToggleWatched}
                onClick={() => onMovieClick(movie)}
              />
            ))}
          </div>
        </>
      ) : currentFilters ? (
        <div className="text-center py-20">
          <p className={`text-xl mb-2 ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>
            Filtre kriterlerine uygun sonuç bulunamadı
          </p>
          <p className={darkMode ? 'text-white/40' : 'text-slate-400'}>
            Farklı filtreler deneyebilirsiniz
          </p>
        </div>
      ) : (
        <div className="text-center py-20">
          <p className={`text-xl mb-2 ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>
            Filtreleme yapmak için yukarıdaki "Filtreler" butonuna tıklayın
          </p>
          <p className={darkMode ? 'text-white/40' : 'text-slate-400'}>
            Puan, yıl, tür ve daha fazla kritere göre arama yapın
          </p>
        </div>
      )}
    </div>
  );
}
