import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BarChart3, Clock, Star, TrendingUp, Film, Tv, Calendar, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import type { Movie, WatchlistItem } from '../App';

interface StatsPageProps {
  darkMode: boolean;
  imageBaseUrl: string;
  apiKey: string;
  onMovieClick: (movie: Movie) => void;
}

export function StatsPage({ darkMode, imageBaseUrl, apiKey, onMovieClick }: StatsPageProps) {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const saved = localStorage.getItem('movieWatchlist');
      if (saved) {
        const list = JSON.parse(saved) as WatchlistItem[];
        setWatchlist(list);

        // Fetch movie details
        const moviePromises = list.map(item =>
          fetch(`https://api.themoviedb.org/3/movie/${item.movieId}?api_key=${apiKey}`)
            .then(r => r.json())
            .catch(() => null)
        );
        const fetchedMovies = await Promise.all(moviePromises);
        setMovies(fetchedMovies.filter(m => m !== null));
      }
      setLoading(false);
    };
    loadData();
  }, [apiKey]);

  // Calculate statistics
  const totalMovies = watchlist.length;
  const watchedMovies = watchlist.filter(w => w.watched).length;
  const unwatchedMovies = totalMovies - watchedMovies;
  const watchedPercentage = totalMovies > 0 ? Math.round((watchedMovies / totalMovies) * 100) : 0;

  // Calculate total runtime
  const totalRuntime = movies.reduce((acc, movie, index) => {
    if (watchlist[index]?.watched && movie.runtime) {
      return acc + movie.runtime;
    }
    return acc;
  }, 0);
  const totalHours = Math.floor(totalRuntime / 60);
  const totalMinutes = totalRuntime % 60;

  // Calculate average rating
  const ratedMovies = watchlist.filter(w => w.rating);
  const averageRating = ratedMovies.length > 0
    ? (ratedMovies.reduce((acc, w) => acc + (w.rating || 0), 0) / ratedMovies.length).toFixed(1)
    : '0';

  // Genre statistics
  const genreCount: Record<string, number> = {};
  movies.forEach((movie, index) => {
    if (watchlist[index]?.watched && movie.genres) {
      movie.genres.forEach(genre => {
        genreCount[genre.name] = (genreCount[genre.name] || 0) + 1;
      });
    }
  });
  const genreData = Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }));

  // Monthly watch data (last 6 months)
  const monthlyData: Record<string, number> = {};
  watchlist.forEach(item => {
    if (item.watched && item.watchedDate) {
      const date = new Date(item.watchedDate);
      const monthYear = `${date.toLocaleString('tr-TR', { month: 'short' })}`;
      monthlyData[monthYear] = (monthlyData[monthYear] || 0) + 1;
    }
  });
  const monthlyChartData = Object.entries(monthlyData).map(([month, count]) => ({ month, count }));

  // Pie chart colors
  const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#6366f1'];

  const pieData = [
    { name: 'İzlendi', value: watchedMovies },
    { name: 'İzlenmedi', value: unwatchedMovies },
  ];

  // Top rated movies
  const topRatedMovies = watchlist
    .filter(w => w.rating && w.rating >= 8)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 5);

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

  if (totalMovies === 0) {
    return (
      <div className="max-w-6xl mx-auto text-center py-20">
        <BarChart3 className={`w-20 h-20 mx-auto mb-4 ${darkMode ? 'text-white/20' : 'text-slate-300'}`} />
        <h2 className={`mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Henüz İstatistik Yok
        </h2>
        <p className={darkMode ? 'text-white/60' : 'text-slate-600'}>
          Listenize film ekleyip izlediğinizde istatistikleriniz burada görünecek!
        </p>
      </div>
    );
  }

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
          <BarChart3 className="w-6 h-6 text-cyan-400" />
          <h1 className={darkMode ? 'text-white' : 'text-slate-900'}>
            İzleme İstatistiklerim
          </h1>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          icon={<Film className="w-6 h-6" />}
          title="Toplam Film"
          value={totalMovies.toString()}
          darkMode={darkMode}
          gradient="from-cyan-500 to-blue-600"
        />
        <StatCard
          icon={<Clock className="w-6 h-6" />}
          title="İzleme Süresi"
          value={`${totalHours}s ${totalMinutes}dk`}
          darkMode={darkMode}
          gradient="from-purple-500 to-pink-600"
        />
        <StatCard
          icon={<Star className="w-6 h-6" />}
          title="Ortalama Puan"
          value={averageRating}
          darkMode={darkMode}
          gradient="from-yellow-500 to-orange-600"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          title="İzlenme Oranı"
          value={`%${watchedPercentage}`}
          darkMode={darkMode}
          gradient="from-green-500 to-emerald-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {/* Genre Bar Chart */}
        {genreData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-3xl ${
              darkMode
                ? 'bg-white/5 border border-white/10'
                : 'bg-white border border-slate-200'
            }`}
          >
            <h3 className={`mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              En Çok İzlenen Türler
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={genreData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#ffffff20' : '#00000020'} />
                <XAxis dataKey="name" stroke={darkMode ? '#ffffff80' : '#00000080'} />
                <YAxis stroke={darkMode ? '#ffffff80' : '#00000080'} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    color: darkMode ? '#ffffff' : '#000000',
                  }}
                />
                <Bar dataKey="count" fill="#06b6d4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-3xl ${
            darkMode
              ? 'bg-white/5 border border-white/10'
              : 'bg-white border border-slate-200'
          }`}
        >
          <h3 className={`mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            İzlenme Durumu
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  color: darkMode ? '#ffffff' : '#000000',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Monthly Activity */}
      {monthlyChartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-3xl mb-12 ${
            darkMode
              ? 'bg-white/5 border border-white/10'
              : 'bg-white border border-slate-200'
          }`}
        >
          <h3 className={`mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Aylık İzleme Aktivitesi
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#ffffff20' : '#00000020'} />
              <XAxis dataKey="month" stroke={darkMode ? '#ffffff80' : '#00000080'} />
              <YAxis stroke={darkMode ? '#ffffff80' : '#00000080'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  color: darkMode ? '#ffffff' : '#000000',
                }}
              />
              <Line type="monotone" dataKey="count" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4', r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Top Rated Movies */}
      {topRatedMovies.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-6 rounded-3xl ${
            darkMode
              ? 'bg-white/5 border border-white/10'
              : 'bg-white border border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-6 h-6 text-yellow-500" />
            <h3 className={darkMode ? 'text-white' : 'text-slate-900'}>
              En Yüksek Puanladıklarım
            </h3>
          </div>
          <div className="space-y-4">
            {topRatedMovies.map((item, index) => {
              const movie = movies.find(m => m.id === item.movieId);
              if (!movie) return null;

              return (
                <motion.div
                  key={item.movieId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${
                    darkMode
                      ? 'hover:bg-white/10'
                      : 'hover:bg-slate-100'
                  }`}
                  onClick={() => onMovieClick(movie)}
                >
                  <div className="text-2xl font-bold text-cyan-400 w-8">
                    #{index + 1}
                  </div>
                  <img
                    src={`${imageBaseUrl}${movie.poster_path}`}
                    alt={movie.title || movie.name}
                    className="w-16 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className={darkMode ? 'text-white' : 'text-slate-900'}>
                      {movie.title || movie.name}
                    </h4>
                    <p className={darkMode ? 'text-white/60' : 'text-slate-600'}>
                      {movie.release_date && new Date(movie.release_date).getFullYear()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
                    <Star className="w-4 h-4" fill="currentColor" />
                    <span>{item.rating}/10</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  darkMode: boolean;
  gradient: string;
}

function StatCard({ icon, title, value, darkMode, gradient }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className={`p-6 rounded-3xl ${
        darkMode
          ? 'bg-white/5 border border-white/10'
          : 'bg-white border border-slate-200'
      }`}
    >
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-4`}>
        {icon}
      </div>
      <p className={`mb-2 ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>
        {title}
      </p>
      <p className={`text-3xl ${darkMode ? 'text-white' : 'text-slate-900'}`}>
        {value}
      </p>
    </motion.div>
  );
}
