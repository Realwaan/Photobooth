import React, { useState } from 'react'

const Gallery = ({ photos, onDeletePhoto }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  const downloadPhoto = (photo) => {
    const link = document.createElement('a')
    link.href = photo.data
    link.download = `photobooth-${photo.id}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const sharePhoto = async (photo) => {
    try {
      // Convert data URL to blob
      const response = await fetch(photo.data)
      const blob = await response.blob()
      const file = new File([blob], `photobooth-${photo.id}.png`, { type: 'image/png' })

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'PhotoBooth Photo',
          text: 'Check out this photo from PhotoBooth V2!'
        })
      } else {
        alert('Sharing is not supported on this device. Use download instead.')
      }
    } catch (err) {
      console.error('Error sharing:', err)
    }
  }

  if (photos.length === 0) {
    return (
      <div className="card p-20 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl mb-4">
            <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white">No Photos Yet</h3>
          <p className="text-slate-400 text-lg">
            Start capturing beautiful moments with your camera
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">Your Gallery</h3>
            <p className="text-slate-400">
              {photos.length} {photos.length === 1 ? 'photo' : 'photos'} captured
            </p>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="group card overflow-hidden hover:scale-[1.02] transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedPhoto(photo)}
          >
            <div className="aspect-video relative overflow-hidden">
              <img
                src={photo.data}
                alt={`Captured on ${photo.timestamp}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {photo.timestamp}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        downloadPhoto(photo)
                      }}
                      className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 px-3 py-2 rounded-lg transition-all text-white text-sm font-medium flex items-center justify-center gap-2"
                      title="Download"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        sharePhoto(photo)
                      }}
                      className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 px-3 py-2 rounded-lg transition-all text-white text-sm font-medium flex items-center justify-center gap-2"
                      title="Share"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (confirm('Delete this photo?')) {
                          onDeletePhoto(photo.id)
                        }
                      }}
                      className="bg-red-500/80 hover:bg-red-500 backdrop-blur-xl border border-red-400/50 px-3 py-2 rounded-lg transition-all text-white flex items-center justify-center"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-6xl w-full animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-14 right-0 bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 text-white p-3 rounded-xl hover:bg-slate-700/80 transition-all shadow-xl"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Image */}
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50">
              <img
                src={selectedPhoto.data}
                alt={`Captured on ${selectedPhoto.timestamp}`}
                className="w-full"
              />
            </div>
            
            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => downloadPhoto(selectedPhoto)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
              <button
                onClick={() => sharePhoto(selectedPhoto)}
                className="inline-flex items-center gap-2 bg-slate-800/80 backdrop-blur-xl text-white font-semibold px-6 py-3 rounded-xl border border-slate-700/50 hover:bg-slate-700/80 hover:scale-105 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
              <button
                onClick={() => {
                  if (confirm('Delete this photo?')) {
                    onDeletePhoto(selectedPhoto.id)
                    setSelectedPhoto(null)
                  }
                }}
                className="inline-flex items-center gap-2 bg-red-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-red-600 hover:scale-105 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
            
            {/* Timestamp */}
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 text-slate-300 px-4 py-2 rounded-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {selectedPhoto.timestamp}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Gallery
