import React, { useRef, useState, useEffect } from 'react'

const Camera = ({ onPhotoCapture, maxPhotos = 3, currentCount = 0 }) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('none')
  const [showFlash, setShowFlash] = useState(false)
  const [countdown, setCountdown] = useState(null)
  const [facingMode, setFacingMode] = useState('user') // 'user' for front, 'environment' for back
  const [error, setError] = useState(null)
  const [debugInfo, setDebugInfo] = useState([])
  const [showDebug, setShowDebug] = useState(false)

  const addDebugLog = (message) => {
    const timestamp = new Date().toLocaleTimeString()
    setDebugInfo(prev => [...prev, `[${timestamp}] ${message}`])
    console.log(message)
  }

  const filters = [
    { name: 'none', label: 'None', class: '', icon: '✨' },
    { name: 'grayscale', label: 'B&W', class: 'grayscale', icon: '⚫' },
    { name: 'sepia', label: 'Sepia', class: 'sepia', icon: '🟤' },
    { name: 'invert', label: 'Invert', class: 'invert', icon: '🔄' },
    { name: 'saturate', label: 'Vivid', class: 'saturate-150', icon: '🌈' },
    { name: 'contrast', label: 'Contrast', class: 'contrast-125', icon: '◐' },
    { name: 'brightness', label: 'Bright', class: 'brightness-110', icon: '☀️' },
    { name: 'hue', label: 'Hue', class: 'hue-rotate-90', icon: '🎨' },
  ]

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  const startCamera = async () => {
    try {
      setError(null) // Clear any previous errors
      addDebugLog('Starting camera...')
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser. Please use Chrome, Edge, or Safari.')
      }

      addDebugLog('getUserMedia supported')
      
      // Request camera permissions
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
      
      addDebugLog('Camera stream obtained')
      addDebugLog('Video tracks: ' + mediaStream.getVideoTracks().length)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        
        // Wait for metadata to load
        videoRef.current.onloadedmetadata = () => {
          addDebugLog('Video metadata loaded')
          videoRef.current.play()
            .then(() => {
              addDebugLog('Video playing successfully')
              setStream(mediaStream)
              setIsCameraActive(true)
            })
            .catch(err => {
              addDebugLog('Error playing video: ' + err.message)
              setError('Failed to start video playback: ' + err.message)
            })
        }
        
        // Handle video errors
        videoRef.current.onerror = (err) => {
          addDebugLog('Video element error: ' + err)
          setError('Video playback error occurred')
        }
      }
    } catch (err) {
      addDebugLog('Error accessing camera: ' + err.name + ' - ' + err.message)
      let errorMessage = 'Could not access camera. '
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage += 'Please allow camera permissions in your browser settings.'
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage += 'No camera device found on your device.'
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage += 'Camera is already in use by another application.'
      } else if (err.name === 'OverconstrainedError' || err.name === 'ConstraintNotSatisfiedError') {
        errorMessage += 'Camera does not support the requested settings. Trying default settings...'
        // Retry with basic constraints
        retryWithBasicConstraints()
        return
      } else {
        errorMessage += err.message || 'Please check your camera settings.'
      }
      
      setError(errorMessage)
    }
  }

  const retryWithBasicConstraints = async () => {
    try {
      addDebugLog('Retrying with basic constraints...')
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        await videoRef.current.play()
        setStream(mediaStream)
        setIsCameraActive(true)
        setError(null)
        addDebugLog('Camera started with basic constraints')
      }
    } catch (err) {
      addDebugLog('Retry failed: ' + err.message)
      setError('Unable to access camera even with basic settings: ' + err.message)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
      setIsCameraActive(false)
    }
  }

  const toggleCamera = async () => {
    if (isCameraActive) {
      stopCamera()
      const newFacingMode = facingMode === 'user' ? 'environment' : 'user'
      setFacingMode(newFacingMode)
      // Restart with new facing mode
      setTimeout(async () => {
        await startCamera()
      }, 100)
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    // Set canvas size to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Apply filter
    context.filter = getFilterStyle(selectedFilter)
    
    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Show flash effect
    setShowFlash(true)
    setTimeout(() => setShowFlash(false), 500)

    // Get image data
    const photoData = canvas.toDataURL('image/png')
    onPhotoCapture(photoData)
  }

  const handleCaptureWithCountdown = () => {
    if (currentCount >= maxPhotos) {
      alert(`You already have ${maxPhotos} photos! Download or retake.`)
      return
    }

    let count = 3
    setCountdown(count)
    
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
      case 'invert': return 'invert(100%)'
      case 'saturate': return 'saturate(150%)'
      case 'contrast': return 'contrast(125%)'
      case 'brightness': return 'brightness(110%)'
      case 'hue': return 'hue-rotate(90deg)'
      default: return 'none'
    }
  }

  return (
    <div className="space-y-6">
      {/* Camera View */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-700/50">
        <div className="aspect-video relative">
          {!isCameraActive ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
              <div className="text-center space-y-6 px-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl shadow-xl">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Ready to Capture</h3>
                  <p className="text-slate-400 mb-6">Click the button below to start your camera</p>
                  {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                      {error}
                    </div>
                  )}
                  <button
                    onClick={startCamera}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Start Camera
                  </button>
                  <div className="mt-4 text-xs text-slate-500">
                    💡 Make sure to allow camera permissions when prompted
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${
                  selectedFilter !== 'none' ? filters.find(f => f.name === selectedFilter)?.class : ''
                }`}
              />
              
              {/* Countdown Overlay */}
              {countdown && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                  <div className="text-white text-9xl font-bold animate-pulse">
                    {countdown}
                  </div>
                </div>
              )}

              {/* Flash Effect */}
              {showFlash && (
                <div className="absolute inset-0 bg-white animate-flash pointer-events-none" />
              )}

              {/* Camera Controls Overlay */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={toggleCamera}
                    className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 p-3 rounded-xl text-white hover:bg-slate-800/80 transition-all shadow-lg"
                    title="Flip Camera"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
                
                <button
                  onClick={stopCamera}
                  className="bg-red-500/90 backdrop-blur-xl border border-red-400/50 px-4 py-2 rounded-xl text-white font-medium hover:bg-red-600/90 transition-all shadow-lg flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                  Stop
                </button>
              </div>
            </>
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Filter Selection */}
      {isCameraActive && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-lg flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Filters
            </h3>
            <span className="text-sm text-slate-400">
              {filters.find(f => f.name === selectedFilter)?.label}
            </span>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {filters.map((filter) => (
              <button
                key={filter.name}
                onClick={() => setSelectedFilter(filter.name)}
                className={`group relative p-4 rounded-xl font-medium transition-all ${
                  selectedFilter === filter.name
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 scale-105'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:scale-105 border border-slate-600/50'
                }`}
              >
                <div className="text-2xl mb-1">{filter.icon}</div>
                <div className="text-xs">{filter.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Capture Buttons */}
      {isCameraActive && currentCount < maxPhotos && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={capturePhoto}
            className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg px-10 py-5 rounded-xl hover:scale-105 transition-all shadow-xl shadow-purple-500/30"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Capture Photo
          </button>
          <button
            onClick={handleCaptureWithCountdown}
            className="inline-flex items-center justify-center gap-3 bg-slate-800/80 backdrop-blur-xl text-white font-bold text-lg px-10 py-5 rounded-xl border border-slate-700/50 hover:bg-slate-700/80 hover:scale-105 transition-all shadow-xl"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Timer (3s)
          </button>
        </div>
      )}

      {currentCount >= maxPhotos && isCameraActive && (
        <div className="text-center">
          <div className="inline-block bg-green-500/20 border border-green-400/50 rounded-xl px-6 py-4">
            <p className="text-white font-semibold text-lg">
              ✅ All {maxPhotos} photos captured! Scroll down to customize and download.
            </p>
          </div>
        </div>
      )}

      {/* Debug Panel */}
      <div className="card p-4">
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="w-full flex items-center justify-between text-white hover:text-purple-400 transition-colors"
        >
          <span className="font-semibold flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            Debug Info
          </span>
          <svg 
            className={`w-5 h-5 transition-transform ${showDebug ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {showDebug && (
          <div className="mt-4 space-y-2">
            <div className="bg-slate-900/50 rounded-lg p-4 max-h-60 overflow-y-auto">
              <div className="text-xs font-mono text-slate-300 space-y-1">
                {debugInfo.length === 0 ? (
                  <p className="text-slate-500">No debug logs yet. Start the camera to see logs.</p>
                ) : (
                  debugInfo.map((log, index) => (
                    <div key={index} className="border-b border-slate-700/50 pb-1">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/50 rounded p-2">
                <span className="text-slate-400">Camera Active:</span>
                <span className={`ml-2 font-semibold ${isCameraActive ? 'text-green-400' : 'text-red-400'}`}>
                  {isCameraActive ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="bg-slate-900/50 rounded p-2">
                <span className="text-slate-400">Facing Mode:</span>
                <span className="ml-2 text-white font-semibold">{facingMode}</span>
              </div>
              <div className="bg-slate-900/50 rounded p-2">
                <span className="text-slate-400">Filter:</span>
                <span className="ml-2 text-white font-semibold">{selectedFilter}</span>
              </div>
              <div className="bg-slate-900/50 rounded p-2">
                <span className="text-slate-400">Photos:</span>
                <span className="ml-2 text-white font-semibold">{currentCount}/{maxPhotos}</span>
              </div>
            </div>
            
            <button
              onClick={() => {
                setDebugInfo([])
                addDebugLog('Debug logs cleared')
              }}
              className="w-full bg-slate-700/50 hover:bg-slate-600/50 text-white text-xs py-2 rounded transition-colors"
            >
              Clear Logs
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Camera
