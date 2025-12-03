import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Camera as CameraIcon, 
  Image, 
  ArrowLeft, 
  Sparkles,
  Heart,
  Loader2,
  HardDrive
} from 'lucide-react'
import Landing from './components/Landing'
import Camera from './components/Camera'
import Gallery from './components/Gallery'
import LayoutSelector from './components/LayoutSelector'
import Customization from './components/Customization'
import PhotoStripPreview from './components/PhotoStripPreview'
import SavedGallery from './components/SavedGallery'
import { generatePhotoStrip, downloadPhotoStrip } from './utils/generatePhotoStrip'

/**
 * App - Main Application Component
 * 
 * Design Philosophy:
 * - Dark, sophisticated background (slate-950) for focus
 * - Rose/Pink gradients for primary actions (warmth, joy)
 * - Violet accents for creativity and premium feel
 * - Smooth page transitions reduce cognitive load
 */

const API_URL = 'https://photobooth-production-c647.up.railway.app'

function App() {
  const [showLanding, setShowLanding] = useState(true)
  const [photos, setPhotos] = useState([])
  const [activeTab, setActiveTab] = useState('camera')
  const [selectedLayout, setSelectedLayout] = useState('layoutF') // Default to 4-photo classic strip
  const [customOptions, setCustomOptions] = useState({
    frameColor: '#1E293B', // Dark navy default
    photoShape: 'square',
    sticker: 'none',
    logo: 'ENG',
    addDate: true,
    addTime: false
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [showSavedGallery, setShowSavedGallery] = useState(false)

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
    setPreviewUrl(null) // Reset preview when photos change
  }

  const handleCustomOptionsChange = (newOptions) => {
    setCustomOptions({ ...customOptions, ...newOptions })
    setPreviewUrl(null) // Reset preview when options change
  }

  const handleRetake = () => {
    setPhotos([])
    setActiveTab('camera')
    setPreviewUrl(null)
  }

  // Generate and download photo strip
  const handleDownload = async () => {
    if (photos.length < requiredPhotos) {
      alert(`Please capture ${requiredPhotos} photos first!`)
      return
    }

    setIsGenerating(true)
    
    try {
      // Generate the photo strip
      const stripDataUrl = await generatePhotoStrip(photos, {
        layout: selectedLayout,
        ...customOptions
      })
      
      // Download locally
      downloadPhotoStrip(stripDataUrl, 'photostrip')
      
      // Try to save to server (optional - won't fail if server is down)
      try {
        await fetch(`${API_URL}/api/photostrip`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageData: stripDataUrl })
        })
      } catch (e) {
        console.log('Server not available, photo saved locally only')
      }
      
    } catch (error) {
      console.error('Error generating photo strip:', error)
      alert('Error generating photo strip. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate preview
  const handleGeneratePreview = async () => {
    if (photos.length < requiredPhotos) return
    
    setIsGenerating(true)
    try {
      const stripDataUrl = await generatePhotoStrip(photos, {
        layout: selectedLayout,
        ...customOptions
      })
      setPreviewUrl(stripDataUrl)
    } catch (error) {
      console.error('Error generating preview:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Landing Page
  if (showLanding) {
    return <Landing onStart={() => setShowLanding(false)} />
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Subtle Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-[800px] h-[800px] rounded-full opacity-10 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(244,63,94,0.3) 0%, transparent 70%)',
            top: '-20%',
            right: '-20%',
          }}
        />
        <div 
          className="absolute w-[600px] h-[600px] rounded-full opacity-10 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
            bottom: '-10%',
            left: '-10%',
          }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Top Social Banner */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-violet-500/10 backdrop-blur-sm border-b border-slate-800/50 text-center py-3 px-4"
        >
          <p className="text-sm text-slate-400 flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 text-rose-400" />
            Share your photos and tag us 
            <span className="text-rose-400 font-medium">@andrei.regulacion13</span>
          </p>
        </motion.div>

        {/* Navigation */}
        <motion.nav 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 sticky top-0 z-50"
        >
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-2 rounded-xl">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
                missing minus 20
              </span>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSavedGallery(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-shadow"
              >
                <HardDrive className="w-4 h-4" />
                View Gallery
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLanding(true)}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-slate-800/50"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </motion.button>
            </div>
          </div>
        </motion.nav>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Header */}
          <motion.header 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl mb-4 shadow-lg shadow-rose-500/20">
              <CameraIcon className="w-7 h-7 text-white" strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Missing Minus 20
            </h1>
            <p className="text-slate-400 max-w-lg mx-auto">
              Capture beautiful memories and create your custom photostrip
            </p>
          </motion.header>

          {/* Photo Progress */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mb-8"
          >
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-full px-6 py-3 border border-slate-700/50 flex items-center gap-4">
              <span className="text-slate-400 text-sm">Progress</span>
              <div className="flex gap-1.5">
                {[...Array(requiredPhotos)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      i < photos.length 
                        ? 'bg-gradient-to-r from-rose-500 to-pink-500 shadow-lg shadow-rose-500/30' 
                        : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>
              <span className="text-white font-semibold">
                {photos.length}/{requiredPhotos}
              </span>
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex bg-slate-900/80 backdrop-blur-sm rounded-xl p-1.5 border border-slate-800/50">
              <button
                onClick={() => setActiveTab('camera')}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'camera'
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <CameraIcon className="w-4 h-4" />
                Camera
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'gallery'
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Image className="w-4 h-4" />
                Gallery
                {photos.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 text-xs font-semibold bg-white/20 rounded-full">
                    {photos.length}
                  </span>
                )}
              </button>
            </div>
          </motion.div>

          {/* Layout Selector */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <LayoutSelector selectedLayout={selectedLayout} onLayoutChange={setSelectedLayout} />
          </motion.div>

          {/* Main Content Area */}
          <div className="max-w-5xl mx-auto space-y-8">
            <AnimatePresence mode="wait">
              {activeTab === 'camera' ? (
                <motion.div
                  key="camera"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Camera 
                    onPhotoCapture={handlePhotoCapture} 
                    maxPhotos={requiredPhotos}
                    currentCount={photos.length}
                    photos={photos}
                    onDeletePhoto={handleDeletePhoto}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="gallery"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Gallery photos={photos} onDeletePhoto={handleDeletePhoto} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Customization Section */}
            <AnimatePresence>
              {photos.length >= requiredPhotos && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <Customization
                    customOptions={customOptions}
                    onChange={handleCustomOptionsChange}
                    onRetake={handleRetake}
                    onDownload={handleDownload}
                    onPreview={handleGeneratePreview}
                    isGenerating={isGenerating}
                  />
                  
                  {/* Photo Strip Preview */}
                  {(previewUrl || isGenerating) && (
                    <PhotoStripPreview 
                      previewUrl={previewUrl}
                      isGenerating={isGenerating}
                      onDownload={handleDownload}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Saved Gallery Modal */}
      <SavedGallery 
        isOpen={showSavedGallery} 
        onClose={() => setShowSavedGallery(false)} 
      />
    </div>
  )
}

export default App
