import React, { useState } from 'react'
import Landing from './components/Landing'
import Camera from './components/Camera'
import Gallery from './components/Gallery'
import LayoutSelector from './components/LayoutSelector'
import Customization from './components/Customization'

function App() {
  const [showLanding, setShowLanding] = useState(true)
  const [photos, setPhotos] = useState([])
  const [activeTab, setActiveTab] = useState('camera')
  const [selectedLayout, setSelectedLayout] = useState('layoutA')
  const [customOptions, setCustomOptions] = useState({
    frameColor: 'rainbow',
    photoShape: 'rounded',
    sticker: 'none',
    logo: 'ENG',
    addDate: true,
    addTime: false
  })

  const layoutRequirements = {
    layoutA: 3,
    layoutB: 4,
    layoutC: 2,
    layoutD: 6,
    horizontal: 3,
    layoutE: 3,
    layoutF: 4
  }

  const requiredPhotos = layoutRequirements[selectedLayout] || 3

  const handlePhotoCapture = (photoData) => {
    const newPhoto = {
      id: Date.now(),
      data: photoData,
      timestamp: new Date().toLocaleString()
    }
    setPhotos([...photos, newPhoto])
  }

  const handleDeletePhoto = (id) => {
    setPhotos(photos.filter(photo => photo.id !== id))
  }

  const handleCustomOptionsChange = (newOptions) => {
    setCustomOptions({ ...customOptions, ...newOptions })
  }

  const handleRetake = () => {
    setPhotos([])
    setActiveTab('camera')
  }

  if (showLanding) {
    return <Landing onStart={() => setShowLanding(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-indigo-900/20 animate-gradient-xy"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Top Banner */}
        <div className="bg-pink-200 text-center py-3 px-4 text-sm text-gray-700 animate-slide-down">
          Share your photos and tag us @andrei.regulacion13
        </div>

        {/* Navigation */}
        <nav className="bg-white shadow-lg sticky top-0 z-50 animate-slide-down animation-delay-200">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-shimmer">
              missing alegres
            </div>
            <button
              onClick={() => setShowLanding(true)}
              className="text-gray-600 hover:text-pink-500 font-medium transition-all hover:scale-105"
            >
              ← Back to Home
            </button>
          </div>
        </nav>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <header className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6 shadow-lg hover:scale-105 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight animate-slide-up">
              📸 Missing Alegres
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto animate-slide-up animation-delay-200">
              Capture amazing photos and customize your photostrip!
            </p>
          </header>

          {/* Photo Count */}
          <div className="text-center mb-8 animate-fade-in animation-delay-400">
            <div className="inline-block bg-purple-500/20 backdrop-blur-xl border border-purple-400/30 rounded-full px-6 py-3 hover:scale-105 transition-transform">
              <span className="text-white font-semibold text-lg">
                Photos captured: {photos.length} / {requiredPhotos}
              </span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-10 animate-slide-up animation-delay-600">
            <div className="inline-flex bg-slate-800/50 backdrop-blur-xl rounded-xl p-1.5 border border-slate-700/50 shadow-2xl hover:shadow-purple-500/20 transition-shadow">
              <button
                onClick={() => setActiveTab('camera')}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'camera'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50 scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50 hover:scale-105'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
                Camera
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'gallery'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50 scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50 hover:scale-105'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Gallery
                {photos.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 text-xs font-semibold bg-white/20 rounded-full">
                    {photos.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Layout Selector */}
          <div className="mb-8 animate-fade-in">
            <LayoutSelector selectedLayout={selectedLayout} onLayoutChange={setSelectedLayout} />
          </div>

          {/* Content */}
          <div className="max-w-7xl mx-auto space-y-8 animate-slide-up">
            {activeTab === 'camera' ? (
              <Camera 
                onPhotoCapture={handlePhotoCapture} 
                maxPhotos={requiredPhotos}
                currentCount={photos.length}
              />
            ) : (
              <Gallery photos={photos} onDeletePhoto={handleDeletePhoto} />
            )}

            {/* Customization Section - show when enough photos */}
            {photos.length >= requiredPhotos && (
              <div className="animate-slide-up">
                <Customization
                  customOptions={customOptions}
                  onChange={handleCustomOptionsChange}
                  onRetake={handleRetake}
                  onDownload={() => {
                    // Download functionality will be implemented
                    alert('Download feature coming soon!')
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
