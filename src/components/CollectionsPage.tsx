import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FolderHeart, Plus, Trash2, Edit2, X } from 'lucide-react';
import { MovieCard } from './MovieCard';
import type { Movie, Collection } from '../App';

interface CollectionsPageProps {
  darkMode: boolean;
  imageBaseUrl: string;
  apiKey: string;
  onMovieClick: (movie: Movie) => void;
  collections: Collection[];
  setCollections: (collections: Collection[]) => void;
}

export function CollectionsPage({ darkMode, imageBaseUrl, apiKey, onMovieClick, collections, setCollections }: CollectionsPageProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [collectionMovies, setCollectionMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedCollection) {
      fetchCollectionMovies();
    }
  }, [selectedCollection]);

  const fetchCollectionMovies = async () => {
    if (!selectedCollection) return;
    setLoading(true);
    try {
      const moviePromises = selectedCollection.movieIds.map(id =>
        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`)
          .then(r => r.json())
          .catch(() => null)
      );
      const movies = await Promise.all(moviePromises);
      setCollectionMovies(movies.filter(m => m !== null));
    } catch (error) {
      console.error('Error fetching collection movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCollection = () => {
    if (newCollectionName.trim()) {
      const newCollection: Collection = {
        id: Date.now().toString(),
        name: newCollectionName.trim(),
        movieIds: [],
        createdAt: new Date().toISOString(),
      };
      setCollections([...collections, newCollection]);
      setNewCollectionName('');
      setShowCreateModal(false);
    }
  };

  const deleteCollection = (id: string) => {
    setCollections(collections.filter(c => c.id !== id));
    if (selectedCollection?.id === id) {
      setSelectedCollection(null);
    }
  };

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
          <FolderHeart className="w-6 h-6 text-cyan-400" />
          <h1 className={darkMode ? 'text-white' : 'text-slate-900'}>
            Koleksiyonlarım
          </h1>
        </motion.div>
        <p className={`mb-8 ${darkMode ? 'text-white/60' : 'text-slate-600'}`}>
          Filmlerinizi özel listelerde düzenleyin
        </p>

        <motion.button
          onClick={() => setShowCreateModal(true)}
          className={`px-6 py-3 rounded-full transition-all ${
            darkMode
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5 inline mr-2" />
          Yeni Koleksiyon
        </motion.button>
      </div>

      {/* Collections Grid */}
      {!selectedCollection ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`group relative p-6 rounded-3xl cursor-pointer transition-all ${
                darkMode
                  ? 'bg-white/5 border border-white/10 hover:bg-white/10'
                  : 'bg-white border border-slate-200 hover:shadow-lg'
              }`}
              onClick={() => setSelectedCollection(collection)}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white`}>
                  <FolderHeart className="w-6 h-6" />
                </div>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCollection(collection.id);
                  }}
                  className={`opacity-0 group-hover:opacity-100 p-2 rounded-full transition-all ${
                    darkMode
                      ? 'hover:bg-red-500/20 text-red-400'
                      : 'hover:bg-red-500/20 text-red-600'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>

              <h3 className={`mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {collection.name}
              </h3>
              <p className={darkMode ? 'text-white/60' : 'text-slate-600'}>
                {collection.movieIds.length} film
              </p>
              <p className={`text-sm ${darkMode ? 'text-white/40' : 'text-slate-400'}`}>
                {new Date(collection.createdAt).toLocaleDateString('tr-TR')}
              </p>
            </motion.div>
          ))}

          {collections.length === 0 && (
            <div className="col-span-full text-center py-20">
              <FolderHeart className={`w-20 h-20 mx-auto mb-4 ${darkMode ? 'text-white/20' : 'text-slate-300'}`} />
              <p className={darkMode ? 'text-white/60' : 'text-slate-600'}>
                Henüz koleksiyon oluşturmadınız
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Collection Detail View */
        <div>
          <motion.button
            onClick={() => setSelectedCollection(null)}
            className={`mb-6 px-4 py-2 rounded-full transition-all ${
              darkMode
                ? 'bg-white/10 hover:bg-white/20 text-white'
                : 'bg-slate-900/10 hover:bg-slate-900/20 text-slate-900'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Geri
          </motion.button>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className={`mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {selectedCollection.name}
              </h2>
              <p className={darkMode ? 'text-white/60' : 'text-slate-600'}>
                {selectedCollection.movieIds.length} film
              </p>
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
            <>
              {collectionMovies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                  {collectionMovies.map(movie => (
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
                  <FolderHeart className={`w-20 h-20 mx-auto mb-4 ${darkMode ? 'text-white/20' : 'text-slate-300'}`} />
                  <p className={darkMode ? 'text-white/60' : 'text-slate-600'}>
                    Bu koleksiyonda henüz film yok
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Create Collection Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md p-6 rounded-3xl ${
                darkMode
                  ? 'bg-slate-900 border border-white/10'
                  : 'bg-white border border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={darkMode ? 'text-white' : 'text-slate-900'}>
                  Yeni Koleksiyon
                </h3>
                <motion.button
                  onClick={() => setShowCreateModal(false)}
                  className={`p-2 rounded-full ${
                    darkMode
                      ? 'hover:bg-white/10 text-white'
                      : 'hover:bg-slate-100 text-slate-900'
                  }`}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <input
                type="text"
                placeholder="Koleksiyon adı..."
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && createCollection()}
                className={`w-full px-4 py-3 rounded-2xl mb-6 transition-all ${
                  darkMode
                    ? 'bg-white/10 border border-white/20 text-white placeholder-white/40 focus:bg-white/15 focus:border-cyan-500'
                    : 'bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500'
                } outline-none`}
                autoFocus
              />

              <motion.button
                onClick={createCollection}
                disabled={!newCollectionName.trim()}
                className={`w-full px-6 py-3 rounded-full transition-all ${
                  newCollectionName.trim()
                    ? darkMode
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                }`}
                whileHover={newCollectionName.trim() ? { scale: 1.05 } : {}}
                whileTap={newCollectionName.trim() ? { scale: 0.95 } : {}}
              >
                Oluştur
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
