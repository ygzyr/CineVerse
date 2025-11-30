import { useState, useEffect } from 'react';
import { Search, TrendingUp, Star, Film, Tv, Bookmark, Moon, Sun, Sparkles, Shuffle, Calendar, FolderHeart, Heart, Menu, X, ChevronDown, Play, Grid, List, Palette, User } from 'lucide-react';
import { HeroBanner } from './components/HeroBanner';
import { HorizontalScroll } from './components/HorizontalScroll';
import { MovieCard } from './components/MovieCard';
import { MovieDetails } from './components/MovieDetails';
import { SearchBar } from './components/SearchBar';
import { WatchlistPage } from './components/WatchlistPage';
import { DiscoverPage } from './components/DiscoverPage';
import { UpcomingPage } from './components/UpcomingPage';
import { CollectionsPage } from './components/CollectionsPage';
import { ActorPage } from './components/ActorPage';
import { SwipePage } from './components/SwipePage';
import { ModernHeader } from './components/ModernHeader';
import { motion, AnimatePresence } from 'motion/react';

// TMDB API Configuration
const TMDB_API_KEY = '6b2259c866a513db5d8ca63deac3a2f1';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: string;
  runtime?: number;
  genres?: { id: number; name: string }[];
}

export interface WatchlistItem {
  movieId: number;
  watched: boolean;
  addedAt: string;
  rating?: number; // 1-10
  notes?: string;
  watchedDate?: string;
}

export interface Collection {
  id: string;
  name: string;
  movieIds: number[];
  createdAt: string;
}

export type ThemeColor = 'cyan' | 'purple' | 'green' | 'red' | 'orange';
export type ViewMode = 'grid' | 'list';

type MainTab = 'home' | 'movies' | 'tv' | 'watchlist' | 'search' | 'genre' | 'discover' | 'upcoming' | 'collections' | 'actor' | 'swipe';

