import React from 'react'
import { motion } from 'framer-motion'
import {
  Palette,
  Shapes,
  Sparkles,
  Tag,
  RefreshCw,
  Download,
  Calendar,
  Clock,
  Check,
  Eye,
  Loader2
} from 'lucide-react'

/**
 * Customization Component - Photo Strip Options
 * 
 * Color Theory Notes:
 * - Frame colors provide user choice while maintaining visual harmony
 * - Selected states use consistent Rose/Pink gradient
 * - Grouped sections use subtle backgrounds for visual organization
 */

const Customization = ({ customOptions, onChange, onRetake, onDownload, onPreview, isGenerating }) => {
  const frameColors = [
    { id: '#1E293B', label: 'Navy', style: '#1E293B' },
    { id: '#000000', label: 'Black', style: '#000000' },
    { id: '#4a1942', label: 'Burgundy', style: '#4a1942' },
    { id: '#ffffff', label: 'White', style: '#ffffff' },
    { id: 'rainbow', label: 'Rainbow', gradient: true },
    { id: '#F43F5E', label: 'Rose', style: '#F43F5E' },
    { id: '#8B5CF6', label: 'Violet', style: '#8B5CF6' },
    { id: '#F59E0B', label: 'Amber', style: '#F59E0B' },
    { id: '#10B981', label: 'Emerald', style: '#10B981' },
    { id: '#3B82F6', label: 'Blue', style: '#3B82F6' },
    { id: '#EC4899', label: 'Pink', style: '#EC4899' },
  ]

  const shapes = [
    { id: 'square', icon: '⬜', label: 'Square' },
    { id: 'rounded', icon: '▢', label: 'Rounded' },
  ]

  const stickers = [
    'none', 'ghost', 'clover', 'kiss', 'heart', 'bow', 'star', 'love', 
    'unicorn', 'sparkle', 'music', 'heart2', 'bear', 'koala', 'panda', 
    'frog', 'flower', 'cherry', 'cake', 'pizza', 'crown', 'fire', 'rainbow', 'moon'
  ]

  const stickerEmojis = {
    none: '🚫', ghost: '👻', clover: '🍀', kiss: '💋', heart: '💗',
    bow: '🎀', star: '⭐', love: '🤍', unicorn: '🦄', sparkle: '✨',
    music: '🎵', heart2: '💕', bear: '🐻', koala: '🐨', panda: '🐼',
    frog: '🐸', flower: '🌸', cherry: '🍒', cake: '🎂', pizza: '🍕',
    crown: '👑', fire: '🔥', rainbow: '🌈', moon: '🌙'
  }

  // Section component for consistent styling
  const Section = ({ icon: Icon, title, children, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/30"
    >
      <h4 className="text-white font-medium mb-4 flex items-center gap-2 text-sm">
        <Icon className="w-4 h-4 text-rose-400" />
        {title}
      </h4>
      {children}
    </motion.div>
  )

  return (
    <div className="bg-slate-800/20 backdrop-blur-sm rounded-2xl border border-slate-700/30 p-6">
      <motion.h3 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-semibold text-white text-center mb-6 flex items-center justify-center gap-2"
      >
        <Sparkles className="w-5 h-5 text-rose-400" />
        Customize Your Strip
      </motion.h3>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Frame Color */}
        <Section icon={Palette} title="Frame Color" delay={0.1}>
          <div className="flex flex-wrap gap-2">
            {frameColors.map((color) => (
              <motion.button
                key={color.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onChange({ frameColor: color.id })}
                className={`relative w-9 h-9 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                  customOptions.frameColor === color.id
                    ? 'border-white shadow-lg shadow-white/20'
                    : 'border-slate-600 hover:border-slate-400'
                }`}
                style={{ 
                  background: color.gradient 
                    ? 'linear-gradient(135deg, #F43F5E, #F59E0B, #10B981, #3B82F6, #8B5CF6)' 
                    : color.style 
                }}
                title={color.label}
              >
                {customOptions.frameColor === color.id && (
                  <Check className="w-4 h-4 text-white drop-shadow-md" strokeWidth={3} />
                )}
              </motion.button>
            ))}
          </div>
        </Section>

        {/* Photo Shape */}
        <Section icon={Shapes} title="Photo Shape" delay={0.2}>
          <div className="flex gap-2 flex-wrap">
            {shapes.map((shape) => (
              <motion.button
                key={shape.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onChange({ photoShape: shape.id })}
                className={`w-12 h-12 rounded-lg transition-all duration-200 flex items-center justify-center text-xl ${
                  customOptions.photoShape === shape.id
                    ? 'bg-gradient-to-br from-rose-500 to-pink-500 shadow-lg shadow-rose-500/20'
                    : 'bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50'
                }`}
                title={shape.label}
              >
                {shape.icon}
              </motion.button>
            ))}
          </div>
        </Section>

        {/* Stickers - Full Width */}
        <Section icon={Sparkles} title="Stickers" delay={0.3}>
          <div className="grid grid-cols-8 gap-1.5 max-h-32 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
            {stickers.map((sticker) => (
              <motion.button
                key={sticker}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onChange({ sticker })}
                className={`w-9 h-9 rounded-lg transition-all duration-200 flex items-center justify-center text-lg ${
                  customOptions.sticker === sticker
                    ? 'bg-gradient-to-br from-rose-500 to-pink-500 shadow-lg'
                    : 'bg-slate-700/50 hover:bg-slate-600/50'
                }`}
              >
                {stickerEmojis[sticker]}
              </motion.button>
            ))}
          </div>
        </Section>

        {/* Logo & Date Options */}
        <Section icon={Tag} title="Text Options" delay={0.4}>
          <div className="space-y-3">
            {/* Language Logo */}
            <div className="flex gap-2">
              {['ENG', 'KOR', 'CN'].map((logo) => (
                <motion.button
                  key={logo}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onChange({ logo })}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    customOptions.logo === logo
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-slate-600/50'
                  }`}
                >
                  {logo}
                </motion.button>
              ))}
            </div>
            
            {/* Date/Time Toggles */}
            <div className="flex gap-4 flex-wrap">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white transition-colors text-sm">
                <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                  customOptions.addDate ? 'bg-rose-500' : 'bg-slate-700 border border-slate-600'
                }`}>
                  {customOptions.addDate && <Check className="w-3 h-3 text-white" />}
                </div>
                <input
                  type="checkbox"
                  checked={customOptions.addDate}
                  onChange={(e) => onChange({ addDate: e.target.checked })}
                  className="sr-only"
                />
                <Calendar className="w-3.5 h-3.5" />
                Date
              </label>
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer hover:text-white transition-colors text-sm">
                <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                  customOptions.addTime ? 'bg-rose-500' : 'bg-slate-700 border border-slate-600'
                }`}>
                  {customOptions.addTime && <Check className="w-3 h-3 text-white" />}
                </div>
                <input
                  type="checkbox"
                  checked={customOptions.addTime}
                  onChange={(e) => onChange({ addTime: e.target.checked })}
                  className="sr-only"
                />
                <Clock className="w-3.5 h-3.5" />
                Time
              </label>
            </div>
          </div>
        </Section>
      </div>

      {/* Action Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex gap-3 pt-6 justify-center flex-wrap"
      >
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRetake}
          disabled={isGenerating}
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800/80 text-white border border-slate-700/50 rounded-xl font-medium hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className="w-4 h-4" />
          Retake
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPreview}
          disabled={isGenerating}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-medium shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
          {isGenerating ? 'Generating...' : 'Preview'}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={onDownload}
          disabled={isGenerating}
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          Download Strip
        </motion.button>
      </motion.div>
    </div>
  )
}

export default Customization
