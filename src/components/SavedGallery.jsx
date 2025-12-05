import React, { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Image,
  Download,
  Trash2,
  X,
  Calendar,
  ImageOff,
  RefreshCw,
  Loader2,
  ExternalLink,
  Clock,
  HardDrive,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

/**
 * SavedGallery Component - View Photo Strips from Server
 * 
 * Full Stack Integration:
 * - Fetches saved photo strips from Express backend
 * - Supports download, delete operations
 * - Real-time updates with refresh capability
 */

const API_URL = 'https://photobooth-production-c647.up.railway.app'

// Memoized photo card component to prevent unnecessary re-renders
const PhotoCard = memo(({ photostrip, index, onSelect, onDownload, onDelete, deleteConfirm, setDeleteConfirm, formatDate, formatSize, API_URL }) => {
  return (
    <div
      className="group relative bg-slate-800/30 rounded-xl border border-slate-700/30 overflow-hidden"
    >
      {/* Image */}
      <div 
        className="aspect-[3/4] relative overflow-hidden cursor-pointer"
        onClick={() => onSelect(photostrip)}
      >
        <img
          src={photostrip.storage === 'cloudinary' ? photostrip.url : `${API_URL}${photostrip.url}`}
          alt={photostrip.filename}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          decoding="async"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDownload(photostrip)
                }}
                className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 p-2 rounded-lg text-white active:scale-95 transition-all"
              >
                <Download className="w-4 h-4 mx-auto" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setDeleteConfirm(photostrip.filename)
                }}
                className="flex-1 bg-red-500/20 hover:bg-red-500/40 backdrop-blur-sm border border-red-500/20 p-2 rounded-lg text-red-300 active:scale-95 transition-all"
              >
                <Trash2 className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 border-t border-slate-700/30">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <Clock className="w-3 h-3" />
          {formatDate(photostrip.createdAt)}
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <HardDrive className="w-3 h-3" />
            {formatSize(photostrip.size)}
          </span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
            photostrip.storage === 'cloudinary' 
              ? 'bg-blue-500/20 text-blue-300' 
              : 'bg-slate-600/50 text-slate-400'
          }`}>
            {photostrip.storage === 'cloudinary' ? '☁️ Cloud' : '💾 Local'}
          </span>
        </div>
      </div>

      {/* Delete Confirmation */}
      {deleteConfirm === photostrip.filename && (
        <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center p-4">
          <Trash2 className="w-8 h-8 text-red-400 mb-3" />
          <p className="text-white font-medium text-center mb-4">Delete this photo?</p>
          <div className="flex gap-2">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm active:scale-95 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => onDelete(photostrip)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm active:scale-95 transition-all"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
})

PhotoCard.displayName = 'PhotoCard'

const SavedGallery = ({ isOpen, onClose }) => {
  const [photostrips, setPhotostrips] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [notification, setNotification] = useState(null)

  // Fetch photo strips from server
  const fetchPhotostrips = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/api/photostrips`)
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setPhotostrips(data.photostrips || [])
    } catch (err) {
      console.error('Error fetching photostrips:', err)
      setError('Could not connect to server. Make sure the backend is running on port 3001.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      fetchPhotostrips()
    }
  }, [isOpen, fetchPhotostrips])

  // Show notification
  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }, [])

  // Download photo strip
  const handleDownload = useCallback((photostrip) => {
    const link = document.createElement('a')
    // For cloudinary, use the direct URL; for local, prepend API_URL
    link.href = photostrip.storage === 'cloudinary' ? photostrip.url : `${API_URL}${photostrip.url}`
    link.download = photostrip.filename.split('/').pop() + '.png'
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showNotification('Photo downloaded!')
  }, [showNotification])

  // Delete photo strip
  const handleDelete = useCallback(async (photostrip) => {
    try {
      const params = new URLSearchParams()
      if (photostrip.storage === 'cloudinary' && photostrip.publicId) {
        params.append('storage', 'cloudinary')
        params.append('publicId', photostrip.publicId)
      }
      
      const response = await fetch(
        `${API_URL}/api/photostrip/${encodeURIComponent(photostrip.filename)}?${params}`,
        { method: 'DELETE' }
      )
      if (!response.ok) throw new Error('Failed to delete')
      
      setPhotostrips(prev => prev.filter(p => p.filename !== photostrip.filename))
      setDeleteConfirm(null)
      setSelectedPhoto(null)
      showNotification('Photo deleted successfully!')
    } catch (err) {
      console.error('Error deleting:', err)
      showNotification('Failed to delete photo', 'error')
    }
  }, [showNotification])

  // Format file size - memoized
  const formatSize = useCallback((bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }, [])

  // Format date - memoized
  const formatDate = useCallback((dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }, [])

  if (!isOpen) return null

  // Handle backdrop click - only close if lightbox is not open
  const handleBackdropClick = useCallback((e) => {
    // Only close if clicking directly on the backdrop and lightbox is not open
    if (e.target === e.currentTarget && !selectedPhoto) {
      onClose()
    }
  }, [selectedPhoto, onClose])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-5xl max-h-[90vh] bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-slate-800/50 border-b border-slate-700/50 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-2 rounded-xl">
                <HardDrive className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Saved Photo Strips</h2>
                <p className="text-sm text-slate-400">
                  {photostrips.length} {photostrips.length === 1 ? 'photo strip' : 'photo strips'} saved
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchPhotostrips}
                disabled={isLoading}
                className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-slate-300 hover:text-white transition-colors"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 bg-slate-700/50 hover:bg-red-500/50 rounded-lg text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Notification */}
          <AnimatePresence>
            {notification && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`mx-6 mt-4 p-3 rounded-xl flex items-center gap-2 ${
                  notification.type === 'error' 
                    ? 'bg-red-500/20 border border-red-500/30 text-red-300'
                    : 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
                }`}
              >
                {notification.type === 'error' ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                {notification.message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-rose-400 animate-spin mb-4" />
                <p className="text-slate-400">Loading saved photos...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-red-500/10 p-4 rounded-2xl mb-4">
                  <AlertCircle className="w-10 h-10 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Connection Error</h3>
                <p className="text-slate-400 max-w-md mb-4">{error}</p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={fetchPhotostrips}
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </motion.button>
              </div>
            ) : photostrips.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="bg-slate-800/50 p-4 rounded-2xl mb-4">
                  <ImageOff className="w-10 h-10 text-slate-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No Saved Photos</h3>
                <p className="text-slate-400 max-w-md text-center">
                  Create and download photo strips to see them here. Your saved photos will appear in this gallery.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {photostrips.map((photostrip, index) => (
                  <PhotoCard
                    key={photostrip.filename}
                    photostrip={photostrip}
                    index={index}
                    onSelect={setSelectedPhoto}
                    onDownload={handleDownload}
                    onDelete={handleDelete}
                    deleteConfirm={deleteConfirm}
                    setDeleteConfirm={setDeleteConfirm}
                    formatDate={formatDate}
                    formatSize={formatSize}
                    API_URL={API_URL}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedPhoto(null)
              }}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-3xl max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedPhoto.storage === 'cloudinary' ? selectedPhoto.url : `${API_URL}${selectedPhoto.url}`}
                  alt={selectedPhoto.filename}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                />
                
                {/* Lightbox Actions */}
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDownload(selectedPhoto)}
                    className="bg-rose-500 hover:bg-rose-600 text-white p-3 rounded-full shadow-lg"
                  >
                    <Download className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedPhoto(null)}
                    className="bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-full shadow-lg"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setDeleteConfirm(selectedPhoto.filename)
                      setSelectedPhoto(null)
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}

export default SavedGallery