export default function App() {
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [darkMode, setDarkMode] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<{ id: number; name: string } | null>(null);
  const [selectedActor, setSelectedActor] = useState<{ id: number; name: string } | null>(null);
  const [themeColor, setThemeColor] = useState<ThemeColor>('cyan');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
  // Data states
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
  const [trendingAll, setTrendingAll] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [trendingTV, setTrendingTV] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [popularTV, setPopularTV] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [topRatedTV, setTopRatedTV] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [genreResults, setGenreResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  // Load watchlist from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('movieWatchlist');
    if (saved) {
      setWatchlist(JSON.parse(saved));
    }
  }, []);

  // Save watchlist to localStorage
  useEffect(() => {
    localStorage.setItem('movieWatchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Load collections from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('movieCollections');
    if (saved) {
      setCollections(JSON.parse(saved));
    }
  }, []);

  // Save collections to localStorage
  useEffect(() => {
    localStorage.setItem('movieCollections', JSON.stringify(collections));
  }, [collections]);

  // Load theme
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      setDarkMode(saved === 'dark');
    }
  }, []);

  // Save theme
  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Load theme color
  useEffect(() => {
    const saved = localStorage.getItem('themeColor');
    if (saved) {
      setThemeColor(saved as ThemeColor);
    }
  }, []);

  // Save theme color
  useEffect(() => {
    localStorage.setItem('themeColor', themeColor);
  }, [themeColor]);

  // Load view mode
  useEffect(() => {
    const saved = localStorage.getItem('viewMode');
    if (saved) {
      setViewMode(saved as ViewMode);
    }
  }, []);

  // Save view mode
  useEffect(() => {
    localStorage.setItem('viewMode', viewMode);
  }, [viewMode]);

  // Fetch all data on mount
  useEffect(() => {
    if (activeTab === 'home') {
      fetchHomeData();
    } else if (activeTab === 'movies') {
      fetchMoviesData();
    } else if (activeTab === 'tv') {
      fetchTVData();
    } else if (activeTab === 'genre' && selectedGenre) {
      fetchGenreData();
    }
  }, [activeTab, selectedGenre]);

  const fetchHomeData = async () => {
    setLoading(true);
    try {
      const [trending, movies, tv] = await Promise.all([
        fetch(`${TMDB_BASE_URL}/trending/all/week?api_key=${TMDB_API_KEY}`).then(r => r.json()),
        fetch(`${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`).then(r => r.json()),
        fetch(`${TMDB_BASE_URL}/trending/tv/week?api_key=${TMDB_API_KEY}`).then(r => r.json()),
      ]);

      // Filter out items without poster images
      setTrendingAll((trending.results || []).filter((m: Movie) => m.poster_path));
      setTrendingMovies((movies.results || []).filter((m: Movie) => m.poster_path));
      setTrendingTV((tv.results || []).filter((m: Movie) => m.poster_path));
      setHeroMovie((trending.results || []).filter((m: Movie) => m.poster_path)?.[0] || null);
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoviesData = async () => {
    setLoading(true);
    try {
      const [trending, popular, topRated] = await Promise.all([
        fetch(`${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`).then(r => r.json()),
        fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`).then(r => r.json()),
        fetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}`).then(r => r.json()),
      ]);

      // Filter out items without poster images
      setTrendingMovies((trending.results || []).filter((m: Movie) => m.poster_path));
      setPopularMovies((popular.results || []).filter((m: Movie) => m.poster_path));
      setTopRatedMovies((topRated.results || []).filter((m: Movie) => m.poster_path));
    } catch (error) {
      console.error('Error fetching movies data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTVData = async () => {
    setLoading(true);
    try {
      const [trending, popular, topRated] = await Promise.all([
        fetch(`${TMDB_BASE_URL}/trending/tv/week?api_key=${TMDB_API_KEY}`).then(r => r.json()),
        fetch(`${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}`).then(r => r.json()),
        fetch(`${TMDB_BASE_URL}/tv/top_rated?api_key=${TMDB_API_KEY}`).then(r => r.json()),
      ]);

      // Filter out items without poster images
      setTrendingTV((trending.results || []).filter((m: Movie) => m.poster_path));
      setPopularTV((popular.results || []).filter((m: Movie) => m.poster_path));
      setTopRatedTV((topRated.results || []).filter((m: Movie) => m.poster_path));
    } catch (error) {
      console.error('Error fetching TV data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGenreData = async () => {
    if (selectedGenre) {
      setLoading(true);
      try {
        const response = await fetch(
          `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${selectedGenre.id}`
        );
        const data = await response.json();
        // Filter out items without poster images
        setGenreResults((data.results || []).filter((m: Movie) => m.poster_path));
      } catch (error) {
        console.error('Error fetching genre data:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setActiveTab('search');
      setLoading(true);
      try {
        const response = await fetch(
          `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
        );
        const data = await response.json();
        // Filter out items without poster images
        setSearchResults((data.results || []).filter((m: Movie) => m.poster_path));
      } catch (error) {
        console.error('Error searching:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGenreClick = (genreId: number, genreName: string) => {
    setSelectedGenre({ id: genreId, name: genreName });
    setActiveTab('genre');
    setSelectedMovie(null);
  };

  const handleActorClick = (actorId: number, actorName: string) => {
    setSelectedActor({ id: actorId, name: actorName });
    setActiveTab('actor');
    setSelectedMovie(null);
  };

  const toggleWatchlist = (movieId: number) => {
    setWatchlist(prev => {
      const existing = prev.find(item => item.movieId === movieId);
      if (existing) {
        return prev.filter(item => item.movieId !== movieId);
      } else {
        return [...prev, { movieId, watched: false, addedAt: new Date().toISOString() }];
      }
    });
  };

  const toggleWatched = (movieId: number) => {
    setWatchlist(prev =>
      prev.map(item =>
        item.movieId === movieId ? { ...item, watched: !item.watched } : item
      )
    );
  };

  const isInWatchlist = (movieId: number) => {
    return watchlist.some(item => item.movieId === movieId);
  };

  const isWatched = (movieId: number) => {
    return watchlist.find(item => item.movieId === movieId)?.watched || false;
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 overflow-x-hidden ${
      darkMode ? 'bg-slate-950' : 'bg-slate-50'
    }`}>
      {/* Header */}
      <ModernHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        themeColor={themeColor}
        setThemeColor={setThemeColor}
        onSearch={handleSearch}
        watchlistCount={watchlist.length}
        unwatchedCount={watchlist.filter(w => !w.watched).length}
      />

      {/* Main Content */}
      <main className="max-w-[1920px] mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {heroMovie && (
                <HeroBanner
                  movie={heroMovie}
                  imageBaseUrl={TMDB_IMAGE_BASE_URL}
                  darkMode={darkMode}
                  isInWatchlist={isInWatchlist(heroMovie.id)}
                  onToggleWatchlist={toggleWatchlist}
                  onPlayClick={() => setSelectedMovie(heroMovie)}
                />
              )}

              <div className="px-6 pb-12 space-y-8">
                <HorizontalScroll
                  title="🔥 Bu Hafta Trend"
                  movies={trendingAll}
                  imageBaseUrl={TMDB_IMAGE_BASE_URL}
                  darkMode={darkMode}
                  isInWatchlist={isInWatchlist}
                  isWatched={isWatched}
                  onToggleWatchlist={toggleWatchlist}
                  onToggleWatched={toggleWatched}
                  onMovieClick={setSelectedMovie}
                />

                <HorizontalScroll
                  title="🎬 Trend Filmler"
                  movies={trendingMovies}
                  imageBaseUrl={TMDB_IMAGE_BASE_URL}
                  darkMode={darkMode}
                  isInWatchlist={isInWatchlist}
                  isWatched={isWatched}
                  onToggleWatchlist={toggleWatchlist}
                  onToggleWatched={toggleWatched}
                  onMovieClick={setSelectedMovie}
                />

                <HorizontalScroll
                  title="📺 Trend Diziler"
                  movies={trendingTV}
                  imageBaseUrl={TMDB_IMAGE_BASE_URL}
                  darkMode={darkMode}
                  isInWatchlist={isInWatchlist}
                  isWatched={isWatched}
                  onToggleWatchlist={toggleWatchlist}
                  onToggleWatched={toggleWatched}
                  onMovieClick={setSelectedMovie}
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'movies' && (
            <motion.div
              key="movies"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="px-6 py-8 space-y-8"
            >
              <HorizontalScroll
                title="🔥 Trend Filmler"
                movies={trendingMovies}
                imageBaseUrl={TMDB_IMAGE_BASE_URL}
                darkMode={darkMode}
                isInWatchlist={isInWatchlist}
                isWatched={isWatched}
                onToggleWatchlist={toggleWatchlist}
                onToggleWatched={toggleWatched}
                onMovieClick={setSelectedMovie}
              />

              <HorizontalScroll
                title="⭐ Popüler Filmler"
                movies={popularMovies}
                imageBaseUrl={TMDB_IMAGE_BASE_URL}
                darkMode={darkMode}
                isInWatchlist={isInWatchlist}
                isWatched={isWatched}
                onToggleWatchlist={toggleWatchlist}
                onToggleWatched={toggleWatched}
                onMovieClick={setSelectedMovie}
              />

              <HorizontalScroll
                title="🏆 En İyi Filmler"
                movies={topRatedMovies}
                imageBaseUrl={TMDB_IMAGE_BASE_URL}
                darkMode={darkMode}
                isInWatchlist={isInWatchlist}
                isWatched={isWatched}
                onToggleWatchlist={toggleWatchlist}
                onToggleWatched={toggleWatched}
                onMovieClick={setSelectedMovie}
              />
            </motion.div>
          )}

          {activeTab === 'tv' && (
            <motion.div
              key="tv"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="px-6 py-8 space-y-8"
            >
              <HorizontalScroll
                title="🔥 Trend Diziler"
                movies={trendingTV}
                imageBaseUrl={TMDB_IMAGE_BASE_URL}
                darkMode={darkMode}
                isInWatchlist={isInWatchlist}
                isWatched={isWatched}
                onToggleWatchlist={toggleWatchlist}
                onToggleWatched={toggleWatched}
                onMovieClick={setSelectedMovie}
              />

              <HorizontalScroll
                title="⭐ Popüler Diziler"
                movies={popularTV}
                imageBaseUrl={TMDB_IMAGE_BASE_URL}
                darkMode={darkMode}
                isInWatchlist={isInWatchlist}
                isWatched={isWatched}
                onToggleWatchlist={toggleWatchlist}
                onToggleWatched={toggleWatched}
                onMovieClick={setSelectedMovie}
              />

              <HorizontalScroll
                title="🏆 En İyi Diziler"
                movies={topRatedTV}
                imageBaseUrl={TMDB_IMAGE_BASE_URL}
                darkMode={darkMode}
                isInWatchlist={isInWatchlist}
                isWatched={isWatched}
                onToggleWatchlist={toggleWatchlist}
                onToggleWatched={toggleWatched}
                onMovieClick={setSelectedMovie}
              />
            </motion.div>
          )}

          {activeTab === 'watchlist' && (
            <motion.div
              key="watchlist"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <WatchlistPage
                watchlist={watchlist}
                darkMode={darkMode}
                imageBaseUrl={TMDB_IMAGE_BASE_URL}
                apiKey={TMDB_API_KEY}
                onToggleWatchlist={toggleWatchlist}
                onToggleWatched={toggleWatched}
                onMovieClick={setSelectedMovie}
              />
            </motion.div>
          )}

          {activeTab === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="px-6 py-8"
            >
              <h2 className={`mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                "{searchQuery}" için sonuçlar
              </h2>
              
              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="relative">
                    <motion.div
                      className={`w-16 h-16 border-4 rounded-full ${
                        darkMode ? 'border-cyan-500/30 border-t-cyan-500' : 'border-blue-500/30 border-t-blue-500'
                      }`}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                  {searchResults.map(movie => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      imageBaseUrl={TMDB_IMAGE_BASE_URL}
                      darkMode={darkMode}
                      isInWatchlist={isInWatchlist(movie.id)}
                      isWatched={isWatched(movie.id)}
                      onToggleWatchlist={toggleWatchlist}
                      onToggleWatched={toggleWatched}
                      onClick={() => setSelectedMovie(movie)}
                    />
                  ))}
                </div>
              )}

              {!loading && searchResults.length === 0 && (
                <div className="text-center py-20">
                  <Search className={`w-16 h-16 mx-auto mb-4 ${
                    darkMode ? 'text-white/20' : 'text-slate-300'
                  }`} />
                  <p className={darkMode ? 'text-white/40' : 'text-slate-400'}>
                    Sonuç bulunamadı
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'genre' && (
            <motion.div
              key="genre"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="px-6 py-8"
            >
              <h2 className={`mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                "{selectedGenre?.name}" için sonuçlar
              </h2>
              
              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="relative">
                    <motion.div
                      className={`w-16 h-16 border-4 rounded-full ${
                        darkMode ? 'border-cyan-500/30 border-t-cyan-500' : 'border-blue-500/30 border-t-blue-500'
                      }`}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                  {genreResults.map(movie => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      imageBaseUrl={TMDB_IMAGE_BASE_URL}
                      darkMode={darkMode}
                      isInWatchlist={isInWatchlist(movie.id)}
                      isWatched={isWatched(movie.id)}
                      onToggleWatchlist={toggleWatchlist}
                      onToggleWatched={toggleWatched}
                      onClick={() => setSelectedMovie(movie)}
                    />
                  ))}
                </div>
              )}

              {!loading && genreResults.length === 0 && (
                <div className="text-center py-20">
                  <Search className={`w-16 h-16 mx-auto mb-4 ${
                    darkMode ? 'text-white/20' : 'text-slate-300'
                  }`} />
                  <p className={darkMode ? 'text-white/40' : 'text-slate-400'}>
                    Sonuç bulunamadı
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'discover' && (
            <motion.div
              key="discover"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="px-6 py-8"
            >
              <DiscoverPage
                darkMode={darkMode}
                imageBaseUrl={TMDB_IMAGE_BASE_URL}
                apiKey={TMDB_API_KEY}
                onMovieClick={setSelectedMovie}
              />
            </motion.div>
          )}

          {activeTab === 'upcoming' && (
            <motion.div
              key="upcoming"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="px-6 py-8"
            >
              <UpcomingPage
                darkMode={darkMode}
                imageBaseUrl={TMDB_IMAGE_BASE_URL}
                apiKey={TMDB_API_KEY}
                onMovieClick={setSelectedMovie}
              />
            </motion.div>
          )}

          {activeTab === 'collections' && (
            <motion.div
              key="collections"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="px-6 py-8"
            >
              <CollectionsPage
                darkMode={darkMode}
                imageBaseUrl={TMDB_IMAGE_BASE_URL}
                apiKey={TMDB_API_KEY}
                onMovieClick={setSelectedMovie}
                collections={collections}
                setCollections={setCollections}
              />
            </motion.div>
          )}

          {activeTab === 'actor' && (
            <motion.div
              key="actor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="px-6 py-8"
            >
              <ActorPage
                darkMode={darkMode}
                imageBaseUrl={TMDB_IMAGE_BASE_URL}
                apiKey={TMDB_API_KEY}
                onMovieClick={setSelectedMovie}
                actor={selectedActor}
              />
            </motion.div>
          )}

          {activeTab === 'swipe' && (
            <motion.div
              key="swipe"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="px-6 py-8"
            >
              <SwipePage
                darkMode={darkMode}
                imageBaseUrl={TMDB_IMAGE_BASE_URL}
                apiKey={TMDB_API_KEY}
                onMovieClick={setSelectedMovie}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Movie Details Modal */}
      <AnimatePresence>
        {selectedMovie && (
          <MovieDetails
            movie={selectedMovie}
            imageBaseUrl={TMDB_IMAGE_BASE_URL}
            darkMode={darkMode}
            isInWatchlist={isInWatchlist(selectedMovie.id)}
            isWatched={isWatched(selectedMovie.id)}
            onToggleWatchlist={toggleWatchlist}
            onToggleWatched={toggleWatched}
            onClose={() => setSelectedMovie(null)}
            apiKey={TMDB_API_KEY}
            onGenreClick={handleGenreClick}
            onActorClick={handleActorClick}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
