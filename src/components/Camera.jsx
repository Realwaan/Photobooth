import React, { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera as CameraIcon,
  Video,
  VideoOff,
  Timer,
  FlipHorizontal,
  X,
  Play,
  Sparkles,
  Moon,
  Sun,
  Contrast,
  Palette,
  CircleDot,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Trash2,
  Bug
} from 'lucide-react'

/**
 * Camera Component - Redesigned with Color Theory
 * 
 * Visual Hierarchy:
 * - Primary actions (capture) use Rose/Pink gradient for maximum attention
 * - Secondary actions use subtle slate backgrounds
 * - Status indicators use semantic colors (green=success, amber=warning, red=error)
 * 
 * UX Principles Applied:
 * - Clear visual feedback for all interactions
 * - Smooth transitions reduce cognitive load
 * - Progressive disclosure (debug panel hidden by default)
 */

const Camera = ({ onPhotoCapture, maxPhotos = 3, currentCount = 0, photos = [], onDeletePhoto }) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('none')
  const [showFlash, setShowFlash] = useState(false)
  const [countdown, setCountdown] = useState(null)
  const [facingMode, setFacingMode] = useState('user')
  const [error, setError] = useState(null)
  const [debugInfo, setDebugInfo] = useState([])
  const [showDebug, setShowDebug] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const addDebugLog = useCallback((message) => {
    const timestamp = new Date().toLocaleTimeString()
    setDebugInfo(prev => [...prev.slice(-50), `[${timestamp}] ${message}`])
    console.log(message)
  }, [])

  // Filter definitions with lucide icons
  const filters = [
    { name: 'none', label: 'None', class: '', icon: Sparkles, color: 'from-slate-500 to-slate-600' },
    { name: 'grayscale', label: 'B&W', class: 'grayscale', icon: Moon, color: 'from-slate-600 to-slate-700' },
    { name: 'sepia', label: 'Sepia', class: 'sepia', icon: Sun, color: 'from-amber-500 to-orange-500' },
    { name: 'saturate', label: 'Vivid', class: 'saturate-150', icon: Palette, color: 'from-rose-500 to-pink-500' },
    { name: 'contrast', label: 'Contrast', class: 'contrast-125', icon: Contrast, color: 'from-violet-500 to-purple-500' },
    { name: 'brightness', label: 'Bright', class: 'brightness-110', icon: Sun, color: 'from-yellow-400 to-amber-500' },
    { name: 'hue', label: 'Cool', class: 'hue-rotate-90', icon: CircleDot, color: 'from-cyan-500 to-blue-500' },
  ]

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  const startCamera = async () => {
    try {
      setError(null)
      setIsLoading(true)
      addDebugLog('Starting camera...')
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported. Please use Chrome, Edge, or Safari.')
      }

      addDebugLog('Requesting camera with facingMode: ' + facingMode)
      
      const constraints = {
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      
      addDebugLog('Camera stream obtained - Tracks: ' + mediaStream.getVideoTracks().length)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        
        // Use both event listener and direct play attempt
        const playVideo = async () => {
          try {
            await videoRef.current.play()
            addDebugLog('Video playing successfully')
            setStream(mediaStream)
            setIsCameraActive(true)
            setIsLoading(false)
          } catch (err) {
            addDebugLog('Error playing video: ' + err.message)
            setError('Failed to start video: ' + err.message)
            setIsLoading(false)
          }
        }

        // Try to play when metadata loads, or after a short delay as fallback
        if (videoRef.current.readyState >= 1) {
          // Metadata already loaded
          addDebugLog('Video metadata already available')
          await playVideo()
        } else {
          videoRef.current.onloadedmetadata = async () => {
            addDebugLog('Video metadata loaded')
            await playVideo()
          }
          
          // Fallback timeout in case onloadedmetadata doesn't fire
          setTimeout(async () => {
            if (!isCameraActive && isLoading && videoRef.current?.srcObject) {
              addDebugLog('Fallback: attempting to play video')
              await playVideo()
            }
          }, 1000)
        }
        
        videoRef.current.onerror = () => {
          addDebugLog('Video element error')
          setError('Video playback error occurred')
          setIsLoading(false)
        }
      } else {
        addDebugLog('Video ref not available')
        setError('Video element not ready')
        setIsLoading(false)
      }
    } catch (err) {
      addDebugLog('Error: ' + err.name + ' - ' + err.message)
      setIsLoading(false)
      
      let errorMessage = 'Could not access camera. '
      
      if (err.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera permissions in your browser.'
      } else if (err.name === 'NotFoundError') {
        errorMessage += 'No camera found on your device.'
      } else if (err.name === 'NotReadableError') {
        errorMessage += 'Camera is in use by another application.'
      } else if (err.name === 'OverconstrainedError') {
        errorMessage += 'Retrying with default settings...'
        retryWithBasicConstraints()
        return
      } else {
        errorMessage += err.message || 'Please check your settings.'
      }
      
      setError(errorMessage)
    }
  }

  const retryWithBasicConstraints = async () => {
    try {
      addDebugLog('Retrying with basic constraints...')
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        await videoRef.current.play()
        setStream(mediaStream)
        setIsCameraActive(true)
        setError(null)
        setIsLoading(false)
        addDebugLog('Camera started with basic constraints')
      }
    } catch (err) {
      addDebugLog('Retry failed: ' + err.message)
      setError('Unable to access camera: ' + err.message)
      setIsLoading(false)
    }
  }

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
      setIsCameraActive(false)
      addDebugLog('Camera stopped')
    }
  }, [stream, addDebugLog])

  const toggleCamera = async () => {
    if (isCameraActive) {
      stopCamera()
      const newFacingMode = facingMode === 'user' ? 'environment' : 'user'
      setFacingMode(newFacingMode)
      addDebugLog('Switching to: ' + newFacingMode)
      setTimeout(startCamera, 100)
    }
  }

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Mirror the captured image for front-facing camera
    if (facingMode === 'user') {
      context.translate(canvas.width, 0)
      context.scale(-1, 1)
    }

    context.filter = getFilterStyle(selectedFilter)
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Reset transform
    context.setTransform(1, 0, 0, 1, 0, 0)

    setShowFlash(true)
    setTimeout(() => setShowFlash(false), 400)

    const photoData = canvas.toDataURL('image/png')
    onPhotoCapture(photoData)
    addDebugLog('Photo captured')
  }, [selectedFilter, onPhotoCapture, addDebugLog, facingMode])

  const handleCaptureWithCountdown = () => {
    if (currentCount >= maxPhotos) {
      return
    }

    let count = 3
    setCountdown(count)
    addDebugLog('Countdown started')
    
    const timer = setInterval(() => {
      count--
      if (count > 0) {
        setCountdown(count)
      } else {
        setCountdown(null)
        clearInterval(timer)
        capturePhoto()
      }
    }, 1000)
  }

  const getFilterStyle = (filter) => {
    switch (filter) {
      case 'grayscale': return 'grayscale(100%)'
      case 'sepia': return 'sepia(100%)'
      case 'saturate': return 'saturate(150%)'
      case 'contrast': return 'contrast(125%)'
      case 'brightness': return 'brightness(110%)'
      case 'hue': return 'hue-rotate(90deg)'
      default: return 'none'
    }
  }

  const photosRemaining = maxPhotos - currentCount

  return (
    <div className="space-y-6">
      {/* Camera View */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-800"
      >
        <div className="aspect-video relative bg-gradient-to-br from-slate-900 to-slate-800">
          {/* Hidden video element - always in DOM for ref access */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
            className={`absolute inset-0 w-full h-full object-cover ${
              !isCameraActive ? 'hidden' : ''
            } ${selectedFilter !== 'none' ? filters.find(f => f.name === selectedFilter)?.class : ''}`}
          />
          
          {!isCameraActive ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 px-6"
              >
                {/* Camera Icon */}
                <motion.div 
                  className="relative inline-flex"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl blur-xl opacity-40" />
                  <div className="relative bg-gradient-to-br from-rose-500 via-pink-500 to-violet-500 p-5 rounded-2xl">
                    <Video className="w-10 h-10 text-white" strokeWidth={1.5} />
                  </div>
                </motion.div>
                
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Ready to Capture</h3>
                  <p className="text-slate-400 mb-6 max-w-sm">
                    Click below to start your camera and begin taking photos
                  </p>
                  
                  {/* Error Message */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm flex items-start gap-3"
                      >
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Start Camera Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={startCamera}
                    disabled={isLoading}
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Starting...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        Start Camera
                      </>
                    )}
                  </motion.button>
                  
                  <p className="mt-4 text-xs text-slate-500 flex items-center justify-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    Allow camera access when prompted
                  </p>
                </div>
              </motion.div>
            </div>
          ) : (
            <>
              {/* Countdown Overlay */}
              <AnimatePresence>
                {countdown && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                  >
                    <motion.div
                      key={countdown}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 1.5, opacity: 0 }}
                      className="text-white text-9xl font-bold"
                    >
                      {countdown}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Flash Effect */}
              <AnimatePresence>
                {showFlash && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="absolute inset-0 bg-white pointer-events-none"
                  />
                )}
              </AnimatePresence>

              {/* Camera Controls Overlay */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                {/* Left: Flip Camera */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleCamera}
                  className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-3 rounded-xl text-white hover:bg-slate-800/80 transition-colors shadow-lg"
                  title="Flip Camera"
                >
                  <FlipHorizontal className="w-5 h-5" />
                </motion.button>
                
                {/* Right: Stop Camera */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={stopCamera}
                  className="bg-red-500/90 backdrop-blur-md px-4 py-2 rounded-xl text-white font-medium hover:bg-red-600 transition-colors shadow-lg flex items-center gap-2"
                >
                  <VideoOff className="w-4 h-4" />
                  Stop
                </motion.button>
              </div>

              {/* Photo Counter */}
              <div className="absolute bottom-4 left-4">
                <div className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700/50">
                  <span className="text-slate-400 text-sm">Photos: </span>
                  <span className="text-white font-semibold">{currentCount}/{maxPhotos}</span>
                </div>
              </div>
            </>
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </motion.div>

      {/* Filter Selection */}
      <AnimatePresence>
        {isCameraActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Palette className="w-5 h-5 text-rose-400" />
                Filters
              </h3>
              <span className="text-sm text-slate-400 bg-slate-700/50 px-3 py-1 rounded-full">
                {filters.find(f => f.name === selectedFilter)?.label}
              </span>
            </div>
            
            <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
              {filters.map((filter, index) => {
                const Icon = filter.icon
                const isSelected = selectedFilter === filter.name
                
                return (
                  <motion.button
                    key={filter.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedFilter(filter.name)}
                    className={`relative p-3 rounded-xl font-medium transition-all flex flex-col items-center gap-2 ${
                      isSelected
                        ? `bg-gradient-to-br ${filter.color} text-white shadow-lg`
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-slate-600/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{filter.label}</span>
                    {isSelected && (
                      <motion.div
                        layoutId="filterIndicator"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full"
                      />
                    )}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Captured Photos Preview Strip */}
      <AnimatePresence>
        {photos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-700/50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <CameraIcon className="w-5 h-5 text-rose-400" />
                Captured Photos
              </h3>
              <span className="text-sm text-slate-400 bg-slate-700/50 px-3 py-1 rounded-full">
                {photos.length} of {maxPhotos}
              </span>
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
              {/* Empty slots first */}
              {[...Array(maxPhotos)].map((_, index) => {
                const photo = photos[index]
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex-shrink-0 relative group"
                  >
                    {photo ? (
                      <>
                        <div className="relative w-24 h-32 sm:w-28 sm:h-36 rounded-xl overflow-hidden border-2 border-rose-500/50 shadow-lg shadow-rose-500/10">
                          <img
                            src={photo.data}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                            <span className="text-xs text-white font-medium">#{index + 1}</span>
                          </div>
                        </div>
                        
                        {/* Delete Button */}
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ scale: 1.1 }}
                          animate={{ opacity: 1, scale: 1 }}
                          onClick={() => onDeletePhoto && onDeletePhoto(photo.id)}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </motion.button>
                      </>
                    ) : (
                      <div className="w-24 h-32 sm:w-28 sm:h-36 rounded-xl border-2 border-dashed border-slate-600 flex flex-col items-center justify-center bg-slate-800/30">
                        <CameraIcon className="w-6 h-6 text-slate-500 mb-1" />
                        <span className="text-xs text-slate-500">#{index + 1}</span>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(photos.length / maxPhotos) * 100}%` }}
                  className="h-full bg-gradient-to-r from-rose-500 to-pink-500"
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Capture Buttons */}
      <AnimatePresence>
        {isCameraActive && photosRemaining > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={capturePhoto}
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-lg px-10 py-5 rounded-xl shadow-xl shadow-rose-500/25 hover:shadow-rose-500/40 transition-shadow"
            >
              <CameraIcon className="w-6 h-6" />
              Capture Photo
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCaptureWithCountdown}
              className="inline-flex items-center justify-center gap-3 bg-slate-800/80 backdrop-blur-sm text-white font-bold text-lg px-10 py-5 rounded-xl border border-slate-700/50 hover:bg-slate-700/80 transition-colors"
            >
              <Timer className="w-6 h-6" />
              Timer (3s)
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* All Photos Captured Message */}
      <AnimatePresence>
        {currentCount >= maxPhotos && isCameraActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-6 py-4">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
              <p className="text-white font-semibold">
                All {maxPhotos} photos captured! Scroll down to customize.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Debug Panel */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/30"
      >
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="w-full flex items-center justify-between p-4 text-white hover:text-slate-300 transition-colors"
        >
          <span className="font-medium flex items-center gap-2 text-sm">
            <Bug className="w-4 h-4 text-slate-500" />
            Debug Panel
          </span>
          <motion.div
            animate={{ rotate: showDebug ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </motion.div>
        </button>
        
        <AnimatePresence>
          {showDebug && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 pt-0 space-y-3">
                {/* Log Output */}
                <div className="bg-slate-900/70 rounded-lg p-3 max-h-40 overflow-y-auto">
                  <div className="text-xs font-mono text-slate-400 space-y-1">
                    {debugInfo.length === 0 ? (
                      <p className="text-slate-600">No logs yet...</p>
                    ) : (
                      debugInfo.map((log, index) => (
                        <div key={index} className="border-b border-slate-800/50 pb-1 last:border-0">
                          {log}
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                {/* Status Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900/50 rounded-lg p-2 flex items-center justify-between">
                    <span className="text-slate-500">Active:</span>
                    <span className={`font-medium ${isCameraActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {isCameraActive ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-2 flex items-center justify-between">
                    <span className="text-slate-500">Camera:</span>
                    <span className="text-slate-300 font-medium">{facingMode}</span>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-2 flex items-center justify-between">
                    <span className="text-slate-500">Filter:</span>
                    <span className="text-slate-300 font-medium">{selectedFilter}</span>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-2 flex items-center justify-between">
                    <span className="text-slate-500">Photos:</span>
                    <span className="text-slate-300 font-medium">{currentCount}/{maxPhotos}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setDebugInfo([])
                    addDebugLog('Logs cleared')
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-slate-700/30 hover:bg-slate-700/50 text-slate-400 hover:text-slate-300 text-xs py-2 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear Logs
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default Camera
