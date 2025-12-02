import React from 'react'
import { motion } from 'framer-motion'
import { Download, Loader2, Image, Sparkles } from 'lucide-react'

/**
 * PhotoStripPreview - Shows the generated photo strip preview
 * 
 * Design Philosophy:
 * - Glass morphism card design for premium feel
 * - Centered image display with subtle shadow
 * - Clear call-to-action download button
 */

function PhotoStripPreview({ previewUrl, isGenerating, onDownload }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 sm:p-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-2 rounded-xl">
            <Image className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Photo Strip Preview</h3>
            <p className="text-sm text-slate-400">Your custom photo strip is ready!</p>
          </div>
        </div>
        
        {previewUrl && !isGenerating && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDownload}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium rounded-xl shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30 transition-all"
          >
            <Download className="w-4 h-4" />
            Download
          </motion.button>
        )}
      </div>
      
      {/* Preview Area */}
      <div className="flex justify-center items-center min-h-[300px] bg-slate-900/50 rounded-xl border border-slate-700/30 p-4">
        {isGenerating ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-slate-700 rounded-full animate-pulse" />
              <Loader2 className="w-8 h-8 text-rose-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-white font-medium">Generating your photo strip...</p>
              <p className="text-sm text-slate-400 mt-1 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400" />
                Adding some magic
              </p>
            </div>
          </div>
        ) : previewUrl ? (
          <motion.img
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            src={previewUrl}
            alt="Photo Strip Preview"
            className="max-w-full max-h-[600px] rounded-lg shadow-2xl shadow-black/50 object-contain"
          />
        ) : (
          <div className="text-center text-slate-400">
            <Image className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Preview will appear here</p>
          </div>
        )}
      </div>
      
      {/* Footer Info */}
      {previewUrl && !isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 flex justify-center"
        >
          <p className="text-sm text-slate-500 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Click download to save your photo strip
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

export default PhotoStripPreview
