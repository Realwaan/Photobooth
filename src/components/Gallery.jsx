import React, { useState, useCallback, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Image,
  Download,
  Share2,
  Trash2,
  X,
  Calendar,
  ImageOff
} from 'lucide-react'

/**
 * Gallery Component - Photo Collection View
 * 
 * Design Principles:
 * - Grid layout provides visual organization
 * - Hover states reveal actions progressively
 * - Lightbox allows focused viewing
 * - Semantic colors for destructive actions (red for delete)
 */

// Memoized photo item component
const PhotoItem = memo(({ photo, index, onSelect, onDownload, onShare, onDelete }) => (
  <div
    className="group relative bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/30 overflow-hidden cursor-pointer"
    onClick={() => onSelect(photo)}
  >
    <div className="aspect-video relative overflow-hidden">
      <img
        src={photo.data}
        alt={`Captured on ${photo.timestamp}`}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
        decoding="async"
      />
      
      {/* Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
          {/* Timestamp */}
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <Calendar className="w-3.5 h-3.5" />
            {photo.timestamp}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDownload(photo)
              }}
              className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 px-3 py-2 rounded-lg transition-colors text-white text-sm font-medium flex items-center justify-center gap-2 active:scale-95"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onShare(photo)
              }}
              className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 px-3 py-2 rounded-lg transition-colors text-white text-sm font-medium flex items-center justify-center gap-2 active:scale-95"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(photo.id)
              }}
              className="bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm border border-red-500/20 px-3 py-2 rounded-lg transition-colors text-red-300 text-sm font-medium flex items-center justify-center gap-2 active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
))

PhotoItem.displayName = 'PhotoItem'

const Gallery = ({ photos, onDeletePhoto }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  const downloadPhoto = useCallback((photo) => {
    const link = document.createElement('a')
    link.href = photo.data
    link.download = `photobooth-${photo.id}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])

  const sharePhoto = useCallback(async (photo) => {
    try {
      const response = await fetch(photo.data)
      const blob = await response.blob()
      const file = new File([blob], `photobooth-${photo.id}.png`, { type: 'image/png' })

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'PhotoBooth Photo',
          text: 'Check out this photo from PhotoBooth!'
        })
      } else {
        alert('Sharing is not supported on this device. Use download instead.')
      }
    } catch (err) {
      console.error('Error sharing:', err)
    }
  }, [])

  const handleSelect = useCallback((photo) => {
    setSelectedPhoto(photo)
  }, [])

  const handleClose = useCallback(() => {
    setSelectedPhoto(null)
  }, [])

  // Empty State
  if (photos.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/30 p-16 text-center"
      >
        <div className="max-w-sm mx-auto space-y-4">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-slate-800/50 rounded-2xl mb-2"
          >
            <ImageOff className="w-10 h-10 text-slate-500" />
          </motion.div>
          <h3 className="text-xl font-semibold text-white">No Photos Yet</h3>
          <p className="text-slate-400">
            Start capturing beautiful moments with your camera
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/30 p-5"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white mb-1">Your Gallery</h3>
            <p className="text-slate-400 text-sm">
              {photos.length} {photos.length === 1 ? 'photo' : 'photos'} captured
            </p>
          </div>
          <div className="bg-slate-700/50 p-3 rounded-xl">
            <Image className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </motion.div>

      {/* Gallery Grid - Optimized with memoized components */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <PhotoItem
            key={photo.id}
            photo={photo}
            index={index}
            onSelect={handleSelect}
            onDownload={downloadPhoto}
            onShare={sharePhoto}
            onDelete={onDeletePhoto}
          />
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-14 right-0 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 text-white p-3 rounded-xl hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
              
              {/* Image */}
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50">
                <img
                  src={selectedPhoto.data}
                  alt={`Captured on ${selectedPhoto.timestamp}`}
                  className="w-full"
                />
              </div>
              
              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => downloadPhoto(selectedPhoto)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30 transition-shadow"
                >
                  <Download className="w-5 h-5" />
                  Download
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => sharePhoto(selectedPhoto)}
                  className="inline-flex items-center gap-2 bg-slate-800/80 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl border border-slate-700/50 hover:bg-slate-700 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (confirm('Delete this photo?')) {
                      onDeletePhoto(selectedPhoto.id)
                      setSelectedPhoto(null)
                    }
                  }}
                  className="inline-flex items-center gap-2 bg-red-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete
                </motion.button>
              </div>
              
              {/* Timestamp */}
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-slate-400 px-4 py-2 rounded-lg text-sm">
                  <Calendar className="w-4 h-4" />
                  {selectedPhoto.timestamp}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Gallery
